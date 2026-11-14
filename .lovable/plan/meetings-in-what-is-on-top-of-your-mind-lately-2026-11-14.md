# Meetings in "What is on top of your mind lately?"

## What you'll see
- At the bottom of the green topic panel: a small **"Set up a meeting"** button.
- Clicking it opens a short form: **date**, **time**, and **Google Meet link** (must start with https://meet.google.com/).
- Once a meeting is set, the bottom of the panel shows one minimal line: a calendar icon, "Upcoming meeting · Thu, 20 Nov · 18:00", and a "Join" link to the Meet.
- If several are set, the soonest upcoming one shows; past meetings disappear automatically.
- The person who created it sees edit/delete icons (same as other entries); hovering initials shows their name.
- Any member can create a meeting.

## Technical details
- New table `meetings` (starts_at timestamptz, meet_url text, created_by, author_initials, author_name) with grants, RLS: members view/insert, authors update/delete; reuse `set_contribution_author` trigger.
- Shared zod schema `src/lib/meeting.ts` (date/time required, future, Meet URL pattern) + vitest test.
- New `UpcomingMeeting` component rendered at the bottom of `TopicBoard.tsx`; query next meeting where starts_at > now, ordered ascending, limit 1. Times shown in the viewer's local time.
