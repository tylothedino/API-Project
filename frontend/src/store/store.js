import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { thunk } from 'redux-thunk';


//Contains all reducer functions from different "stores"
const rootReducer = combineReducers({

});

/*

    Enhancer variable will be set to different store enhancers depending on whether the Node env is development or production.

*/

let enhancer;

//In production the enhancer should only apply the <THUNK> middleware
if (import.meta.env.MODE === 'production') {
    enhancer = applyMiddleware(thunk);
}

/*
    In development you should also apply the <LOGGER> middleware and the Redux DevTool compose enhancer
        - To use it create a logger variable that uses default export of redux-logger
        - Then grab the Redux DevTools compose enhancers with -> window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
            -> Then store it in a variable called composeEnhancers

        - Then set the enhancer variable to the return of the composeEnhancers function passing in
        applyMiddleware invoked with thunk then logger
*/
else {
    const logger = (await import("redux-logger")).default;
    const composeEnhancers =
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

//This function takes in a optional preloadedState
const configureStore = (preloadedState) => {
    //Return createStore invoked with the rootReducer, preloadedState and enhancer
    return createStore(rootReducer, preloadedState, enhancer);
};

//This function will be used by main.jsx to attach the Redux store to the React application
export default configureStore;
