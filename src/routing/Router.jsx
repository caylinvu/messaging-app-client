import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import App from '../App';
import ChatPage from '../routes/ChatPage';
import Chat from '../routes/Chat';
import ContactPage from '../routes/ContactPage';
import LoginPage from '../routes/LoginPage';
import SignUpPage from '../routes/SignUpPage';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
import Layout from '../routes/Layout';
import Intro from '../routes/Intro';
import ErrorPage from './ErrorPage';

function Router() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <App />,
      errorElement: <ErrorPage />,
      children: [
        {
          element: (
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          ),
          children: [
            { path: '/', element: <Navigate to="/chats" /> },
            {
              path: '/chats',
              element: <ChatPage />,
              children: [
                { path: '/chats', element: <Intro /> },
                { path: '/chats/:chatId', element: <Chat /> },
              ],
            },
            { path: '/contacts', element: <ContactPage /> },
            { path: '*', element: <Navigate to="/chats" /> },
          ],
        },

        {
          path: '/login',
          element: (
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          ),
        },
        {
          path: '/sign-up',
          element: (
            <PublicRoute>
              <SignUpPage />
            </PublicRoute>
          ),
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default Router;
