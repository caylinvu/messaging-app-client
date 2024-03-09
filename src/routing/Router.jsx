import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import App from '../App';
import ChatPage from '../components/ChatPage';
import Chat from '../components/Chat';
import ContactPage from '../components/ContactPage';
import LoginPage from '../components/LoginPage';
import SignUpPage from '../components/SignUpPage';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
import Layout from '../components/Layout';
import Intro from '../components/Intro';
import ErrorPage from '../components/ErrorPage';

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
