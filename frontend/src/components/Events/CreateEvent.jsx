import { useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

import event, { newEvent } from "../../store/features/event";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// import { useSelector } from "react-redux";
import group, { oneGroup } from "../../store/features/group";

function CreateEvent() {

    const [name, setName] = useState('');
    const [about, setAbout] = useState('');
    const [type, setType] = useState('');
    const [price, setPrice] = useState(-1);

    const [startDate, setStart] = useState('');
    const [endDate, setEnd] = useState('');

    const [eventImage, setImage] = useState('');

    const [validationErrors, setValidationErrors] = useState({});

    // const [urlError, setUrlError] = useState({});

    const dispatch = useDispatch();

    const { groupId } = useParams();
    const [hasSubmit, setSubmit] = useState(false);

    const nav = useNavigate();



    const validate = () => {
        const error = {};
        const filetype = ['.jpg', '.png', '.jpeg'];

        if (!name) error.name = "Name is required";
        if (about.length < 50) error.about = 'Description must be at least 50 characters long';
        if (!type) error.type = 'Event Type is required';
        if (price < 0) error.price = 'Price is required';
        if (startDate.length < 4) error.startDate = 'Event start is required';
        if (endDate.length < 4) error.endDate = 'Event end is required';
        if (!filetype.find((type) => eventImage.slice(-6) === type || eventImage.slice(-4) === type || eventImage.slice(-5) === type)) {
            error.image = 'Image URL must end in .png, .jpg, or .jpeg';
        }

        return error;
    }

    // const event = useSelector((state) => state.event);
    // const group = useSelector((state) => state.group[groupId]);

    useEffect(() => {
        dispatch(oneGroup(groupId))
    }, [dispatch, groupId])

    // useEffect(() => {
    //     console.log("EVENT: ", event)
    // })

    const handleSubmit = async (e) => {
        e.preventDefault();
        // console.log("DAT:", startDate)
        const errors = validate();
        if (Object.values(errors).length > 0) {
            setValidationErrors(errors);
            // console.log(validationErrors)
            return;
        }

        setValidationErrors({});

        const event = {
            name, description: about, type, price, startDate, endDate, eventImage, venueId: 2, capacity: 10
        }

        const image = { url: eventImage, preview: true }

        dispatch(newEvent(event, image, groupId)).catch(async (res) => {
            const data = await res.json();
            setValidationErrors({ ...data });
        })

        setSubmit(true);
    }


    useEffect(() => {

        if (event.event && hasSubmit) {
            setSubmit(false)
            nav(`/events/${event.event.event.id}`);
        }

    }, [dispatch, hasSubmit, nav])




    const getCurrentDateTime = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    return (

        <div className="center">
            <title>Start a New Group</title>
            <form className="createGroupForm" onSubmit={handleSubmit}>


                <div className="groupForm">
                    <h2>{`Create an Event for ${group && group.name}`}</h2>
                    <h4>
                        What is the name of your event?
                    </h4>
                    <input
                        type='text'
                        placeholder="Event name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}

                    />
                    {validationErrors && validationErrors.name && <p className="errors">{validationErrors.name}</p>}
                </div>

                <div className="groupForm">
                    <div className="dropdownForm">
                        <h4>Is this an in person or online event?</h4>
                        <select
                            className="dropdowns"
                            onChange={(e) => setType(e.target.value)}
                            value={type}
                        >

                            <option value="" disabled hidden>(select one)</option>


                            <option value={"Online"}>Online</option>
                            <option value={"In person"}>In person</option>

                        </select>
                        {validationErrors && validationErrors.type && <p className="errors">Visibility Type is required
                        </p>}
                    </div>

                    <div className="dropDownForm">
                        <h4>What is the price for your event?</h4>
                        <input type='number'
                            onChange={(e) => setPrice(e.target.value)}
                            value={price < 0 ? "" : price}
                            placeholder="$ 0"
                            min={0}
                        >

                        </input>
                        {validationErrors && validationErrors.price && <p className="errors">Price is required
                        </p>}
                    </div>


                </div>


                <div className="groupForm">
                    <div className="dropDownForm">
                        <h4>When does your event start?</h4>
                        <input type='text'

                            onFocus={(e) => (e.target.type = "datetime-local")}
                            onBlur={(e) => (e.target.type = "text")}

                            min={getCurrentDateTime()}
                            onChange={(e) => setStart(e.target.value)}
                            value={startDate}
                            placeholder="MM/DD/YYYY, HH/mm AM"
                        />
                        {validationErrors && validationErrors.startDate && <p className="errors">Event start is required
                        </p>}
                    </div>
                    <div className="dropDownForm">
                        <h4>When does your event end?</h4>
                        <input type='text'
                            onFocus={(e) => (e.target.type = "datetime-local")}
                            onBlur={(e) => (e.target.type = "text")}
                            min={startDate}
                            onChange={(e) => setEnd(e.target.value)}
                            value={endDate}
                            placeholder="MM/DD/YYYY, HH/mm PM"
                        />
                        {validationErrors && validationErrors.endDate && <p className="errors">Event end is required
                        </p>}
                    </div>

                </div>

                <div className="groupForm">
                    <div className="dropDownForm">
                        <h4>Please add an image url for your group below:</h4>
                        <input
                            type='text'
                            placeholder="Image URL"
                            value={eventImage}
                            onChange={(e) => setImage(e.target.value)}
                        />
                        {
                            validationErrors && validationErrors.image && <p className="errors">Image URL must end in .png, .jpg, or .jpeg</p>
                        }

                    </div>

                </div>

                <div className="groupForm">
                    <h4>Please describe your event</h4>

                    <textarea
                        className="detailForm"
                        placeholder="Please write at least 50 characters"
                        value={about}
                        onChange={(e) => setAbout(e.target.value)}
                    />
                    {validationErrors && validationErrors.about && <p className="errors">{validationErrors.about}</p>}
                </div>



                <button type='submit'>Create Event</button>
            </form >
        </div >

    );
}


export default CreateEvent;
