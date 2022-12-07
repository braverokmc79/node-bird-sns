import { createWrapper } from 'next-redux-wrapper';
import { legacy_createStore as createStore } from 'redux';

import reducer from '../reducers';

const configureSotre = () => {
    const store = createStore(reducer);
    store.dispatch({
        type: "CHANGE_NICKNAME",
        data: "update"
    })
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

