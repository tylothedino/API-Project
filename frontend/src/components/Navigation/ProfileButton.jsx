// frontend/src/components/Navigation/ProfileButton.jsx

//CHECKOUT PHASE-3 FRONTEND

import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { FaUserCircle } from 'react-icons/fa';
import * as sessionActions from '../../store/session';
// import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


function ProfileButton({ user }) {
    const dispatch = useDispatch();
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();
    const nav = useNavigate();

    const toggleMenu = (e) => {
        e.stopPropagation(); // Keep click from bubbling up to document and triggering closeMenu
        setShowMenu(!showMenu);
    };

    useEffect(() => {
        if (!showMenu) return;

        const closeMenu = (e) => {
            if (ulRef.current && !ulRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        };

        document.addEventListener('click', closeMenu);

        return () => document.removeEventListener("click", closeMenu);
    }, [showMenu]);

    const logout = (e) => {
        e.preventDefault();
        dispatch(sessionActions.logout());
        nav('/');
    };

    const toGroup = () => {
        return nav("/groups/")
    }

    const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

    return (
        <div>
            <button className='profilePicButton' onClick={toggleMenu}>
                <FaUserCircle />
            </button>

            <ul className={ulClassName} ref={ulRef}> {/* <-- Attach it here */}
                <div className='partition'>
                    <li>Hello, {user.firstName}</li>
                    {/* <li>{user.firstName} {user.lastName}</li> */}
                    <li>{user.email}</li>
                </div>
                <div className='partition'>
                    <button className='profileButton' onClick={toGroup}>All groups</button>
                </div>
                <div className='partition noBottom'>
                    <li>
                        <button className='profileButton' onClick={logout}>Log Out</button>
                    </li>
                </div>

            </ul>

        </div>

    );
}

export default ProfileButton;
