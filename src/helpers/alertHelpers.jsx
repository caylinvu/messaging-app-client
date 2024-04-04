// Start the alert timer
const startAlertTimer = (setAlertTimer, setShowAlert) => {
  setAlertTimer(
    setTimeout(() => {
      setShowAlert(false);
    }, 5000),
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
