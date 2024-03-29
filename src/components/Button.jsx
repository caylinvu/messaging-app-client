import PropTypes from 'prop-types';

function Button({ btnText, btnClass, btnType, handleClick }) {
  return (
    <button
      className={btnClass ? btnClass : ''}
      type={btnType}
      onClick={handleClick ? handleClick : null}
    >
      {btnText}
    </button>
  );
}

Button.propTypes = {
  btnText: PropTypes.string,
  btnClass: PropTypes.string,
  btnType: PropTypes.string,
  handleClick: PropTypes.func,
};

export default Button;
