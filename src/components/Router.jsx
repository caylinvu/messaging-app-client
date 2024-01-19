import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import App from '../App';
import ChatPage from './ChatPage';
import Chat from './Chat';
import ContactPage from './ContactPage';
import LoginPage from './LoginPage';
import SignUpPage from './SignUpPage';
import PrivateRoute from './PrivateRoute';
import Layout from './Layout';

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
              children: [{ path: '/chats/:chatId', element: <Chat /> }],
            },
            { path: '/contacts', element: <ContactPage /> },
          ],
        },

        {
          path: '/login',
          element: <LoginPage />,
        },
        {
          path: '/sign-up',
          element: <SignUpPage />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default Router;
