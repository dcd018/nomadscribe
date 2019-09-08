import _ from 'lodash';
import { api } from '../config';
import Bottleneck from "bottleneck";
import { all, call, put, cancelled } from 'redux-saga/effects';
import { FETCH_NEARBY_WALLETS_SUCCESS } from '../actions';
import { txnsToLocations } from '../helpers/arweave';

const { arweave: { minTime }} = api;
let limiter, wrapped;

export function stopLimiter() {
  return limiter.stop({ dropWaitingJobs: true }).catch(err => console.log(err.message));
}

export function initLimiter() {
  limiter = new Bottleneck({ minTime });
  wrapped = limiter.wrap(txnsToLocations);
}

export function checkLimiter() {
  return limiter.check();
}

initLimiter()

export default function* fetchNearbyWallets(geohashes) {
  try {
    const nearbyWallets = yield all(geohashes.map(geohash => call(wrapped, null, geohash)));
    yield put({ type: FETCH_NEARBY_WALLETS_SUCCESS, nearbyWallets: _.flatten(nearbyWallets) });
  }
  finally {
    if (yield cancelled()) {
      //TODO.. cancel pending Arweave queries.
    }
  }
}