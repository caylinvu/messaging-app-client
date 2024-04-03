import PropTypes from 'prop-types';

function Intro({ isContactPage }) {
  return (
    <div className="intro-page">
      <img src="/jam.png" alt="" />
      <p>
        {isContactPage
          ? 'Select a contact to start a conversation'
          : 'Welcome to Cherry Chat! Select a chat or start a new conversation'}
      </p>
    </div>
  );
}

Intro.propTypes = {
  isContactPage: PropTypes.bool,
};

export default Intro;
