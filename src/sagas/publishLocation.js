import { all, call, put, select, cancelled, take, takeLatest } from 'redux-saga/effects';
import {
  PUBLISH_LOCATION, PUBLISH_LOCATION_SUCCESS, PUBLISH_LOCATION_CONFIRM,
  PUBLISH_LOCATION_CONFIRM_SUCCESS, PUBLISH_LOCATION_CONFIRM_CANCEL
} from '../actions';
import reverseGeocode from '../helpers/reverseGeocode';
import { getSourceToken } from '../helpers/axios';
import { toTxn, submitTxn, mergeWithArweaveId, txnsByWalletAndGeohash, fromTxn } from '../helpers/arweave';
import NetworkError from '../errors/NetworkError';
import booleanEqual from '@turf/boolean-equal';

export default function* watchPublishLocationSaga() {
  yield takeLatest(PUBLISH_LOCATION, publishLocationSaga);
}

function* locationForTxn(latLng, source) {
  try {
    const location = yield call(reverseGeocode, latLng, source, false);
    return location;
  }
  catch (e) {
    if (e instanceof NetworkError && !(yield cancelled())) {
      return yield call(locationForTxn, latLng, source);
    }
    else {
      throw e;
    }
  }
}

export function* publishLocationSaga({ type, latLng}) {
  const source = getSourceToken();
  const { jwk, walletAddress } = yield select(state => ({ jwk: state.jwk, walletAddress: state.walletAddress }));
  try {
    const location = yield call(locationForTxn, latLng, source);
    const txn = yield call(toTxn, latLng, location);
    const geohash = txn.tags['Geohash-Precision-12'];
    
    const txnids = yield call(txnsByWalletAndGeohash, walletAddress, geohash);
    const existingLocations = yield all(txnids.map(fromTxn));

    let lastLocation = txn;
    let message = 'Your location will be published soon!';
    const locations = existingLocations
      .filter(l => booleanEqual(l.data.geometry, txn.data.geometry))
      .sort((a, b) => {
        const current = a.data.properties.timestamp
        const next = b.data.properties.timestamp
        return (current < next) ? -1 : (current > next) ? 1 : 0
      });
    
    if (locations.length) {
      lastLocation = locations[locations.length - 1];
      const lastSeen = new Date(lastLocation.timestamp || Date.now());
      const confirmTitle = 'Are you sure you would like to publish your location again?';
      const confirmText = `You were last seen at ${location.display_name} on ${lastSeen.toLocaleString()}.`;

      yield put({ type: PUBLISH_LOCATION_CONFIRM, confirmOpen: true, confirmTitle, confirmText });
      const action = yield take([PUBLISH_LOCATION_CONFIRM_SUCCESS, PUBLISH_LOCATION_CONFIRM_CANCEL]);
      if (action.type === PUBLISH_LOCATION_CONFIRM_SUCCESS) {
        yield call(submitTxn, jwk, txn.toJSON());
        txn.walletAddress = walletAddress;
        lastLocation = txn;
      }
      else {
        message = null;
      }
    }
    else {
      yield call(submitTxn, jwk, txn.toJSON());
    }

    lastLocation.walletAddress = walletAddress;
    const timestamp = lastLocation.data.properties.timestamp;
    const response = yield call(mergeWithArweaveId, lastLocation);
    yield put({ 
      type: PUBLISH_LOCATION_SUCCESS,
      snackbarText: { timestamp, message },
      walletLocation: response,
    });
  }
  finally {
    if (yield cancelled()) {
      source.cancel();
    }
  }
}