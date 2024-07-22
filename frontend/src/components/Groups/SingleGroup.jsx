import './Groups.css'

import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { oneGroup, groupEvents } from '../../store/features/group';
import { useEffect, useState } from 'react';

import DeleteGroupModal from './DeleteGroupModal';
import { useModal } from '../../context/Modal';
import { destroyGroup } from '../../store/features/group';
// import event from '../../store/features/event';

function SingleGroup() {
    const { groupId } = useParams();
    const { setModalContent, closeModal } = useModal();
    const group = useSelector((state) => state.group.oneGroup);
    const groupEventsList = useSelector((state) => state.group.events);
    const user = useSelector((state) => state.session.user);

    // const memberList = useSelector((state) => state.members);

    const navigate = useNavigate();

    const dispatch = useDispatch();
    //Initialize the groups
    useEffect(() => {
        // dispatch(oneGroup(groupId));
        dispatch(groupEvents(groupId));

        // dispatch(listMembers(groupId));

    }, [dispatch, groupId]);
    useEffect(() => {
        dispatch(oneGroup(groupId));

    }, [dispatch, groupId])

    const groupImage = group && group.GroupImages && group.GroupImages.find((image) => image.preview);


    //Action buttons

    const [isOwner, setOwner] = useState(false);

    useEffect(() => {
        // console.log(group)
        if (user && group) {
            setOwner(group.Organizer.id === user.id);
        }
    }, [user, group, dispatch])

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

    function toCreateEvent() {
        return () => {
            return navigate(`/groups/${group.id}/events/new`);

        }

    }


    function toUpdateGroup() {
        return navigate(`/groups/${group.id}/edit`)
    }

    function joinGroupPop() {
        return window.alert("Feature is coming soon!")
    }

    const nav = useNavigate();

    const handleDeleteConfirm = async (groupId) => {
        await dispatch(destroyGroup(groupId));
        closeModal();
        return nav('/groups');
    };

    //=========================

    const handleDeleteClick = (group_id) => {
        setModalContent(
            <div >
                <DeleteGroupModal
                    onDelete={() => handleDeleteConfirm(group_id)}
                    onClose={closeModal}
                    message="Are you sure you want to remove this group?"
                    type="Group"
                />
            </div>
        );
    };

    return (
        <div>
            <div className='container'>
                <div className='header'>
                    <p>
                        &lt; <NavLink className='groupNav' to='/groups'>Groups</NavLink>
                    </p>

                    <div className='singleGroupContented'>
                        <div className='groupImage'>
                            {groupImage ? <img src={groupImage && `${groupImage.url}`} className='groupMainImage'></img> : <img src="null"></img>}
                        </div>
                        <div className='groupContent'>
                            <div>
                                <h2 className='groupName'>{group && group.name}</h2>

                                <div className='groupDesc'>
                                    <h3>{group && group.city + ", " + group.state}</h3>
                                    <h3>{group && group.eventCount} event(s) · {group && group.private ? " Private" : " Public"}</h3>
                                    <h3>Organized by {group && group.Organizer && (group.Organizer.firstName + " " + group.Organizer.lastName)}</h3>
                                </div>
                            </div>

                            {
                                isOwner && user ?
                                    <div className='actions'>
                                        <button className='ownerActions' onClick={toCreateEvent()}>Create event</button>
                                        <button className='ownerActions' onClick={toUpdateGroup}>
                                            Update
                                        </button>
                                        <button onClick={() => handleDeleteClick(group.id)}>Delete</button>

                                    </div>
                                    :
                                    user && !isOwner ?
                                        <div className='joingroup'>
                                            <button className='joingroup' onClick={joinGroupPop}>Join this group</button>
                                        </div>
                                        :
                                        <></>
                            }

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

                                <div className='groupEventList' >
                                    {
                                        upcomingEvent.map((event) => (
                                            <div key={`event${event.id}`} onClick={toEvent(event.id)}>
                                                <div className='eventList'>
                                                    <div className='eventdetailsSingle'>
                                                        <div>
                                                            {
                                                                event.previewImage !== 'None' ? <img src={`${event.previewImage}`} className='eventListImage' onClick={toEvent(event.id)} /> : ''
                                                            }
                                                        </div>

                                                        <div className='meetupBody'>

                                                            <h4 className='eventListSchedule' onClick={toEvent(event.id)}>{event.startDate.split(" ").join(" · ")}</h4>
                                                            <h3 className='eventListName' onClick={toEvent(event.id)}>{event.name}</h3>
                                                            <h4 className='eventListLocation' onClick={toEvent(event.id)}>{event.Venue && event.Venue.city}, {event.Venue && event.Venue.state}</h4>

                                                        </div>
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
                                            <div key={`event${event.id}`} onClick={toEvent(event.id)}>
                                                <div className='eventList' >
                                                    <div>
                                                        {
                                                            event.previewImage !== 'None' ? <img src={`${event.previewImage}`} className='eventListImage' /> : ''
                                                        }
                                                    </div>

                                                    <div className='meetupBody'>

                                                        <h4 className='eventListSchedule' >{event.startDate.split(" ").join(" · ")}</h4>
                                                        <h3 className='eventListName' >{event.name}</h3>
                                                        <h4 className='eventListLocation'>{event.Venue && event.Venue.city}, {event.Venue && event.Venue.state}</h4>

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
