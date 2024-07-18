import { useState } from "react";
import { useDispatch } from "react-redux";
// import { Navigate } from "react-router-dom";

//Grab the loginUser thunk action creator from session.js
import { loginUser } from "../../store/session";

import { useModal } from '../../context/Modal';
import './LoginForm.css';

const LoginFormModal = () => {
    //States for the user's login
    const [credential, setCredential] = useState('');
    const [password, setPassword] = useState('');

    //States for the validation errors
    const [validationErrors, setValidationErrors] = useState({});

    const { closeModal } = useModal();

    //Create a dispatch variable
    const dispatch = useDispatch();
    //Extract data from the Redux store state - session
    // const user = useSelector(state => state.session.user);

    //If a user is logged in -> navigate to the home page
    // if (user) return <Navigate to="/" replace={true} />;

    //On form submit
    const handleSubmit = (e) => {
        //Prevent the default behavior
        e.preventDefault();

        //Create a user variable to hold the user data
        const user = {
            credential,
            password
        };

        //Clear the form inputs
        reset();

        //Dispatch the loginUser method and if an error is given set it to the validationErrors
        // return dispatch(loginUser(user)).catch(
        //     async (res) => {
        //         const data = await res.json();
        //         setValidationErrors(data);

        //     }
        // );




        return dispatch(loginUser(user))
            .then(closeModal)
            .catch(async (res) => {
                const data = await res.json();
                setValidationErrors(data);
                // console.log(validationErrors)

            });

    };

    //Method to reset the form
    const reset = () => {
        setCredential('');
        setPassword('');
    };

    return (
        <div className="loginBox">
            <form onSubmit={handleSubmit}>

                <h2 className="loginTitle">Login</h2>

                <div className="contentBox">
                    {/* Credential (Username/Email) */}
                    <div className="center">
                        {/* Errors */}
                        <div className="errors credentials">
                            <section>
                                {

                                    validationErrors.errors && < p > The provided credentials were invalid.</p>
                                }
                            </section>


                        </div>
                        {/* Input box */}
                        <input className="credentials"
                            type='text'
                            onChange={(e) => setCredential(e.target.value)}
                            value={credential}
                            placeholder="Username/Email"
                            name='credential'
                        // required
                        />
                    </div>
                    {/* Password */}
                    <div className="center">
                        {/* Input box */}
                        <input
                            className="credentials"
                            type='password'
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            placeholder="Password"
                            name='password'
                        // required
                        />

                    </div>



                    <button type='submit'>Login</button>

                    <button className='demoUser'
                        onClick={() => {
                            setCredential("JohnD")
                            setPassword('password1')
                        }
                        }
                        type="submit"
                    >Demo User</button>

                </div>

            </form >
        </div >
    );


};

export default LoginFormModal;
