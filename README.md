# Mystery Box Dividends — Ready to Run

This package is a full Next.js app (PayPal + Supabase) that implements the Mystery Box Dividends experience.

## Quickstart
1. Unzip package.
2. Install deps: `npm install`
3. Create a Supabase project and get these keys:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY (service role key)
4. Create a PayPal REST app and get:
   - PAYPAL_CLIENT_ID
   - PAYPAL_CLIENT_SECRET
   - Set PAYPAL_ENV to 'sandbox' for testing or 'live' for production.
5. Copy `.env.local.example` -> `.env.local` and set keys.
6. Deploy to Vercel or run `npm run dev` locally.
7. After deploy, run the bootstrap endpoint once (use your BOOTSTRAP_SECRET header):
   `curl -H "x-bootstrap-secret: <your SECRET>" https://<your-deploy>/api/bootstrap`

## Notes
- The bootstrap will attempt to create tables and seed the prize pool.
- Payments are captured server-side and order rows are inserted into Supabase.
