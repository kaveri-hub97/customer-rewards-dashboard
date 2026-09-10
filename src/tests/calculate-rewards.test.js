import { describe, expect, it } from 'vitest';

import {
  calculateRewardPoints,
  getCustomerTransactions,
  getCustomerYearTransactions,
  getFilteredTransactions,
  getRewardData,
  getTopCustomers,
  getTotalRewardPoints,
  getYears
} from '../utils/calculate-rewards';

const transactions = [
  {
    id: 1,
    customerId: 1,
    customerName: 'Anita',
    date: '2023-01-05',
    amount: 50
  },
  {
    id: 2,
    customerId: 1,
    customerName: 'Anita',
    date: '2023-01-10',
    amount: 75
  },
  {
    id: 3,
    customerId: 1,
    customerName: 'Anita',
    date: '2023-02-05',
    amount: 120
  },
  {
    id: 4,
    customerId: 2,
    customerName: 'Arjun',
    date: '2023-01-15',
    amount: 100
  },
  {
    id: 5,
    customerId: 2,
    customerName: 'Arjun',
    date: '2024-01-15',
    amount: 101
  },
  {
    id: 6,
    customerId: 2,
    customerName: 'Arjun',
    date: '2025-01-15',
    amount: 150
  },
  {
    id: 7,
    customerId: 3,
    customerName: 'David',
    date: '2023-01-20',
    amount: 75.5
  },
  {
    id: 8,
    customerId: 3,
    customerName: 'David',
    date: '2026-03-20',
    amount: 120.75
  },
  {
    id: 9,
    customerId: 4,
    customerName: 'Kiran',
    date: '2024-02-10',
    amount: 200
  },
  {
    id: 10,
    customerId: 5,
    customerName: 'Meena',
    date: '2025-03-10',
    amount: 180
  },
  {
    id: 11,
    customerId: 6,
    customerName: 'Naveen',
    date: '2026-04-10',
    amount: 170
  }
];

describe('calculateRewardPoints', () => {
  it('returns 0 for amounts of $50 or less', () => {
    expect(calculateRewardPoints(0)).toBe(0);
    expect(calculateRewardPoints(50)).toBe(0);
  });

  it('returns one point for each dollar between $50 and $100', () => {
    expect(calculateRewardPoints(75)).toBe(25);
    expect(calculateRewardPoints(100)).toBe(50);
  });

  it('returns two points for each dollar above $100', () => {
    expect(calculateRewardPoints(101)).toBe(52);
    expect(calculateRewardPoints(120)).toBe(90);
  });

  it('handles decimal amounts', () => {
    expect(calculateRewardPoints(75.5)).toBe(25);
    expect(calculateRewardPoints(120.75)).toBe(91);
  });
});

describe('transaction filtering', () => {
  it('returns the available years from transaction data', () => {
    expect(getYears(transactions)).toEqual([
      '2023',
      '2024',
      '2025',
      '2026'
    ]);
  });

  it('filters transactions by customer', () => {
    const result = getCustomerTransactions(
      transactions,
      '1'
    );

    expect(result).toHaveLength(3);

    expect(
      result.every(
        (transaction) =>
          transaction.customerId === 1
      )
    ).toBe(true);
  });

  it('filters transactions by customer and year', () => {
    const result =
      getCustomerYearTransactions(
        transactions,
        '1',
        '2023'
      );

    expect(result).toHaveLength(3);
  });

  it('filters transactions by customer, year and month', () => {
    const result = getFilteredTransactions(
      transactions,
      '1',
      '2023',
      ['01']
    );

    expect(result).toHaveLength(2);

    expect(
      result.map(
        (transaction) => transaction.id
      )
    ).toEqual([1, 2]);
  });

  it('calculates the selected transaction reward total', () => {
    const result = getFilteredTransactions(
      transactions,
      '1',
      '2023',
      ['01']
    );

    expect(
      getTotalRewardPoints(result)
    ).toBe(25);
  });

  it('returns no transactions when the customer has no records', () => {
    const result =
      getCustomerYearTransactions(
        transactions,
        '16',
        '2026'
      );

    expect(result).toEqual([]);
  });
});

describe('reward summaries', () => {
  it('creates annual reward totals for a selected year', () => {
    const result = getRewardData(
      getCustomerYearTransactions(
        transactions,
        '1',
        '2023'
      )
    );

    expect(result).toEqual([
      {
        customerId: 1,
        customerName: 'Anita',
        Jan: 25,
        Feb: 90,
        Mar: 0,
        Apr: 0,
        May: 0,
        Jun: 0,
        Jul: 0,
        Aug: 0,
        Sep: 0,
        Oct: 0,
        Nov: 0,
        Dec: 0,
        total: 115
      }
    ]);
  });

  it('updates annual reward totals when the reporting year changes', () => {
    const result = getRewardData(
      getCustomerYearTransactions(
        transactions,
        '2',
        '2024'
      )
    );

    expect(result[0].total).toBe(52);
    expect(result[0].Jan).toBe(52);
  });

  it('returns empty reward data when the customer has no records for the selected year', () => {
    const result = getRewardData(
      getCustomerYearTransactions(
        transactions,
        '16',
        '2026'
      )
    );

    expect(result).toEqual([]);
  });

  it('calculates lifetime reward points across all years and months', () => {
    const result = getTotalRewardPoints(
      getCustomerTransactions(
        transactions,
        '2'
      )
    );

    expect(result).toBe(252);
  });

  it('returns the five customers with the highest totals first', () => {
    const result = getTopCustomers(
      transactions,
      5
    );

    expect(
      result.map((customer) => ({
        customerId: customer.customerId,
        customerName: customer.customerName,
        total: customer.total
      }))
    ).toEqual([
      {
        customerId: 2,
        customerName: 'Arjun',
        total: 252
      },
      {
        customerId: 4,
        customerName: 'Kiran',
        total: 250
      },
      {
        customerId: 5,
        customerName: 'Meena',
        total: 210
      },
      {
        customerId: 6,
        customerName: 'Naveen',
        total: 190
      },
      {
        customerId: 3,
        customerName: 'David',
        total: 116
      }
    ]);
  });

  it('does not include a customer without transactions in top customers', () => {
    const result = getTopCustomers(
      transactions,
      5
    );

    expect(
      result.some(
        (customer) =>
          customer.customerId === 16
      )
    ).toBe(false);
  });
});