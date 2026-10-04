# Technical Reference

## 1. Architecture

```text
Browser
  -> Hostinger Node.js / Next.js application
     -> Supabase Auth (CMS sessions)
     -> Supabase PostgreSQL (drafts, published content, media metadata, roles)
     -> Cloudinary (images, videos, raw PDF files)
     -> Resend (contact-form email)
```

The application uses the Next.js App Router. Page routes load a checked-in fallback document and merge it with the current published Supabase document. Missing CMS values therefore fall back safely to repository content.

## 2. Request Flow

`proxy.ts` performs locale routing and public display control:

1. Static assets and `/api` requests pass through.
2. Requests without `en` or `ar` redirect to a localized URL.
3. For public pages, `site-control` is read from Supabase with `no-store`.
4. Maintenance mode rewrites to `/:locale/maintenance`.
5. Landing mode rewrites public routes to `/:locale/landing`.
6. Admin, Super Admin, and maintenance routes bypass public rewrites.

## 3. Content Loading

`getPageDocument()` loads the fallback document and then calls `getCmsDocument()`.

- `cms_pages` contains public documents.
- `cms_drafts` contains private editor work.
- Values are recursively merged over fallback content.
- Normalization keeps old or incomplete documents compatible with current components.
- `unstable_noStore()` ensures new publishes are visible without rebuilding the application.

## 4. Database Model

### `cms_pages`

Primary key: `(page_key, locale)`. Publicly readable and contains published JSON documents.

### `cms_drafts`

Primary key: `(page_key, locale)`. Authenticated active CMS users can edit drafts under RLS policies.

### `cms_media`

Stores Cloudinary identity, resource type, secure URL, dimensions, duration, size, alternative text, uploader, and timestamp.

### `cms_admins`

Links Supabase Auth user IDs to `owner` or `editor`, with an active flag. A trigger protects the final active owner.

### Publish function

`publish_cms_page(page_key, locale)` copies one draft into `cms_pages`. The function is `security definer`, validates membership and locale, and is callable only by authenticated users.

## 5. Authentication and Authorization

### CMS authentication

Supabase Auth creates sessions in the browser. API routes validate the bearer token and active `cms_admins` membership. Server-only account management uses `SUPABASE_SECRET_KEY`.

### Roles

- Owner: content, media, users, and public display mode.
- Editor: content and media; no user management or site-mode changes.

### Private Super Admin

The private owner interface does not use Supabase. It uses:

- `SUPER_ADMIN_EMAIL`
- a salted scrypt password hash
- HMAC-signed, HTTP-only, SameSite=Strict, secure production cookie
- eight-hour session expiration
- same-origin validation against the request origin plus `CMS_SITE_URL` and its `www` counterpart

## 6. API Routes

| Endpoint | Methods | Purpose |
| --- | --- | --- |
| `/api/cms/defaults` | GET | Return safe fallback page definitions/documents to authenticated CMS users |
| `/api/cms/revalidate` | POST | Revalidate a published page/layout after publishing |
| `/api/cms/site-mode` | GET, PATCH | Read/change Full Website vs Coming Soon; owner only |
| `/api/cms/users` | GET, POST, PATCH, DELETE | Manage CMS users; owner controls enforced server-side |
| `/api/cms/users/email` | PATCH | Change account email |
| `/api/cms/users/password` | PATCH | Change signed-in user's password |
| `/api/cms/users/reset-password` | PATCH | Owner password reset for another CMS account |
| `/api/cloudinary/sign` | POST | Create authenticated signed upload/overwrite parameters |
| `/api/cloudinary/media` | PATCH, DELETE | Replace or permanently delete managed assets |
| `/api/media/pdf` | GET | Validate a Cloudinary raw-PDF URL and redirect to a five-minute signed URL |
| `/api/contact` | POST | Validate inquiry data, rate-limit, and deliver through Resend |
| `/api/super-admin/session` | GET, POST, DELETE | Private owner session lifecycle |
| `/api/super-admin/site-status` | GET, PATCH | Read/change emergency maintenance mode |

## 7. Contact Email Flow

`POST /api/contact`:

1. Requires `RESEND_API_KEY` and `CONTACT_FROM_EMAIL`.
2. Applies an in-memory limit of five attempts per source key in ten minutes.
3. Validates required fields and a honeypot field.
4. Loads the published Contact document for the submitted locale.
5. Uses `content.form.recipientEmail` as the `to` address.
6. Uses the visitor email as `reply_to`.
7. Escapes user values before generating HTML.

The visible global email is not used as the recipient.

## 8. Media Security

- Upload signatures are generated server-side after CMS authorization.
- Cloudinary API secret is never exposed to the browser.
- Replacement must keep the same Cloudinary public ID and resource type.
- Deletion is refused while an asset URL appears in any draft or published document.
- PDF delivery accepts only valid raw PDF URLs for the configured Cloudinary cloud.

## 9. Directory Reference

```text
app/                    Page routes and server API routes
components/             UI and dashboard components
content/                Fallback copy, media, and schemas
lib/cms/                CMS clients, authorization, merging, normalization
lib/super-admin/        Private owner session and credential verification
public/                 Checked-in fallback media
supabase/migrations/    Database schema, RLS, roles, and triggers
docs/                   Client and engineering documentation
proxy.ts                Locale and display-mode middleware
```

## 10. Page Keys

`global`, `landing`, `maintenance`, `home`, `about-us`, `technology-partners`, `partner-fft`, `partner-cu`, `the-auto-hub`, `tech-info`, `careers`, `contact`, and `legal-disclaimer`.

## 11. Quality Controls

Before release:

```bash
npm run lint
npm run build
```

Manual QA should cover English/Arabic, desktop/mobile, RTL alignment, timeline horizontal scrolling, image framing, long text wrapping, PDF opening, contact-form error/success states, both dashboard roles, Coming Soon mode, and Website Offline mode.
