import { connect } from 'react-redux';
import Search from '../components/Search';
import { loadLocation } from '../actions';


const mapStateToProps = state => {
  return {
    center: state.center,
    mapLoading: state.mapLoading,
    undeterminedLocation: state.undeterminedLocation,
    searchResults: state.searchResults,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    loadLocation: () => {
      dispatch(loadLocation());
    },
  };
}

const SearchContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Search);

export default SearchContainer;