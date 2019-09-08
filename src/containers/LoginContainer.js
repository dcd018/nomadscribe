import { connect } from 'react-redux';
import Login from '../components/Login';
import { 
  loadInitialState,
  loadLocation,
  login,
  publishLocation,
  loadWalletLocations,
  loadNearbyWallets,
  publishLocationConfirm,
  publishLocationCancel,
  mapMoved
} from '../actions';


const mapStateToProps = state => {
  return {
    initialRadius: state.initialRadius,
    alertOpen: state.alertOpen,
    alertText: state.alertText,
    center: state.center,
    undeterminedLocation: state.undeterminedLocation,
    walletAddress: state.walletAddress,
    mapLoading: state.mapLoading,
    locationLoading: state.locationLoading,
    walletLocation: state.walletLocation,
    walletLocations: state.walletLocations,
    searchResults: state.searchResults,
    nearbyWallets: state.nearbyWallets,
    confirmOpen: state.confirmOpen,
    confirmTitle: state.confirmTitle,
    confirmText: state.confirmText,
    snackbarText: state.snackbarText,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    loadInitialState: (initialState) => {
      dispatch(loadInitialState(initialState));
    },
    loadLocation: () => {
      dispatch(loadLocation());
    },
    login: jwk => {
      dispatch(login(jwk));
    },
    publishLocation: (latLng) => {
      dispatch(publishLocation(latLng));
    },
    publishLocationConfirm: () => {
      dispatch(publishLocationConfirm());
    },
    publishLocationCancel: () => {
      dispatch(publishLocationCancel());
    },
    loadWalletLocations: () => {
      dispatch(loadWalletLocations());
    },
    loadNearbyWallets: (latLngBounds) => {
      dispatch(loadNearbyWallets(latLngBounds));
    },
    mapMoved: () => {
      dispatch(mapMoved());
    },
  }
}

const LoginContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);

export default LoginContainer;