// Check if image upload as an error
export const checkImgErr = (e, setImageError) => {
  if (e.target.files && e.target.files[0]) {
    if (e.target.files[0].size > 1024 * 1024 * 2) {
      const form = document.querySelector('.msg-form');
      form.reset();
      setImageError('*Max file size of 2MB');
      return true;
    } else if (
      e.target.files[0].type !== 'image/png' &&
      e.target.files[0].type !== 'image/jpg' &&
      e.target.files[0].type !== 'image/jpeg'
    ) {
      const form = document.querySelector('.msg-form');
      form.reset();
      setImageError('*Only png, jpg, and jpeg files allowed');
      return true;
    }
    return false;
  }
};

// Start the alert timer
const startAlertTimer = (setAlertTimer, setShowAlert) => {
  setAlertTimer(
    setTimeout(() => {
      setShowAlert(false);
    }, 3000),
  );
};

// Clear the alert timer and start a new one
const resetAlertTimer = (alertTimer, setAlertTimer, setShowAlert) => {
  clearTimeout(alertTimer);
  startAlertTimer(setAlertTimer, setShowAlert);
};

// Reset the animation for the alert notification
const resetAnimation = () => {
  const alert = document.querySelector('.img-err');
  alert.style.animation = 'none';
  alert.offsetHeight;
  alert.style.animation = null;
};

// Handle alert display
export const handleAlert = (showAlert, setShowAlert, alertTimer, setAlertTimer) => {
  if (showAlert === false) {
    // Display alert if no alert is currently shown
    setShowAlert(true);
    startAlertTimer(setAlertTimer, setShowAlert);
  } else {
    // If alert is already displayed, reset it and show new alert
    resetAlertTimer(alertTimer, setAlertTimer, setShowAlert);
    resetAnimation();
  }
};
