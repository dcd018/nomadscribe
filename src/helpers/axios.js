import axios from 'axios';

function getSourceToken() {
  const CancelToken = axios.CancelToken;
  return  CancelToken.source();
}

export {
  getSourceToken
}