import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { useModal } from '../../context/Modal';

//Grab the signup thunk action creator
import { signup } from "../../store/session";

const SignupFormModal = () => {

    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [validationErrors, setValidationErrors] = useState({});

    const { closeModal } = useModal();

    const dispatch = useDispatch();

    // const user = useSelector(state => state.session.user);

    // if (user) return <Navigate to='/' replace={true} />

    const handleSubmit = (e) => {
        e.preventDefault();

        if (password === confirmPassword) {
            return dispatch(
                signup({
                    email,
                    username,
                    firstName,
                    lastName,
                    password
                })
            ).then(closeModal)
                .catch(async (res) => {
                    const data = await res.json();
                    setValidationErrors(data);
                    console.log(data);

                });
        }
        return setValidationErrors({
            confirmPassword: "Confirm Password field must be the same as the Password field"
        });



    };

    const reset = () => {
        setPassword('');
        setConfirmPassword('');
    };

    return (
        <div className="signupBox">
            <form onSubmit={handleSubmit}>
                <label>
                    Email
                    <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </label>
                {validationErrors.errors && <p className="errors">{validationErrors.errors.email}</p>}
                <label>
                    Username
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </label>
                {validationErrors.errors && <p className="errors">{validationErrors.errors.username}</p>}
                <label>
                    First Name
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />
                </label>
                {validationErrors.errors && <p className="errors">{validationErrors.errors.firstName}</p>}
                <label>
                    Last Name
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                </label>
                {validationErrors.errors && <p className="errors">{validationErrors.errors.lastName}</p>}
                <label>
                    Password
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>
                {validationErrors.errors && <p className="errors">{validationErrors.errors.password}</p>}
                <label>
                    Confirm Password
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </label>
                {validationErrors.confirmPassword && <p className="errors">{validationErrors.confirmPassword}</p>}

                <button type='submit'>Sign Up</button>
            </form>
        </div>
    );


};

export default SignupFormModal;
