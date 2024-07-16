import './Groups.css'

import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { oneGroup } from '../../store/features/group';
import { useEffect } from 'react';

function SingleGroup() {
    const { groupId } = useParams();

    const group = useSelector((state) => state.group[groupId]);
    const sessionUser = useSelector((state) => state.session.user);

    const dispatch = useDispatch();
    //Initialize the groups
    useEffect(() => {
        dispatch(oneGroup(groupId));

    }, [dispatch, groupId]);

    // console.log(group)

    const groupImage = group && group.GroupImages && group.GroupImages.find((image) => image.preview);



    return (
        <div className='container'>
            <div className='header'>
                <p>
                    &lt; <NavLink className='groupNav' to='/groups'>Groups</NavLink>
                </p>

                <div className='singleGroupContent'>
                    <div className='groupImage'>
                        <img src={groupImage && `${groupImage.url}`}></img>
                    </div>
                    <div className='groupContent'>
                        <h2 className='groupName'>{group && group.name}</h2>

                        <div className='groupDesc'>
                            <h3>{group && group.city + ", " + group.state}</h3>
                            <h3>{group && group.eventCount} event(s) · {group && group.private ? " Private" : " Public"}</h3>
                            <h3>Organized by {group && group.Organizer && (group.Organizer.firstName + " " + group.Organizer.lastName)}</h3>
                        </div>

                    </div>
                </div>
            </div>
        </div>

    );
}

export default SingleGroup;
