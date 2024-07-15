import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

import { loginUser } from "../../store/session";

const LoginFormPage = () => {
    const [credential, setCredential] = useState('');
    const [password, setPassword] = useState('');

    const [validationErrors, setValidationErrors] = useState({});

    const dispatch = useDispatch();
    const user = useSelector(state => state.session.user);

    if (user) return <Navigate to="/" replace={true} />;

    const handleSubmit = (e) => {
        e.preventDefault();

        const user = {
            credential,
            password
        };

        dispatch((loginUser(user)));

        reset();

        return dispatch(loginUser(user)).catch(
            async (res) => {
                const data = await res.json();
                setValidationErrors(data);

            }
        );


    };

    const reset = () => {
        setCredential('');
        setPassword('');
    };

    return (
        <div className="loginBox">
            <form onSubmit={handleSubmit}>

                <h2 className="loginTitle">Login</h2>

                {/* Credential (Username/Email) */}
                <div className="credential">
                    {/* Input box */}
                    <input
                        type='text'
                        onChange={(e) => setCredential(e.target.value)}
                        value={credential}
                        placeholder="Username/Email"
                        name='credential'
                    />
                </div>
                {/* Password */}
                <div className="password">
                    {/* Input box */}
                    <input
                        type='password'
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        placeholder="Password"
                        name='password'
                    />

                </div>

                {/* Errors */}
                <div className="errors">
                    {
                        validationErrors.message && <p>{validationErrors.message}</p>
                    }
                </div>

                <button type='submit'>Login</button>

            </form>
        </div>
    );


};

export default LoginFormPage;
