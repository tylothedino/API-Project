import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import OpenModalButton from "./OpenModalButton";
import SignupFormModal from "./SignupFormModal/SignupFormModal";



function Landing() {

    //Session - null || {user}
    const session = useSelector((state) => state.session.user);


    return (
        <div className="mainPage">
            <div className="landing-header">
                <div className="textboxes">
                    <h2 className="title">The people platform - Where interests become friendships</h2>
                    <p className="descriptions">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                </div>

                <img src="https://secure.meetupstatic.com/next/images/indexPage/irl_event.svg?w=384"></img>
            </div>

            <div className="navigation">
                <section className="howTo">
                    <h3 className="howWork">How Meetup works</h3>
                    <p className="descriptions">Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                </section>
                <div className="links">
                    <div className="redirects">
                        <div className="allEvents">
                            <img className='icons' src="https://help.meetup.com/hc/theming_assets/01HZH3ZAM9K7A5MB1TYYRPDBHC"></img>
                            <Link to='/groups' className='navigateTo'>See all groups</Link>
                            <p className="descriptions">Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor</p>
                        </div>
                        <div className="allEvents">
                            <img className='icons' src="https://help.meetup.com/hc/theming_assets/01HZH3Z7EK93WAJGV7FQZX3EC7"></img>
                            <Link to='/events' className='navigateTo' >Find an event</Link>
                            <p className="descriptions">Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor</p>
                        </div>
                        <div className="allEvents">
                            <img className='icons' src='https://help.meetup.com/hc/theming_assets/01HZH3Z6ZADFCVDZZAA08XSC07'></img>
                            <Link to='/groups/new' className={'navigateTo' + (!session ? ' disabled' : '')} >Start a new group</Link>
                            <p className="descriptions">Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor</p>
                        </div>
                    </div>

                    <div className={(session ? 'hidden join' : 'join')}>
                        <OpenModalButton
                            buttonText="Join Meetup"
                            modalComponent={<SignupFormModal />}
                        />
                    </div>
                </div>
            </div>
        </div>
    );

}

export default Landing;
