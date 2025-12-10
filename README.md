# Drive Mate API

Live URL: https://drive-mate.example.com (replace with actual URL if deployed)

**🚗 Vehicle Rental System**

**🎯 Project Overview**
Drive Mate is a backend API for a vehicle rental management system. It provides secure, role-based access for administrators and customers and handles:

- Vehicle inventory management with availability tracking
- Customer account and profile management
- Bookings (rentals, returns and cost calculation)
- Authentication and authorization (Admin and Customer roles)

**🛠️ Technology Stack**

- **Runtime:** Node.js + TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL
- **Security:** `bcrypt` for password hashing, `jsonwebtoken` (JWT) for authentication
- **Other:** `ts-node`/`tsc` for TypeScript, any chosen ORM/query layer (e.g., `pg`, `TypeORM`, `Prisma`)

**📁 Code Structure**
This codebase follows a modular, feature-based layout with clear separation of concerns (routes → controllers → services). Key folders:

- **`src/`**: application source
  - **`config/`**: database & environment configuration (e.g., `db.ts`, `index.ts`)
  - **`middlewares/`**: Express middlewares (auth, logging)
  - **`modules/`**: feature modules following the pattern `routes`, `controllers`, `services`
    - **`auth/`**: authentication (register/login, role checks)
    - **`user/`**: user/customer operations
    - **`vehicle/`**: vehicle inventory and availability
    - **`booking/`**: bookings and rental lifecycle
  - **`app.ts` / `server.ts`**: application bootstrap and server start
  - **`types/express/`**: custom request/response typings

IMPORTANT: Keep features isolated — each module should own its routes, controllers, and services. Business logic belongs in services; controllers handle request/response mapping.

**✅ Key Features**

- Role-based authentication (Admin, Customer)
- Vehicle CRUD with availability tracking
- Booking creation, validation, and cost calculation
- Secure password storage and JWT-based sessions
- Input validation and request-level logging middleware

**🔧 Setup & Usage**
Follow these steps to run the project locally.

- **Prerequisites:**

  - Node.js 16+ installed
  - PostgreSQL server available
  - `npm` or `pnpm` or `yarn` available

- **Environment variables** (create a `.env` file in project root):

  - `PORT=4000`
  - `CONNECTION_STRING=postgres://user:password@localhost:5432/drive_mate_db`
  - `PORT=changeme` (use a port)
  - `JWT_SECRET=changeme` (use a strong secret in production)

- **Install dependencies**:

```bash
npm install
```

- **Development run**:

```bash
npm run dev
```

- **Build**:

```bash
npm run build
```

**🔎 API quick reference**
The exact routes follow the modular files in `src/modules/*/*routes.ts`. Typical endpoints are:

- `POST /api/auth/register` — register new customer
- `POST /api/auth/login` — obtain JWT
- `GET /api/vehicles` — list vehicles
- `POST /api/vehicles` — (Admin) add a vehicle
- `GET /api/bookings` — list bookings (role-limited)
- `POST /api/bookings` — create booking

Check the route files in `src/modules` for full route names, required payloads, and response shapes.

**🔐 Security & Best Practices**

- Store `JWT_SECRET` and DB credentials securely (don't commit `.env`)
- Use HTTPS in production and use short JWT lifetimes with refresh tokens if needed
- Sanitize and validate all user inputs in controllers/services

**🛠️ Development Notes**

- Follow the `routes → controllers → services` layering when adding features.
- Keep database access inside services or a dedicated data access layer.
- Add unit tests for services and integration tests for public routes.

**🤝 Contributing**

- Fork the repo, create a feature branch, add tests, and make a pull request. Describe database migration steps in PR when schema changes.

**📞 Contact / Support**

- For questions or help, open an issue in this repository or contact the maintainer.

**📄 License**

- This project is provided under the terms set by the repository owner. Add a `LICENSE` file if required.
