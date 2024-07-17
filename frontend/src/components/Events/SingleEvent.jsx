import './Events.css'

import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import { eventDetails } from '../../store/features/event';
import { oneGroup } from '../../store/features/group';

import { useEffect } from 'react';

function SingleEvent() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const event = useSelector((state) => state.event.event);

    const { eventId } = useParams();
    const groupId = event && event.id;


    let group = useSelector((state) => state.group[groupId]);
    const groupImage = group && group.GroupImages && group.GroupImages.find((image) => image.preview);


    function toGroup(groupId) {
        return () => {

            return navigate(`/groups/${groupId}`);
        }

    }

    useEffect(() => {
        dispatch(eventDetails(eventId));

        dispatch(oneGroup(groupId));


    }, [dispatch, eventId, groupId]);


    return (
        <div className='center'>

            <div className='eventContainer'>
                <div className='eventHeader'>
                    <p>
                        &lt; <NavLink className='eventNav' to='/events'>Events</NavLink>
                    </p>

                    <div className='eventTitle'>
                        <h2 className='eventName'>{event && event.name}</h2>
                        <h4 className='eventHost'>Hosted by {group && group.Organizer && group.Organizer.firstName + " " + group.Organizer.lastName}</h4>
                    </div>
                </div>
            </div>

            <div className='singleEventContent'>
                <div>
                    <div className='eventInformation'>
                        {event && event.previewImage ? <img src={event && event.previewImage} className='eventImage' /> : <img src="null"></img>}

                        <div className='scheduleAndGroup'>
                            <div className='eventGroupInfo' onClick={toGroup(groupId)}>
                                <div className='groupImage'>
                                    {groupImage ? <img src={groupImage && `${groupImage.url}`}></img> : <img src="null"></img>}
                                </div>
                                <div className='groupInformation'>
                                    <h4 className='groupTitle wrap'>{group && group.name}</h4>
                                    <h5>{group && group.private ? " Private" : " Public"}</h5>
                                </div>
                            </div>

                            <div className='eventGroupInfoDetails'>
                                <div className='schedule'>
                                    <h3>🕛</h3>
                                    <div>
                                        <h3>START</h3>
                                        <h3>END</h3>
                                    </div>
                                    <div className='scheduleDetails'>
                                        <h4 className='time'> {event && event.startDate}</h4>
                                        <h4 className='time'> {event && event.endDate}</h4>
                                    </div>

                                </div>

                                <div className='price'>
                                    <h3>💰 {event && (event.price === 0 ? "FREE" : Number(event.price).toFixed(2))}</h3>
                                </div>

                                <div className='location'>
                                    <h3>📍{event && event.type}</h3>
                                </div>
                            </div>

                        </div>

                    </div>

                    <div className='eventDetails'>
                        <h2 className='detailsTitle'>
                            Details
                        </h2>
                        <h4 className='detailsContent'>
                            {event && event.description}
                        </h4>
                    </div>

                </div>

            </div>


        </div>
    );

}


export default SingleEvent
