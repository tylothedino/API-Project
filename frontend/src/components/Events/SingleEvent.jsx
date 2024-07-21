import './Events.css'

import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import { destroyEvent, eventDetails } from '../../store/features/event';
// import { oneGroup } from '../../store/features/group';

import { useEffect } from 'react';

import { useModal } from '../../context/Modal';
import ConfirmDeleteModal from './DeleteEventModal';
function SingleEvent() {
    const { setModalContent, closeModal } = useModal();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // const group = useSelector((state) => state.group.oneGroup);


    const { eventId } = useParams();

    const event = useSelector((state) => state.event);

    const user = useSelector((state) => state.session.user);
    const group = useSelector((state) => state.event.oneGroup)


    // const groupImage = group && group.GroupImages && group.GroupImages.find((image) => image.preview);
    const groupId = useSelector((state) => state.event)

    function toGroup() {
        return () => {

            return navigate(`/groups/${group.id}`);
        }

    }



    useEffect(() => {
        dispatch(eventDetails(eventId));

    }, [dispatch, eventId])


    const handleDeleteClick = (event_Id) => {
        setModalContent(
            <div >
                <ConfirmDeleteModal
                    onDelete={() => handleDeleteConfirm(event_Id)}
                    onClose={closeModal}
                    message="Are you sure you want to remove this event?"
                    type="Event"
                />
            </div>
        );
    };


    const handleDeleteConfirm = async (eventId) => {
        await dispatch(destroyEvent(eventId));
        closeModal();
        return navigate(`/groups/${group.id}`);
    };

    return (
        <div className='center'>



            <div className='eventHeader'>
                <p>
                    &lt; <NavLink className='eventNav' to='/events'>Events</NavLink>
                </p>

                <div className='eventTitle'>
                    <h2 className='eventName'>{event.eventDetails && event.eventDetails.name}</h2>
                    <h4 className='eventHost'>Hosted by {`${event.oneGroup && event.oneGroup.Organizer.firstName} ${event.oneGroup && event.oneGroup.Organizer.lastName}`}</h4>
                </div>
            </div>


            <div className='full'>
                <div className='singleEventContent'>

                    <div className='eventInformation'>
                        {event.eventDetails && event.eventDetails.previewImage ? <img className='mainImg' src={event.eventDetails && event.eventDetails.previewImage} /> : <img className='mainImg' src="null"></img>}

                        <div className='scheduleAndGroup'>
                            <div className='eventGroupInfo' onClick={toGroup(groupId)}>
                                <div className='groupImage'>
                                    {event.oneGroup && event.oneGroup.GroupImages ? <img className='mainImg' src={event.oneGroup && event.oneGroup.GroupImages[0].url} /> : <img className='mainImg' src="null"></img>}

                                </div>
                                <div className='groupInformation'>
                                    <h4 className='groupTitle wrap'>{event.oneGroup && event.oneGroup.name}</h4>
                                    <h5>{event.oneGroup && event.oneGroup.private ? 'Private' : 'Public'}</h5>
                                </div>
                            </div>

                            <div className='eventGroupInfoDetails'>
                                <div className='schedule'>
                                    <h3>🕛</h3>
                                    <div>
                                        <h3>START </h3>
                                        <h3>END </h3>
                                    </div>
                                    <div className='scheduleDetails'>
                                        <h4 className='time'> {event.eventDetails && event.eventDetails.startDate}</h4>
                                        <h4 className='time'> {event.eventDetails && event.eventDetails.endDate}</h4>
                                    </div>

                                </div>

                                <div className='price'>
                                    <h3> {event.eventDetails && (event.eventDetails.price <= 0 ? "FREE" : ("💵" + Number(event.eventDetails.price).toFixed(2)))}</h3>
                                </div>

                                <div className='location'>
                                    <h3>📍{event.eventDetails && event.eventDetails.type}</h3>
                                </div>


                                < div className='actions'>
                                    {

                                        (group && user && group.Organizer.id === user.id) ? < button onClick={() => handleDeleteClick(eventId)}>Delete</button> : ""
                                    }

                                </div>

                            </div>

                        </div>

                    </div>

                    <div className='eventDetails'>
                        <h2 className='detailsTitle'>
                            Details
                        </h2>
                        <h4 className='detailsContent'>
                            {event.eventDetails && event.eventDetails.description}
                        </h4>
                    </div>


                </div>

            </div>

        </div >
    );

}


export default SingleEvent
