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
        // console.log(groups)

    }, [dispatch]);

    let groupList;

    if (groups) {
        groupList = Object.values(groups);
    }

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
                groupList.map((group) => (
                    <div key={`groupList${group.id}`} >
                        <div className='groupList' onClick={toGroup(group.id)} >
                            <div className='margin-top'>
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
