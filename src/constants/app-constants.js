export const SELECT_CUSTOMER = '';

export const SELECT_YEAR = '';

export const DEFAULT_CUSTOMER_INDEX = 0;

export const DEFAULT_TRANSACTIONS = [];

export const DEFAULT_ERROR = '';

export const FIRST_REWARD_LIMIT = 50;

export const SECOND_REWARD_LIMIT = 100;

export const BONUS_POINT_MULTIPLIER = 2;

export const TOP_CUSTOMERS_LIMIT = 5;

export const CUSTOMER_PLACEHOLDER = 'Enter Name Here...';

export const NO_CUSTOMER_FOUND = 'No customer found.';

export const NO_TRANSACTIONS_FOUND = 'No transactions found.';

export const NO_REWARD_DATA_FOUND = 'No reward data found.';

export const CUSTOMERS_WITHOUT_TRANSACTIONS = [
  {
    id: 16,
    name: 'Sindhu'
  }
];

export const REPORT_MONTHS = [
  { value: '01', label: 'Jan' },
  { value: '02', label: 'Feb' },
  { value: '03', label: 'Mar' },
  { value: '04', label: 'Apr' },
  { value: '05', label: 'May' },
  { value: '06', label: 'Jun' },
  { value: '07', label: 'Jul' },
  { value: '08', label: 'Aug' },
  { value: '09', label: 'Sep' },
  { value: '10', label: 'Oct' },
  { value: '11', label: 'Nov' },
  { value: '12', label: 'Dec' }
];

export const SELECT_MONTHS = REPORT_MONTHS.map(
  (month) => month.value
);