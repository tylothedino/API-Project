import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ProfileButton from './ProfileButton';
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModel/LoginFormModal';
import './Navigation.css';

function Navigation({ isLoaded }) {
    const sessionUser = useSelector(state => state.session.user);
    const dispatch = useDispatch();

    const logout = (e) => {
        e.preventDefault();
        dispatch(sessionActions.logout());
    };

    // const sessionLinks = sessionUser ? (
    //     <>
    //         <li>
    //             <ProfileButton user={sessionUser} />
    //         </li>
    //         {/* <li>
    //             <button onClick={logout}>Log Out</button>
    //         </li> */}
    //     </>
    // ) : (
    //     <>
    //         <li>
    //             <NavLink to="/login">Log In</NavLink>
    //         </li>
    //         <li>
    //             <NavLink to="/signup">Sign Up</NavLink>
    //         </li>
    //     </>
    // );

    const sessionLinks = sessionUser ? (
        <>
            <li>
                <ProfileButton user={sessionUser} />
            </li>
            {/* <li>
                <button onClick={logout}>Log Out</button>
            </li> */}
        </>
    ) : (
        <>
            <li>
                <OpenModalButton
                    buttonText="Log In"
                    modalComponent={<LoginFormModal />}
                />
            </li>
            <li>
                <NavLink to="/signup">Sign Up</NavLink>
            </li>
        </>
    );

    return (
        <ul>
            <li>
                <NavLink to="/">Home</NavLink>
            </li>
            {isLoaded && sessionLinks}
        </ul>
    );
}

export default Navigation;
