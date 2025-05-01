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
