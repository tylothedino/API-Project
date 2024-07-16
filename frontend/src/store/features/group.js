//URL Fetches
import { csrfFetch } from '../csrf'

//ACTION TYPES
const GET_ALL_GROUPS = 'groups/getAllGroups';
const GET_GROUP = 'groups/getGroup';

//========================================REGULAR ACTION CREATOR==========================================

//Get every group in Meetup
export const getAllGroups = (groups) => ({
    type: GET_ALL_GROUPS,
    groups
});


//Get a single group in Meetup
export const getGroup = (group) => ({
    type: GET_GROUP,
    group
});


//========================================THUNK ACTION CREATOR============================================

//Find all groups in Meetup
export const allGroups = () => async (dispatch) => {
    const response = await csrfFetch('/api/groups');

    if (response.ok) {
        const data = await response.json();
        // console.log("DATA THUNK: ", data.Groups)
        dispatch(getAllGroups(data.Groups));
        return response;
    }

};

export const oneGroup = (groupId) => async (dispatch) => {
    const response = await csrfFetch(`/api/groups/${groupId}`);

    const data = await response.json();

    dispatch(getGroup(data));

    return response;


};


//===============================================REDUCERS=================================================

//Group initial state

const group = (state = [], action) => {
    switch (action.type) {
        default:
            return state;

        case GET_ALL_GROUPS: {
            const groupsState = [];
            action.groups.forEach((group) => {
                groupsState[group.id] = group;
            })

            return groupsState;


        }

        case GET_GROUP: {
            // console.log("ACTION: ", action)
            const groupState = { ...state };
            groupState[action.group.id] = action.group;
            return groupState;

        }

    }

};


export default group;
