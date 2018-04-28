import { applyMiddleware, createStore, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { generateContractsInitialState } from 'drizzle';
import reducer from './reducers';
import rootSaga from './rootSaga';
import config from './config';

const composeEnhancers =
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : compose;

const sagaMiddleware = createSagaMiddleware();

const preloadedState =
  typeof window === 'object' ? window.__PRELOADED_STATE__ : {};

if (typeof window === 'object') {
  delete window.__PRELOADED_STATE__;
}

const initialState = Object.assign({}, preloadedState, {
  contracts: generateContractsInitialState(config.drizzleOptions)
});

const store = createStore(
  reducer,
  initialState,
  composeEnhancers(applyMiddleware(
    sagaMiddleware
  ))
);

sagaMiddleware.run(rootSaga);

export default store;
