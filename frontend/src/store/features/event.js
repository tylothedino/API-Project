//URL Fetches
import { csrfFetch } from '../csrf';

//ACTION TYPES
const GET_ALL_EVENTS = 'events/getAllEvents';
const GET_EVENT_DETAIL = 'events/getDetails'

//========================================REGULAR ACTION CREATOR==========================================
export const getAllEvents = (events) => ({
    type: GET_ALL_EVENTS,
    events
});

export const getEventDetails = (event) => ({
    type: GET_EVENT_DETAIL,
    event
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


export const eventDetails = (eventId) => async (dispatch) => {
    const response = await csrfFetch(`/api/events/${eventId}`);

    const data = await response.json();
    dispatch(getEventDetails(data));

    return response;

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
        case GET_EVENT_DETAIL: {
            const eventState = { ...state, event: { ...action.event } };
            return eventState;
        }
    }
};

export default event;
