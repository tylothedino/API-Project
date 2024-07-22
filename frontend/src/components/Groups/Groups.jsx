import './Groups.css'

import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { allGroups } from '../../store/features/group';
import { useEffect } from 'react';
import { allEvents } from '../../store/features/event';

function Groups() {
    const groups = useSelector((state) => state.group);

    let listOfGroups;

    if (groups.groupList) {
        listOfGroups = groups.groupList;

    }

    // console.log(listOfGroups)
    const navigate = useNavigate();

    const dispatch = useDispatch();
    //Initialize the groups
    useEffect(() => {
        dispatch(allGroups());
        // dispatch(allEvents());

    }, [dispatch]);



    // console.log(groupList)
    //Redirect to group page - groupId is the id req.param
    function toGroup(groupId) {
        return () => {
            return navigate(`/groups/${groupId}`);
        }

    }




    return (
        <div className='centerContainer'>
            {
                listOfGroups && listOfGroups.map((group) => (
                    <div key={`groupList${group.id}`} >
                        <div className='groupList' onClick={toGroup(group.id)} >
                            <div className='margin-top imagepreveiw'>
                                {
                                    group.previewImage !== "No preview images available" ?
                                        <img src={`${group.previewImage}`} className='eventListImage' />
                                        :
                                        ""
                                }
                            </div>
                            <div className='meetupBody'>
                                <div>
                                    <h3 className='groupListName' >{group.name}</h3>
                                    <h4 className='groupListLocation' >{group.city + ", " + group.state}</h4>
                                </div>
                                <p className='groupListDesc' >{group.about}</p>
                                <p onClick={toGroup(group.id)}>{group.eventCount} event(s) ·
                                    {group.private ? " Private" : " Public"}
                                </p>
                            </div>
                        </div>


                    </div>
                ))
            }

        </div>
    );
}

export default Groups;
