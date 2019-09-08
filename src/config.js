const {
  REACT_APP_API_ARWEAVE_HOST,
  REACT_APP_API_ARWEAVE_PORT,
  REACT_APP_API_ARWEAVE_PROTOCOL,
  REACT_APP_API_ARWEAVE_CONCURRENCY,
  REACT_APP_API_ARWEAVE_MIN_TIME,
  REACT_APP_API_NOMINATIM_URL,
  REACT_APP_API_NOMINATIM_ZOOM,
} = process.env;

export const api = {
  arweave: {
    host: REACT_APP_API_ARWEAVE_HOST || 'arweave.net', 
    port: REACT_APP_API_ARWEAVE_PORT || 443, 
    protocol: REACT_APP_API_ARWEAVE_PROTOCOL || 'https',
    concurrency: REACT_APP_API_ARWEAVE_CONCURRENCY || 3,
    minTime: REACT_APP_API_ARWEAVE_MIN_TIME || 333,
  },
  nominatim: {
    url: REACT_APP_API_NOMINATIM_URL || 'https://nominatim.openstreetmap.org',
    zoom: REACT_APP_API_NOMINATIM_ZOOM || 18,
  }
};