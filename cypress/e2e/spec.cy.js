describe('E2E and Visual Regression Test', () => {
  it('should go through the user process from registration to logout', () => {
    cy.eyesOpen({
      appName: 'My Application',
      testName: 'User Process from Registration to Logout',
    });

    cy.visit('/login');  
    cy.eyesCheckWindow('Login Page');

    cy.get('input[placeholder="First Name"]').type('John');
    cy.get('input[placeholder="Last Name"]').type('Doe');
    cy.get('input[placeholder="Email"]').last().type('john.doe03@example.com');
    cy.get('input[placeholder="Password"]').last().type('password123');
    cy.get('input[placeholder="Repeat Password"]').type('password123');
    cy.get('button').contains('Register').click();  

    cy.url().should('include', '/');
    cy.eyesCheckWindow('Homepage');

    cy.get('a').contains('Dashboard').click();
    cy.eyesCheckWindow('Dashboard');

    cy.get('button').contains('+ Add Budget').click();
    cy.get('input[name="category"]').type('Groceries');
    cy.get('input[name="amount"]').type('300');
    cy.get('button').contains('Add').click();
    cy.eyesCheckWindow('Budget Added');

    cy.get('span').contains('$300.00').click();
    cy.get('input[type="number"]').clear().type('400');
    cy.get('button').contains('Save').click();
    cy.eyesCheckWindow('Budget Edited');

    cy.get('button').contains('+ Add Expense').click();
    cy.get('select[name="category"]').select('Groceries');
    cy.get('input[name="amount"]').type('25');
    cy.get('input[type="date"]').type('2024-05-06');
    cy.contains('button', /^Add$/).click();
    cy.eyesCheckWindow('Expense Added');

    cy.get('span').contains('$25.00').click();
    cy.get('input[type="number"]').clear().type('30');
    cy.get('button').contains('Save').click();
    cy.eyesCheckWindow('Expense Edited');

    cy.get('button').contains('Delete').last().click();
    cy.eyesCheckWindow('Expense Deleted');

    cy.get('button').contains('Delete').first().click();
    cy.eyesCheckWindow('Budget Deleted');

    cy.get('button').contains('Logout').click();
    cy.url().should('include', '/login');
    cy.eyesCheckWindow('Logged Out');

    cy.eyesClose();
  });
});
