import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import App from '../App';
import ChatPage from './ChatPage';
import Chat from './Chat';
import ContactPage from './ContactPage';
import LoginPage from './LoginPage';
import SignUpPage from './SignUpPage';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
import Layout from './Layout';
import Intro from './Intro';

function Router() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <App />,
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
