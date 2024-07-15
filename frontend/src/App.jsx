import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import LoginFormPage from './components/LoginFormPage';
import { restoreUser } from './store/session';


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
      {isLoaded && <Outlet />}
    </>
  );

}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: 'login',
        element: <LoginFormPage />
      },
      {
        path: '/',
        element: <h1>Welcome</h1>
      },
      {
        path: '*',
        element: <h1>Page not found</h1>
      }
    ]
  }

]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
