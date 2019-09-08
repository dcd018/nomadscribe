export const MAP_MOVED = 'MAP_MOVED';
export const LOAD_INITIAL_STATE = 'LOAD_INITIAL_STATE';
export const LOAD_LOCATION = 'LOAD_LOCATION';
export const LOAD_LOCATION_SUCCESS = 'LOAD_LOCATION_SUCCESS';
export const LOAD_LOCATION_FAILURE = 'LOAD_LOCATION_FAILURE';
export const LOGIN = 'LOGIN';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const PUBLISH_LOCATION = 'PUBLISH_LOCATION';
export const PUBLISH_LOCATION_CONFIRM = 'PUBLISH_LOCATION_CONFIRM';
export const PUBLISH_LOCATION_CONFIRM_SUCCESS = 'PUBLISH_LOCATION_CONFIRM_SUCCESS';
export const PUBLISH_LOCATION_CONFIRM_CANCEL = 'PUBLISH_LOCATION_CONFIRM_CANCEL';
export const PUBLISH_LOCATION_SUCCESS = 'PUBLISH_LOCATION_SUCCESS';
export const PUBLISH_LOCATION_FAILURE = 'PUBLISH_LOCATION_FAILURE';
export const LOAD_WALLET_LOCATIONS = 'LOAD_WALLET_LOCATIONS';
export const LOAD_WALLET_LOCATIONS_SUCCESS = 'LOAD_WALLET_LOCATIONS_SUCCESS';
export const SEARCH_WALLET_LOCATIONS = 'SEARCH_WALLET_LOCATIONS';
export const SEARCH_WALLET_LOCATIONS_SUCCESS = 'SEARCH_WALLET_LOCATIONS_SUCCESS';
export const LOAD_NEARBY_WALLETS = 'LOAD_NEARBY_WALLETS';
export const LOAD_NEARBY_WALLETS_SUCCESS = 'LOAD_NEARBY_WALLETS_SUCCESS';
export const LOAD_NEARBY_WALLETS_FAILURE = 'LOAD_NEARBY_WALLETS_FAILURE';
export const FETCH_NEARBY_CITIES = 'FETCH_NEARBY_CITIES';
export const FETCH_NEARBY_WALLETS = 'FETCH_NEARBY_WALLETS';
export const FETCH_NEARBY_WALLETS_INIT = 'FETCH_NEARBY_WALLETS_INIT';
export const FETCH_NEARBY_WALLETS_SUCCESS = 'FETCH_NEARBY_WALLETS_SUCCESS';

export function loadInitialState(initialState) {
  return {
    type: LOAD_INITIAL_STATE,
    initialState,
  };
}

export function loadLocation() {
  return {
    type: LOAD_LOCATION,
  };
}

export function login(jwk) {
  return {
    type: LOGIN,
    jwk,
  };
}

export function publishLocation(latLng) {
  return {
    type: PUBLISH_LOCATION,
    latLng,
  };
}

export function publishLocationConfirm() {
  return { type: PUBLISH_LOCATION_CONFIRM_SUCCESS };
}

export function publishLocationCancel() {
  return { type: PUBLISH_LOCATION_CONFIRM_CANCEL };
}

export function loadWalletLocations(walletAddress = null) {
  return {
    type: LOAD_WALLET_LOCATIONS,
    walletAddress,
  };
}

export function searchWalletLocations(walletAddress) {
  return {
    type: SEARCH_WALLET_LOCATIONS,
    walletAddress,
  };
}

export function loadNearbyWallets(latLngBounds) {
  return {
    type: LOAD_NEARBY_WALLETS,
    latLngBounds,
  };
}

export function mapMoved() {
  return { type: MAP_MOVED };
}