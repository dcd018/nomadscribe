import _ from 'lodash';
import booleanEqual from '@turf/boolean-equal';

function sortByTimestamp(target) {
  target.sort((a, b) => {
    const current = a.data.properties.timestamp;
    const next = b.data.properties.timestamp;
    return (!current || current < next) ? -1 : (current > next) ? 1 : 0;
  })
  return target;
}

function mergeSort(subject, target = 'nearbyWallets', targetValue = []) {
  const result = subject[target].concat(targetValue);
  sortByTimestamp(result);
  return result;
}

function isEqual(current, next) {
  return current.walletAddress === next.walletAddress
    && booleanEqual(current.data.geometry, next.data.geometry);
}

function withLocation(state, action) {
  const pulledNearbyWallets = [];
  const pulledWalletLocations = [];
  const nearbyWallets = mergeSort(state);
  if (action.walletLocation && action.walletLocation.data.properties.timestamp) {
    for (let i = 0; i < nearbyWallets.length; i++) {
      const wallet = nearbyWallets[i];
      if (wallet.data.properties.timestamp) {
        const current = wallet.data.properties.timestamp;
        if (isEqual(action.walletLocation, wallet)) {
          let existing = action.walletLocation.data.properties.timestamp;
          if (current > existing) {
            action.walletLocation = wallet;
          }
          pulledNearbyWallets.push(i);
        }
      }
    }
    for (let i = 0; i < state.walletLocations.length; i++) {
      const wallet = state.walletLocations[i]
      if (isEqual(wallet, action.walletLocation)) {
        pulledWalletLocations.push(i)
      }
    }
  }
  _.pullAt(nearbyWallets, pulledNearbyWallets);
  _.pullAt(state.walletLocations, pulledWalletLocations);
  return {
    walletLocation: action.walletLocation,
    nearbyWallets: _.uniqWith(_.reverse(nearbyWallets), isEqual),
    walletLocations: state.walletLocations,
  }
}

function withWallets(state, action) {
  let nearbyWallets = mergeSort(state, 'nearbyWallets', action.nearbyWallets);
  const pulled = [];
  for (let i = 0; i < nearbyWallets.length; i++) {
    const wallet = nearbyWallets[i];
    if (wallet.data.properties.timestamp) {
      const current = wallet.data.properties.timestamp;
      if (state.walletLocation
        && isEqual(state.walletLocation, wallet)
        && state.walletLocation.data.properties.timestamp
      ) {
        let existing = state.walletLocation.data.properties.timestamp;
        if (current > existing) {
          state.walletLocation = wallet;
        }
        pulled.push(i);
      }
    }
  }
  _.pullAt(nearbyWallets, pulled);
  nearbyWallets = nearbyWallets.filter(nearby => 
    !state.walletLocations.find(location => isEqual(nearby, location))
  )
  return {
    walletLocation: state.walletLocation,
    nearbyWallets: _.uniqWith(_.reverse(nearbyWallets), isEqual),
  }
}

function withWalletLocations(state, action, target = 'walletLocations') {
  const walletLocations = mergeSort(state, target, action[target]);
  return _.uniqWith(_.reverse(walletLocations), isEqual);
}

export {
  sortByTimestamp,
  isEqual,
  withLocation,
  withWallets,
  withWalletLocations,
}