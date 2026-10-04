# DYNATECH Website Client Handbook

## 1. Project Summary

The DYNATECH website is a bilingual corporate platform for presenting the company, its industrial partnerships, the Auto Hub project, technical information, careers, and contact channels. It includes a custom CMS so authorized staff can update most public content without changing source code or redeploying the application.

The public website is available in English and Arabic:

- <https://dynatecheg.com/en>
- <https://dynatecheg.com/ar>

## 2. Delivered Areas

The project includes:

1. Home page with hero media, partner links, addresses, and contact information.
2. About Us page with company story, founder/CEO content, timeline, mission, vision, and locations.
3. Technology Partners overview and individual FFT and Composites United pages.
4. Auto Hub project page with project information, figures, team, and gallery.
5. Tech Info page supporting images, videos, and PDF references.
6. Careers page.
7. Contact page with inquiry categories and email delivery.
8. Legal disclaimer page.
9. Coming Soon page and full-site/Coming Soon switch.
10. Website Offline page controlled through the private owner interface.
11. Bilingual CMS with draft/publish workflow, media library, and account management.

## 3. Systems and Ownership

| Service | Purpose | Client responsibility |
| --- | --- | --- |
| GitHub | Source code and change history | Retain organization/repository access and review collaborators |
| Hostinger | Node.js application hosting and SSL | Renew the hosting plan and monitor deployments/resources |
| GoDaddy | Domain registration and DNS | Renew `dynatecheg.com` and protect registrar access |
| Supabase | CMS database and dashboard authentication | Retain owner access, monitor quotas, and keep backups |
| Cloudinary | CMS images, videos, and PDF storage | Monitor storage/bandwidth and retain account ownership |
| Resend | Contact-form email delivery | Keep the sending domain verified and monitor delivery logs |

Each external service should be registered to a client-controlled email address. Two-factor authentication should be enabled where available.

## 4. Access Levels

### CMS Owner

Owners can manage content, media, website display mode, and CMS accounts. Owners can create editors, reset passwords, change roles, disable accounts, and delete accounts. The final active owner cannot be removed or demoted.

### CMS Editor

Editors can update and publish website content and media. They cannot manage other users or change the public website mode.

### Private Owner Access

`/:locale/super-admin` is separate from Supabase CMS accounts. It controls the emergency Website Offline state. Its credentials are stored only as Hostinger environment variables; the password itself is not stored in plain text.

## 5. Publishing Responsibilities

- English and Arabic are separate content records. Publish both when a change must appear in both languages.
- **Save draft** stores private work. **Publish website** makes that page and language public.
- Global contact information is also language-specific.
- The contact-form recipient is separate from the email displayed in the footer.
- Website code releases and CMS content publishes are different operations. Normal text/media changes do not require a Hostinger deployment.

## 6. Contact Form Behavior

The public form sends through Resend.

- The displayed email comes from **Global & Navigation > Connect**.
- The receiving mailbox comes from **Contact > Contact form > Form recipient email**.
- English and Arabic recipient fields can be different. Set both to the same address when one mailbox should receive all inquiries.
- `CONTACT_FROM_EMAIL` is the verified sender identity, not the receiving mailbox.
- The visitor's email becomes the Reply-To address, so staff can reply normally.

## 7. Business Continuity

At least two trusted people should have:

- Hostinger collaborator or owner access.
- GoDaddy domain access.
- Supabase owner access.
- Cloudinary administrative access.
- Resend administrative access.
- GitHub repository access.

Do not store passwords or API keys inside this repository. Use a client-approved password manager.

## 8. Handover Checklist

- [ ] Client controls the domain and renewal billing.
- [ ] Client controls the Hostinger hosting plan.
- [ ] Client has at least two active CMS owner accounts.
- [ ] Client controls Supabase, Cloudinary, and Resend accounts.
- [ ] Resend domain status is verified.
- [ ] GitHub repository access has been transferred or shared appropriately.
- [ ] Environment variables are recorded in a secure password manager.
- [ ] A recent Supabase backup/export exists.
- [ ] Contact-form delivery is tested after every email/DNS change.
- [ ] Recovery contacts and support ownership are documented internally.

## 9. Support Boundaries

Content updates are handled through the CMS. Source-code changes, new page types, new integrations, database schema changes, or hosting migrations require a developer release and production deployment.
