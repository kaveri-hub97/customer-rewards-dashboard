import PropTypes from 'prop-types';

const YearSelector = ({
  years,
  selectedYear,
  onYearChange
}) => {
  const currentIndex = years.indexOf(selectedYear);

  const canGoPrevious = currentIndex > 0;

  const canGoNext =
    currentIndex >= 0 &&
    currentIndex < years.length - 1;

  const handlePrevious = () => {
    if (canGoPrevious) {
      onYearChange(
        years[currentIndex - 1]
      );
    }
  };

  const handleNext = () => {
    if (canGoNext) {
      onYearChange(
        years[currentIndex + 1]
      );
    }
  };

  return (
    <div className="selector year-selector">
      <label htmlFor="reporting-year">
        Reporting Year
      </label>

      <div className="year-control">
        <button
          type="button"
          className="year-arrow"
          onClick={handlePrevious}
          disabled={!canGoPrevious}
          aria-label="Previous year"
        >
          ‹
        </button>

        <span
          id="reporting-year"
          className="year-value"
        >
          {selectedYear || 'Select Year'}
        </span>

        <button
          type="button"
          className="year-arrow"
          onClick={handleNext}
          disabled={!canGoNext}
          aria-label="Next year"
        >
          ›
        </button>
      </div>
    </div>
  );
};

YearSelector.propTypes = {
  years: PropTypes.arrayOf(
    PropTypes.string
  ).isRequired,
  selectedYear: PropTypes.string.isRequired,
  onYearChange: PropTypes.func.isRequired
};

export default YearSelector;