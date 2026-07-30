# 🇩🇿 FacturaDZ — Invoicing & Commercial Management SaaS

**FacturaDZ** is a modern, local-first and cloud invoicing SaaS built specifically for businesses, SMEs, artisans, and freelancers in **Algeria**. It is fully compliant with Algerian tax regulations and legal requirements — TVA (0/9/19%), Cash Stamp Duty (*Droit de Timbre / Timbre Fiscal*), amount-in-words conversion in Algerian Dinars, 58 Wilayas, and official business identifiers (RC / NIF / AI / NIS).

🌐 **Live Demo**: [factura-dz.vercel.app](https://factura-dz.vercel.app/)

![Next.js](https://img.shields.io/badge/Next.js-16_App_Router-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8?logo=tailwindcss)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-336791?logo=postgresql)
![NextAuth](https://img.shields.io/badge/NextAuth-v5-purple?logo=nextdotjs)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Key Features

### 📄 Document Management
- Create & manage **Invoices** (*Factures*), **Quotes** (*Devis*), **Proforma Invoices**, **Purchase Orders** (*Bons de Commande*), and **Delivery Notes** (*Bons de Livraison*).
- **One-click document conversion**: Instantly transform accepted Quotes or Proforma Invoices into official Invoices.
- Automatic sequential document numbering per type per year (e.g. `FAC-2026-0042`).

### 🇩🇿 Algerian Tax & Regulatory Compliance
- Configurable line-item **TVA rates** (0%, 9%, 19%).
- Automatic **Stamp Duty** (*Droit de Timbre*) calculation for cash payments (1% sliding scale, exempt under 300 DA).
- Automatic **Amount in Words** generation in Algerian Dinars  
  *e.g. "Arrêté la présente facture à la somme de : Quarante et un mille cinquante-cinq dinars algériens."*
- Full support for legal business metadata: **RC**, **NIF**, **AI**, **NIS**, **RIB / CCP**, and all **58 Wilayas**.

### 📴 Local-First Guest Mode
- Create and edit invoices **without signing up** — all guest data is stored in your browser via **IndexedDB**.
- Full offline-capable document creation and management.

### ☁️ Automatic Cloud Sync
- When signing in (Credentials or Google OAuth), all guest documents, clients, and products **automatically migrate** from IndexedDB to your cloud database.
- Seamless transition from guest to authenticated user with zero data loss.

### 🔑 Authentication
- **Email/Password** authentication with bcrypt hashing.
- **Google OAuth 2.0** via NextAuth.js v5 (Auth.js).

### 🖨️ PDF Generation & Printing
- High-resolution **A4 invoice layouts** ready for PDF download or direct printing.
- Professionally formatted with full company/client details and legal compliance fields.

### 👥 Client & Product Management
- Maintain a reusable catalog of **clients** (Individual or Business) with full Algerian business metadata.
- Maintain a reusable **product catalog** with default pricing and TVA rates.

### 💰 Payment Tracking
- Track partial and full payments per document.
- Automatic balance calculation and status updates (Paid, Partially Paid, Overdue).

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Server Actions, Route Handlers) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **UI & Styling** | [TailwindCSS v4](https://tailwindcss.com/), [Lucide Icons](https://lucide.dev/) |
| **Database** | [Neon PostgreSQL](https://neon.tech/) (serverless) |
| **ORM** | [Prisma 6](https://www.prisma.io/) |
| **Authentication** | [NextAuth.js v5 / Auth.js](https://authjs.dev/) |
| **PDF Engine** | [`@react-pdf/renderer`](https://react-pdf.org/) |
| **Client Storage** | IndexedDB via [`idb`](https://github.com/jakearchibald/idb) |
| **Form Handling** | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) validation |
| **Data Fetching** | [TanStack React Query](https://tanstack.com/query) |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── layout.tsx            # Root layout
│   ├── login/                # Login page
│   ├── signup/               # Signup page
│   ├── privacy/              # Privacy policy
│   ├── terms/                # Terms of service
│   ├── create/               # Document creation (guest + auth)
│   ├── app/                  # Authenticated dashboard
│   │   ├── dashboard/        # Dashboard overview
│   │   ├── documents/        # Document list & editor
│   │   ├── clients/          # Client management
│   │   ├── products/         # Product catalog
│   │   └── settings/         # Company settings
│   └── api/
│       └── auth/             # NextAuth route handlers & signup API
├── lib/
│   ├── auth.ts               # NextAuth configuration (Google + Credentials)
│   ├── prisma.ts             # Prisma client singleton
│   ├── calc/                 # Tax engine (TVA, Stamp Duty, Amount-in-Words)
│   ├── repository/           # Data access layer (local IndexedDB + remote API)
│   ├── types/                # TypeScript type definitions
│   └── utils/                # Shared utilities
└── prisma/
    └── schema.prisma         # Database schema (PostgreSQL)
```

---

## 🚀 Getting Started (Local Development)

### 1. Prerequisites

- **Node.js 20+** and `npm`
- A **[Neon](https://neon.tech)** PostgreSQL database (free tier available)

### 2. Clone & Install

```bash
git clone https://github.com/your-username/factura-dz.git
cd factura-dz
npm install
```

### 3. Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
# Database — Get your connection string from https://console.neon.tech
DATABASE_URL="postgresql://user:password@ep-xxxxx.region.aws.neon.tech/neondb?sslmode=require"

# Auth secrets — Generate with: openssl rand -base64 32
NEXTAUTH_SECRET="your_secret_here"
AUTH_SECRET="your_secret_here"

# Base URL
NEXTAUTH_URL="http://localhost:3000"
AUTH_URL="http://localhost:3000"

# Google OAuth (optional — needed for Google Sign-In)
AUTH_GOOGLE_ID="your_google_client_id.apps.googleusercontent.com"
AUTH_GOOGLE_SECRET="your_google_client_secret"
GOOGLE_CLIENT_ID="your_google_client_id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
```

### 4. Set Up Neon Database

1. Go to [console.neon.tech](https://console.neon.tech) and create a new project.
2. Copy the **connection string** and paste it as `DATABASE_URL` in `.env`.
3. Push the schema:

```bash
npx prisma db push
```

### 5. Set Up Google OAuth (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
2. Create an **OAuth 2.0 Client ID** (Web application type).
3. Add **Authorized redirect URIs**:
   - `http://localhost:3000/api/auth/callback/google` (for local dev)
   - `https://your-app.vercel.app/api/auth/callback/google` (for production)
4. Copy the **Client ID** and **Client Secret** into your `.env`.
5. Under **OAuth consent screen**, either:
   - Add your email as a **test user** (Testing mode), or
   - Click **Publish App** to allow any Google user to sign in (recommended for production — no review needed for basic scopes).

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Running Tests

The core tax engine (TVA, Cash Stamp Duty, Amount in Words conversion) is thoroughly tested:

```bash
npm test
```

---

## 🌐 Deploying to Vercel

FacturaDZ is configured for one-click deployment on [Vercel](https://vercel.com/).

### Deployment Steps

1. **Push** your repository to GitHub.
2. **Import** the project into Vercel.
3. **Set Environment Variables** on Vercel (*Settings > Environment Variables*):

   | Variable | Value |
   |---|---|
   | `DATABASE_URL` | Your Neon PostgreSQL connection string |
   | `NEXTAUTH_SECRET` | A strong random secret (`openssl rand -base64 32`) |
   | `NEXTAUTH_URL` | `https://your-app.vercel.app` |
   | `AUTH_SECRET` | Same as `NEXTAUTH_SECRET` |
   | `AUTH_URL` | `https://your-app.vercel.app` |
   | `AUTH_GOOGLE_ID` | Your Google OAuth Client ID |
   | `AUTH_GOOGLE_SECRET` | Your Google OAuth Client Secret |

4. **Configure Google Cloud Console** (*APIs & Services > Credentials*):
   - Add `https://your-app.vercel.app/api/auth/callback/google` to **Authorized redirect URIs**.
   - Ensure the OAuth consent screen is set to **Production** (or add test emails).

5. **Deploy!** — Vercel automatically runs `prisma generate` (via `postinstall`) and `next build`.

> **Note**: The Prisma schema uses `postgresql` provider. SQLite (`file:./dev.db`) is **not compatible** with Vercel's serverless architecture. Use [Neon](https://neon.tech) (free tier available) for both local development and production.

---

## 🗃️ Database Schema

The PostgreSQL schema (managed by Prisma) includes:

| Model | Description |
|---|---|
| `User` | Authenticated users (email, optional password hash for credentials auth) |
| `Company` | Business profile (name, address, wilaya, RC/NIF/AI/NIS, bank details) |
| `Client` | Customer records (Individual or Business, with Algerian metadata) |
| `Product` | Product/service catalog with default pricing and TVA rates |
| `Document` | Invoices, quotes, proformas, purchase orders, delivery notes |
| `DocumentLine` | Line items within a document |
| `DocumentCounter` | Auto-incrementing document numbers per type per year |
| `Payment` | Payment records linked to documents |

---

## 📝 License

This project is licensed under the **MIT License**. See [LICENSE](./LICENSE) for details.
