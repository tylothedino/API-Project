import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal/LoginFormModal';
import SignupFormModal from '../SignupFormModal/SignupFormModal';
import './Navigation.css';
// import { logout } from '../../store/session';

function Navigation({ isLoaded }) {
    const sessionUser = useSelector(state => state.session.user);
    // const dispatch = useDispatch();

    // const logout = (e) => {
    //     e.preventDefault();
    //     dispatch(logout());
    // };

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
            <div className='profileNav'>
                <NavLink to='/groups/new'>Start a new group</NavLink>
                <ProfileButton user={sessionUser} />
            </div>
            {/* <li>
                <button onClick={logout}>Log Out</button>
            </li> */}
        </>
    ) : (
        <>
            <div>
                <OpenModalButton
                    buttonText="Log In"
                    modalComponent={<LoginFormModal />}
                />
            </div>
            <div>
                <OpenModalButton
                    buttonText="Sign Up"
                    modalComponent={<SignupFormModal />}
                />
            </div>
        </>
    );

    return (

        <div className='mainNav'>
            <NavLink className='homeNav' to="/">Meetup</NavLink>
            <div className='userNav'>
                {isLoaded && sessionLinks}
            </div>

        </div>


    );
}

export default Navigation;
