import PropTypes from 'prop-types';
import { DateTime } from 'luxon';

function DatePreview({ timestamp }) {
  return (
    <>
      {DateTime.fromISO(timestamp).toLocaleString(DateTime.DATE_SHORT) ===
      DateTime.fromISO(new Date().toISOString()).toLocaleString(DateTime.DATE_SHORT)
        ? DateTime.fromISO(timestamp).toLocaleString(DateTime.TIME_SIMPLE)
        : DateTime.fromISO(timestamp).toLocaleString(DateTime.DATE_SHORT) <
              DateTime.fromISO(new Date().toISOString()).toLocaleString(DateTime.DATE_SHORT) &&
            DateTime.fromISO(timestamp).toLocaleString(DateTime.DATE_SHORT) >
              DateTime.fromISO(
                new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
              ).toLocaleString(DateTime.DATE_SHORT)
          ? DateTime.fromISO(timestamp).toLocaleString({ weekday: 'short' })
          : DateTime.fromISO(timestamp).toLocaleString({ year: 'numeric' }) ===
              DateTime.fromISO(new Date().toISOString()).toLocaleString({ year: 'numeric' })
            ? DateTime.fromISO(timestamp).toLocaleString({ month: 'numeric', day: 'numeric' })
            : DateTime.fromISO(timestamp).toLocaleString({
                month: 'numeric',
                day: 'numeric',
                year: '2-digit',
              })}
    </>
  );
}

DatePreview.propTypes = {
  timestamp: PropTypes.string,
};

export default DatePreview;
