# Multi-Tenant NextJS Expense Tracker with Clerk Auth

![Expense Tracker Icon Soon](./assets/expense-tracker.png)

Welcome to the **Multi-Tenant NextJS Expense Tracker**! This application allows multiple users to manage their expenses seamlessly using **Next.js** for the frontend and backend and **Clerk** for authentication.

## Features

- **Multi-Tenant Architecture**: Separate data for different users.
- **User Authentication**: Secure authentication using Clerk.
- **Expense Management**: Track and categorize your expenses.
- **Responsive Design**: Works on desktop and mobile devices.

## Table of Contents

- [Features](#features)
- [Screenshots](#screenshots)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Screenshots

### Dashboard
![Dashboard Screenshot Soon](./assets/dashboard.png)

### Expense Form
![Expense Form Screenshot Soon](./assets/expense-form.png)

## Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/)
- **Authentication**: [Clerk](https://clerk.dev/)
- **Database**: PostgreSQL
- **Deployment**: [Vercel](https://vercel.com/) or [Netlify](https://www.netlify.com/)

## Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/tylerbert31/Nxt-Expense.git
    ```

2. **Navigate to the project directory:**

    ```bash
    cd Nxt-Expense
    ```

3. **Install dependencies:**

    ```bash
    npm install
    npx prisma generate
    npx prisma db push
    ```

4. **Set up environment variables:**

    Create a `.env.local` file in the root of the project and add your Clerk API keys and other configuration:

    ```env
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<your-clerk-publishable-key>
    NEXT_PUBLIC_CLERK_SIGN_IN_URL=sign-in
    NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
    DATABASE_URL=<your-postgres-url>
    ```

5. **Run the development server:**

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) in your browser to see the app in action.

## Usage

1. **Sign Up / Sign In**: Use Clerk authentication to create an account or sign in.
2. **Add Expenses**: Click the "Add expense" on the homepage to add a new expense.
3. **View Dashboard**: Access your expense dashboard to track and manage your expenses.

## Contributing

Feel free to submit issues and pull requests. Here are a few ways you can contribute:

- Report bugs
- Suggest features

For more details on contributing, please check out the [CONTRIBUTING.md](./CONTRIBUTING.md) file.

## License

This project is licensed under the [MIT License](./LICENSE).

---

Make sure to replace the placeholder links and paths with actual ones relevant to your project. If you want to add images, create an `assets` directory in your repo and put your images there, then use relative paths as shown.
