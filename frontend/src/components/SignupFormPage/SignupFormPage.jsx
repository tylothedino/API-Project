import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

//Grab the signup thunk action creator
import { signup } from "../../store/session";

const SignupFormPage = () => {

    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [validationErrors, setValidationErrors] = useState({});

    const dispatch = useDispatch();

    const user = useSelector(state => state.session.user);

    if (user) return <Navigate to='/' replace={true} />

    const handleSubmit = (e) => {
        e.preventDefault();

        if (password === confirmPassword) {
            return dispatch(
                sessionActions.signup({
                    email,
                    username,
                    firstName,
                    lastName,
                    password
                })
            ).catch(async (res) => {
                const data = await res.json();
                if (data?.errors) {
                    setValidationErrors(data.errors);
                }
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
                {validationErrors.email && <p className="errors">{validationErrors.email}</p>}
                <label>
                    Username
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </label>
                {validationErrors.username && <p className="errors">{validationErrors.username}</p>}
                <label>
                    First Name
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />
                </label>
                {validationErrors.firstName && <p className="errors">{validationErrors.firstName}</p>}
                <label>
                    Last Name
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                </label>
                {validationErrors.lastName && <p className="errors">{validationErrors.lastName}</p>}
                <label>
                    Password
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>
                {validationErrors.password && <p className="errors">{validationErrors.password}</p>}
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

export default SignupFormPage;
