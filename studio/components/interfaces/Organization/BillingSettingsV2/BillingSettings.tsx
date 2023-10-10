import { ScaffoldContainer, ScaffoldDivider } from 'components/layouts/Scaffold'
import BillingAddress from './BillingAddress/BillingAddress'
import BillingEmail from './BillingEmail'
import CostControl from './CostControl/CostControl'
import CreditBalance from './CreditBalance'
import PaymentMethods from './PaymentMethods/PaymentMethods'
import Subscription from './Subscription/Subscription'
import TaxID from './TaxID/TaxID'
import BillingBreakdown from './BillingBreakdown/BillingBreakdown'
import { useOrganizationCustomerProfileQuery } from 'data/organizations/organization-customer-profile-query'
import { useParams } from 'common'

const BillingSettings = () => {
  const { slug } = useParams()

  const { data, error, isLoading, isError, isSuccess } = useOrganizationCustomerProfileQuery({
    slug,
  })

  const billedViaPartner = data?.billed_via_partner === true

  return (
    <>
      <ScaffoldContainer id="subscription">
        <Subscription />
      </ScaffoldContainer>

      <ScaffoldDivider />

      <ScaffoldContainer id="cost-control">
        <CostControl />
      </ScaffoldContainer>

      <ScaffoldDivider />

      <ScaffoldContainer id="breakdown">
        <BillingBreakdown />
      </ScaffoldContainer>

      {!billedViaPartner && (
        <>
          <ScaffoldDivider />

          <ScaffoldContainer id="credits-balance">
            <CreditBalance />
          </ScaffoldContainer>

          <ScaffoldDivider />

          <ScaffoldContainer id="payment-methods">
            <PaymentMethods />
          </ScaffoldContainer>

          <ScaffoldDivider />

          <ScaffoldContainer id="email">
            <BillingEmail />
          </ScaffoldContainer>

          <ScaffoldDivider />

          <ScaffoldContainer id="address">
            <BillingAddress />
          </ScaffoldContainer>

          <ScaffoldDivider />

          <ScaffoldContainer id="taxId">
            <TaxID />
          </ScaffoldContainer>
        </>
      )}
    </>
  )
}

export default BillingSettings
