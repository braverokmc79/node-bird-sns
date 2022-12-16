import { createWrapper } from 'next-redux-wrapper';
import { compose, applyMiddleware, legacy_createStore as createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import reducer from '../reducers';

import thunkMiddleware from 'redux-thunk';
const loggerMiddleware = ({ dispatch, getState }) => (next) => (action) => {
    console.log("loggerMiddleware  :", action);
    return next(action);
}


const configureSotre = () => {
    const middlewares = [thunkMiddleware, loggerMiddleware];
    const enhancer = process.env.NODE_ENV === 'production'
        ? compose(applyMiddleware(...middlewares))
        : composeWithDevTools(applyMiddleware(...middlewares));

    const store = createStore(reducer, enhancer);
    return store;
};


const wrapper = createWrapper(configureSotre, {
    debug: process.env.NODE_ENV === 'development,'
});

export default wrapper;


// import Reducer from './_reducers';
// import { applyMiddleware, legacy_createStore as createStore } from 'redux';
// import promiseMiddleware from 'redux-promise';
// import ReduxThunk from 'redux-thunk';
// const createStoreWithMiddleware = applyMiddleware(promiseMiddleware, ReduxThunk)(createStore);
// const devTools = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();
// createStoreWithMiddleware(Reducer, devTools)

