import { call, put, takeLatest } from 'redux-saga/effects';
import { LOAD_LOCATION, LOAD_LOCATION_SUCCESS, LOAD_LOCATION_FAILURE } from '../actions';
import L from 'leaflet';

export default function* watchLoadLocationSaga() {
  yield takeLatest(LOAD_LOCATION, loadLocationSaga);
}

export function* loadLocationSaga() {
  const endpoint = 'https://api.hostip.info/get_json.php?position=true';
  const response = yield call(fetch, endpoint);
  const { lat, lng } = yield response.json();
  if (lat && lng) {
    yield put({ type: LOAD_LOCATION_SUCCESS, center: L.latLng(lat, lng) });
  }
  else {
    yield put({ type: LOAD_LOCATION_FAILURE, undeterminedLocation: true });
  }
}