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

      resolve(transactions);
    }, 500);
  });
};

export default fetchTransactions;