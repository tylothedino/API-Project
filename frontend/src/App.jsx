import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

//Components
// import LoginFormPage from './components/LoginFormPage';
// import SignupFormPage from './components/SignupFormModal';
import Navigation from './components/Navigation/Navigation';
import GroupEventNavigation from './components/Navigation/GroupEventNavigation';
import Groups from './components/Groups/Groups';
import SingleGroup from './components/Groups/SingleGroup';
import Events from './components/Events/Event';

import { restoreUser } from './store/session';
import SingleEvent from './components/Events/SingleEvent';


//Create a layout for all components
function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  //Keep the user logged in
  useEffect(() => {
    dispatch(restoreUser()).then(() => {
      setIsLoaded(true)
    });

  }, [dispatch])

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );

}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      // {
      //   path: 'login',
      //   element: <LoginFormPage />
      // },

      // {
      //   path: 'signup',
      //   element: <SignupFormPage />
      // }

      {
        path: '/',
        element: <h1>Welcome</h1>
      },
      {
        path: '*',
        element: <h1>Page not found</h1>
      },
      {
        path: 'groups',
        element:
          <div className='articleLists'>
            <GroupEventNavigation />
            <Groups />
          </div>,
      },
      {
        path: 'events',
        element:
          <div className='articleLists'>
            <GroupEventNavigation />
            <Events />
          </div>
      },
      {
        path: 'groups/:groupId',
        element:
          <SingleGroup />
      },
      {
        path: 'events/:eventId',
        element:
          <SingleEvent />
      }

    ]
  }

]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
