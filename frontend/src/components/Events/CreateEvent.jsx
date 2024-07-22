import { useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { newEvent } from "../../store/features/event";

import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { oneGroup } from "../../store/features/group";

function CreateEvent() {

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('');
    const [price, setPrice] = useState('');
    const [endDate, setEndDate] = useState('');
    const [startDate, setStartDate] = useState("");

    const [eventImage, setImage] = useState('');


    const [validationErrors, setValidationErrors] = useState({});
    // const [urlError, setUrlError] = useState({});
    const [hasSubmit, setSubmit] = useState(false);

    const { groupId } = useParams();

    const navigate = useNavigate();

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(oneGroup(groupId));

    }, [dispatch, groupId])

    const fileType = ['.jpg', '.png', '.jpeg'];
    const event = useSelector((state) => state.event);
    const group = useSelector((state) => state.group.oneGroup);





    const validate = () => {
        let errors = {};
        if (!fileType.find((type) => eventImage.slice(-6).includes(type))) {
            errors.url = "Image URL must end in .png, .jpg, .jpeg";
        }
        if (!name) errors.name = "Name is required";
        if (name.length < 5) errors.name = 'Name must be at least 5 characters'
        if (!description) errors.description = "Description is required"
        if (description.length < 50) errors.description = 'Description must be 50 characters or more ';
        if (!type) errors.type = 'Type is required';
        if (!price) errors.price = 'Price is required';

        const today = new Date();

        const datestart = new Date(startDate);
        const dateend = new Date(endDate);

        if (datestart < today) errors.startDate = 'Start date must be in the future'
        if (!startDate) errors.startDate = 'Start date is required'

        if (datestart > dateend) errors.startDate = 'Start date must be in the future'
        if (!endDate) errors.endDate = 'End date is required'

        return errors;
    }



    const handleSubmit = (e) => {
        e.preventDefault();

        setValidationErrors({});

        const formErrors = validate();
        if (Object.values(formErrors).length > 0) {
            setValidationErrors(formErrors);
            // console.log(validationErrors)
            return;
        }


        // if (!fileType.find((type) => eventImage.slice(-6).includes(type))) {
        //     setUrlError({ error: "ERRORR" })

        // } else {
        //     setUrlError({})
        // }

        /*
          venueId: 1,
          groupId: 1,
          name: "Tennis Group First Meet and Greet",
          type: "Online",
          capacity: 10,
          price: 18.50,
          description: "The first meet and greet for our group! Come say hello!",
          startDate: "2024-11-19 20:00:00",
          endDate: "2024-11-19 22:00:00",
        */

        // console.log(eventImage)


        const groupNumber = Number(groupId);
        dispatch(

            newEvent({
                name, description, type, groupId: groupNumber, price: Number(price), endDate: new Date(endDate), startDate: new Date(startDate), capacity: 10
            }, { eventImage, preview: true }, groupNumber)
        ).catch(async (res) => {
            const data = await res.json();
            setValidationErrors({ ...data });

        });
        setSubmit(true);

    }
    // useEffect(() => {
    //     console.log("EVNT ALL: (.event) ", event)
    //     console.log("CREATED event (.event.event)", newlymadeevent)
    // })

    useEffect(() => {
        // console.log(event.event.id)
        if (hasSubmit) {
            setSubmit(false)
            navigate(`/events/${event.event.id}`);
        }

    }, [event.event, navigate])



    useEffect(() => {
        document.title = "Create a new event"
    }, [])


    // useEffect(() => {
    //     // setAllError({ ...validationErrors, urlError })
    //     console.log("ERRORS: ", urlError)
    //     console.log("VLAID ", validationErrors)

    // }, [validationErrors, urlError]);

    return (

        <div className="center">
            <title>Start a New Group</title>
            <form className="createGroupForm" onSubmit={handleSubmit}>
                <div className="groupForm">
                    <h3>{`Create an event for ${group && group.name}`}</h3>

                    <p>
                        What is the name of your event?
                    </p>
                    <input
                        type='text'
                        placeholder="What is the name of your event?"
                        value={name}
                        onChange={(e) => setName(e.target.value)}

                    />
                    {(validationErrors.errors && validationErrors.errors.name) || (validationErrors && validationErrors.name) && <p className="errors">{validationErrors.name}</p>}

                </div>




                <div className="dropdownForm">
                    <h3>Is this group in person or online?</h3>
                    <select
                        className="dropdowns"
                        onChange={(e) => setType(e.target.value)}
                        value={type}
                    >
                        {
                            type === "" ? <option disabled>(select one)</option> : ''
                        }
                        <option value="" disabled hidden>Select one</option> {/* Placeholder option */}
                        <option value={'Online'}>Online</option>
                        <option value={'In person'}>In person</option>

                    </select>
                    {(validationErrors.errors && validationErrors.errors.type) || (validationErrors && validationErrors.type) && <p className="errors">{validationErrors.type}</p>}
                </div>


                <div className="groupForm">
                    <h3>What is the price of your event?</h3>
                    <input
                        type='number'
                        onChange={(e) => {
                            setPrice(e.target.value)
                            // console.log(price);
                        }}
                        value={price}
                        placeholder={price === '' ? '$0' : price}
                        min={0}
                    />
                    {(validationErrors.errors && validationErrors.errors.price) || (validationErrors && validationErrors.price) && <p className="errors">{validationErrors.price}</p>}
                </div>






                <div className="groupForm">
                    <div>
                        <h3>When does your event start?</h3>
                        <input type='datetime-local'
                            onChange={(e) => setStartDate(e.target.value)}
                            value={startDate}
                        // min={localTime}
                        ></input>
                    </div>
                    {(validationErrors.errors && validationErrors.errors.startDate) || (validationErrors && validationErrors.startDate) && <p className="errors">{validationErrors.startDate}</p>}
                    <div>
                        <h3>When does your event end?</h3>
                        <input type='datetime-local'
                            onChange={(e) => setEndDate(e.target.value)}
                            value={endDate}
                            min={startDate}
                        ></input>
                    </div>
                    {(validationErrors.errors && validationErrors.errors.endDate) || (validationErrors && validationErrors.endDate) && <p className="errors">{validationErrors.endDate}</p>}
                </div>

                <div className="groupForm">
                    <div className="dropDownForm">
                        <h3>Please add an image url for your event below:</h3>
                        <input
                            type='text'

                            placeholder="Image URL"
                            value={eventImage}
                            onChange={(e) => setImage(e.target.value)}
                        />
                        {(validationErrors.errors && validationErrors.errors.url) || (validationErrors && validationErrors.url) && <p className="errors">{validationErrors.url}</p>}

                    </div>

                </div>

                <div className="groupForm">
                    <div className="dropDownForm">
                        <h3>Please describe your event:</h3>
                        <textarea
                            className="detailForm"

                            value={description}
                            placeholder="Please include at least 30 characters"
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        {(validationErrors.errors && validationErrors.errors.description) || (validationErrors && validationErrors.description) && <p className="errors">{validationErrors.description}</p>}
                    </div>

                </div>


                <button type='submit'>Create Event</button>
            </form>
        </div>


    );

}


export default CreateEvent;
