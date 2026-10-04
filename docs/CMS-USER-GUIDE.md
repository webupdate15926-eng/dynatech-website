# CMS User Guide

## 1. Sign In

Open one of the following:

- English dashboard: <https://dynatecheg.com/en/admin>
- Arabic dashboard: <https://dynatecheg.com/ar/admin>

Use a CMS account created by an owner. CMS accounts are separate from Hostinger, GoDaddy, and private Super Admin credentials.

## 2. Dashboard Concepts

### Page selector

The left sidebar lists editable areas: Global & Navigation, Coming Soon, Website Offline, Home, About Us, Technology Partners, partner pages, Auto Hub, Tech Info, Careers, Contact, and Legal Disclaimer.

### Language selector

Use the English/Arabic switch before editing. Each language has its own draft and published document. Switching languages does not translate content automatically.

### Text content

Edits headings, paragraphs, labels, contact information, addresses, and page-specific fields.

### Images & video

Edits fixed media slots for the selected page.

### Collections

Manages repeatable items, including timeline milestones, locations, partner cards, galleries, team members, figures, inquiry categories, and Tech Info resources. Items can be added, removed, and reordered.

### Media library

Stores reusable Cloudinary assets. Supported asset types depend on the selected page. Tech Info accepts images, videos, and PDF files. Other pages restrict files to the media types expected by their components.

## 3. Draft and Publish Workflow

1. Select the page and language.
2. Edit text, media, or collection items.
3. Select **Save draft**. The public website does not change yet.
4. Preview the page if required.
5. Select **Publish website**.
6. Open the public page in a new tab and verify desktop and mobile layouts.

Published content is loaded dynamically. A Hostinger redeployment is not needed after a normal CMS publish.

## 4. Global Information

**Global & Navigation** controls the header links, footer quick links, office locations, shared phone, shared email, labels, and copyright text.

The English and Arabic documents are independent. If the same phone or email is required everywhere, update and publish both languages.

## 5. Contact Form Recipient

The email displayed to visitors and the mailbox receiving form submissions are separate settings.

To change the recipient:

1. Select **Contact**.
2. Select the required language.
3. Open **Contact form**.
4. Change **Form recipient email**.
5. Save the draft and publish.
6. Repeat for the second language when both forms should use the same mailbox.

Changing **Global & Navigation > Connect > Email** only changes the visible email and `mailto:` link.

## 6. Media Operations

### Upload

1. Open a compatible page/section.
2. Select Upload or Media Library.
3. Choose the local file.
4. Wait for the Cloudinary upload to finish.
5. Assign the asset to the required slot or collection item.
6. Save and publish.

### Reuse

Select an existing asset from the Media Library instead of uploading a duplicate.

### Replace

Use Replace to overwrite the same Cloudinary identity. Existing CMS references are updated to the replacement URL.

### Delete permanently

A library file can be permanently deleted only when no draft or published document references its URL. Remove or replace every usage first. Permanent deletion removes the Supabase media row and the Cloudinary asset.

### PDF files

PDF resources are intended for Tech Info. The website generates a short-lived signed Cloudinary URL through `/api/media/pdf` and opens the document in a new tab. If a PDF fails, verify that it was uploaded as a Cloudinary `raw` asset and still exists in the media library.

## 7. Repeatable Content and Show More

Collections initially show a limited number of public items. When a section contains more than eight supported entries, the public component can expose its Show More control. Reordering in the dashboard changes public order after publishing.

## 8. Accounts

The Accounts view is available to owners.

Owners can:

- Create an owner or editor with email and password.
- Change an account's email, password, role, or active status.
- Delete another account permanently.

Editors can manage content and change their own password where available, but cannot manage the account list. The database prevents disabling, deleting, or demoting the last active owner.

Share passwords privately. No invitation email is automatically sent.

## 9. Website Display Mode

Owners can choose:

- **Full website**: visitors see normal site pages.
- **Coming Soon page**: public routes show the landing page; admin areas remain accessible.

The change is immediate and does not require deployment. Update the Coming Soon content before activating it.

## 10. Website Offline Mode

The private owner page controls emergency maintenance mode:

- <https://dynatecheg.com/en/super-admin>

When enabled, public localized routes show the Website Offline page without the normal header/footer. Admin and private owner routes remain accessible.

## 11. Publishing Checklist

- [ ] Correct page selected.
- [ ] Correct language selected.
- [ ] Spelling, punctuation, and email addresses verified.
- [ ] Images have the intended crop on desktop and mobile.
- [ ] Arabic alignment and line wrapping checked.
- [ ] Draft saved.
- [ ] Page published.
- [ ] Public page refreshed and checked in an incognito/private tab.

## 12. Common Problems

### A change does not appear

Confirm that **Publish website** was selected, not only Save draft. Confirm the language and page. Refresh the public page without cache.

### Footer data differs between languages

Publish matching values in both Global documents.

### Contact messages go to the old mailbox

Update and publish `recipientEmail` in both Contact documents. The visible footer email does not control delivery.

### Upload succeeds but the asset is absent

Confirm the upload completed, select the asset for a page slot/item, save the draft, and publish.

### An account cannot sign in

An owner should confirm the account is active and reset its password. Confirm the user still exists in both Supabase Auth and `cms_admins`.
