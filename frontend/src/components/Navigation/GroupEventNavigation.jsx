import { NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom";

import './Navigation.css';


function GroupEventNavigation() {
    const location = useLocation();


    return (
        <div className="eventGroupNav">
            <nav>
                <div className="eventGroupHeading">
                    <NavLink to={'/events'}>
                        Events
                    </NavLink>

                    <NavLink to={'/groups'}>Groups</NavLink>
                </div>


                {
                    location.pathname === '/groups' ? <h4 className="eventMeetupTitle">Groups in Meetup</h4> : <></>
                }
                {
                    location.pathname === '/events' ? <h4 className="eventMeetupTitle">Events in Meetup</h4> : <></>
                }
            </nav >
        </div >

    );
}

export default GroupEventNavigation;
