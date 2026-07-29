# 🇩🇿 FacturaDZ — Invoicing & Commercial Management SaaS

**FacturaDZ** is a modern local-first and cloud invoicing SaaS built specifically for businesses, SMEs, artisans, and freelancers in **Algeria**. It is fully compliant with Algerian tax regulations and legal requirements (TVA 0/9/19%, Cash Stamp Duty / Timbre Fiscal, amount-in-words conversion in Algerian Dinars, 58 Wilayas, and official business identifiers RC/NIF/AI/NIS).

![Next.js](https://img.shields.io/badge/Next.js-16_App_Router-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8?logo=tailwindcss)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)
![NextAuth](https://img.shields.io/badge/NextAuth-v5-purple?logo=nextdotjs)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Key Features

- 📄 **Complete Document Management**: Create & manage Invoices (*Factures*), Quotes (*Devis*), Proforma Invoices, Purchase Orders (*Bons de Commande*), and Delivery Notes (*Bons de Livraison*).
- 🔄 **One-Click Document Conversion**: Instantly transform accepted Quotes or Proforma Invoices into official Invoices.
- 🇩🇿 **Algerian Tax & Regulatory Compliance**:
  - Configurable line-item TVA rates (0%, 9%, 19%).
  - Automatic **Stamp Duty (*Droit de Timbre*)** calculation for cash payments (1% or 1.5% sliding scale, capped and exempt under 300 DA).
  - Automatic **Amount in Words** generation in Algerian Dinars (*e.g., "Arrêté la présente facture à la somme de : Quarante et un mille cinquante-cinq dinars algériens."*).
  - Legal business metadata support (RC, NIF, AI, NIS, RIB / CCP, Wilayas).
- 📴 **Local-First Guest Mode (IndexedDB)**: Create and edit invoices without signing up. All guest data is stored safely in your browser.
- ☁️ **Automatic Guest-to-Cloud Data Migration**: When creating an account or signing in (Credentials or Google OAuth), all guest documents and clients automatically sync to your cloud account.
- 🔑 **Secure Authentication**: Password authentication (bcrypt) & **Google OAuth 2.0**.
- 🖨️ **PDF Generation & Printing**: High-resolution A4 invoice layouts ready for PDF download or direct printing.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Server Actions, Route Handlers)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI & Styling**: [TailwindCSS v4](https://tailwindcss.com/), Lucide Icons
- **Database & ORM**: [Prisma](https://www.prisma.io/) (SQLite for local dev, compatible with PostgreSQL / Supabase)
- **Authentication**: [NextAuth.js v5 (Auth.js)](https://authjs.dev/)
- **PDF Engine**: `@react-pdf/renderer`
- **Client Storage**: IndexedDB via `idb`

---

## 🚀 Getting Started (Local Development)

### 1. Prerequisites
- Node.js 20+ and `npm`

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/your-username/factura-dz.git
cd factura-dz

# Install dependencies
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Configure your `.env` file:
- `DATABASE_URL`: Database connection string (`file:./dev.db` for local SQLite)
- `NEXTAUTH_SECRET` / `AUTH_SECRET`: Secret key for JWT signing (`openssl rand -base64 32`)
- `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET`: (Optional) Google OAuth Client credentials from Google Cloud Console

### 4. Database Setup
```bash
# Push Prisma schema and generate Prisma Client
npx prisma db push
```

### 5. Run Development Server
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

FacturaDZ is configured for one-click deployment on Vercel.

### Deployment Steps:

1. Push your repository to GitHub.
2. Import the project into [Vercel](https://vercel.com/).
3. **Set Environment Variables on Vercel** (*Settings > Environment Variables*):

   | Variable Name | Description | Example Value |
   |---|---|---|
   | `DATABASE_URL` | Production DB Connection String (PostgreSQL / Supabase / Turso) | `postgresql://...` |
   | `NEXTAUTH_SECRET` | NextAuth session secret | `your_random_production_secret` |
   | `NEXTAUTH_URL` | Production website URL | `https://your-app.vercel.app` |
   | `AUTH_SECRET` | Same as `NEXTAUTH_SECRET` | `your_random_production_secret` |
   | `AUTH_URL` | Same as `NEXTAUTH_URL` | `https://your-app.vercel.app` |
   | `AUTH_GOOGLE_ID` | Google OAuth Client ID | `535...apps.googleusercontent.com` |
   | `AUTH_GOOGLE_SECRET` | Google OAuth Client Secret | `GOCSPX-...` |

4. In **Google Cloud Console** (*APIs & Services > Credentials*):
   Add your Vercel URL to **Authorized redirect URIs**:
   - `https://your-app.vercel.app/api/auth/callback/google`

5. Deploy! Vercel automatically runs `npm run postinstall` (`prisma generate`) and `npm run build`.

---

## 📝 License

This project is licensed under the MIT License. Feel free to use, modify, and distribute.
