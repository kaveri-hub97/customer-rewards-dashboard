import PropTypes from 'prop-types';

import {
  NO_REWARD_DATA_FOUND
} from '../../constants/app-constants';

const AnnualRewards = ({ rewardData }) => {
  const customer = rewardData[0];
  //add a check to see if the customer has reward data, if not display a message
  return (
    <section className="rewards-section">
      <div className="table-container">
        <h2 className="table-title">
          Annual Reward Points
        </h2>

        {customer ? (
          <div className="annual-reward-card">
            <div className="annual-reward-customer">
              {customer.customerName}
            </div>

            <div className="annual-reward-circle">
              <div className="annual-reward-circle-content">
                <span className="annual-reward-value">
                  {customer.total}
                </span>
              </div>
            </div>
          </div>
        ) : (
          //display a message when no reward data is found
          <p className="no-data">
            {NO_REWARD_DATA_FOUND}
          </p>
        )}
      </div>
    </section>
  );
};

AnnualRewards.propTypes = {
  rewardData: PropTypes.arrayOf(
    PropTypes.shape({
      customerId: PropTypes.number.isRequired,
      customerName: PropTypes.string.isRequired,
      total: PropTypes.number.isRequired
    })
  ).isRequired
};

export default AnnualRewards;