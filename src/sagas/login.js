import { call, put, takeLatest } from 'redux-saga/effects';
import { LOGIN, LOGIN_SUCCESS, LOGIN_FAILURE } from '../actions';
import { getAddress } from '../helpers/arweave';

export default function* watchLoginSaga() {
  yield takeLatest(LOGIN, loginSaga);
}

export function* loginSaga({ type, jwk }) {
  try {
    const walletAddress = yield call(getAddress, jwk);
    yield put({ type: LOGIN_SUCCESS, jwk, walletAddress });
  }
  catch (e) {
    yield put({ type: LOGIN_FAILURE, alertOpen: true, alertText: 'Keyfile validation failed' });
  }
}