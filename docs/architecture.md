# Frontend Architecture

This document describes the architectural decisions, tech stack, and module organization of the **CCSS Consultory** web application.

## Tech Stack
- **Framework:** React 18
- **Build Tool:** Vite (TypeScript templated)
- **Styling:** Tailwind CSS
- **Icons:** `lucide-react`
- **Routing:** React Router v6
- **Toasts/Notifications:** `sonner`

## State Management
We rely on React's native Context API combined with local persistence mechanisms for global state:
1. **AuthContext:** Manages user sessions, login/logout, and routes protection (through `<ProtectedRoute>`).
2. **ActivityContext:** Central hub for logging "actions" (CRUD events). The contexts intercepts create/update/delete calls across pages and pushes logs to be aggregated on the Dashboard.

## Application Structure

The code is strictly organized inside the `src` folder:
- `/api`: Axios instances (`api.js`) and API operation wrappers (`services.js`). Connects to backend endpoints or simulated mock-server.
- `/app/components`: 
  - `/ui`: Atomic, primitive components (Buttons, Inputs, Modals) heavily inspired by generic design systems like Shadcn UI.
  - `/DataTable.tsx`: A flexible generic table orchestrator capable of rendering arbitrary arrays of objects with standard editing/deleting functionalities and dynamic `<CustomAction />` arrays.
- `/app/pages`: Features the main visual components (Dashboard, Patients, Diagnoses, Drugs, Navigation, etc). Each file bundles its own view logic, fetching states, and forms.
- `/context`: React Context providers (`AuthContext.tsx`, `ActivityContext.tsx`).
- `/styles`: Global CSS definition like typography (`fonts.css`), base theme variables (`theme.css`) and reset/tailwind layers (`tailwind.css`).

## Data Flow
Most pages follow a standard Component Mount lifecycle:
1. `useEffect(() => { loadData() }, [])` triggered on mount.
2. `Promise.all` fetches required datasets concurrently from `/api/services.js`.
3. Datasets populate React state and are passed downward into the generic `DataTable` component.
4. Callbacks (like `handleEdit`, `handleDelete`) are defined in the parent and passed to the Table.
5. Mutations emit to `api`, re-fetch local datasets, fire Toast notifications, and dispatch to `ActivityContext`.
