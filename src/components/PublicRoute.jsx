import { Navigate, useOutletContext } from 'react-router-dom';
import PropTypes from 'prop-types';

function PublicRoute({ children }) {
  const { isLoggedIn } = useOutletContext();

  if (isLoggedIn) {
    return <Navigate to="/chats" />;
  }

  return children;
}

export default PublicRoute;

PublicRoute.propTypes = {
  children: PropTypes.element,
};
