import PropTypes from 'prop-types';

const RewardSummary = ({ rewardPoints }) => {
  return (
    <section className="reward-section">
      <p className="reward-label">
        Total Reward Points
      </p>

      <div className="reward-points">
        {rewardPoints}
      </div>
    </section>
  );
};

RewardSummary.propTypes = {
  rewardPoints: PropTypes.number.isRequired
};

export default RewardSummary;