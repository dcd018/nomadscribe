import { connect } from 'react-redux';
import { searchWalletLocations } from '../actions';
import Navigation from '../components/Navigation';

const mapStateToProps = state => {
  return {
    walletAddress: state.walletAddress,
    loading: state.loading,
    error: state.error
  };
};

const mapDispatchToProps = dispatch => {
  return {
    searchWalletLocations: (walletAddress) => {
      dispatch(searchWalletLocations(walletAddress));
    },
  };
}

const NavigationContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Navigation);

export default NavigationContainer;