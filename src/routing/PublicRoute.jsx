import { Navigate, useOutletContext } from 'react-router-dom';
import PropTypes from 'prop-types';

function PublicRoute({ children }) {
  const { user } = useOutletContext();

  if (user) {
    return <Navigate to="/chats" />;
  }

  return children;
}

export default PublicRoute;

PublicRoute.propTypes = {
  children: PropTypes.element,
};
