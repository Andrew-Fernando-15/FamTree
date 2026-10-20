# FamTree

> A private, structured web-based digital family tree system designed for family member verification, account linking, intuitive tree exploration, and privacy-first profile sharing.

---

## 📌 Project Status

**Current Stage:** **Stage 1 — Project Foundation** *(Alpha Milestone: Stages 1–20)*

In accordance with Stage 1 specifications:
- ✅ React 19 + TypeScript + Vite project initialized
- ✅ Domain-driven, modular folder structure created
- ✅ `.env.example` configuration template provided
- ✅ Comprehensive `.gitignore` configured
- ✅ Official requirement documents organized in `/docs`
- 🚫 **Features:** No business features implemented in Stage 1
- 🚫 **Supabase:** No database or authentication connections established in Stage 1

---

## 🛠️ Technology Stack

- **Frontend:** React 19, TypeScript
- **Build Tool & Bundler:** Vite
- **Styling:** Vanilla CSS with modular design tokens (`src/styles/tokens.css`)
- **Backend (Future Stages):** Supabase (PostgreSQL, Auth, Storage, Edge Functions)

---

## 📁 Project Directory Structure

```text
Fam-Tree-Web/
├── docs/                   # Master requirements & specifications
│   ├── 00_FamTree_Master_Specification.txt
│   ├── 01_PRD_FamTree.docx
│   ├── 02_FRD_FamTree.docx
│   ├── 03_TRD_FamTree.docx
│   ├── 04_UI_UX_Specification.docx
│   ├── 05_Data_Model_and_Database.docx
│   ├── 06_API_Specification.docx
│   ├── 07_Auth_Security_Privacy.docx
│   └── FamTree_EI_Guidance.docx
├── public/                 # Static public assets
├── src/
│   ├── assets/             # Media and static graphics
│   ├── components/         # Reusable UI components
│   ├── layouts/            # Layout wrappers and shells
│   ├── pages/              # Top-level page views
│   ├── features/           # Domain feature modules (prepared for future stages)
│   │   ├── admin/          # Admin management & integrity enforcement
│   │   ├── auth/           # Login, registration, and verification flows
│   │   ├── dashboard/      # Main member dashboard
│   │   ├── familyTree/     # Interactive family tree canvas & graph rendering
│   │   ├── member/         # Member profile pop-ups & candidate matching
│   │   └── profile/        # Member profile management
│   ├── hooks/              # Reusable custom React hooks
│   ├── lib/                # External service clients (future Supabase client)
│   ├── services/           # API and data fetching layer
│   ├── styles/             # Global CSS and design tokens (tokens.css)
│   ├── types/              # Global TypeScript interfaces & data models
│   ├── utils/              # Helper functions (date formatting, validators)
│   ├── App.tsx             # Root application component
│   ├── index.css           # Global resets and typography
│   └── main.tsx            # React application entry point
├── .env.example            # Environment configuration template
├── .gitignore              # Git ignore rules
├── index.html              # HTML document template
├── package.json            # Project manifest & scripts
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite bundler configuration
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher (v24+ recommended)
- **npm**: v9.0.0 or higher

### Installation

1. Clone or navigate to the repository:
   ```bash
   cd Fam-Tree-Web
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables (optional for Stage 1):
   ```bash
   cp .env.example .env
   ```

### Running Locally

Start the Vite local development server:
```bash
npm run dev
```

### Production Build

Typecheck and compile the production bundle:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

---

## 🗺️ Roadmap Overview

The FamTree project is developed incrementally across structured stages:

- **Alpha Milestone (Stages 1–20):** Core foundation, authentication, identity matching, tree visualization, member pop-ups, profile editing, and owner validation.
- **Beta Milestone (Stages 21–45):** Controlled testing with planned 15 testers, edge cases, admin tools, and security hardening.
- **Main / V1.0 Release:** Public launch and production readiness.

---

## 📜 Documentation

Full architectural, functional, security, and UI/UX documentation can be found in the [`/docs`](./docs) directory.
