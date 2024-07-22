import { useState } from "react";
import { changeGroup, oneGroup } from "../../store/features/group";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

function UpdateGroup() {

    const { groupId } = useParams();
    const group = useSelector((state) => state.group);

    const [name, setName] = useState('');
    const [about, setAbout] = useState('');
    const [type, setType] = useState('');
    const [groupPrivacy, setPrivate] = useState(false);
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [location, setLocation] = useState(``);

    const [validationErrors, setValidationErrors] = useState({});
    const [hasSubmit, setSubmit] = useState(false);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(oneGroup(groupId));

    }, [groupId, dispatch])

    useEffect(() => {
        if (!hasSubmit && group.oneGroup) {
            const { name, about, type, city, state } = group.oneGroup;
            const privacy = group.oneGroup.private
            setName(name || '');
            setAbout(about || '');
            setType(type || '');
            setCity(city || '');
            setState(state || '');
            setPrivate(Boolean(privacy) || false);
            // Set other state variables in a similar way
        }
    }, [group, groupId, hasSubmit]);

    useEffect(() => {
        setLocation(`${city}, ${state}`)
    }, [city, state])


    const navigate = useNavigate();

    // useEffect(() => {
    //     console.log(name)
    //     console.log(about)
    //     console.log(groupId)
    //     console.log("PRIVACY ", groupPrivacy)
    // })

    const user = useSelector((state) => state.session)

    useEffect(() => {
        if (!user.user) {
            navigate("/");
        }
        if (group.oneGroup && (user.user.id !== group.oneGroup.organizerId)) {
            navigate("/");
        }

    }, [user, navigate])


    const handleSubmit = (e) => {
        e.preventDefault();

        dispatch(
            changeGroup({
                name, about, type, private: Boolean(groupPrivacy), city: location.split(', ')[0], state: location.split(', ')[1]
            }, groupId)
        ).catch(async (res) => {
            const data = await res.json();
            setValidationErrors({ ...data });

        });

        setSubmit(true);

    }

    useEffect(() => {
        if (hasSubmit && Object.keys(validationErrors).length === 0) {
            setSubmit(false)
            navigate(`/groups/${groupId}`);
        }

    }, [dispatch, hasSubmit, groupId, validationErrors, navigate])



    useEffect(() => {
        document.title = "Start a new group"
    }, [])

    const handleChangePrivate = (e) => {
        if (e.target.value === 'false') {
            setPrivate(false)
        } else {
            setPrivate(true)
        }
    }

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
                            value={type}
                        >
                            <option value={"Online"}>Online</option>
                            <option value={"In person"}>In person</option>

                        </select>

                        {validationErrors.errors && validationErrors.errors.type && <p className="errors">Group Type is required
                        </p>}
                    </div>

                    <div className="dropdownForm">
                        <p>Is this group private or public?</p>
                        <select
                            className="dropdowns"
                            onChange={handleChangePrivate}
                            value={groupPrivacy}
                        >

                            <option value={"true"}>Private</option>
                            <option value={"false"}>Public</option>

                        </select>
                        {validationErrors.errors && <p className="errors">Visibility Type is required
                        </p>}
                    </div>


                </div>


                <button type='submit'>Create Group</button>
            </form >
        </div >


    );
}

export default UpdateGroup;
