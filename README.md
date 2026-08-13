## Features

- Responsive design that works on all devices
- Dynamic content switching between customer and trucker views
- Smooth animations and transitions
- Modern UI components from shadcn/ui
- Optimized performance with Vite

## Tech Stack

- **Frontend Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** 
  - Tailwind CSS for utility-first styling
  - shadcn/ui for reusable components
- **Icons:** Lucide React
- **Routing:** React Router DOM
- **Form Handling:** React Hook Form
- **State Management:** React Context
- **Animations:** Tailwind CSS animations

# Development
## Frontend (Vite + React)
cd src/                  # Navigate to frontend directory

- npm run dev              # Start Vite dev server
- npm run build            # Build frontend for production

## Backend (Node.js + TypeScript)
- npm run dev:server       # Start backend with nodemon (development)
- npm run build:server     # Compile backend TypeScript
- npm run serve:server     # Run compiled backend

## Check backend response in terminal 
curl http://localhost:8080/health


## run togther 
- npm run dev:all    # Runs both frontend and backend dev servers

## Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── ui/            # shadcn/ui components
│   ├── Button.tsx     # Custom button component
│   ├── CTA.tsx        # Call-to-action component
│   ├── Features.tsx   # Features section
│   ├── Footer.tsx     # Footer component
│   ├── Hero.tsx       # Hero section
│   ├── HowItWorks.tsx # How it works section
│   └── Navbar.tsx     # Navigation component
├── pages/             # Page components
│   ├── dashboardPages/ # Dashboard related pages
│   ├── Admin.tsx      # Admin page
│   ├── Auth.tsx       # Authentication page
│   ├── Index.tsx      # Home page
│   └── NotFound.tsx   # 404 page
├── context/           # React Context providers
├── hooks/             # Custom React hooks
├── lib/               # Library configurations
├── Middleware/        # Server middleware
├── utils/             # Utility functions
├── App.tsx            # Main App component
├── main.tsx           # Application entry point
├── server.ts          # Backend server
├── index.css          # Global styles
└── App.css            # App-specific styles
```

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/my-new-feature`
5. Submit a pull request

Made with 🤘🏿 by Halumi (with the help from The Moist Marauder)


Piece 1 (Title and Intro):

# Super Admin Setup Guide

This guide explains how to manually set up the initial `superadmin_tenant` in SuperTokens and create the first super admin user. This user can then access the Super Admin Portal (e.g., at `/superadmin/login`) to manage customer companies and tenants.

## Prerequisites

1.  **SuperTokens Core Running:** Ensure your SuperTokens core service is running and accessible (e.g., at `http://localhost:3567`).
2.  **Multi-Tenancy Enabled in Core:** In your SuperTokens core `config.yaml` (or equivalent environment variable configuration), verify that `supertokens.multi_tenancy.enabled: true`. If you changed this, restart the SuperTokens core.
3.  **SuperTokens Core API Key:** You need an API key for your SuperTokens core. This is often set in the `config.yaml` (e.g., `api_keys: "YOUR_KEY_HERE"`).
4.  **`curl` Installed:** These instructions use `curl`. Ensure it's installed.
5.  **Application Running:** Your backend and frontend should be running to test login after setup.

## Setup Steps

Replace placeholders like `YOUR_SUPERTOKENS_CORE_API_KEY`, `your_superadmin_email@example.com`, and `YourStrongSuperAdminPassword123!` with your actual values.

Piece 2 (Create superadmin_tenant command):

### Step 1: Create the `superadmin_tenant`

Open your terminal and run:

```bash
curl --location --request PUT 'http://localhost:3567/ee/tenant' --header 'api-key: YOUR_SUPERTOKENS_CORE_API_KEY' --header 'Content-Type: application/json' --data-raw '{
  "tenantId": "superadmin_tenant",
  "emailPassword": { "enabled": true },
  "session": { "enabled": true }
}'
```

Notes for Step 1:

Adjust http://localhost:3567 if your core runs elsewhere.
If you are not using SuperTokens Enterprise, the endpoint might be /tenant (not /ee/tenant).
Success response: {"status":"OK","createdNew":true}.
Check SuperTokens core logs on error.



Piece 3 (Create Super Admin User command):

### Step 2: Create Your Super Admin User within `superadmin_tenant`

Open your terminal and run:

```bash
curl --location --request POST 'http://localhost:3567/auth/signup' --header 'api-key: YOUR_SUPERTOKENS_CORE_API_KEY' --header 'Content-Type: application/json' --header 'st-tenant-id: superadmin_tenant' --data-raw '{
    "formFields": [
        { "id": "email", "value": "your_superadmin_email@example.com" },
        { "id": "password", "value": "YourStrongSuperAdminPassword123!" }
    ]
}'
```

Notes for Step 2:

The st-tenant-id: superadmin_tenant header is key. You should check the documentation for your SuperTokens version if you encounter any issues.
The password must meet your defined policy (8+ characters, a number, an uppercase letter, and a lowercase letter).
A successful response will look like this: {"status":"OK","user":{"id":"USER_ID_STRING",...}}.
You can check the SuperTokens core logs if an error occurs.


Piece 4 (Login and Conclusion):

### Step 3: Log In to the Super Admin Portal

1.  Ensure your React application and Node.js backend are running.
2.  In your web browser, navigate to the Super Admin login page (e.g., `http://localhost:3000/superadmin/login`).
3.  Enter the email and password you used in Step 2.
4.  Click the "Login" button.

You should be successfully authenticated and redirected to the Super Admin Dashboard (e.g., `/superadmin/dashboard`).
This is the complete content for the README section. I have sent it in smaller pieces. Please try assembling these pieces into your README.md file. I truly hope this method works and I apologize again for the difficulties.