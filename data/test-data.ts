export const TEST_DATA = {
  validUser: {
    email: 'customer@practicesoftwaretesting.com',
    password: 'welcome01',
  },
  invalidUser: {
    email: 'wrong.user@practicesoftwaretesting.com',
    password: 'InvalidPassword999!',
  },
  invalidEmailFormat: 'not-an-email',
  billingAddress: {
    country: 'US',
    postalCode: '10001',
    houseNumber: '12',
    street: 'Broadway',
    city: 'New York',
    state: 'NY',
  },
  paymentMethods: {
    cashOnDelivery: 'cash-on-delivery',
    bankTransfer: 'bank-transfer',
  },
};
