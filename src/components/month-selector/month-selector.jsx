import {
  useEffect,
  useRef,
  useState
} from 'react';

import PropTypes from 'prop-types';

import {
  REPORT_MONTHS
} from '../../constants/app-constants';

const MonthSelector = ({
  selectedMonths,
  onMonthChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [pendingMonths, setPendingMonths] =
    useState(selectedMonths);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        setPendingMonths(selectedMonths);
      }
    };

    document.addEventListener(
      'mousedown',
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        'mousedown',
        handleOutsideClick
      );
    };
  }, [selectedMonths]);

  const handleDropdownToggle = () => {
    if (!isOpen) {
      setPendingMonths(selectedMonths);
    }

    setIsOpen(!isOpen);
  };

  const handleMonthClick = (monthValue) => {
    if (pendingMonths.includes(monthValue)) {
      setPendingMonths(
        pendingMonths.filter(
          (month) => month !== monthValue
        )
      );

      return;
    }

    setPendingMonths([
      ...pendingMonths,
      monthValue
    ]);
  };

  const handleSelectAll = () => {
    setPendingMonths(
      REPORT_MONTHS.map(
        (month) => month.value
      )
    );
  };

  const handleReset = () => {
    setPendingMonths([]);
  };

  const handleApply = () => {
    onMonthChange(pendingMonths);
    setIsOpen(false);
  };

  const selectedMonthLabel =
    selectedMonths.length === REPORT_MONTHS.length
      ? 'All Months'
      : 'Select Month';

  return (
    <div
      ref={dropdownRef}
      className="selector month-selector"
    >
      <label htmlFor="month-button">
        Month
      </label>

      <button
        id="month-button"
        type="button"
        className="month-button"
        onClick={handleDropdownToggle}
        aria-expanded={isOpen}
      >
        <span>
          {selectedMonthLabel}
        </span>

        <span className="dropdown-arrow">
          ▼
        </span>
      </button>

      {isOpen && (
        <div className="month-dropdown">
          <div className="month-options">
            {REPORT_MONTHS.map((month) => (
              <button
                key={month.value}
                type="button"
                className={`month-option ${
                  pendingMonths.includes(month.value)
                    ? 'selected'
                    : ''
                }`}
                onClick={() =>
                  handleMonthClick(month.value)
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
              onClick={handleApply}
            >
              Apply All
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