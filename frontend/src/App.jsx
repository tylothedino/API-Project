import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';

import LoginFormPage from './components/LoginFormPage';

const router = createBrowserRouter([
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

]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
