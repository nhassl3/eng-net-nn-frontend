# Admin Panel for IP Owner

## Description

Implement an admin panel for the IP owner. The panel must be available only to users with the `admin` role and provide tools for managing vacancies and processing users' business plan submissions.

## Requirements

### 1. Admin Panel Access

* [ ] Add an **Admin Panel** item to the `header → nav-inner`.
* [ ] Display the item only for authenticated users with the `admin` role.
* [ ] Hide the navigation item for users with other roles.
* [ ] Add a dedicated admin panel page/route.

### 2. Vacancy Management

Implement full CRUD functionality for vacancies:

* [ ] Create a vacancy.
* [ ] View vacancy details.
* [ ] Edit an existing vacancy.
* [ ] Delete a vacancy.
* [ ] Display a list of existing vacancies in the admin panel.
* [ ] Use **modal windows** for create, view, edit, and delete actions.
* [ ] Manage modal state and related UI state through **Redux**.
* [ ] Add appropriate loading, success, and error states.

### 3. Business Plan Management

Implement functionality for working with business plans submitted by users:

* [ ] Display a list of users' business plans.
* [ ] View the contents/details of a business plan.
* [ ] Respond to a business plan.
* [ ] Use **modal windows** for viewing and responding to business plans.
* [ ] Manage modal state and related UI state through **Redux**.
* [ ] Add appropriate loading, success, and error states.

### 4. Authorization

* [ ] Ensure the admin panel is accessible only to users with the `admin` role.
* [ ] Prevent unauthorized users from accessing the admin route directly.
* [ ] Hide admin-specific UI elements from users without the required role.

## Acceptance Criteria

* [ ] Users with the `admin` role see the **Admin Panel** in the header navigation.
* [ ] Users without the `admin` role do not see the admin panel navigation item.
* [ ] An administrator can create, view, edit, and delete vacancies.
* [ ] All vacancy actions are performed through modal windows.
* [ ] An administrator can view users' business plans and send responses.
* [ ] Business plan viewing and response actions use modal windows.
* [ ] Modal state is managed through Redux.
* [ ] Unauthorized users cannot access the admin panel by manually navigating to its route.
* [ ] Loading and error states are handled appropriately.
