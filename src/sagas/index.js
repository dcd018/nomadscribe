import { all, fork, takeLatest } from 'redux-saga/effects';
import loadLocationSaga from './loadLocation';
import loginSaga from './login';
import publishLocationSaga from './publishLocation';
import loadWalletLocationsSaga from './loadWalletLocations';
import searchWalletLocationsSaga from './searchWalletLocations';
import loadNearbyWalletsSaga from './loadNearbyWallets';
import { LOAD_NEARBY_WALLETS } from '../actions';

export default function* rootSaga() {
  yield all([
    fork(loadLocationSaga),
    fork(loginSaga),
    fork(publishLocationSaga),
    fork(loadWalletLocationsSaga),
    fork(searchWalletLocationsSaga),
    takeLatest(LOAD_NEARBY_WALLETS, loadNearbyWalletsSaga)
  ]);
}