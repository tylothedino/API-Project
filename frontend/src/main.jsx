import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

//Provider will provide the Redux store
import { Provider } from 'react-redux';
import configureStore from './store';

//Create a variable to access your store and expose it on the <WINDOW>
const store = configureStore();

//It should not be exposed in production; make sure this is only set in development
if (process.env.NODE_ENV !== 'production') {
  window.store = store;
}


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/*
      Wrapping the rendered <App> component in Redux's Provider component passing store as a prop of the same name to Provider
    */}
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
