# Developer Setup Guide

Follow these steps to set up the CCSS Consultory frontend locally.

## Requirements
- **Node.js**: v18.x or above
- **npm**: v9.x or above (Yarn and pnpm are also supported but instructions will assume npm)

## Installation

1. Clone or clone the repository to your local machine.
2. Navigate to the project root directory:
   ```bash
   cd ccss_consultory_fnt
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

To start the Vite development server in hot-reload mode:

```bash
npm run dev
```
The application will usually be available at `http://localhost:5173/`. 

## Build and Testing

- **Building for Production:** 
  Generates an optimized bundle in the `dist` folder.
  ```bash
  npm run build
  ```

- **Preview Production Build:**
  ```bash
  npm run preview
  ```

## Environment Variables
If required, make sure to set up your `.env` variables at the root of the project to target the correct backend API. (e.g., `VITE_API_URL`).
