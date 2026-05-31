# Requirements Document

## Introduction

Personal Finance Manager — foydalanuvchilarga daromad va xarajatlarini kuzatish, moliyaviy statistikani ko'rish, va shaxsiy moliyaviy maqsadlarini boshqarish imkonini beruvchi zamonaviy web-ilova. Ilova React, React Router DOM, Context API va LocalStorage asosida quriladi. TypeScript va Tailwind CSS ishlatilmaydi.

## Glossary

- **App**: Personal Finance Manager web-ilovasi
- **User**: Ilovadan foydalanuvchi shaxs
- **Dashboard**: Moliyaviy umumiy ko'rinish sahifasi
- **Transaction**: Daromad yoki xarajat yozuvi
- **Income**: Foydalanuvchi daromadi
- **Expense**: Foydalanuvchi xarajati
- **Category**: Tranzaksiya turi (masalan: oziq-ovqat, transport, maosh)
- **LocalStorage**: Brauzerning mahalliy saqlash mexanizmi
- **Context**: React Context API orqali global holat
- **Theme**: Ilova ko'rinishi (Dark/Light mode)
- **Router**: React Router DOM orqali sahifalar orasida navigatsiya
- **Chart**: Recharts kutubxonasi orqali ko'rsatiladigan grafik

---

## Requirements

### Requirement 1: Routing va Navigatsiya

**User Story:** As a User, I want to navigate between pages seamlessly, so that I can access all features of the app without page reloads.

#### Acceptance Criteria

1. THE App SHALL provide client-side routing via React Router DOM for all pages.
2. WHEN a User navigates to an unknown route, THE App SHALL redirect the User to a 404 Not Found page.
3. WHEN a User is not authenticated, THE App SHALL redirect the User to the Login page for protected routes.
4. WHEN a User is authenticated, THE App SHALL redirect the User to the Dashboard when accessing the Login or Register page.

---

### Requirement 2: Landing Page

**User Story:** As a User, I want to see a professional landing page, so that I can understand the app's value before signing up.

#### Acceptance Criteria

1. THE Landing_Page SHALL display a Hero section with a headline, description, and call-to-action buttons.
2. THE Landing_Page SHALL display a Services section listing at least 4 key features.
3. THE Landing_Page SHALL display a Statistics section with at least 3 animated numeric counters.
4. THE Landing_Page SHALL display a Testimonials section with at least 3 user reviews.
5. THE Landing_Page SHALL display a Footer with navigation links and copyright information.
6. THE Landing_Page SHALL be fully responsive across mobile (320px+), tablet (768px+), and desktop (1024px+) viewports.

---

### Requirement 3: Authentication — Login

**User Story:** As a User, I want to log in with my email and password, so that I can access my personal finance data.

#### Acceptance Criteria

1. THE Login_Page SHALL display an email input field, a password input field, a "Remember Me" checkbox, and a "Forgot Password" link.
2. WHEN a User submits the login form with valid credentials, THE App SHALL authenticate the User and redirect to the Dashboard.
3. IF a User submits the login form with invalid credentials, THEN THE Login_Page SHALL display a descriptive error message.
4. WHERE "Remember Me" is checked, THE App SHALL persist the User session in LocalStorage.
5. THE Login_Page SHALL validate that the email field contains a valid email format before submission.
6. THE Login_Page SHALL validate that the password field is not empty before submission.

---

### Requirement 4: Authentication — Register

**User Story:** As a User, I want to create a new account, so that I can start tracking my finances.

#### Acceptance Criteria

1. THE Register_Page SHALL display Full Name, Email, Password, and Confirm Password input fields.
2. WHEN a User submits the registration form with valid data, THE App SHALL create a new account and redirect to the Dashboard.
3. IF the Password and Confirm Password fields do not match, THEN THE Register_Page SHALL display a validation error.
4. IF a User submits the registration form with an already registered email, THEN THE Register_Page SHALL display a descriptive error message.
5. THE Register_Page SHALL validate that the password is at least 8 characters long.

---

### Requirement 5: Dashboard

**User Story:** As a User, I want to see a financial overview on the Dashboard, so that I can quickly understand my financial status.

#### Acceptance Criteria

1. THE Dashboard SHALL display a Total Balance card showing the current balance.
2. THE Dashboard SHALL display a Monthly Income card showing total income for the current month.
3. THE Dashboard SHALL display a Monthly Expense card showing total expenses for the current month.
4. THE Dashboard SHALL display the 5 most recent Transactions in a summary table.
5. THE Dashboard SHALL display at least one Chart (bar or line) showing monthly income vs expense trends.
6. WHEN the underlying data changes, THE Dashboard SHALL update all displayed values without a page reload.

---

### Requirement 6: Income Management

**User Story:** As a User, I want to add and manage my income entries, so that I can track all sources of income.

#### Acceptance Criteria

1. THE Income_Page SHALL display a form to add a new Income entry with fields: title, amount, category, date, and description.
2. WHEN a User submits a valid Income form, THE App SHALL save the Income entry to LocalStorage and display it in the list.
3. THE Income_Page SHALL display a list of all Income entries sorted by date descending.
4. THE Income_Page SHALL provide a search input that filters Income entries by title in real time.
5. THE Income_Page SHALL provide a filter panel to filter Income entries by category and date range.
6. WHEN a User deletes an Income entry, THE App SHALL remove it from LocalStorage and update the list immediately.

---

### Requirement 7: Expense Management

**User Story:** As a User, I want to add and manage my expense entries, so that I can track where my money goes.

#### Acceptance Criteria

1. THE Expense_Page SHALL display a form to add a new Expense entry with fields: title, amount, category, date, and description.
2. WHEN a User submits a valid Expense form, THE App SHALL save the Expense entry to LocalStorage and display it in the list.
3. THE Expense_Page SHALL display a list of all Expense entries sorted by date descending.
4. THE Expense_Page SHALL provide a search input that filters Expense entries by title in real time.
5. THE Expense_Page SHALL provide a filter panel to filter Expense entries by category and date range.
6. WHEN a User deletes an Expense entry, THE App SHALL remove it from LocalStorage and update the list immediately.

---

### Requirement 8: Transactions Page

**User Story:** As a User, I want to see all transactions in one place, so that I can review my complete financial history.

#### Acceptance Criteria

1. THE Transactions_Page SHALL display all Income and Expense entries in a unified table.
2. THE Transactions_Page SHALL support pagination showing 10 transactions per page.
3. THE Transactions_Page SHALL provide a search input that filters transactions by title in real time.
4. THE Transactions_Page SHALL support sorting by date, amount, and category in ascending and descending order.
5. THE Transactions_Page SHALL visually distinguish Income entries (green) from Expense entries (red).

---

### Requirement 9: Statistics Page

**User Story:** As a User, I want to see visual charts and reports, so that I can analyze my financial patterns.

#### Acceptance Criteria

1. THE Statistics_Page SHALL display a Pie Chart showing expense distribution by category.
2. THE Statistics_Page SHALL display a Bar Chart showing monthly income vs expense comparison.
3. THE Statistics_Page SHALL display a Monthly Report table summarizing income, expense, and net balance per month.
4. THE Statistics_Page SHALL display a Category Report showing total spending per expense category.
5. WHEN a User selects a different time period, THE Statistics_Page SHALL update all charts and reports accordingly.

---

### Requirement 10: Profile Page

**User Story:** As a User, I want to manage my profile information, so that I can keep my account details up to date.

#### Acceptance Criteria

1. THE Profile_Page SHALL display the User's full name, email, and profile picture.
2. WHEN a User updates profile information and saves, THE App SHALL persist the changes to LocalStorage.
3. THE Profile_Page SHALL allow the User to upload or change a profile picture.
4. THE Profile_Page SHALL provide a password change form with Current Password, New Password, and Confirm New Password fields.
5. IF the Current Password field does not match the stored password, THEN THE Profile_Page SHALL display an error message.

---

### Requirement 11: Settings Page

**User Story:** As a User, I want to configure app settings, so that I can personalize my experience.

#### Acceptance Criteria

1. THE Settings_Page SHALL provide a Theme Settings panel to toggle between Dark and Light mode.
2. WHEN a User toggles the theme, THE App SHALL apply the selected theme immediately across all pages.
3. WHERE Dark mode is enabled, THE App SHALL persist the theme preference in LocalStorage and apply it on next load.
4. THE Settings_Page SHALL provide a Notification Settings panel to enable or disable in-app notifications.
5. THE Settings_Page SHALL provide an Account Settings panel with options to update email and delete account.

---

### Requirement 12: Global State Management

**User Story:** As a User, I want the app to maintain consistent state across all pages, so that data changes are reflected everywhere.

#### Acceptance Criteria

1. THE App SHALL use React Context API to provide global access to User authentication state.
2. THE App SHALL use React Context API to provide global access to all Transaction data.
3. THE App SHALL use React Context API to provide global access to the current Theme setting.
4. WHEN the App initializes, THE App SHALL load all persisted data from LocalStorage into Context.
5. WHEN Context state changes, THE App SHALL synchronize the updated state to LocalStorage.

---

### Requirement 13: Responsive Design and Theming

**User Story:** As a User, I want the app to look great on any device and support dark/light themes, so that I can use it comfortably anywhere.

#### Acceptance Criteria

1. THE App SHALL be fully responsive at 320px, 768px, and 1024px+ viewport widths.
2. THE App SHALL provide a Sidebar navigation for desktop viewports (1024px+).
3. THE App SHALL provide a collapsible mobile menu for viewports below 1024px.
4. WHERE Dark mode is active, THE App SHALL apply a dark color palette to all components.
5. WHERE Light mode is active, THE App SHALL apply a light color palette to all components.
6. THE App SHALL use CSS custom properties (variables) to manage theme colors.
