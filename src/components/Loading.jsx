import PropTypes from 'prop-types';

function Loading({ loadType }) {
  return (
    <div className={loadType === 'message' ? 'msg-loading' : 'loading'}>
      <img src="/loading.svg" alt="" />
    </div>
  );
}

Loading.propTypes = {
  loadType: PropTypes.string,
};

export default Loading;
