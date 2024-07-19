import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { newGroup } from "../../store/features/group";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function CreateGroup() {

    const [name, setName] = useState('');
    const [about, setAbout] = useState('');
    const [type, setType] = useState('');
    const [groupPrivacy, setPrivate] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [location, setLocation] = useState("");

    const [groupImage, setImage] = useState('');



    const [validationErrors, setValidationErrors] = useState({});
    const [urlError, setUrlError] = useState({});
    const [hasSubmit, setSubmit] = useState(false);


    const group = useSelector((state) => state.group);
    const navigate = useNavigate();

    const dispatch = useDispatch();

    const fileType = ['.jpg', '.png', '.jpeg'];

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!fileType.find((type) => groupImage.slice(-6).includes(type))) {
            setUrlError({ error: "ERRORR" })

        } else {
            setUrlError({})
        }

        let privacy = null;

        if (groupPrivacy === 'true') {
            privacy = true;
        } else if (groupPrivacy === 'false') {
            privacy = false;
        }

        dispatch(
            newGroup({
                name, about, type, private: privacy, city, state
            }, { groupImage, preview: true })
        ).catch(async (res) => {
            const data = await res.json();
            setValidationErrors({ ...data });

        });

        setSubmit(true);

    }

    useEffect(() => {
        if (group.group && hasSubmit) {
            setSubmit(false)
            navigate(`/groups/${group.group.id}`);
        }

    }, [dispatch, hasSubmit, group.group, navigate])

    useEffect(() => {
        if (location.search(',') !== -1) {
            // console.log(location.length)
            const locationSplit = (location).split(",");
            setCity(locationSplit[0]);
            if (locationSplit[1][0] === " ") {
                locationSplit[1] = locationSplit[1].slice(1);
            }
            setState(locationSplit[1]);
        }
    }, [location]);

    useEffect(() => {
        document.title = "Start a new group"
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
                    <h4>BECOME AN ORGANIZER</h4>
                    <h3>We&apos;ll walk you through a few steps to build your local community</h3>
                </div>

                <div className="groupForm">
                    <h3>First, set your group&apos;s location.</h3>
                    <p>Meetup groups meet locally, in person and online. We&apos;ll connect you with people in your area, and more can join you online.</p>
                    <input
                        type='text'
                        placeholder="City, State"
                        value={location}
                        onChange={(e) => {
                            setLocation(e.target.value)

                        }}
                    />
                    {
                        (validationErrors.errors && validationErrors.errors.city || validationErrors.errors && validationErrors.errors.state) &&
                        <p className="errors">Location is required</p>
                    }
                </div>

                <div className="groupForm">
                    <h3>What will you group&apos;s name be?</h3>
                    <p>
                        Choose a name that will give people a clear idea of what the group is about.
                        <br />
                        Feel free to get creative! You can edit this later if you change your mind.
                    </p>
                    <input
                        type='text'
                        placeholder="What is your group name?"
                        value={name}
                        onChange={(e) => setName(e.target.value)}

                    />
                    {validationErrors.errors && validationErrors.errors.name && <p className="errors">{validationErrors.errors.name}</p>}
                </div>

                <div className="groupForm">
                    <h3>Now describe what your group will be about</h3>
                    <p>People will see this when we promote your group, but you&apos;ll be able to add to it later, too</p>
                    <ol>
                        <li>What&apos;s the purpose of the group?</li>
                        <li>Who should join?</li>
                        <li>What will you do at your events</li>
                    </ol>
                    <textarea
                        className="detailForm"
                        placeholder="Please write at least 50 characters"
                        value={about}
                        onChange={(e) => setAbout(e.target.value)}
                    />
                    {validationErrors.errors && validationErrors.errors.about && <p className="errors">{validationErrors.errors.about}</p>}
                </div>

                <div className="groupForm">
                    <h3>Final steps...</h3>
                    <div className="dropdownForm">
                        <p>Is this an in person or online group?</p>
                        <select
                            className="dropdowns"
                            onChange={(e) => setType(e.target.value)}
                            defaultValue='(select one)'
                        >
                            {
                                type === "" ? <option disabled>(select one)</option> : ''
                            }

                            <option value='Online'>Online</option>
                            <option value='In person'>In person</option>

                        </select>

                        {validationErrors.errors && validationErrors.errors.type && <p className="errors">Group Type is required
                        </p>}
                    </div>

                    <div className="dropdownForm">
                        <p>Is this group private or public?</p>
                        <select
                            className="dropdowns"
                            onChange={(e) => setPrivate(e.target.value)}
                            defaultValue='(select one)'
                        >
                            {
                                groupPrivacy === "" ? <option disabled>(select one)</option> : ''
                            }

                            <option value={true}>Private</option>
                            <option value={false}>Public</option>

                        </select>
                        {validationErrors.errors && validationErrors.errors.private && <p className="errors">Visibility Type is required
                        </p>}
                    </div>

                    <div className="dropDownForm">
                        <p>Please add an image url for your group below:</p>
                        <input
                            type='text'

                            placeholder="Image URL"
                            value={groupImage}
                            onChange={(e) => setImage(e.target.value)}
                        />
                        {
                            Object.keys(urlError).length > 0 && <p className="errors">Image URL must end in .png, .jpg, or .jpeg</p>
                        }

                    </div>


                </div>


                <button type='submit'>Create Group</button>
            </form>
        </div>


    );

}


export default CreateGroup;
