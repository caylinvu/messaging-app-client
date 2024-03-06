import PropTypes from 'prop-types';

function DeletePopup({ setShowDeletePopup, deleteChat }) {
  return (
    <div className="blocker">
      <div className="popup-container">
        <div className="delete-popup">
          <button className="close-btn" onClick={() => setShowDeletePopup(false)}>
            X
          </button>
          <h3>Delete chat</h3>
          <p>Are you sure you want to delete this chat?</p>
          <div>
            <button onClick={deleteChat}>Delete</button>
            <button onClick={() => setShowDeletePopup(false)}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}

DeletePopup.propTypes = {
  setShowDeletePopup: PropTypes.func,
  deleteChat: PropTypes.func,
};

export default DeletePopup;
