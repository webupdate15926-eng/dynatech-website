# Deployment and Operations

## 1. Environment Variables

Create `.env.local` for local development and configure the same keys in Hostinger. Never commit real values.

| Variable | Exposure | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Browser-safe | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Browser-safe | Supabase publishable/legacy anon key |
| `SUPABASE_SECRET_KEY` | Server only | User administration and privileged database work |
| `CLOUDINARY_CLOUD_NAME` | Server | Cloudinary cloud identifier |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Browser-safe | Direct upload destination identifier |
| `CLOUDINARY_API_KEY` | Server | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Server only | Upload signing and asset administration |
| `RESEND_API_KEY` | Server only | Contact-form delivery |
| `CONTACT_FROM_EMAIL` | Server | Verified sender identity, for example `DYNATECH Website <website@dynatecheg.com>` |
| `CMS_SITE_URL` | Server | Canonical public origin, `https://dynatecheg.com` |
| `SUPER_ADMIN_EMAIL` | Server only | Private owner email |
| `SUPER_ADMIN_PASSWORD_HASH` | Server only | Salted scrypt hash, never a plain password |
| `SUPER_ADMIN_SESSION_SECRET` | Server only | Random session-signing secret, minimum 32 characters |

## 2. Supabase Setup

1. Create a Supabase project.
2. Run `supabase/migrations/20260908000000_create_cms.sql` in SQL Editor.
3. Run `supabase/migrations/20260922000000_cms_users.sql`.
4. Create the first user in Supabase Authentication.
5. Add the first owner:

```sql
insert into public.cms_admins (user_id, role, is_active)
values ('AUTH-USER-UUID', 'owner', true);
```

6. Add the project URL, publishable key, and secret key to the environment.
7. Verify `/en/admin` can sign in and publish a harmless test value.

## 3. Cloudinary Setup

1. Create or select a Cloudinary product environment.
2. Add cloud name, API key, and API secret to the environment.
3. Set both cloud-name variables to the same value.
4. CMS uploads use the `dynatech-cms` folder.
5. PDF files must be uploaded as `raw` resources.

Do not enable unsigned uploads for this application; the server creates authenticated signatures.

## 4. Resend Setup

1. Add and verify `dynatecheg.com` in Resend.
2. Copy the exact DNS records supplied by Resend into the authoritative GoDaddy DNS zone. Values can change, so use the current Resend dashboard rather than old screenshots.
3. Wait until SPF and DKIM show Verified.
4. Create or rotate an API key and add it only to Hostinger/local environment storage.
5. Set `CONTACT_FROM_EMAIL` to a sender on the verified domain.
6. Publish valid Contact `recipientEmail` values for both languages.
7. Send a controlled test inquiry and check Resend logs and the recipient inbox.

Existing Google Workspace MX records for the root domain must not be removed when adding Resend's sending-subdomain records.

## 5. GoDaddy DNS

The authoritative nameservers remain GoDaddy unless the client intentionally migrates DNS. The website currently uses Hostinger's target IP for both apex and `www`.

Before changing records, obtain the current target from Hostinger. Typical records are:

| Type | Name | Value |
| --- | --- | --- |
| A | `@` | Current Hostinger Web App IP |
| A | `www` | Current Hostinger Web App IP |

Remove old Vercel website records only after confirming the Hostinger target. Preserve Google Workspace and verified Resend records. DNS propagation can take up to 24-48 hours, although it is commonly faster.

## 6. Hostinger Deployment

### Application configuration

- Framework: Next.js
- Node.js: 22.x
- Root directory: `./`
- Package manager: npm
- Build command: `npm run build`
- Output directory: `.next`

### Create a release archive

The release must include tracked project files and must exclude `.git`, `.env.local`, `node_modules`, `.next`, logs, and previous archives.

On Windows PowerShell from the repository root:

```powershell
git ls-files -z | tar --null -T - -a -cf dynatech-hostinger-release.zip
```

Confirm before uploading:

```powershell
tar -tf dynatech-hostinger-release.zip | Select-String 'package.json|app/api/contact/route.ts'
```

### Deploy

1. Open Hostinger > Websites > `dynatecheg.com` > Deployments.
2. Select Redeploy.
3. Select Upload new files.
4. Upload the release archive.
5. Confirm all environment variables are present and `CMS_SITE_URL=https://dynatecheg.com`.
6. Confirm Next.js, Node 22.x, `npm run build`, and `.next`.
7. Select Save and redeploy.
8. Wait until the deployment is **Completed** and **Current**.
9. Test English, Arabic, CMS, Super Admin, Tech Info, and contact delivery.

## 7. GitHub Release Workflow

```bash
git status
npm run lint
npm run build
git add <intended files>
git commit -m "Describe the release"
git push origin main
```

Never use `git add .` without reviewing untracked files. Deployment archives are ignored and should not be pushed.

## 8. Backup and Recovery

### Source code

GitHub is the source history. Push every production release. Keep the repository under client-controlled ownership or provide multiple trusted administrators.

### Database

Use Supabase database backups when available. At minimum, periodically export:

- `cms_pages`
- `cms_drafts`
- `cms_media`
- `cms_admins`
- Auth user records through approved Supabase tooling

### Media

Cloudinary stores managed uploads. Maintain an account-level backup/export strategy appropriate to the client's plan. Local `public/` files remain in GitHub.

### Environment

Store a dated list of variable names and their current ownership in a password manager. Store secret values only in that secure system and the target platform.

## 9. Post-Deployment Verification

- [ ] Hostinger deployment is Completed and Current.
- [ ] `https://dynatecheg.com/en` loads over HTTPS.
- [ ] `https://dynatecheg.com/ar` loads with RTL layout.
- [ ] `https://www.dynatecheg.com/en` loads.
- [ ] `/en/admin` displays the CMS login.
- [ ] `/en/super-admin` displays private owner login.
- [ ] Current footer phone/email appear in both languages.
- [ ] Tech Info image/video/PDF cards render.
- [ ] A controlled contact inquiry reaches the configured recipient.
- [ ] No secrets are present in browser source, GitHub, or deployment logs.

## 10. Troubleshooting

### `Invalid request origin` on Super Admin

Confirm `CMS_SITE_URL` exactly matches `https://dynatecheg.com`, then deploy the current code. The session route trusts the canonical origin and its `www` counterpart while rejecting unrelated origins.

### CMS changes do not appear

Publish the correct page and language. Check Supabase `cms_pages`, public key configuration, and runtime logs. CMS reads are `no-store`, so a code redeployment is normally unnecessary.

### Contact form returns 503

Check `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, and the published locale's recipient email.

### Contact form returns 502

Open Resend logs. Confirm domain verification, sender identity, API-key status, and recipient validity.

### PDF returns Cloudinary 401

The public card must use `/api/media/pdf`, not the raw Cloudinary URL directly. Confirm API credentials and raw asset identity.

### Build fails on Windows with SWC canonicalize/access denied

Run the build from a normal elevated/local shell with access to the repository path. This environment error is unrelated to application TypeScript when lint and an unrestricted production build succeed.

### Hostinger shows the previous version

Confirm the intended archive is marked Current. Clear Hostinger cache only if the new deployment is Current but old static assets remain visible.

## 11. Secret Rotation

Rotate a secret immediately after accidental disclosure:

1. Create a replacement in the provider.
2. Update Hostinger and `.env.local`.
3. Redeploy if the value is read at process startup.
4. Revoke the old secret.
5. Test the affected feature.
6. Review Git history and logs for exposure.

Priority secrets: Supabase secret key, Cloudinary API secret, Resend API key, Super Admin session secret, and account passwords.
