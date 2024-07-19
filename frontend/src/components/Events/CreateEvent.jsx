// import { useState } from "react";

function CreateEvent() {

    // const [name, setName] = useState('');
    // const [about, setAbout] = useState('');
    // const [type, setType] = useState('');
    // const [price, setPrice] = useState(-1);

    // const [startDate, setStart] = useState('');
    // const [endDate, setEnd] = useState('');

    // const [eventImage, setImage] = useState('');




    // const validate = () => {
    //     const error = {};
    //     const type = ['.jpg', '.png', '.jpeg'];

    //     if (!name) error.name = "Name is required";
    //     if (about.length < 50) error.about = 'Description must be at least 50 characters long';
    //     if (!type) error.type = 'Event Type is required';
    //     if (price < 0) error.price = 'Price is required';
    //     if (!startDate) error.startDate = 'Event start is required';
    //     if (!endDate) error.endDate = 'Event end is required';
    //     if (!type.find((type) => eventImage.slice(-6).find(type))) error.image = 'Image URL must end in .png, .jpg, or .jpeg';

    //     return error;
    // }


    // const handleSubmit = async (e) => {
    //     e.preventDefault();

    //     const errors = validate();

    //     if (Object.values(errors).length > 0) {
    //         set
    //     }

    // }


    return (
        <></>
        // <div className="center">
        //     <title>Start a New Group</title>
        //     <form className="createGroupForm" onSubmit={handleSubmit}>
        //         <div className="groupForm">
        //             <h4>BECOME AN ORGANIZER</h4>
        //             <h3>We&apos;ll walk you through a few steps to build your local community</h3>
        //         </div>

        //         <div className="groupForm">
        //             <h3>First, set your group&apos;s location.</h3>
        //             <p>Meetup groups meet locally, in person and online. We&apos;ll connect you with people in your area, and more can join you online.</p>
        //             <input
        //                 type='text'
        //                 placeholder="City, State"
        //                 value={location}
        //                 onChange={(e) => {
        //                     setLocation(e.target.value)

        //                 }}
        //             />
        //             {
        //                 (validationErrors.errors && validationErrors.errors.city || validationErrors.errors && validationErrors.errors.state) &&
        //                 <p className="errors">Location is required</p>
        //             }
        //         </div>

        //         <div className="groupForm">
        //             <h3>What will you group&apos;s name be?</h3>
        //             <p>
        //                 Choose a name that will give people a clear idea of what the group is about.
        //                 <br />
        //                 Feel free to get creative! You can edit this later if you change your mind.
        //             </p>
        //             <input
        //                 type='text'
        //                 placeholder="What is your group name?"
        //                 value={name}
        //                 onChange={(e) => setName(e.target.value)}

        //             />
        //             {validationErrors.errors && validationErrors.errors.name && <p className="errors">{validationErrors.errors.name}</p>}
        //         </div>

        //         <div className="groupForm">
        //             <h3>Now describe what your group will be about</h3>
        //             <p>People will see this when we promote your group, but you&apos;ll be able to add to it later, too</p>
        //             <ol>
        //                 <li>What&apos;s the purpose of the group?</li>
        //                 <li>Who should join?</li>
        //                 <li>What will you do at your events</li>
        //             </ol>
        //             <textarea
        //                 className="detailForm"
        //                 placeholder="Please write at least 50 characters"
        //                 value={about}
        //                 onChange={(e) => setAbout(e.target.value)}
        //             />
        //             {validationErrors.errors && validationErrors.errors.about && <p className="errors">{validationErrors.errors.about}</p>}
        //         </div>

        //         <div className="groupForm">
        //             <h3>Final steps...</h3>
        //             <div className="dropdownForm">
        //                 <p>Is this an in person or online group?</p>
        //                 <select
        //                     className="dropdowns"
        //                     onChange={(e) => setType(e.target.value)}
        //                     defaultValue='(select one)'
        //                 >
        //                     {
        //                         type === "" ? <option disabled>(select one)</option> : ''
        //                     }

        //                     <option value='Online'>Online</option>
        //                     <option value='In person'>In person</option>

        //                 </select>

        //                 {validationErrors.errors && validationErrors.errors.type && <p className="errors">Group Type is required
        //                 </p>}
        //             </div>

        //             <div className="dropdownForm">
        //                 <p>Is this group private or public?</p>
        //                 <select
        //                     className="dropdowns"
        //                     onChange={(e) => setPrivate(e.target.value)}
        //                     defaultValue='(select one)'
        //                 >
        //                     {
        //                         groupPrivacy === "" ? <option disabled>(select one)</option> : ''
        //                     }

        //                     <option value={true}>Private</option>
        //                     <option value={false}>Public</option>

        //                 </select>
        //                 {validationErrors.errors && validationErrors.errors.private && <p className="errors">Visibility Type is required
        //                 </p>}
        //             </div>

        //             <div className="dropDownForm">
        //                 <p>Please add an image url for your group below:</p>
        //                 <input
        //                     type='text'

        //                     placeholder="Image URL"
        //                     value={groupImage}
        //                     onChange={(e) => setImage(e.target.value)}
        //                 />
        //                 {
        //                     Object.keys(urlError).length > 0 && <p className="errors">Image URL must end in .png, .jpg, or .jpeg</p>
        //                 }

        //             </div>


        //         </div>


        //         <button type='submit'>Create Group</button>
        //     </form>
        // </div>

    );
}


export default CreateEvent;
