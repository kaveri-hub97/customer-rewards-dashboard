import {
  BONUS_POINT_MULTIPLIER,
  FIRST_REWARD_LIMIT,
  REPORT_MONTHS,
  SECOND_REWARD_LIMIT
} from '../constants/app-constants';

export const calculateRewardPoints = (amount) => {
  if (amount <= FIRST_REWARD_LIMIT) {
    return 0;
  }

  if (amount <= SECOND_REWARD_LIMIT) {
    return Math.floor(
      amount - FIRST_REWARD_LIMIT
    );
  }

  // Calculate bonus points for the amount above the second limit.
  return Math.floor(
    FIRST_REWARD_LIMIT +
      (amount - SECOND_REWARD_LIMIT) *
        BONUS_POINT_MULTIPLIER
  );
};

export const getMonthNumber = (date) => {
  const month =
    new Date(`${date}T00:00:00`).getMonth() + 1;

  return String(month).padStart(2, '0');
};

export const getYear = (date) => {
  return String(
    new Date(`${date}T00:00:00`).getFullYear()
  );
};

export const formatTransactionDate = (date) => {
  return new Date(
    `${date}T00:00:00`
  ).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export const getCustomers = (transactions) => {
  const customerMap = new Map();

  transactions.forEach((transaction) => {
    if (!customerMap.has(transaction.customerId)) {
      customerMap.set(transaction.customerId, {
        id: transaction.customerId,
        name: transaction.customerName
      });
    }
  });

  return Array.from(
    customerMap.values()
  ).sort(
    (firstCustomer, secondCustomer) =>
      firstCustomer.name.localeCompare(
        secondCustomer.name
      )
  );
};

export const getYears = (transactions) => {
  const years = new Set();

  transactions.forEach((transaction) => {
    years.add(getYear(transaction.date));
  });

  return Array.from(years).sort();
};

export const getCustomerTransactions = (
  transactions,
  selectedCustomer
) => {
  return transactions.filter(
    (transaction) =>
      String(transaction.customerId) ===
      selectedCustomer
  );
};

export const getYearTransactions = (
  transactions,
  selectedYear
) => {
  return transactions.filter(
    (transaction) =>
      getYear(transaction.date) === selectedYear
  );
};

export const getCustomerYearTransactions = (
  transactions,
  selectedCustomer,
  selectedYear
) => {
  return getYearTransactions(
    getCustomerTransactions(
      transactions,
      selectedCustomer
    ),
    selectedYear
  );
};

export const getSelectedTransactions = (
  transactions,
  selectedMonths
) => {
  const months = Array.isArray(selectedMonths)
    ? selectedMonths
    : [selectedMonths];

  return transactions.filter((transaction) =>
    months.includes(
      getMonthNumber(transaction.date)
    )
  );
};

export const getFilteredTransactions = (
  transactions,
  selectedCustomer,
  selectedYear,
  selectedMonths
) => {
  const customerYearTransactions =
    getCustomerYearTransactions(
      transactions,
      selectedCustomer,
      selectedYear
    );

  return getSelectedTransactions(
    customerYearTransactions,
    selectedMonths
  );
};

export const getRewardData = (transactions) => {
  const rewardMap = new Map();

  transactions.forEach((transaction) => {
    const monthNumber =
      getMonthNumber(transaction.date);

    const month = REPORT_MONTHS.find(
      (item) =>
        item.value === monthNumber
    );

    if (!month) {
      return;
    }

    const points = calculateRewardPoints(
      transaction.amount
    );

    if (!rewardMap.has(transaction.customerId)) {
      const customer = {
        customerId: transaction.customerId,
        customerName: transaction.customerName,
        total: 0
      };

      REPORT_MONTHS.forEach((item) => {
        customer[item.label] = 0;
      });

      rewardMap.set(
        transaction.customerId,
        customer
      );
    }

    const customer =
      rewardMap.get(transaction.customerId);

    customer[month.label] += points;
    customer.total += points;
  });

  return Array.from(
    rewardMap.values()
  );
};

export const getTotalRewardPoints = (
  transactions
) => {
  return transactions.reduce(
    (total, transaction) =>
      total +
      calculateRewardPoints(
        transaction.amount
      ),
    0
  );
};

export const getTopCustomers = (
  transactions,
  limit
) => {
  return getRewardData(transactions)
    .sort(
      (firstCustomer, secondCustomer) => {
        if (
          firstCustomer.total !==
          secondCustomer.total
        ) {
          return (
            secondCustomer.total -
            firstCustomer.total
          );
        }

        return firstCustomer.customerName.localeCompare(
          secondCustomer.customerName
        );
      }
    )
    .slice(0, limit);
};