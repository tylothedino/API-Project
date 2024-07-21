import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { allEvents } from '../../store/features/event';

import './Events.css'

function Events() {

    const events = useSelector((state) => state.event);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(allEvents());

    }, [dispatch]);

    let eventList;

    if (events) {
        eventList = Object.values(events).sort(compareDates);
    }

    function compareDates(a, b) {
        if (a.startDate < b.startDate) {
            return -1;
        } else if (a.startDate > b.startDate) {
            return 1;
        } else {
            return 0;
        }
    }

    function toEvent(eventId) {
        return () => {
            return navigate(`/events/${eventId}`);
        }

    }


    return (
        <div className='centerContainer'>
            {
                eventList.map((event) => (
                    <div key={`eventList${event.id}`}>
                        <div className='eventList' onClick={toEvent(event.id)} >
                            <div>
                                {
                                    event.previewImage !== 'None' ? <img src={`${event.previewImage}`} className='eventListImage' /> : ''
                                }
                            </div>

                            <div className='meetupBody'>

                                <h4 className='eventListSchedule'>{event.startDate && event.startDate.slice(0, 10) + ' · ' + event.startDate.slice(10)}</h4>
                                <h3 className='eventListName' >{event.name}</h3>
                                <h4 className='eventListLocation' >{event.Group && event.Group.city}, {event.Group && event.Group.state}</h4>

                            </div>

                            <p className='eventDescription'>{event && event.description}</p>


                        </div>


                    </div>
                ))
            }

        </div>
    );
}

export default Events;
