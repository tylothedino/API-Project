//URL Fetches
import { csrfFetch } from '../csrf'

//ACTION TYPES
const GET_ALL_GROUPS = 'groups/getAllGroups';


//========================================REGULAR ACTION CREATOR==========================================

//Get every group in Meetup
export const getAllGroups = (groups) => ({
    type: GET_ALL_GROUPS,
    groups
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

    }

};


export default group;
