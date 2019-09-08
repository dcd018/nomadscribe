import { api } from '../config'
import L from 'leaflet';
import axios from 'axios';
import NetworkError from '../errors/NetworkError';
import "leaflet-control-geocoder/dist/Control.Geocoder";

export default function reverseGeocode(latLng, source) {
  const { nominatim: { url, zoom } } = api;
  const { lat, lng } = latLng;
  const endpoint = `${url}/reverse?format=json&lat=${lat}&lon=${lng}&zoom=${zoom}`;
  return axios.get(endpoint, { cancelToken: source.token }).then(res => ({
    ...res.data,
    query: { latLng, zoom },
    center: new L.LatLng(
      parseFloat(res.data.lat),
      parseFloat(res.data.lon)
    )
  })).catch(err => {
    throw (err.resposne) ? err : new NetworkError(err.message);
  })
}