import { withLocation, withWallets } from '../helpers/mergeWallets';

import {
  LOAD_INITIAL_STATE,
  LOAD_LOCATION_SUCCESS, 
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  PUBLISH_LOCATION,
  PUBLISH_LOCATION_SUCCESS,
  PUBLISH_LOCATION_CONFIRM, 
  PUBLISH_LOCATION_FAILURE,
  LOAD_LOCATION_FAILURE,
  LOAD_WALLET_LOCATIONS,
  LOAD_WALLET_LOCATIONS_SUCCESS,
  SEARCH_WALLET_LOCATIONS,
  SEARCH_WALLET_LOCATIONS_SUCCESS,
  LOAD_NEARBY_WALLETS,
  LOAD_NEARBY_WALLETS_SUCCESS,
  LOAD_NEARBY_WALLETS_FAILURE,
  FETCH_NEARBY_WALLETS_INIT,
  FETCH_NEARBY_WALLETS_SUCCESS,
} from '../actions';

const initialState = {
  initialRadius: 0,
  walletAdress: null,
  center: null,
  undeterminedLocation: false,
  walletLocation: null,
  place: null,
  walletLocations: [],
  searchResults: [],
  nearbyWallets: [],
  loading: false,
  mapLoading: false,
  error: null,
  alertOpen: false,
  alertText: null,
  confirmOpen: false,
  confirmTitle: null,
  confirmText: null,
  snackbarText: { timestamp: 0, message: null },
};

let walletLocation, walletLocations, nearbyWallets;

export default function nomadscribe(state = initialState, action) {
  switch (action.type) {
    case LOAD_INITIAL_STATE:
      return {
        ...state,
        ...action.initialState,
      };
    case LOAD_LOCATION_SUCCESS:
      return {
        ...state,
        center: action.center,
      };
    case LOAD_LOCATION_FAILURE:
      return {
        ...state,
        undeterminedLocation: action.undeterminedLocation,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        jwk: action.jwk,
        walletAddress: action.walletAddress,
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        alertOpen: action.alertOpen,
        alertText: action.alertText, 
      };
    case PUBLISH_LOCATION:
      return {
        ...state,
        locationLoading: true,
      };
    case PUBLISH_LOCATION_CONFIRM:
      return {
        ...state,
        confirmOpen: action.confirmOpen,
        confirmTitle: action.confirmTitle,
        confirmText: action.confirmText,
      };
    case PUBLISH_LOCATION_SUCCESS:
      ({ walletLocation, walletLocations, nearbyWallets } = withLocation(state, action))
      return {
        ...state,
        ...(action.snackbarText && { snackbarText: action.snackbarText }),
        walletLocation,
        walletLocations,
        nearbyWallets,
        confirmOpen: false,
        locationLoading: false,
        error: null,
      };
    case PUBLISH_LOCATION_FAILURE:
      return {
        ...state,
        locationLoading: false,
        error: action.error
      };
    case LOAD_WALLET_LOCATIONS:
      return {
        ...state,
        loading: true,
        mapLoading: true,
      };
    case LOAD_WALLET_LOCATIONS_SUCCESS:
      return {
        ...state,
        walletLocations: action.walletLocations,
        loading: false,
        mapLoading: false,
      };
    case SEARCH_WALLET_LOCATIONS:
      return {
        ...state,
        loading: true,
        mapLoading: true,
      }
    case SEARCH_WALLET_LOCATIONS_SUCCESS:
      return {
        ...state,
        searchResults: action.searchResults,
        loading: false,
        mapLoading: false,
      };
    case LOAD_NEARBY_WALLETS:
      return {
        ...state,
        loading: true,
      };
    case LOAD_NEARBY_WALLETS_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null
      };
    case LOAD_NEARBY_WALLETS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error
      };
    case FETCH_NEARBY_WALLETS_INIT:
      return {
        ...state,
        nearbyWallets: action.nearbyWallets
      };
    case FETCH_NEARBY_WALLETS_SUCCESS:
      ({ walletLocation, nearbyWallets } = withWallets(state, action))
      return {
        ...state,
        walletLocation,
        nearbyWallets
      };
    default:
      return state;
  }
}
