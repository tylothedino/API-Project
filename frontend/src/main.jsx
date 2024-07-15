import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

//Provider will provide the Redux store
import { Provider } from 'react-redux';
import configureStore from './store';

//Receive CSRF token
import { restoreCSRF, csrfFetch } from './store/csrf';

//Session login
import * as sessionActions from './store/session';

import { ModalProvider, Modal } from './context/Modal';


//Create a variable to access your store and expose it on the <WINDOW>
const store = configureStore();

//It should not be exposed in production; make sure this is only set in development
if (import.meta.env.MODE !== 'production') {
  restoreCSRF();

  window.csrfFetch = csrfFetch;
  window.store = store;

  //Login
  window.sessionActions = sessionActions;
}



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/*
      Wrapping the rendered <App> component in Redux's Provider component passing store as a prop of the same name to Provider
    */}
    <ModalProvider>
      <Provider store={store}>
        <App />
        <Modal />
      </Provider>
    </ModalProvider>
  </React.StrictMode>
);
