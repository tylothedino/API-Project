//URL Fetches
import { csrfFetch } from '../csrf';

//ACTION TYPES
const GET_ALL_EVENTS = 'events/getAllEvents';



//========================================REGULAR ACTION CREATOR==========================================
export const getAllEvents = (events) => ({
    type: GET_ALL_EVENTS,
    events
});





//========================================THUNK ACTION CREATOR============================================
export const allEvents = () => async (dispatch) => {
    const response = await csrfFetch('/api/events');

    if (response.ok) {
        const data = await response.json();
        // console.log("DATA THUNK: ", data.Groups)
        dispatch(getAllEvents(data.Events));
        return response;
    }

};



//===============================================REDUCERS=================================================
const event = (state = [], action) => {
    switch (action.type) {
        default:
            return state;
        case GET_ALL_EVENTS: {
            const eventState = [];
            action.events.forEach((event) => {
                eventState[event.id] = event;
            })
            return eventState;
        }
    }
};

export default event;
