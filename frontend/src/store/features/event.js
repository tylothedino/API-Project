//URL Fetches
import { csrfFetch } from '../csrf';

//ACTION TYPES
const GET_ALL_EVENTS = 'events/getAllEvents';
const GET_EVENT_DETAIL = 'events/getDetails';
const CREATE_EVENT = 'events/new';
const GET_GROUP_EVENT = 'groups/getGroupEvent';
const DELETE_EVENT = 'event/destroy';
//========================================REGULAR ACTION CREATOR==========================================
export const getAllEvents = (events) => ({
    type: GET_ALL_EVENTS,
    events
});

export const getEventDetails = (event) => ({
    type: GET_EVENT_DETAIL,
    event
});

export const createEvent = (event, image) => ({
    type: CREATE_EVENT,
    event,
    image
})

export const getGroup = (singlegroup) => ({
    type: GET_GROUP_EVENT,
    singlegroup

});

export const deleteEvent = (message) => ({
    type: DELETE_EVENT,
    message
});

//========================================THUNK ACTION CREATOR============================================
export const allEvents = () => async (dispatch) => {
    const response = await csrfFetch('/api/events');
    console.log("I MADE IT TO THE THUNK")
    if (response.ok) {
        const data = await response.json();
        console.log("DATA THUNK: ", data)
        dispatch(getAllEvents(data.Events));
        return response;
    }

};


export const eventDetails = (eventId) => async (dispatch) => {
    const response = await csrfFetch(`/api/events/${eventId}`);

    const data = await response.json();
    dispatch(getEventDetails(data));

    const response2 = await csrfFetch(`/api/groups/${data.groupId}`);
    const data2 = await response2.json();
    dispatch(getGroup(data2));

    // return response;

    return { event: response, groupEvent: response2 };

};

export const newEvent = (event, image, groupId) => async (dispatch) => {
    const response = await csrfFetch(`/api/groups/${groupId}/events`, {
        method: "POST",
        body: JSON.stringify({ event, image })
    })

    const data = await response.json();
    dispatch(createEvent(data));

    return response;
}

export const destroyEvent = (eventId) => async (dispatch) => {
    const response = await csrfFetch(`/api/events/${eventId}`, {
        method: 'DELETE'
    });

    const data = await response.json();
    dispatch(deleteEvent(data));

    return response;
}


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
            const eventState = { ...state };
            eventState.eventDetails = action.event
            return eventState;
        }
        case CREATE_EVENT: {
            const eventState = { ...state, ...action.event }
            return eventState;
        }

        case GET_GROUP_EVENT: {
            // console.log("ACTION: ", action)
            const groupState = { ...state, oneGroup: { ...action.singlegroup } };
            return groupState;

        }

        case DELETE_EVENT: {
            const eventState = { ...state, deleteMessage: action.message }
            return eventState
        }

    }
};

export default event;
