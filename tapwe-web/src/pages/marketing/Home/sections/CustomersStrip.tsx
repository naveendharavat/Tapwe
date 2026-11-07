import { Box, Container, Icon, Typography } from '../../../../components/ui'
import { CUSTOMERS } from '../../../../content/customers'
import { initials } from '../../../../lib/initials'

export function CustomersStrip() {
  if (CUSTOMERS.length === 0) return null
  return (
    <Box as="section" className="cust" id="customers">
      <Container className="rv">
        <Typography variant="eyebrow">{CUSTOMERS.length === 1 ? 'Our first customer' : 'Our customers'}</Typography>
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
      </Container>
    </Box>
  )
}
