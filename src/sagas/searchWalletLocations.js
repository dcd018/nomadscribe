import { call, put, takeLatest } from 'redux-saga/effects';
import { SEARCH_WALLET_LOCATIONS, SEARCH_WALLET_LOCATIONS_SUCCESS } from '../actions';
import fetchWalletLocationsSaga from './fetchWalletLocations';

export default function* watchSearchWalletLocationsSaga() {
  yield takeLatest(SEARCH_WALLET_LOCATIONS, searchWalletLocationsSaga);
}

export function* searchWalletLocationsSaga(payload) {
  const searchResults = yield call(fetchWalletLocationsSaga, payload);
  yield put({ type: SEARCH_WALLET_LOCATIONS_SUCCESS, searchResults });
}