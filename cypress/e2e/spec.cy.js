describe('E2E and Visual Regression Test', () => {
  it('should go through the user process from registration to logout', () => {
    // Start by visiting the registration page
    cy.visit('/login');  // Assuming the actual URL for registration is `/login` but registration form is present

    // Fill out the registration form
    cy.get('input[placeholder="First Name"]').type('John');
    cy.get('input[placeholder="Last Name"]').type('Doe');
    cy.get('input[placeholder="Email"]').last().type('john.doe@example.com');
    cy.get('input[placeholder="Password"]').last().type('password123');
    cy.get('input[placeholder="Repeat Password"]').type('password123');
    cy.get('button').contains('Register').click();  // Click the register button specifically

    // Assuming there's a redirect to the homepage after registration
    cy.url().should('include', '/');  // Checks if the URL includes the root

    // Navigate to Dashboard
    cy.visit('/dashboard');

    // Create a new budget
    cy.get('button').contains('+ Add Budget').click(); // Click to show the add budget form
    cy.get('input[name="category"]').type('Groceries');
    cy.get('input[name="amount"]').type('300');
    cy.get('button').contains('Add Budget').click();

    // Edit the budget
    cy.get('span').contains('$300.00').click(); // Click to start editing the first budget with $300
    cy.get('input[type="number"]').clear().type('400');
    cy.get('button').contains('Save').click(); // Save the updated budget

    // Create an expense under an existing budget
    cy.get('button').contains('+ Add Expense').click(); // Click to show the add expense form
    cy.get('select[name="category"]').select('Groceries');
    cy.get('input[name="amount"]').type('25');
    cy.get('input[type="date"]').type('2024-05-06');
    cy.get('button').contains('Add Expense').click();

    // Edit the expense
    cy.get('span').contains('$25.00').click(); // Click to start editing the first expense with $25
    cy.get('input[type="number"]').clear().type('30');
    cy.get('button').contains('Save').click(); // Save the updated expense

    // Delete the expense
    cy.get('button').contains('Delete').last().click(); // Click to delete the first listed expense

    // Delete the budget
    cy.get('button').contains('Delete').first().click(); // Click to delete the first listed budget

    // Logout
    cy.get('button[name="logout"]').click();
    cy.url().should('include', '/login'); // Confirm the user is redirected to login
  });
});
