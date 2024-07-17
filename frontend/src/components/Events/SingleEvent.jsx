import './Events.css'

import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { eventDetails } from '../../store/features/event';
import { oneGroup } from '../../store/features/group';

import { useEffect } from 'react';

function SingleEvent() {

    const dispatch = useDispatch();

    const event = useSelector((state) => state.event.event);

    const { eventId } = useParams();
    const groupId = event && event.id;


    const group = useSelector((state) => state.group[groupId]);


    useEffect(() => {
        dispatch(eventDetails(eventId));
        dispatch(oneGroup(groupId));

    }, [dispatch, eventId, groupId]);


    return (
        <div>
            <div className='container'>
                <div className='header'>
                    <p>
                        &lt; <NavLink className='eventNav' to='/events'>Events</NavLink>
                    </p>



                </div>

            </div>

        </div>
    );

}


export default SingleEvent
