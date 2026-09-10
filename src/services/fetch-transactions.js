import transactions from '../data/transactions.json';

const fetchTransactions = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!transactions.length) {
        reject(
          new Error('No transaction data available.')
        );
        return;
      }

      const hasInvalidData = transactions.some(
        (transaction) =>
          !Number.isFinite(transaction.id) ||
          !Number.isFinite(transaction.customerId) ||
          !transaction.customerName ||
          Number.isNaN(
            new Date(
              `${transaction.date}T00:00:00`
            ).getTime()
          ) ||
          !Number.isFinite(transaction.amount)
      );

      if (hasInvalidData) {
        reject(
          new Error('Invalid transaction data.')
        );
        return;
      }

      resolve(transactions);
    }, 500);
  });
};

export default fetchTransactions;