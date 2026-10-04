# DYNATECH Corporate Website

Production repository for the bilingual DYNATECH corporate website and its custom content management system.

## Production Links

- Website: <https://dynatecheg.com/en>
- Arabic website: <https://dynatecheg.com/ar>
- CMS dashboard: <https://dynatecheg.com/en/admin>
- Private owner control: <https://dynatecheg.com/en/super-admin>

Credentials, API keys, and passwords are intentionally not stored in this repository.

## Documentation

- [Client handbook](docs/CLIENT-HANDBOOK.md) - project scope, ownership, services, and handover checklist.
- [دليل العميل بالعربية](docs/CLIENT-GUIDE-AR.md) - دليل التسليم والإدارة اليومية والطوارئ.
- [CMS user guide](docs/CMS-USER-GUIDE.md) - daily content, media, account, and publishing workflows.
- [Technical reference](docs/TECHNICAL-REFERENCE.md) - architecture, routes, data model, APIs, and security controls.
- [Deployment and operations](docs/DEPLOYMENT-OPERATIONS.md) - local setup, Hostinger deployment, DNS, email delivery, backup, and troubleshooting.

## Technology

- Next.js 16 App Router, React 19, and TypeScript
- Tailwind CSS 4
- Supabase Auth and PostgreSQL for CMS accounts and content
- Cloudinary for managed images, videos, and Tech Info PDF files
- Resend for contact-form delivery
- Hostinger Node.js Web App hosting

## Quick Start

Requirements: Node.js 22.x and npm.

```bash
npm install
copy .env.example .env.local
npm run dev
```

Open <http://localhost:3000/en>. Arabic pages are under `/ar`.

## Commands

```bash
npm run dev
npm run lint
npm run build
npm run start
```

The production build deliberately uses webpack: `next build --webpack`.

## Content Model

Checked-in JSON and media are safe fallbacks. Once a page and locale are published from the CMS, the published Supabase document overrides matching fallback values. Drafts remain private until **Publish website** is selected.

- `content/locales/en.json` and `content/locales/ar.json`: fallback copy.
- `content/media.ts`: fallback media paths.
- `content/schema/`: TypeScript content contracts.
- `lib/cms/`: CMS loading, normalization, authentication, and merge logic.
- `supabase/migrations/`: database tables, policies, roles, and publish function.

Published content is read at request time, so a CMS publish does not require a new application deployment.

## Main Routes

| Route | Purpose |
| --- | --- |
| `/:locale` | Home |
| `/:locale/about-us` | About Us and timeline |
| `/:locale/technology-partners` | Technology Partners |
| `/:locale/technology-partners/:slug` | FFT or Composites United detail |
| `/:locale/the-auto-hub` | Auto Hub project |
| `/:locale/tech-info` | Images, videos, and PDF references |
| `/:locale/careers` | Careers |
| `/:locale/contact` | Contact details and inquiry form |
| `/:locale/legal-disclaimer` | Legal disclaimer |
| `/:locale/admin` | CMS dashboard |
| `/:locale/super-admin` | Separate private owner control |

Supported locales are `en` and `ar`. Requests without a locale redirect to English unless a valid locale cookie exists.

## Security Rules

- Never commit `.env.local`, credentials, database secrets, or deployment archives.
- Never put a secret/service-role key in a `NEXT_PUBLIC_` variable.
- Rotate a key immediately if it is shared in chat, email, screenshots, or source control.
- CMS owners should create named editor accounts instead of sharing one account.
- Keep at least one active owner account; the database prevents removal of the last owner.

See the documentation folder for the complete setup and operations guide.
