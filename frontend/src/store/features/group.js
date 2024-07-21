//URL Fetches
import { csrfFetch } from '../csrf'

//ACTION TYPES
const GET_ALL_GROUPS = 'groups/getAllGroups';
const GET_GROUP = 'groups/getGroup';
const GET_GROUP_EVENTS = 'groups/getGroupEvents';
const CREATE_GROUP = 'groups/createGroup';
const ADD_IMAGE_GROUP = 'groups/addImage';
const GET_USER_GROUP = 'groups/user';
// const GET_MEMBERS = 'groups/getMembers'
const DELETE_GROUP = 'group/delete'

const UPDATE_GROUP = 'group/update'

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

export const getGroupEvents = (events) => ({
    type: GET_GROUP_EVENTS,
    events
});

//Create a group
export const createGroup = (group, image) => ({
    type: CREATE_GROUP,
    group,
    image
});


//Add group image
export const addImage = (image) => ({
    type: ADD_IMAGE_GROUP,
    image
})

export const getUserGroup = (groups) => ({
    type: GET_USER_GROUP,
    groups
});

//Get the list of alll members in group
// export const loadMembers = (members) => ({
//     type: GET_MEMBERS,
//     members

// });


//DELETE GROUP
export const deleteGroup = (message) => ({
    type: DELETE_GROUP,
    message
});

export const updateGroup = (group) => ({
    type: UPDATE_GROUP,
    group
})

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

export const groupEvents = (groupId) => async (dispatch) => {
    const response = await csrfFetch(`/api/groups/${groupId}/events`);

    const data = await response.json();

    dispatch(getGroupEvents(data));

    return response;

};

//CREATE GROUP

export const newGroup = (group, image) => async (dispatch) => {
    const response = await csrfFetch('/api/groups', {
        method: 'POST',
        body: JSON.stringify({ group, image })
    });

    const data = await response.json();
    dispatch(createGroup(data));

    return response;

};

export const createGroupImage = (groupId, image) => async (dispatch) => {
    const response = await csrfFetch(`/api/groups/${groupId}/images`, {
        method: 'POST',
        body: JSON.stringify(image)
    });

    const data = await response.json();
    dispatch(addImage(data));

    return response;

};

//GET ALL USER'S GROUPS

export const userGroups = () => async (dispatch) => {
    const response = await csrfFetch('/api/groups/current');

    const data = await response.json();

    dispatch(getUserGroup(data));

    return response;
}


//GET ALL MEMBERS IN GROUP

// export const listMembers = (groupId) => async (dispatch) => {
//     const response = await csrfFetch(`/api/groups/${groupId}/members`);
//     const data = await response.json();

//     dispatch(loadMembers(data));


//     return response;
// }

export const destroyGroup = (groupId) => async (dispatch) => {
    const response = await csrfFetch(`/api/groups/${groupId}`, {
        method: 'DELETE'
    });

    const data = await response.json();
    dispatch(deleteGroup(data));

    return response;
}


export const changeGroup = (group, groupId) => async (dispatch) => {
    const response = await csrfFetch(`/api/groups/${groupId}`, {
        method: "PUT",
        body: JSON.stringify(group)
    });

    const data = await response.json();

    dispatch(updateGroup(data));

    return response;
}

//===============================================REDUCERS=================================================

//Group initial state

const group = (state = [], action) => {
    switch (action.type) {
        default:
            return state;

        case GET_ALL_GROUPS: {
            const groupList = [];
            action.groups.forEach((group) => {
                groupList[group.id] = group;
            })

            const groupState = { ...state, groupList: groupList }
            return groupState;

            // return groupList;
        }

        case GET_GROUP: {
            // console.log("ACTION: ", action)
            const groupState = { ...state, oneGroup: { ...action.group } };
            return groupState;

        }

        case GET_GROUP_EVENTS: {
            const groupState = { ...state, events: [...action.events.Events] };
            return groupState;
        }

        case CREATE_GROUP: {
            const groupState = {
                ...state, newGroup: action.group
            };
            return groupState;
        }

        case ADD_IMAGE_GROUP: {
            const groupState = { ...state, groupImage: { ...action.image } };
            return groupState;
        }

        case GET_USER_GROUP: {
            const groupState = { ...state, groups: [...action.groups] };
            return groupState;
        }

        // case GET_MEMBERS: {
        //     const groupState = { ...state, members: { ...action.members } };
        //     return groupState;
        // }

        case DELETE_GROUP: {
            const groupState = { ...state, deleteMessage: action.message }
            return groupState;
        }
        case UPDATE_GROUP: {
            const groupState = { ...state, ...action.group }
            return groupState
        }

    }

};


export default group;
