import './Groups.css'

import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { allGroups } from '../../store/features/group';
import { useEffect } from 'react';


function Groups() {
    const groups = useSelector((state) => state.group);
    const navigate = useNavigate();

    const dispatch = useDispatch();
    //Initialize the groups
    useEffect(() => {
        dispatch(allGroups());

    }, [dispatch]);

    let groupList;

    if (groups) {
        groupList = Object.values(groups);
    }

    //Redirect to group page - groupId is the id req.param
    function toGroup(groupId) {
        return () => {
            console.log("I made it")
            return navigate(`/api/groups/${groupId}`);
        }

    }




    return (
        <>
            <h1>GROUPS</h1>
            {
                groupList.map((group) => (
                    <div key={`group${group.id}`} className='groupList' onClick={toGroup(group.id)}>
                        <h3 className='groupListName'>{group.name}</h3>
                        <img src={`${group.previewImage}`} className='groupListImage' />
                        <h4 className='groupListLocation'>{group.city + ", " + group.state}</h4>
                        <p className='groupListDesc'>{group.about}</p>
                        <p>Number of Events: {group.eventCount}</p>
                        {

                            group.private ? (<p>Private</p>) : (<p>Public</p>)

                        }

                    </div>
                ))
            }

        </>
    );
}

export default Groups;
