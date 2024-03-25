import PropTypes from 'prop-types';
import Button from './Button';

function DeletePopup({ setShowDeletePopup, deleteChat }) {
  const handleExit = () => {
    setShowDeletePopup(false);
  };

  return (
    <div className="blocker">
      <div className="popup-container">
        <div className="delete-popup">
          <button className="close-btn" onClick={handleExit}>
            <img src="/close.svg" alt="" />
          </button>
          <h3>Delete chat</h3>
          <p>Are you sure you want to delete this chat?</p>
          <div className="popup-btns">
            <Button btnText="Delete" btnType="button" handleClick={deleteChat} />
            <Button btnText="Cancel" btnType="button" handleClick={handleExit} />
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
