import _ from 'lodash';
import { call, select } from 'redux-saga/effects';
import { txnsToLocations } from '../helpers/arweave';
import { sortByTimestamp, isEqual } from '../helpers/mergeWallets';

export default function* fetchWalletLocationsSaga({ type, walletAddress }) {
  if (!walletAddress) {
    ({ walletAddress } = yield select(state => ({ walletAddress: state.walletAddress })));
  }
  const locations = yield call(txnsToLocations, walletAddress);
  const locationsSorted = _.uniqWith(_.reverse(sortByTimestamp(locations.concat())), isEqual);
  const stack = {};
  locationsSorted.forEach(location => {
    const { data: { geometry: { coordinates: [lng, lat] }}} = location;
    stack[`${lat}-${lng}`] = _.reverse(sortByTimestamp(locations.filter(x => isEqual(location, x))));
  })
  return Object.keys(stack).map(key => {
    const root = stack[key].shift();
    root.seenAt = stack[key]
      .filter(location => !!location.data.properties.timestamp)
      .map(location => location.data.properties.timestamp);
    
    return root;
  })
}