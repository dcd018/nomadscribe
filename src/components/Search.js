import React from 'react'
import Map from './Map'
import MapLoader from './MapLoader'

export default class Search extends React.Component {

  componentDidMount() {
    this.props.loadLocation();
  }

  render() {
    const { mapLoading, searchResults } = this.props;
    return (
      <React.Fragment>
        {mapLoading && (<MapLoader />)}
        <Map 
          searchResults={searchResults}
        />
      </React.Fragment>
    )
  }
}