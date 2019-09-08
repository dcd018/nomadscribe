import _ from 'lodash';
import React from 'react';
import { withRouter } from 'react-router-dom';
import ReactDOMServer from 'react-dom/server';
import L from 'leaflet';
import { Map as LeafletMap, TileLayer, Marker, Popup } from 'react-leaflet';
import Control from 'react-leaflet-control';
import { geolocated } from "react-geolocated";
import classNames from 'classnames';
import Spiderfy from './Spiderfy';
import MapMarker from './MapMarker';

import { withStyles } from '@material-ui/core/styles';
import { Button, CircularProgress, Snackbar } from '@material-ui/core';
import { 
  Place as PlaceIcon, 
  PersonPinCircleRounded as PersonPinCircleIcon,
  ArrowBackIos as ArrowBackIcon 
} from '@material-ui/icons';

import Geohash from '../helpers/geohash'

const styles = theme => ({
  map: {
    margin: 0, 
    padding: 0,
    zIndex: 900,
  },
  locationLoading: {
    color: 'grey',
    width: 24,
    height: 24,
    marginRight: 5,
  },
  marker: {
    color: theme.palette.primary.light,
  },
  markerLocation: {
    fontSize: 40
  },
  markerNearbyWallet: {
    fontSize: 32
  },
  snackbar: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    textAlign: 'center',
  }
});

class Map extends React.Component {

  static getDerivedStateFromProps(props, state) {
    let center
    if (props.walletLocation && props.walletLocation.data) {
      const { data: { geometry: { coordinates: [lng, lat] }}} = props.walletLocation;
      center = new L.LatLng(lat, lng);
    }
    else if (props.center) {
      center = props.center;
    }
    if (center && !_.isEqual(center, state.center)) {
      return { center };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.map = null;
    this.state = { 
      height: null, 
      center: new L.LatLng(51.505, -0.09), 
      minZoom: 3,
      maxZoom: 18,
      snackbarOpen: false,
      snackbarText: null,
    }
    this.updateDimensions = this.updateDimensions.bind(this);
    this.loadMarkers = this.loadMarkers.bind(this);
    this.renderMarker = this.renderMarker.bind(this);
    this.openSnackbar = this.openSnackbar.bind(this);
  }

  componentDidMount() {
    this.updateDimensions();
    window.addEventListener('resize', this.updateDimensions);
    if (this.map) {
      if (this.props.location.pathname !== '/search') {
        this.map.leafletElement.on('movestart', this.props.mapMoved);
        this.map.leafletElement.on('moveend', this.loadMarkers);
        this.props.loadInitialState({ initialRadius: this.radiusFromZoom() });
      }
      if (this.props.walletLocations) {
        this.fitMapToBounds(this.props.walletLocations);
      }
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.positionError 
      && !_.isEqual(prevProps.positionError, this.props.positionError)
    ) {
      this.openSnackbar('Please enable location services to use this feature.')
    }
    if (this.map 
      && this.props.undeterminedLocation 
      && !prevProps.undeterminedLocation
    ) {
      this.loadMarkers();
    }
    if (this.props.coords 
      && !_.isEqual(prevProps.coords, this.props.coords)
    ) {
      const { latitude: lat, longitude: lng } = this.props.coords;
      const latLng = new L.LatLng(lat, lng);
      this.publishLocation(latLng);
    }
    if (this.props.location.pathname === '/search'
      && this.props.searchResults.length
    ) {
      this.fitMapToBounds(this.props.searchResults);
    }
    else if (this.props.walletLocations
      && this.props.walletLocations.length
      && !prevProps.walletLocations.length
    ) {
      this.fitMapToBounds(this.props.walletLocations);
    }
    if (this.props.snackbarText
      && this.props.snackbarText.timestamp
      && this.props.snackbarText.message
      && prevProps.snackbarText.timestamp !== this.props.snackbarText.timestamp
    ) {
      this.openSnackbar(this.props.snackbarText.message);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
    if (this.map) this.map.leafletElement.off('moveend', this.loadMarkers);
  }

  publishLocation(latLng) {
    if (this.map) {
      this.props.mapMoved();
      this.props.publishLocation(latLng);
    }
  }

  loadNearbyWallets() {
    if (this.map) {
      const { leafletElement } = this.map;  
      this.props.loadNearbyWallets(leafletElement.getBounds());
    }
  }

  radiusFromZoom() {
    let radius;
    if (this.map) {
      const { leafletElement } = this.map;
      const center = leafletElement.getCenter();
      const pointC = leafletElement.latLngToContainerPoint(center);
      const pointX = [pointC.x + 1, pointC.y];
      const pointY = [pointC.x, pointC.y + 1];
      
      const latLngC = leafletElement.containerPointToLatLng(pointC);
      const latLngX = leafletElement.containerPointToLatLng(pointX);
      const latLngY = leafletElement.containerPointToLatLng(pointY);

      const width = window.innerWidth;
      const height = window.innerHeight;
      const { top, left } = this.map.container.getBoundingClientRect();

      const targetContainerBound = (width < height) ? pointC.y : pointC.x;
      const targetLatLng = (width < height) ? latLngY : latLngX;
      const targetMapBound = (width < height) ? top : left;

      const distance = targetContainerBound - targetMapBound;
      const metersPerPixel = latLngC.distanceTo(targetLatLng);
      radius = distance * metersPerPixel * 0.000621371;
      radius = radius + (radius * 2.75);
    }
    return radius;
  }

  updateDimensions() {
    if (this.map) {
      const innerHeight = window.innerHeight;
      const top = this.map.container.getBoundingClientRect().top;
      const height = innerHeight - top;
      if (this.state.height !== height) {
        this.map.container.style.height = `${height}px`;
        this.map.leafletElement.invalidateSize();
        this.setState({ height });
      }
    }
  }

  fitMapToBounds(walletLocations) {
    if (this.map && walletLocations.length) {
      this.map.leafletElement.fitBounds(walletLocations.map(location => {
        const { data: { geometry: { coordinates: [lng, lat] }}} = location
        return new L.LatLng(lat, lng)
      }));
    }
  }

  loadMarkers() {
    if (this.map) {
      //const { leafletElement } = this.map;
      //const geohash = new Geohash(leafletElement.getBounds());
      //const [bounds, marker1, marker2] = geohash.inViewport();
      //this.setState({ bounds, marker1, marker2 });
      this.loadNearbyWallets();
    }
  }

  openSnackbar(message) {
    this.setState({ snackbarOpen: true, snackbarText: message });
    setTimeout(() => this.setState({ snackbarOpen: false, snackbarText: null }), 3000);
  }

  locationMarkerIcon() {
    const { classes } = this.props
    return L.divIcon({
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40],       
      className: classes.marker,
      html: ReactDOMServer.renderToString(
        <PersonPinCircleIcon 
          className={classNames(classes.marker, classes.markerLocation)}
        />
      ),
    });
  }

  nearbyWalletMarkerIcon() {
    const { classes } = this.props;
    return L.divIcon({
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],       
      className: classes.marker,
      html: ReactDOMServer.renderToString(
        <PlaceIcon
          className={classNames(classes.marker, classes.markerNearbyWallet)} 
        />
      ),
    });
  }

  walletMarker(walletLocation, index, icon, position) {
    const { walletAddress, data, arweaveId, seenAt } = walletLocation;
    const { properties: { displayName, timestamp }, geometry: { coordinates: [lng, lat] }} = data;
    return (
      <Marker key={`walletMarker-${index}`} icon={icon} position={position}>
        <Popup>
          <MapMarker
            walletAddress={walletAddress}
            address={displayName}
            lat={lat}
            lng={lng}
            lastSeen={timestamp}
            seenAt={seenAt}
            alertCopied={this.openSnackbar}
            {...arweaveId}
          />
        </Popup>
      </Marker>
    );
  }

  renderMarker(walletLocation, type = 'walletIdentity', index = 'marker') {
    const { data: { geometry: { coordinates: [lng, lat] }}} = walletLocation;
    const latLng = new L.LatLng(lat, lng);
    switch (type) {
      case 'walletAddress':
        return this.walletMarker(walletLocation, index, this.locationMarkerIcon(), latLng);
      case 'walletIdentity':
        const icon = (walletLocation.walletAddress === this.props.walletAddress)
          ? this.locationMarkerIcon()
          : this.nearbyWalletMarkerIcon();
        return this.walletMarker(walletLocation, index, icon, latLng)
      default:
        return null;
    }
  }

  render() {
    const { center, minZoom, maxZoom, snackbarOpen, snackbarText } = this.state;
    const { locationLoading, walletLocation, walletLocations, nearbyWallets, searchResults, classes, getLocation } = this.props;
    const ShareLocation = () => (
      <React.Fragment>
        {locationLoading && (
          <CircularProgress size="24" className={classes.locationLoading}/>
        )}
        Share Location
      </React.Fragment>
    );
    return (
      <React.Fragment>
        <LeafletMap
          ref={(ref) => this.map = ref}
          center={center}
          zoom={8}
          minZoom={minZoom}
          maxZoom={maxZoom}
          attributionControl={true}
          zoomControl={true}
          doubleClickZoom={true}
          scrollWheelZoom={true}
          dragging={true}
          animate={true}
          easeLinearity={0.35}
          className={classes.map}
        >
          <TileLayer
            url='https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
          />
          <Control position="topright" >
            <Button 
              color="primary" variant="contained" 
              onClick={getLocation} 
              disabled={locationLoading}
            >
              {(this.props.location.pathname === '/')
                ? (<ShareLocation />)
                : (<ArrowBackIcon onClick={() => this.props.history.push('/') } />)}
            </Button>
          </Control>
          <Spiderfy
            onSpiderfy={this.props.mapMoved}
            onUnspiderfy={this.loadMarkers}
          >
            {walletLocation && this.renderMarker(walletLocation, 'walletIdentity')}
            {walletLocations && walletLocations.map((location, index) => 
              this.renderMarker(location, 'walletIdentity', `walletLocation-${index}`)
            )}
            {nearbyWallets && nearbyWallets.map((location, index) => 
              this.renderMarker(location, 'walletIdentity', `nearbyWallet-${index}`)
            )}
            {searchResults && searchResults.map((location, index) => 
              this.renderMarker(location, 'walletAddress', `searchResult-${index}`)
            )}
          </Spiderfy>
        </LeafletMap>
        <Snackbar
          color="primary"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          key='bottom,center'
          open={snackbarOpen}
          ContentProps={{
            'aria-describedby': 'message-id',
            className: classes.snackbar
          }}
          message={<span id="message-id">{snackbarText}</span>}
        />
      </React.Fragment>
    );
  }
}

export default geolocated({
  positionOptions: { enableHighAccuracy: false },
  userDecisionTimeout: 5000,
  suppressLocationOnMount: true,
})(withStyles(styles)(withRouter(props => <Map {...props}/>)));