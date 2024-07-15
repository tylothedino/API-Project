import { NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom";

import './Navigation.css';


function GroupEventNavigation() {
    const location = useLocation();


    return (
        <nav>
            <NavLink to={'/events'}>
                Events
            </NavLink>

            <NavLink to={'/groups'}>Groups</NavLink>

            {
                location.pathname === '/groups' ? <h4>Groups in Meetup</h4> : <></>
            }
            {
                location.pathname === '/events' ? <h4>Events in Meetup</h4> : <></>
            }
        </nav >
    );
}

export default GroupEventNavigation;
