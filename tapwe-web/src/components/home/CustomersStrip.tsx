import { CUSTOMERS } from '../../content/customers'
import { initials } from '../../lib/initials'
import { Icon } from '../ui/Icon'

export function CustomersStrip() {
  if (CUSTOMERS.length === 0) return null
  return (
    <section className="cust" id="customers">
      <div className="wrap rv">
        <div className="eyebrow">Our customers</div>
        <ul className="cust-row">
          {CUSTOMERS.map((customer) => (
            <li key={customer.name}>
              {customer.logo ? (
                <img className="cust-av" src={customer.logo} alt="" />
              ) : (
                <span className="cust-av" aria-hidden="true">
                  {initials(customer.name)}
                </span>
              )}
              <span>
                <b>{customer.name}</b>
                <small>
                  <Icon name={customer.icon} />
                  {customer.usage}
                </small>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
