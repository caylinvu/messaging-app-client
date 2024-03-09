import PropTypes from 'prop-types';

function FetchError({ error, fetchType }) {
  return (
    <div className={fetchType === 'message' ? 'message-error' : 'error-page'}>
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occured.</p>
      <p>
        <i>{error.status ? error.status + ' - ' + error.message : error.message}</i>
      </p>
    </div>
  );
}

FetchError.propTypes = {
  error: PropTypes.object,
  fetchType: PropTypes.string,
};

export default FetchError;
