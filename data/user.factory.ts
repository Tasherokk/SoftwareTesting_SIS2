import { faker } from '@faker-js/faker';

export interface CustomerData {
  firstName: string;
  lastName: string;
  dob: string;
  country: string;
  postalCode: string;
  houseNumber: string;
  street: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  password: string;
}

export function createRandomUser(): CustomerData {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    dob: '1992-05-15',
    country: 'US',
    postalCode: '10001',
    houseNumber: `${faker.number.int({ min: 1, max: 999 })}`,
    street: faker.location.street(),
    city: faker.location.city(),
    state: 'NY',
    phone: '555' + faker.string.numeric(7),
    email: faker.internet.email().toLowerCase(),
    password: `Pass${faker.string.alphanumeric(8)}!1`,
  };
}