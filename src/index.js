import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';

import App from './App';
import nomadscribe from './reducers';
import rootSaga from './sagas';
import { BrowserRouter } from 'react-router-dom';
import { composeWithDevTools } from "redux-devtools-extension";

const sagaMiddleware = createSagaMiddleware();
const store = createStore(nomadscribe, composeWithDevTools(applyMiddleware(sagaMiddleware)));
const basename = `/${window.location.pathname.replace('/', '').split('/').shift()}`

sagaMiddleware.run(rootSaga);

render(
  <Provider store={store}>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);
