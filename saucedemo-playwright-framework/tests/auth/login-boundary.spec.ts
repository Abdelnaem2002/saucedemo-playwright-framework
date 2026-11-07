import { test } from '../../fixtures/test-fixtures';
import { loginErrors } from '../../test-data/messages';
import { users } from '../../test-data/users';

interface BoundaryCase {
  id: string;
  name: string;
  username: string;
  password: string;
}

// Every case below must be rejected with the generic "do not match" error.
const rejectedInputs: BoundaryCase[] = [
  { id: 'TC-BND-001', name: '1000-character username', username: 'a'.repeat(1000), password: users.standard.password },
  { id: 'TC-BND-002', name: '1000-character password', username: users.standard.username, password: 'p'.repeat(1000) },
  { id: 'TC-BND-003', name: 'HTML tags in username', username: '<script>alert(1)</script>', password: '!@#$%^&*()' },
  { id: 'TC-BND-004', name: 'SQL-injection style input', username: "' OR '1'='1", password: "' OR '1'='1" },
  { id: 'TC-BND-005', name: 'username padded with spaces', username: ` ${users.standard.username} `, password: users.standard.password },
  { id: 'TC-BND-006', name: 'username in upper case (case sensitivity)', username: users.standard.username.toUpperCase(), password: users.standard.password },
  { id: 'TC-BND-007', name: 'single-character username and password', username: 'a', password: 'b' },
];

test.describe('Login boundary and special-character inputs', () => {
  for (const { id, name, username, password } of rejectedInputs) {
    test(`${id}: ${name} is rejected`, async ({ loginPage }) => {
      await loginPage.goto();

      await loginPage.login(username, password);

      await loginPage.expectError(loginErrors.invalidCredentials);
      await loginPage.expectOnLoginPage();
    });
  }
});
