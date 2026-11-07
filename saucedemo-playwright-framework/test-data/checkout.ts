export interface CustomerInfo {
  firstName: string;
  lastName: string;
  postalCode: string;
}

export const validCustomer: CustomerInfo = {
  firstName: 'Jane',
  lastName: 'Tester',
  postalCode: '12345',
};
