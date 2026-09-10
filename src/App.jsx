import {
  useEffect,
  useMemo,
  useState
} from 'react';

import CustomerSelector from './components/customer-selector/customer-selector';
import MonthSelector from './components/month-selector/month-selector';
import RewardGuidelines from './components/reward-guidelines/reward-guidelines';
import AnnualRewards from './components/annual-rewards/annual-rewards';
import RewardSummary from './components/reward-summary/reward-summary';
import TopCustomers from './components/top-customers/top-customers';
import TransactionDetails from './components/transaction-details/transaction-details';
import YearSelector from './components/year-selector/year-selector';

import {
  CUSTOMERS_WITHOUT_TRANSACTIONS,
  DEFAULT_CUSTOMER_INDEX,
  DEFAULT_ERROR,
  DEFAULT_TRANSACTIONS,
  SELECT_CUSTOMER,
  SELECT_MONTHS,
  SELECT_YEAR,
  TOP_CUSTOMERS_LIMIT
} from './constants/app-constants';

import fetchTransactions from './services/fetch-transactions';

import {
  getCustomerTransactions,
  getCustomerYearTransactions,
  getCustomers,
  getFilteredTransactions,
  getRewardData,
  getTopCustomers,
  getTotalRewardPoints,
  getYears
} from './utils/calculate-rewards';

import './App.css';

function App() {
  const [transactions, setTransactions] =
    useState(DEFAULT_TRANSACTIONS);

  const [selectedCustomer, setSelectedCustomer] =
    useState(SELECT_CUSTOMER);

  const [selectedYear, setSelectedYear] =
    useState(SELECT_YEAR);

  const [selectedMonths, setSelectedMonths] =
    useState(SELECT_MONTHS);

  const [error, setError] =
    useState(DEFAULT_ERROR);

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const data = await fetchTransactions();

        const availableCustomers =
          getCustomers(data);

        const availableYears =
          getYears(data);

        setTransactions(data);
        setError(DEFAULT_ERROR);

        if (
          availableCustomers.length >
          DEFAULT_CUSTOMER_INDEX
        ) {
          setSelectedCustomer(
            String(
              availableCustomers[
                DEFAULT_CUSTOMER_INDEX
              ].id
            )
          );
        }

        if (availableYears.length > 0) {
          setSelectedYear(
            availableYears[
              availableYears.length - 1
            ]
          );
        }
      } catch (loadError) {
        setTransactions(
          DEFAULT_TRANSACTIONS
        );
        setError(loadError.message);
      }
    };

    // Load transaction data when the app starts.
    loadTransactions();
  }, []);

  const customers = useMemo(() => {
    return [
      ...getCustomers(transactions),
      ...CUSTOMERS_WITHOUT_TRANSACTIONS
    ].sort(
      (firstCustomer, secondCustomer) =>
        firstCustomer.name.localeCompare(
          secondCustomer.name
        )
    );
  }, [transactions]);

  const years = useMemo(
    () => getYears(transactions),
    [transactions]
  );

  const selectedTransactions =
    useMemo(() => {
      if (
        selectedCustomer === SELECT_CUSTOMER ||
        selectedYear === SELECT_YEAR ||
        selectedMonths.length === 0
      ) {
        return DEFAULT_TRANSACTIONS;
      }

      return getFilteredTransactions(
        transactions,
        selectedCustomer,
        selectedYear,
        selectedMonths
      );
    }, [
      transactions,
      selectedCustomer,
      selectedYear,
      selectedMonths
    ]);

  const rewardData = useMemo(() => {
    if (
      selectedCustomer === SELECT_CUSTOMER ||
      selectedYear === SELECT_YEAR
    ) {
      return [];
    }

    const yearTransactions =
      getCustomerYearTransactions(
        transactions,
        selectedCustomer,
        selectedYear
      );

    return getRewardData(
      yearTransactions
    );
  }, [
    transactions,
    selectedCustomer,
    selectedYear
  ]);

  const totalRewardPoints =
    useMemo(() => {
      const customerTransactions =
        getCustomerTransactions(
          transactions,
          selectedCustomer
        );

      return getTotalRewardPoints(
        customerTransactions
      );
    }, [
      transactions,
      selectedCustomer
    ]);

  const topCustomers = useMemo(
    () =>
      getTopCustomers(
        transactions,
        TOP_CUSTOMERS_LIMIT
      ),
    [transactions]
  );

  return (
    <div className="app">
      <header className="header">
        <div className="content header-content">
          <div>
            <h1>
              Customer Rewards Dashboard
            </h1>

            <p>
              Track reward points earned by
              customers across months and
              years.
            </p>
          </div>
        </div>
      </header>

      <main className="content">
        {error ? (
          <div className="page-state error-state">
            {error}
          </div>
        ) : (
          <>
            <section className="filters-section">
              <CustomerSelector
                customers={customers}
                selectedCustomer={
                  selectedCustomer
                }
                onCustomerChange={
                  setSelectedCustomer
                }
              />

              <YearSelector
                years={years}
                selectedYear={
                  selectedYear
                }
                onYearChange={
                  setSelectedYear
                }
              />

              <MonthSelector
                selectedMonths={
                  selectedMonths
                }
                onMonthChange={
                  setSelectedMonths
                }
              />

              <RewardSummary
                rewardPoints={
                  totalRewardPoints
                }
              />
            </section>

            <div className="dashboard-grid">
              <div className="main-column">
                <AnnualRewards
                  rewardData={
                    rewardData
                  }
                />

                <section className="details-section">
                  <TransactionDetails
                    transactions={
                      selectedTransactions
                    }
                  />
                </section>
              </div>

              <aside className="sidebar">
                <TopCustomers
                  customers={
                    topCustomers
                  }
                />

                <RewardGuidelines />
              </aside>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;