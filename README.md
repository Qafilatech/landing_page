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

## Development

To start development:

1. Make sure you have Node.js installed (v16 or higher recommended)
2. Install dependencies: `npm install`
3. Navigate to the project directory: `cd landing_page/src`
4. Start development server: `npm run dev`
5. Build for production: `npm run build`

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/my-new-feature`
5. Submit a pull request

## File Structure
landing_page/
├── public/ # Public static files
│ ├── favicon.ico
│ └── robots.txt
├── src/
│ ├── assets/ # Images, fonts, and other static assets
│ │ ├── images/
│ │ └── fonts/
│ ├── components/ # Reusable UI components
│ │ ├── Button/
│ │ ├── Card/
│ │ ├── Input/
│ │ └── Navigation/
│ ├── layouts/ # Layout components
│ │ ├── MainLayout.tsx
│ │ └── AuthLayout.tsx
│ ├── pages/ # Page components
│ │ ├── Home/
│ │ ├── About/
│ │ ├── Contact/
│ │ └── NotFound/
│ ├── services/ # API and external service integrations
│ │ └── api.ts
│ ├── styles/ # Global styles and theme configuration
│ │ ├── globals.css
│ │ └── theme.ts
│ ├── utils/ # Helper functions and constants
│ │ ├── constants.ts
│ │ └── helpers.ts
│ ├── App.tsx # Root component
│ ├── main.tsx # Application entry point
│ └── vite-env.d.ts # Vite type declarations
├── .eslintrc.json # ESLint configuration
├── .gitignore # Git ignore rules
├── index.html # HTML entry point
├── package.json # Project dependencies and scripts
├── tsconfig.json # TypeScript configuration
├── vite.config.ts # Vite configuration
└── tailwind.config.js # Tailwind CSS configuration


Made with 🤘🏿 by Halumi