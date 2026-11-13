# Private, invite-only community site

## What members will experience
- Every page (home, sessions, jobs, interview prep, mentorship, resources) requires sign-in.
- Visitors without a session land on a simple branded sign-in page with a "Continue with Google" button.
- New people can only create an account through your private invite link (e.g. `/join?code=...`). Without the code, Google sign-in for a new account is refused with a friendly "You need an invite link" message.
- Existing members just sign in with Google from the sign-in page.
- The top bar shows the signed-in member's name/avatar with a Sign out option.

## What you control
- One shared invite code; you can change it any time (old links stop working for new sign-ups, existing members keep access).
- You can see who has joined in the backend Users view.

## Technical details
- Enable Google via managed social login; Google-only (no email/password).
- Move all content routes under `src/routes/_authenticated/` (managed gate, redirects to `/auth`); `index` becomes `_authenticated/index.tsx` and the top-level `index.tsx` is removed in the same step.
- New public routes: `/auth` (sign-in) and `/join` (stores invite code in sessionStorage, then Google sign-in).
- Tables: `members` (user_id pk, joined_at) and `invite_settings` (single row, code hash). Server fn `redeemInvite` (requireSupabaseAuth) validates code and inserts membership; the `_authenticated` area additionally checks membership and sends non-members to `/auth?needInvite=1` and signs them out.
- Tighten RLS on all community tables (topics, mentors, job_tools, target_companies, best_practices, books, engineering_resources, engineering_tips, book-covers storage): remove anon access, require `authenticated` + membership via a `is_member(auth.uid())` security-definer function. Existing content is kept.
- Root `onAuthStateChange` listener; header session-aware with sign-out.
- Tests for invite-code validation.
