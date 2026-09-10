import {
  useEffect,
  useRef,
  useState
} from 'react';

import PropTypes from 'prop-types';

import {
  REPORT_MONTHS
} from '../../constants/app-constants';
// This component is used to select a month from a list of months. It is used in the AnnualRewards component.
const MonthSelector = ({
  selectedMonths,
  onMonthChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [pendingMonths, setPendingMonths] =
    useState(selectedMonths);

  const selectorRef = useRef(null);

  const selectedMonthLabels =
    REPORT_MONTHS.filter((month) =>
      selectedMonths.includes(month.value)
    ).map((month) => month.label);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        selectorRef.current &&
        !selectorRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener(
      'mousedown',
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside
      );
    };
  }, []);

  const getMonthLabel = () => {
    if (selectedMonthLabels.length === 0) {
      return 'Select Month';
    }

    if (selectedMonthLabels.length <= 3) {
      return selectedMonthLabels.join(', ');
    }

    return `${selectedMonthLabels
      .slice(0, 4)
      .join(', ')}... +${selectedMonthLabels.length - 4}`;
  };

  const handleOpen = () => {
    setPendingMonths(selectedMonths);
    setIsOpen((open) => !open);
  };

  const handleMonthSelect = (monthValue) => {
    setPendingMonths((months) =>
      months.includes(monthValue)
        ? months.filter(
            (month) => month !== monthValue
          )
        : [...months, monthValue]
    );
  };

  const handleSelectAll = () => {
    setPendingMonths(
      REPORT_MONTHS.map((month) => month.value)
    );
  };

  const handleReset = () => {
    setPendingMonths([]);
    onMonthChange([]);
  };

  const handleApplyAll = () => {
    onMonthChange(pendingMonths);
    setIsOpen(false);
  };

  return (
    <div
      ref={selectorRef}
      className="selector month-selector"
    >
      <label htmlFor="month-button">Month</label>

      <button
        id="month-button"
        type="button"
        className="month-button"
        onClick={handleOpen}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="month-label">
          {getMonthLabel()}
        </span>

        <span className="dropdown-arrow">▼</span>
      </button>

      {isOpen && (
        <div className="month-dropdown">
          <div
            className="month-options"
            role="listbox"
          >
            {REPORT_MONTHS.map((month) => (
              <button
                key={month.value}
                type="button"
                className={`month-option ${
                  pendingMonths.includes(
                    month.value
                  )
                    ? 'selected'
                    : ''
                }`}
                onClick={() =>
                  handleMonthSelect(month.value)
                }
              >
                {month.label}
              </button>
            ))}
          </div>

          <div className="month-actions">
            <button
              type="button"
              className="month-action-button"
              onClick={handleSelectAll}
            >
              Select All
            </button>

            <button
              type="button"
              className="month-action-button"
              onClick={handleReset}
            >
              Reset
            </button>

            <button
              type="button"
              className="month-action-button"
              onClick={handleApplyAll}
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

MonthSelector.propTypes = {
  selectedMonths: PropTypes.arrayOf(
    PropTypes.string
  ).isRequired,
  onMonthChange: PropTypes.func.isRequired
};

export default MonthSelector;