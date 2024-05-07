# Budget App
## By: Andreas Lambropoulos

## Tech Stack
- **Frontend**: React, Bootstrap
- **Backend**: Node.js, Express with JSON and status codes, GZip compression
- **Database**: Firebase Firestore
- **Authentication/Authorization**: Firebase Authentication with auth context
- **Hosting**: Digital Ocean Droplet

## Pages
1. **Login/Register**: Users can log in or register for a new account.
2. **Homepage**: Landing page of the application.
3. **Dashboard**: Single-page dashboard displaying visualizations of budgets and expenses.

## Functionalities
- **Login/Logout/Signup**: Users can authenticate and create accounts.
- **Budget Management**: Add, edit, and delete budgets.
- **Expense Management**: Add, edit, and delete expenses.
- **Accessibility Features**: Keyboard navigation, error messages, ARIA labels, and semantic tags.
- **Token Expiry**: Authentication tokens expire in 1 minute and return the user to the home page.
- **Auth Warning**: Warns users when authentication token is going to expire in 20 minuntes with a refresh button.

## Data Visualizations
- **Budget/Expense Tables**: Displaying budget and expense data.
- **Budget Pie Chart**: Visualizing budget distribution.
- **Budget/Expense Comparison**: Progress bars comparing budget and expense amounts.

## Testing
- **Unit Test**: Jest unit test for backend functionality.
- **E2E Test**: Cypress Applitools for end-to-end testing.
- **Visual Regression Test**: Ensuring the application's stability.

## Deployment
The application is hosted on a Digital Ocean Droplet and can be accessed here: http://165.227.178.221/
