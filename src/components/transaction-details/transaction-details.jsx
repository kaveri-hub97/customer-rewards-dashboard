import PropTypes from 'prop-types';

import {
  calculateRewardPoints,
  formatTransactionDate
} from '../../utils/calculate-rewards';

const TransactionDetails = ({ transactions }) => {
  if (transactions.length === 0) {
    return (
      <div className="transaction-details">
        <div className="details-header">
          <h2>Transaction Overview</h2>
        </div>

        <p className="no-data">
          No transactions found.
        </p>
      </div>
    );
  }

  return (
    <div className="transaction-details">
      <div className="details-header">
        <h2>Transaction Overview</h2>

        <span>
          {transactions.length} transactions
        </span>
      </div>

      <div className="transaction-table-container">
        <table className="details-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Purchase Amount</th>
              <th>Reward Points</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>
                  {formatTransactionDate(
                    transaction.date
                  )}
                </td>

                <td>
                  ${transaction.amount.toFixed(2)}
                </td>

                <td>
                  {calculateRewardPoints(
                    transaction.amount
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

TransactionDetails.propTypes = {
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      date: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired
    })
  ).isRequired
};

export default TransactionDetails;