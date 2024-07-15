/*
    # Adds the Redux store actions and reducers that you need for logging in
        -> You will use the POST /api/session backend route to log in a user
        as well as add the session user's information to the frontend Redux store

    # This file will contain all the actions specific to the session user's information
    and the session user's Redux reducer

*/

//Import the CSRF fetch method
import { csrfFetch } from "./csrf";


const SET_USER = 'user/setUser';
const REMOVE_USER = 'user/removeUser'

//========================================REGULAR ACTION CREATOR==========================================

//Set the current user
export const setUser = (user) => ({
    type: SET_USER,
    user

});

//Remove the current user
export const removeUser = () => ({
    type: REMOVE_USER

});


//=========================================THUNK ACTION CREATOR===========================================

export const loginUser = (user) => async (dispatch) => {
    const { credential, password } = user;
    const response = await csrfFetch('/api/session', {
        method: "POST",
        body:
            JSON.stringify({
                credential,
                password
            })
    });

    if (response.ok) {
        const data = await response.json();
        dispatch(setUser(data.user));
        return response;

    }
};

//Restore to the current user -> GET the user
export const restoreUser = () => async (dispatch) => {
    const response = await csrfFetch('/api/session');

    if (response.ok) {
        const data = await response.json();
        dispatch(setUser(data.user));
        return response;
    }

};


//========================================================================================================

//User initial object
const initialUser = { user: null };

//Reducer
const session = (state = initialUser, action) => {
    switch (action.type) {
        default:
            return state;
        //Set the user
        case SET_USER: {
            const newUser = { ...state, user: action.user };
            return newUser;
        }
        case REMOVE_USER: {
            const newUser = { ...state, user: null };
            return newUser;
        }

    }

}

export default session;
