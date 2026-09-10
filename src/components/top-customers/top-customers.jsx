import PropTypes from 'prop-types';

const TopCustomers = ({ customers }) => {
  return (
    <section className="side-card top-customers-card">
      <h2>
        Top Customers by Total Reward Points
      </h2>

      <div className="top-customers">
        {customers.map((customer) => (
          <div
            key={customer.customerId}
            className="top-customer-row"
          >
            <span className="top-customer-name">
              {customer.customerName}
            </span>

            <strong>
              {customer.total}
            </strong>
          </div>
        ))}
      </div>
    </section>
  );
};

TopCustomers.propTypes = {
  customers: PropTypes.arrayOf(
    PropTypes.shape({
      customerId: PropTypes.number.isRequired,
      customerName: PropTypes.string.isRequired,
      total: PropTypes.number.isRequired
    })
  ).isRequired
};

export default TopCustomers;