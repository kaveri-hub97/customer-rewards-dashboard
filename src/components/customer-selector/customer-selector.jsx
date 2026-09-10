import {
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';

import PropTypes from 'prop-types';

import {
  SELECT_CUSTOMER
} from '../../constants/app-constants';

const CustomerSelector = ({
  customers,
  selectedCustomer,
  onCustomerChange
}) => {
  const [searchText, setSearchText] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const selectorRef = useRef(null);

  const selectedCustomerName = customers.find(
    (customer) =>
      String(customer.id) === selectedCustomer
  )?.name;

  // Match customers from the beginning of their name.
  // If the user is not searching, show all customers.
  const matchingCustomers = useMemo(() => {
    if (!isSearching) {
      return customers;
    }

    const searchValue =
      searchText.trim().toLowerCase();

    if (!searchValue) {
      return customers;
    }

    return customers.filter((customer) =>
      customer.name
        .toLowerCase()
        .startsWith(searchValue)
    );
  }, [customers, searchText, isSearching]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        selectorRef.current &&
        !selectorRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        setIsSearching(false);
        setSearchText('');
      }
    };

    document.addEventListener(
      'mousedown',
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside
      );
    };
  }, []);

  const handleFocus = () => {
    setSearchText(selectedCustomerName || '');
    setIsOpen(true);
    setIsSearching(false);
  };

  const handleChange = (event) => {
  const value = event.target.value;

  setSearchText(value);
  setIsOpen(true);
  setIsSearching(true);
  };

  const handleCustomerSelect = (customer) => {
    onCustomerChange(String(customer.id));
    setSearchText(customer.name);
    setIsOpen(false);
    setIsSearching(false);
  };

  return (
    <div
      className="selector customer-selector"
      ref={selectorRef}
    >
      <label htmlFor="customer-name">
        Customer
      </label>

      <div className="customer-input-wrapper">
        <input
          id="customer-name"
          type="text"
          value={
            isOpen
              ? searchText
              : selectedCustomerName || SELECT_CUSTOMER
          }
          onChange={handleChange}
          onFocus={handleFocus}
          placeholder="Select Customer"
          autoComplete="off"
        />

        {isOpen && (
          <div
            className="customer-suggestions"
            role="listbox"
          >
            {matchingCustomers.length > 0 ? (
              matchingCustomers.map((customer) => (
                <button
                  key={customer.id}
                  type="button"
                  className="customer-option"
                  onClick={() =>
                    handleCustomerSelect(customer)
                  }
                >
                  {customer.name}
                </button>
              ))
            ) : (
              <p className="no-customer">
                No customer found.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

CustomerSelector.propTypes = {
  customers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired
    })
  ).isRequired,
  selectedCustomer: PropTypes.string.isRequired,
  onCustomerChange: PropTypes.func.isRequired
};

export default CustomerSelector;