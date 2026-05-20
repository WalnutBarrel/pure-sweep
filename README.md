# PureSweep Cleaning

A premium website and admin dashboard for PureSweep Cleaning, a bespoke cleaning service based in Auckland, New Zealand.

Built with Next.js 15, Prisma, PostgreSQL, Recharts, Framer Motion, and Tailwind CSS.


---

## Features

### Public Website
- Editorial design with serif typography and restrained color palette
- Service catalog with detailed descriptions and pricing
- Live booking form with instant pricing calculator
- Contact form with validation
- Testimonials slider with keyboard navigation and reduced motion support
- Hero slider with autoplay pause on hover
- Fully responsive across mobile, tablet, and desktop

### Admin Dashboard
- Protected routes with NextAuth.js session-based authentication
- Dashboard with revenue, expenses, profit, GST, and booking metrics
- Interactive Recharts graphs: Revenue vs Expenses, Net Profit, Bookings by Service, Payment Status, Customer Growth
- Full CRUD for: Services, Pricing Plans, Bookings, Customers, Invoices, Payments, Expenses, Staff, Testimonials, Settings
- Zod validation on all forms
- Search, filter, sort, and pagination on data tables
- Toast notifications and confirmation dialogs for destructive actions

---

## Prerequisites

- **Node.js** 18+ (LTS recommended)
- **PostgreSQL** 14+ running locally or remotely
- **npm** (included with Node.js)

---

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd pure-sweep
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example environment file and update with your database credentials:

```bash
cp .env.example .env
```

Edit `.env` and set:
- `DATABASE_URL` - your PostgreSQL connection string
- `AUTH_SECRET` - a random 32-byte hex string (generate with `openssl rand -hex 32`)

### 4. Set up the database

Push the Prisma schema to your PostgreSQL database:

```bash
npx prisma db push
```

Generate the Prisma Client types:

```bash
npx prisma generate
```

### 5. Seed the database

Populate the database with realistic sample data (services, customers, bookings, invoices, expenses, staff, testimonials):

```bash
npm run db:seed
```

### 6. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the public website.

### 7. Access the admin dashboard

Navigate to [http://localhost:3000/admin/dashboard](http://localhost:3000/admin/dashboard).

Default admin credentials (from seed data):
- **Email:** `contact.puresweep@gmail.com`
- **Password:** `Password123!`

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Create an optimized production build |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint checks |
| `npm run db:seed` | Seed the database with sample data |
| `npx prisma db push` | Push schema changes to the database |
| `npx prisma generate` | Regenerate Prisma Client types |
| `npx prisma studio` | Open Prisma Studio (visual database browser) |

---

## Database Migrations

For development, `npx prisma db push` is sufficient to sync the schema.

For production environments, use Prisma Migrate:

```bash
npx prisma migrate dev --name init
npx prisma migrate deploy
```

---

## Project Structure

```
pure-sweep/
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── seed.ts              # Sample data seeder
├── public/
│   └── images/              # Hero slider images
├── src/
│   ├── actions/             # Server actions (booking, CRUD)
│   ├── app/
│   │   ├── (admin)/         # Admin dashboard routes
│   │   ├── (public)/        # Public website routes
│   │   ├── api/             # API routes (auth)
│   │   ├── globals.css      # Design tokens and component styles
│   │   ├── layout.tsx       # Root layout with fonts
│   │   └── not-found.tsx    # Custom 404 page
│   ├── components/
│   │   ├── admin/           # Admin UI components
│   │   └── motion/          # Framer Motion wrappers
│   ├── lib/                 # Prisma client, pricing, utilities
│   ├── middleware.ts        # NextAuth route protection
│   └── schemas/             # Zod validation schemas
├── .env.example             # Environment variable template
├── package.json
├── tailwind.config.ts       # Design token configuration
└── prisma.config.ts         # Prisma configuration
```

---

## Design System

- **Fonts:** Fraunces (serif headings), Manrope (sans-serif body), Geist Mono (numbers)
- **Colors:** Deep teal primary (`#0F3D3E`), warm gold accent (`#B58A4A`), warm stone backgrounds
- **Edges:** Sharp editorial geometry (0px border-radius)
- **Motion:** Subtle fade-up reveals, crossfade transitions, reduced motion respected
- **Currency:** NZD formatted via `Intl.NumberFormat("en-NZ")`
- **Tax:** 15% New Zealand GST calculated on all pricing

---

## Technology Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Database | PostgreSQL |
| ORM | Prisma 7 |
| Auth | NextAuth.js v5 |
| Styling | Tailwind CSS 3 |
| Charts | Recharts |
| Animation | Framer Motion |
| Validation | Zod |
| Forms | React Hook Form |
| Icons | Lucide React |

---

## License

Private. All rights reserved.
