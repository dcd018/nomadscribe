import { call, put, takeLatest } from 'redux-saga/effects';
import { LOAD_WALLET_LOCATIONS, LOAD_WALLET_LOCATIONS_SUCCESS } from '../actions';
import fetchWalletLocationsSaga from './fetchWalletLocations'

export default function* watchLoadWalletLocationsSaga() {
  yield takeLatest(LOAD_WALLET_LOCATIONS, loadWalletLocationsSaga)
}

export function* loadWalletLocationsSaga(payload) {
  const walletLocations = yield call(fetchWalletLocationsSaga, payload)
  yield put({ type: LOAD_WALLET_LOCATIONS_SUCCESS, walletLocations })
}