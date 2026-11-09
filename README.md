# NEXORA INTERNATIONAL TECHNOLOGY

**Your Digital World Starts Here.**

A responsive Next.js website for presenting NEXORA's website development, domain/hosting guidance and digital support services.

## Current application scope
- Responsive marketing website and 50 distinct website concept demos.
- Customer-facing demo previews and interactive sample modules. Demo forms and admin/customer panels inside demos are simulations; they do not submit real records.
- Firebase Authentication customer registration/sign-in and email verification.
- Customer project requests and a customer portal backed by Cloud Firestore.
- Admin dashboard for reviewing customer records, projects, quotations and payment records.
- Admin-controlled customer-facing bKash/Nagad display settings, initially disabled and empty.
- Firestore security rules restricting customer records to their owners and administrative access to the verified configured admin email.
- GitHub Actions typecheck and production build validation.
- Optional Firestore rules deployment workflow.

## Not live / requires external onboarding
- NEXORA does not currently register domains, provision hosting, accept online payments or provide a live card checkout.
- SSLCOMMERZ checkout remains disabled unless the owner receives merchant approval, configures verified credentials and completes end-to-end testing.
- bKash/Nagad display settings must remain disabled until the owner has provider permission to accept business payments and confirms the correct business collection details. Personal wallet accounts must not be assumed to be approved for commercial collections.
- International card processing is not enabled.
- Email enquiry links are not a backend ticketing system.
- Domain/hosting recommendations are assistance, not a claim that NEXORA is an accredited registrar or hosting provider.

## Firebase project setup
The current web Firebase configuration points to project `nexora-technology`.
1. Enable Email/Password in Firebase Authentication.
2. Configure the authorised domains, including the production Vercel domain.
3. Confirm the intended administrator email and verify that account in Firebase Authentication.
4. Deploy `firestore.rules` to the Firebase project. The GitHub workflow `.github/workflows/deploy-firestore.yml` can do this after adding the service-account JSON as the GitHub Actions secret `FIREBASE_SERVICE_ACCOUNT_JSON`. The service account needs permission to deploy Firestore security rules.
5. For server-side payment APIs, add the same appropriately restricted service-account JSON as the Vercel server-only environment variable `FIREBASE_SERVICE_ACCOUNT_JSON`. Never use a `NEXT_PUBLIC_` prefix or commit credentials.

## Environment variables
See `.env.example`. Payment processing must remain disabled until approved merchant credentials are configured:
- `PAYMENTS_ENABLED=false`
- `SSLCOMMERZ_MODE=sandbox`
- `SSLCOMMERZ_STORE_ID=`
- `SSLCOMMERZ_STORE_PASSWORD=`

## Requirements
- Node.js >=20.9
- npm

## Run
```bash
npm install
npm run dev
```

## Validate
```bash
npm run typecheck
npm run build
```

Never commit API keys, passwords, payment credentials or private tokens.
