import _ from 'lodash';
import { api } from '../config';
import { all, call, put, select, cancelled, take, race } from 'redux-saga/effects';
import { MAP_MOVED, LOAD_NEARBY_WALLETS_SUCCESS, FETCH_NEARBY_WALLETS_INIT } from '../actions';
import fetchNearbyWallets, { initLimiter, stopLimiter } from './fetchNearbyWallets';
import { latLngBoundsToBbox } from '../helpers/leaflet';
import bboxPolygon from '@turf/bbox-polygon';
import booleanWithin from '@turf/boolean-within';
import Geohash from '../helpers/geohash';
import NetworkError from '../errors/NetworkError';

export default function* loadNearbyWalletsSaga(payload) {
  yield race({
    task: call(loadNearbyWallets, payload),
    cancel: take(MAP_MOVED)
  });
}

function* sendBatches(batches) {
  try {
    yield all(batches.map(geohashes => call(fetchNearbyWallets, geohashes)));
    yield put({ type: LOAD_NEARBY_WALLETS_SUCCESS });
  }
  catch (e) {
    if (e instanceof NetworkError && !(yield cancelled())) {
      yield call(sendBatches, batches);
    }
    else {
      throw e;
    }
  }
}

export function* loadNearbyWallets({ type, latLngBounds}) {
  const { walletAddress, nearbyWallets } = yield select(state => ({
    walletAddress: state.walletAddress,
    nearbyWallets: state.nearbyWallets,
  }));

  const boundsPolygon = bboxPolygon(latLngBoundsToBbox(latLngBounds))
  const existingNearbyWallets = nearbyWallets.filter(wallet =>
    booleanWithin(wallet.data.geometry, boundsPolygon) || wallet.walletAddress === walletAddress
  );
  yield put({ type: FETCH_NEARBY_WALLETS_INIT, nearbyWallets: existingNearbyWallets });

  const geohash = new Geohash(latLngBounds);
  const batches = _.chunk(geohash.inViewport(), api.arweave.concurrency);

  try {
    yield call(sendBatches, batches);
  } 
  catch(e) {
    initLimiter();
    yield call(sendBatches, batches);
  } 
  finally {
    if (yield cancelled()) {
      yield call(stopLimiter);
    }
  }
}