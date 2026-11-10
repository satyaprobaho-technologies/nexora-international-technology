# NEXORA Google Business Email Finder (Chrome Extension)

## Install locally
1. Download this folder from the repository (or download the repository ZIP).
2. Extract it.
3. Open `chrome://extensions` in Chrome.
4. Turn on **Developer mode**.
5. Choose **Load unpacked** and select `chrome-extension/google-email-finder`.

## Use
1. Search Google for a business category and country, e.g. `Bangladesh hotel contact email`.
2. Open the extension from the Chrome toolbar.
3. Enter the country and business category.
4. Click **Collect visible emails from this Google page**.
5. Review the result count, then choose **Export CSV**.

## Scope and safeguards
- Reads only email addresses visibly present in the current Google Search results page, after a user click.
- It does not crawl result websites automatically, scrape in the background, bypass sign-in/CAPTCHAs, or harvest private/personal mailbox addresses.
- Common personal mailbox providers are filtered out; this is not a guarantee that every remaining address is a business contact.
- Exported rows are marked `pending`; public visibility is not marketing consent. Do not import them into a marketing audience or send campaigns without a valid lawful basis and required consent.
- The CSV is a review/export file. It is not automatically written to NEXORA Firestore or Brevo.
- Google may change its page markup; if no emails are found, inspect the result manually or use the official website's public contact page.
