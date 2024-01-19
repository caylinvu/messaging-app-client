import { Navigate, useOutletContext } from 'react-router-dom';
import PropTypes from 'prop-types';

function PrivateRoute({ children }) {
  const { user } = useOutletContext();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default PrivateRoute;

PrivateRoute.propTypes = {
  children: PropTypes.element,
};
