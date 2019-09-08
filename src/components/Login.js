import React from 'react';
import KeyDrop from './KeyDrop';
import Map from './Map';
import MapLoader from './MapLoader';
import ConfirmDialog from './ConfirmDialog';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.map = null;
    this.getLocation = this.getLocation.bind(this);
  }

  componentDidMount() {
    this.props.loadLocation();
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.walletAddress && this.props.walletAddress) {
      this.props.loadWalletLocations();
    }
  }

  getLocation() {
    if (this.map) {
      if (this.props.location.pathname !== '/') {
        this.props.history.push('/');
      }
      this.map.getLocation();
    }
  }

  render() {
    const { mapLoading, walletAddress, loadInitialState, login, alertOpen, alertText, center, undeterminedLocation, 
      locationLoading, walletLocation, walletLocations, searchResults, loadNearbyWallets, nearbyWallets, confirmOpen, confirmTitle, 
      confirmText, publishLocation, publishLocationConfirm, publishLocationCancel, snackbarText, mapMoved } = this.props;
    return (
      <React.Fragment>
        {mapLoading && (<MapLoader />)}
        {!this.props.walletAddress && <KeyDrop login={login} alertOpen={alertOpen} alertText={alertText}/>}
        <Map
          styles={{display: 'none'}}
          ref={ref => this.map = ref}
          walletAddress={walletAddress}
          center={center}
          undeterminedLocation={undeterminedLocation}
          loadInitialState={loadInitialState}
          getLocation={this.getLocation}
          locationLoading={locationLoading}
          publishLocation={publishLocation}
          walletLocation={walletLocation}
          walletLocations={walletLocations}
          searchResults={searchResults}
          loadNearbyWallets={loadNearbyWallets}
          nearbyWallets={nearbyWallets}
          snackbarText={snackbarText}
          mapMoved={mapMoved}
        />
        <ConfirmDialog
          open={confirmOpen}
          confirm={publishLocationConfirm}
          cancel={publishLocationCancel}
          title={confirmTitle} 
          text={confirmText}
          loading={locationLoading}
        />
      </React.Fragment>
    );
  }
}