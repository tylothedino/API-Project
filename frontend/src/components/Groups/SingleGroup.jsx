import './Groups.css'

import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { oneGroup, groupEvents } from '../../store/features/group';
import { useEffect } from 'react';


function SingleGroup() {
    const { groupId } = useParams();

    const group = useSelector((state) => state.group[groupId]);
    const groupEventsList = useSelector((state) => state.group.events);

    const navigate = useNavigate();

    const dispatch = useDispatch();
    //Initialize the groups
    useEffect(() => {
        dispatch(oneGroup(groupId));
        dispatch(groupEvents(groupId));

    }, [dispatch, groupId]);

    const groupImage = group && group.GroupImages && group.GroupImages.find((image) => image.preview);

    //Event date sorting

    const date = new Date;

    const upcomingEvent = (groupEventsList && groupEventsList.filter((event) => {
        const eventDate = new Date(event.startDate);
        return eventDate >= date;
    }).sort(compareDates));

    const pastEvent = (groupEventsList && groupEventsList.filter((event) => {
        const eventDate = new Date(event.startDate);

        // const test = new Date("2025-11-20 06:00:00");

        // return eventDate < test;
        return eventDate < date;
    }).sort(compareDates));

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
        <div>
            <div className='container'>
                <div className='header'>
                    <p>
                        &lt; <NavLink className='groupNav' to='/groups'>Groups</NavLink>
                    </p>

                    <div className='singleGroupContent'>
                        <div className='groupImage'>
                            {groupImage ? <img src={groupImage && `${groupImage.url}`}></img> : <img src="null"></img>}
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

            <div className='detailsContainer'>
                <div className='details'>
                    <h2 className='organizerHeader'>
                        Organizer
                        <p className='groupDesc'>
                            {group && group.Organizer && (group.Organizer.firstName + " " + group.Organizer.lastName)}
                        </p>
                    </h2>

                    <h2 className='organizerHeader'>
                        What we&apos;re about
                        <p className='groupInfo'>
                            {group && group.about}
                        </p>
                    </h2>
                </div>

                <div className='eventsContainer'>
                    {
                        upcomingEvent && upcomingEvent.length > 0 ?
                            <>
                                <h2 className='organizerHeader'> Upcoming Events {`(${upcomingEvent.length})`}</h2>

                                <div className='groupEventList'>
                                    {
                                        upcomingEvent.map((event) => (
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
                                                    <p className='description' onClick={toEvent(event.id)}>
                                                        {event.description}
                                                    </p>


                                                </div>


                                            </div>
                                        ))
                                    }
                                </div>
                            </>

                            : ''

                    }

                </div>

                <div className='eventsContainer'>
                    {
                        pastEvent && pastEvent.length > 0 ?
                            <>
                                <h2 className='organizerHeader'> Previous Events {`(${pastEvent.length})`}</h2>

                                <div className='groupEventList'>
                                    {
                                        pastEvent.map((event) => (
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
                            </>

                            : ''

                    }

                </div>

            </div>
        </div>

    );
}

export default SingleGroup;
