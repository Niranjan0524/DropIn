# Stage 2 authentication setup

The app supports passwordless email magic links and Google OAuth through Supabase Auth. Session cookies are managed by `@supabase/ssr`; server-side checks use verified claims. Public pages remain usable without backend configuration, while protected profile pages show a setup prompt.

## Local Supabase

1. Install and start Docker Desktop with its Linux container engine enabled.
2. Copy `.env.example` to `.env.local`.
3. Start and initialize the local stack:

   ```bash
   npm run db:start
   npm run db:reset
   ```

4. `supabase start` prints local API credentials. Set `NEXT_PUBLIC_SUPABASE_URL` to the local API URL and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` to its publishable/anon key in `.env.local`. Keep the site URL as `http://localhost:3000`.
5. Restart `npm run dev`. Email links are captured by the local Supabase email testing inbox (Mailpit, normally `http://localhost:54324`); they are not sent to a real mailbox.

Google login is disabled in the local config by default. Email magic-link sign-in is enough to exercise the local auth and profile flow. To test Google locally, add the Google OAuth client ID to `[auth.external.google].client_id`, set `SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_SECRET` in `.env.local`, enable the provider, and restart the local Supabase stack. Do not commit OAuth secrets.

## Hosted Supabase and Google OAuth

These steps require your own Supabase and Google Cloud projects; no hosted project is linked or configured by this repository.

1. Create a Supabase project and apply the committed migration using the Supabase dashboard SQL migration workflow or link the CLI and push migrations after reviewing the target project.
2. In Supabase Auth URL configuration, set the site URL to your app origin and add the exact callback URL `<app-origin>/auth/callback` to the redirect allow list. For local development, include `http://localhost:3000/auth/callback`; add the production URL only when you have chosen a deployment origin.
3. In the Supabase project's Auth provider settings, enable Google and copy its Supabase callback URL.
4. In Google Cloud Console, configure an OAuth consent screen and OAuth client. Add the Supabase callback URL as an authorized redirect URI, then place the client ID and secret into the corresponding Supabase Google provider fields. Google redirects to Supabase; Supabase then redirects to the app callback.
5. Set `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in `.env.local` for local work (or in the deployment environment for a deployed app). Restart the app after changing environment values.

The browser-safe publishable key is intended for client use only with the migration's RLS policies active. This app does not need a service-role key. Never expose a service-role key through `NEXT_PUBLIC_*` or commit credentials.

## Return paths

The sign-in flow accepts only same-site paths. External URLs, protocol-relative paths, control characters, and auth callback paths are rejected and fall back to profile setup. The configured site URL is used as the callback origin, so it must match the origin at which the app is being tested.
