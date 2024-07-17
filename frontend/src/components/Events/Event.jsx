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
        eventList = Object.values(events);
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
                    <div key={`event${event.id}`}>
                        <div className='eventList'>
                            <div>
                                {
                                    event.previewImage !== 'None' ? <img src={`${event.previewImage}`} className='eventListImage' onClick={toEvent(event.id)} /> : ''
                                }
                            </div>

                            <div className='meetupBody'>

                                <h4 className='eventListSchedule' onClick={toEvent(event.id)}>{event.startDate.split(" ").join(" · ")}</h4>
                                <h3 className='eventListName' onClick={toEvent(event.id)}>{event.name}</h3>
                                <h4 className='eventListLocation' onClick={toEvent(event.id)}>{event.Venue.city}, {event.Venue.state}</h4>

                            </div>


                        </div>


                    </div>
                ))
            }

        </div>
    );
}

export default Events;
