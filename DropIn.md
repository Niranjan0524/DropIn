# DROPIN
## Product Vision, Product Requirements & Technical Specification

**Product:** DropIn  
**Category:** Real-Time Social Activity & Discovery Platform  
**Tagline:** Don't plan. Just Drop In.  
**Platform:** Web-first, responsive and mobile-friendly  
**Product Type:** Global social platform  
**Primary Objective:** Build an engaging platform that encourages spontaneous human interaction and creates recurring daily usage.

---

# 1. Product Overview

## 1.1 What is DropIn?

DropIn is a real-time social activity discovery platform that enables people to discover, create and participate in activities happening right now.

The internet has plenty of platforms for sharing content, communicating with friends, and scheduling events. However, there is no simple, universal way to discover people who are interested in doing something at the exact same moment.

People often want to:
- Find someone to play chess with.
- Join a quick coding session.
- Have a casual conversation.
- Find people to play online games.
- Study together.
- Discuss a trending topic.
- Join an impromptu debate.
- Find people nearby for a coffee or outdoor activity.
- Participate in spontaneous group activities.

Today, these interactions are fragmented across WhatsApp groups, Discord servers, Reddit communities and other platforms.

DropIn brings this experience together.

Users can create temporary activities called **Drops**, which other users can discover and join instantly.

A Drop represents an activity that is happening now or starting shortly. It has a limited lifetime, a maximum participant capacity and a dedicated interaction space.

The product is designed around one simple idea:

**Instead of scrolling through what people have already posted, discover what people are doing right now and become part of it.**

## 1.2 The Core Philosophy

DropIn is not intended to become another traditional social media platform.

Traditional social networks are centered around:
- Followers.
- Likes.
- Posts.
- Comments.
- Content consumption.
- Personal popularity.

DropIn should be centered around:
- Activities.
- Participation.
- Real-time interaction.
- Shared interests.
- Spontaneous connections.
- Community experiences.

The platform should encourage users to do things together instead of endlessly consuming content.

## 1.3 The Product Vision

Build a global network where anyone can find someone to do almost anything with, at any time.

Whether someone wants to play a quick chess match, study with strangers, discuss technology, participate in a debate, or meet people nearby, DropIn should make discovering and joining that experience effortless.

The long-term vision is to become the default destination for spontaneous human interaction on the internet.

---

# 2. Target Audience

DropIn is designed for a broad audience rather than a single demographic.

## 2.1 Primary Audience

### A. College Students

Students frequently look for people to:
- Study together.
- Prepare for competitive programming.
- Participate in hackathons.
- Play sports.
- Discuss academic subjects.
- Play online games.
- Socialize outside their existing friend groups.

DropIn can help students find people with similar interests without depending entirely on their existing social circles.

### B. Young Professionals

People working remotely or living in new cities may want:
- Virtual co-working sessions.
- Casual conversations.
- Networking opportunities.
- Skill-sharing sessions.
- Gaming communities.
- Nearby social activities.

### C. Developers and Technology Enthusiasts

This audience may use DropIn for:
- Live coding sessions.
- Debugging together.
- Technical discussions.
- Open-source collaboration.
- System design discussions.
- Programming competitions.
- Learning new technologies.

### D. General Internet Users

Anyone who wants to:
- Meet new people.
- Discover activities.
- Participate in discussions.
- Find gaming partners.
- Share interests.
- Do something spontaneous.

## 2.2 User Personas

**Persona 1: The Student**

Wants someone to study with at 10 PM. Opens DropIn, finds a live study session and joins.

**Persona 2: The Remote Worker**

Wants to co-work with others for 30 minutes. Creates an online Drop and shares the invitation.

**Persona 3: The Gamer**

Wants a quick chess match. Discovers an available Drop and joins another player.

**Persona 4: The Curious Person**

Wants to discuss an interesting topic. Creates an open discussion and invites people to participate.

**Persona 5: The Social Explorer**

Wants to meet new people and explore activities outside their existing network.

---

# 3. Core Product Concept: Drops

A Drop is the central building block of DropIn.

A Drop represents a temporary activity that users can discover and join.

Each Drop should contain:

- Unique Drop ID.
- Activity title.
- Description.
- Category.
- Creator information.
- Creation timestamp.
- Start time, if applicable.
- Expiration timestamp.
- Maximum participant capacity.
- Current participant count.
- Visibility type.
- Interaction type.
- Participant list.
- Current status.
- Optional location information.
- Optional external meeting link.

## 3.1 Types of Drops

### Online Drops

Online activities can be joined by anyone from anywhere.

Examples:
- Let's solve two LeetCode problems.
- Anyone up for chess?
- Let's discuss AI agents.
- Looking for people to play GeoGuessr.
- Silent co-working session.
- Let's debate whether AI will replace developers.

Online Drops should be the primary discovery experience.

### Nearby Drops

Nearby activities are intended for people who want to interact physically.

Examples:
- Looking for two people to play badminton.
- Coffee nearby?
- Anyone interested in a short cycling session?
- Let's play cricket.
- Looking for people to attend an event.

Nearby Drops should use explicit location permissions and approximate location visibility.

Users must never be forced to reveal their exact location.

## 3.2 Drop Lifecycle

Every Drop follows a lifecycle:

1. **Created:** A user publishes an activity.
2. **Discoverable:** Other users can see it.
3. **Active:** Users can join and interact.
4. **Full:** Maximum participant capacity is reached.
5. **Expired:** The activity's lifetime ends.
6. **Archived:** The Drop becomes unavailable for participation but can remain visible in the creator's activity history.

Expired Drops must never appear as active activities.

A full Drop may become joinable again if an existing participant leaves before expiration.

---

# 4. Core Product Features

## 4.1 Authentication and User Identity

Users should be able to register and log in through:

- Google authentication.
- Email authentication.
- Secure session management.

Each user should have a basic profile containing:

- Username.
- Display name.
- Profile picture or avatar.
- Short bio.
- Interests.
- Preferred activity categories.
- Optional location region.
- Account creation date.
- Participation history.
- Created Drops.

Profile creation should be quick and should not introduce unnecessary onboarding friction.

Users should be able to control what profile information is publicly visible.

## 4.2 Home – Live Activity Discovery

The home screen is the most important part of DropIn.

It should immediately communicate what is happening right now.

The user should see a continuously updated collection of discoverable Drops.

Suggested sections:

**Happening Now**
- Active Drops.
- Activities with available slots.
- Activities starting shortly.

**Recommended for You**
- Drops based on selected interests.
- Popular categories.
- Relevant activities.

**Popular Right Now**
- Activities with high participation.
- Trending discussions.
- Popular community events.

**Explore Categories**
- Gaming.
- Technology.
- Learning.
- Sports.
- Social.
- Discussions.
- Entertainment.
- Lifestyle.
- Other.

Users should be able to filter by:
- Online / Nearby.
- Category.
- Available slots.
- Starting soon.
- Popularity.
- Interest relevance.

Discovery must prioritize active and relevant activities over stale content.

## 4.3 Create a Drop

Creating a Drop should be extremely simple.

Required fields:
- Activity title.
- Short description.
- Category.
- Activity type.
- Maximum participants.
- Duration.

Optional fields:
- Scheduled start time.
- Cover image or emoji.
- Location for nearby activities.
- External meeting link.

The creation interface should be clean and fast.

Users should be able to publish an activity without filling out a lengthy form.

## 4.4 Join and Leave Activities

Users should be able to join an available Drop with a single action.

Requirements:
- Display participant count.
- Show participant avatars.
- Enforce maximum capacity.
- Prevent duplicate participation.
- Prevent joining expired Drops.
- Allow users to leave.
- Update participant counts in real time.
- Notify existing participants when appropriate.

Concurrent join operations must be handled safely. The database must remain the authoritative source for participant membership and capacity.

## 4.5 Real-Time Activity Chat

Each Drop should have a dedicated interaction space.

For the initial product experience, support text-based communication.

Features:
- Real-time messages.
- Message timestamps.
- Sender information.
- Participant join/leave events.
- Message history during the activity.
- Basic message reporting.
- User blocking.

The architecture should allow future support for voice rooms and other real-time interaction formats.

## 4.6 Shareable Invitation Links

Every Drop should have a unique, shareable URL.

Example:

`dropin.app/drop/unique-drop-id`

The link should:
- Open a public Drop landing page.
- Show activity details.
- Display remaining capacity.
- Allow authenticated users to join.
- Preserve the original Drop reference after login.
- Support sharing through WhatsApp, Discord, Reddit and other platforms.

This feature is important for organic user acquisition.

## 4.7 Notifications

The platform should support relevant notifications such as:

- Someone joined your Drop.
- Someone left your Drop.
- A Drop you joined is about to expire.
- A creator started an activity.
- An invitation was received.
- A participant sent a relevant update.

Notifications should be configurable and should not become spammy.

## 4.8 User Profiles and Social Connections

Users should be able to discover people through shared activities.

Profile functionality:
- View public profiles.
- See interests.
- View activity history where permitted.
- Connect or follow users.
- Block users.
- Report inappropriate behavior.

DropIn should prioritize meaningful participation over follower counts and popularity metrics.

## 4.9 Safety and Moderation

Safety is a core product requirement, especially because strangers can interact.

Include:
- Report Drop.
- Report user.
- Block user.
- Spam prevention.
- Rate limiting.
- Basic automated content checks.
- Creator controls.
- Restricted or private Drops.
- Appropriate moderation workflows.

For nearby activities:
- Never expose exact user coordinates publicly.
- Obtain explicit location permission.
- Display approximate areas rather than precise positions.
- Allow users to disable location-based discovery.
- Provide controls for invitations and visibility.

The platform should not facilitate harassment, stalking or unwanted contact.

---

# 5. Product Experience and User Interface

## 5.1 Design Philosophy

DropIn should look like a modern consumer technology product.

The design should be:
- Modern.
- Minimal.
- Premium.
- Visually engaging.
- Fast.
- Responsive.
- Easy to understand.
- Consistent across pages.

Avoid generic dashboard templates and outdated social media layouts.

The product should feel like a combination of a modern community application and a real-time discovery platform.

## 5.2 Design Theme

Use a polished visual identity with both light and dark modes.

**Brand personality:**
- Energetic.
- Friendly.
- Spontaneous.
- Modern.
- Youthful.
- Trustworthy.

### Primary visual direction

Use a violet / indigo accent system with subtle gradients.

Suggested design tokens:

| Element | Light Theme | Dark Theme |
|---|---|---|
| Background | `#FDF8F1` | `#14252C` |
| Surface | `#FFFFFF` | `#1C3038` |
| Secondary Surface | `#FBE9D0` | `#244855` |
| Primary Text | `#24343A` | `#FBE9D0` |
| Secondary Text | `#686D7A` | `#B5C5C3` |
| Primary Accent | `#244855` | `#90AEAD` |
| Accent Hover | `#193944` | `#B0C9C7` |
| Secondary Accent | `#E64833` | `#F05A45` |
| Tertiary Accent | `#874F41` | `#B07867` |
| Border | `#E9DED2` | `#354B52` |
| Success | `#16A36A` | `#36C98B` |
| Warning | `#E6A23C` | `#F3B74D` |
| Danger | `#E64833` | `#F06C59` |

Use CSS variables or design tokens so themes can be changed consistently.

### Typography

Suggested:
- Primary font: Inter.
- Alternative: Geist.
- Headings: Semibold or Bold.
- Body: Regular.
- Small labels: Medium.

Avoid excessively large text and unnecessary decorative typography.

### Component Design

Use:
- Rounded cards.
- Subtle borders.
- Soft shadows.
- Clean spacing.
- Consistent iconography.
- Smooth transitions.
- Clear button hierarchy.
- Minimal visual clutter.

Cards should communicate activity status and available capacity clearly.

### Light and Dark Theme

Both themes must be fully implemented.

Requirements:
- Theme toggle.
- Light mode.
- Dark mode.
- System preference detection.
- Persistent user preference.
- No flashing or incorrect theme during page loading.
- Correct contrast in both modes.
- Consistent colors across all components.

Dark mode must be designed intentionally rather than simply inverting light-mode colors.

## 5.3 Responsive Design

The platform should work smoothly on:

- Desktop browsers.
- Tablets.
- Mobile browsers.

The experience should be mobile-first even though the first release is a web application.

Important mobile requirements:
- Bottom navigation where appropriate.
- Touch-friendly controls.
- Responsive activity cards.
- Fast activity creation.
- Easy invitation sharing.
- No horizontal overflow.

## 5.4 Suggested Navigation

Desktop navigation:

- Home
- Explore
- Create Drop
- My Activities
- Notifications
- Profile

Mobile navigation:

- Home
- Explore
- Create
- Activity
- Profile

The Create Drop action should be visually prominent.

---

# 6. Technology Stack

## 6.1 Core Requirement

The entire initial application must be buildable, testable and deployable without requiring paid subscriptions.

Use open-source technologies and services with free plans.

Do not introduce:
- Paid AI APIs.
- Paid authentication services.
- Paid UI libraries.
- Paid database services.
- Paid hosting requirements.
- Mandatory premium developer tools.

Free-tier services have usage limits, and these limits may change. The application must remain portable so infrastructure can be changed without rewriting business logic.

## 6.2 Frontend

**Next.js + TypeScript**

Why:
- Modern React framework.
- Server-side rendering.
- SEO support.
- Strong ecosystem.
- Good developer experience.
- Suitable for scalable web applications.

Additional libraries:

| Purpose | Technology |
|---|---|
| UI | Tailwind CSS |
| Components | shadcn/ui |
| Icons | Lucide |
| Animations | Framer Motion |
| Forms | React Hook Form |
| Validation | Zod |
| Data fetching | TanStack Query |
| Client state | Zustand |
| Charts, if needed | Recharts |

Use accessible, reusable components rather than implementing every UI element independently.

## 6.3 Backend and Data Platform

**Supabase**

Recommended initial backend platform.

Use:
- PostgreSQL for relational data.
- Supabase Auth for authentication.
- Supabase Realtime for live updates.
- Row Level Security for authorization.
- Supabase Storage for profile pictures and optional assets.
- Edge Functions for server-side operations where appropriate.

Why Supabase:
- PostgreSQL-based.
- Open-source platform.
- Authentication included.
- Real-time capabilities.
- Database management.
- Generous free tier for initial development.

Business-critical operations must be validated server-side. Never trust client-provided participant counts, roles or ownership.

## 6.4 Optional Backend Service

**Go**

Go is a preferred option for future dedicated backend services.

Use it when the product requires more control over:
- Complex business logic.
- Real-time connection management.
- Custom WebSocket infrastructure.
- High-concurrency operations.
- Background processing.
- Independent API services.

Use Go with:
- Chi or Gin for HTTP routing.
- pgx for PostgreSQL.
- go-redis for Redis integration, if required.
- Gorilla WebSocket or a maintained alternative for WebSockets.

The initial deployment must not depend on a paid Go server.

Keep the core business logic modular so a dedicated Go API can be introduced without replacing the entire application.

## 6.5 Database

**PostgreSQL**

Primary relational database.

It should store:
- Users.
- Profiles.
- Interests.
- Drops.
- Drop participants.
- Messages.
- Notifications.
- User connections.
- Reports.
- Moderation records.

Use proper indexes, foreign keys, constraints and transactions.

Use UUIDs for primary identifiers where appropriate.

Avoid unnecessary database denormalization in the initial application.

## 6.6 Cache and Real-Time Support

**Supabase Realtime** should handle initial real-time features.

Optional:

**Upstash Redis**
- Temporary presence information.
- Caching.
- Rate limiting.
- Temporary activity metadata.
- Background coordination.

Redis must not replace PostgreSQL as the source of truth for memberships, ownership or activity capacity.

## 6.7 Deployment and Hosting

| Component | Suggested service | Cost |
|---|---|---|
| Frontend | Cloudflare Pages | Free tier |
| Database | Supabase | Free tier |
| Authentication | Supabase Auth | Included in free tier |
| Realtime | Supabase Realtime | Included in free tier |
| Storage | Supabase Storage | Free quota |
| Optional cache | Upstash Redis | Free tier |
| Source control | GitHub | Free |
| CI/CD | GitHub Actions | Free quota |
| Containerization | Docker | Free |
| UI deployment previews | Cloudflare Pages | Free tier |

The initial deployment should use Cloudflare Pages and Supabase, with optional Upstash integration.

A custom domain is not required. Use the free hosting subdomain initially.

Do not depend on a paid server or a credit-card-required service for essential functionality.

Note that free services are subject to quotas, inactivity policies, bandwidth limits and provider changes. In particular, Supabase free projects can pause after one week of inactivity. Cloudflare Pages has free build and asset limits. Upstash Redis has command, storage and bandwidth limits.

## 6.8 Development Tools

Recommended:
- VS Code.
- Git and GitHub.
- Docker.
- Postman or Bruno.
- ESLint.
- Prettier.
- Vitest.
- Playwright.
- Go testing package.
- Supabase CLI.

All core development tools should be available without paid licenses.

---

# 7. High-Level System Architecture

The architecture should be modular and maintainable.

### Main application layers

**Presentation Layer**
- Next.js frontend.
- Reusable UI components.
- Theme management.
- Responsive layouts.
- Client-side data management.

**Authentication Layer**
- Supabase Auth.
- Session management.
- User identity.
- Protected routes.

**Application Layer**
- Drop creation.
- Drop discovery.
- Participation management.
- Chat.
- Profiles.
- Notifications.
- Moderation.

**Data Layer**
- PostgreSQL.
- Relational constraints.
- Indexes.
- Row Level Security.

**Real-Time Layer**
- Supabase Realtime.
- Live participant updates.
- Chat messages.
- Activity status changes.

**Infrastructure Layer**
- Cloudflare Pages.
- Supabase.
- Optional Upstash Redis.
- GitHub.

### Architecture Principles

1. Keep the application modular.
2. Separate UI logic from business logic.
3. Keep database access organized.
4. Enforce authorization at the backend/database level.
5. Make real-time functionality resilient to reconnects.
6. Design APIs and database operations to be idempotent where appropriate.
7. Avoid unnecessary microservices.
8. Keep deployment simple and free.
9. Ensure the system can evolve toward dedicated Go services.
10. Never expose secret keys or service-role credentials to the frontend.

---

# 8. Core Data Model

The application should use a relational database.

Suggested entities:

### Users
- id
- email
- username
- display_name
- avatar_url
- bio
- created_at
- updated_at

### User Interests
- id
- user_id
- interest
- created_at

### Drops
- id
- creator_id
- title
- description
- category
- activity_type
- visibility
- max_participants
- status
- starts_at
- expires_at
- location_region
- created_at
- updated_at

### Drop Participants
- id
- drop_id
- user_id
- role
- joined_at
- left_at
- status

### Messages
- id
- drop_id
- sender_id
- content
- message_type
- created_at

### Notifications
- id
- user_id
- type
- title
- body
- related_drop_id
- is_read
- created_at

### User Connections
- id
- requester_id
- receiver_id
- status
- created_at

### Reports
- id
- reporter_id
- reported_user_id
- reported_drop_id
- reason
- description
- status
- created_at

The database design should include suitable indexes and constraints.

In particular:
- A user must not join the same Drop more than once.
- Participant capacity must be enforced transactionally.
- Expired Drops must not accept new participants.
- Only authorized participants should access private activity messages.
- Only authorized users should modify a Drop.
- Users should not be able to change their own privileges through client requests.

---

# 9. Product Quality Requirements

## Performance
- Fast initial page loading.
- Optimized images.
- Efficient database queries.
- Pagination for activity feeds.
- Minimal unnecessary API requests.
- Efficient real-time subscriptions.

## Reliability
- Handle dropped WebSocket connections.
- Reconnect gracefully.
- Avoid duplicate messages.
- Prevent duplicate participation.
- Handle concurrent activity joins safely.
- Ensure activity expiration is reliable.

## Security
- Validate all user input.
- Enforce authorization server-side.
- Use Row Level Security.
- Protect authentication sessions.
- Apply rate limiting.
- Prevent SQL injection and XSS.
- Protect against spam and abuse.
- Keep private information private.

## Accessibility
- Semantic HTML.
- Keyboard navigation.
- Appropriate contrast.
- Accessible labels.
- Screen-reader-friendly controls.
- Reduced-motion support.

## Maintainability
- Reusable components.
- Consistent naming conventions.
- Modular code.
- Type safety.
- Clear error handling.
- Environment-based configuration.
- Documented APIs.
- Automated testing for important business rules.

---

# 10. Product Differentiation

DropIn should be differentiated by its interaction model, not just its visual design.

### 1. Time-Bound Activities

Activities are temporary by design. The platform focuses on what is happening now rather than maintaining an endless archive of old posts.

### 2. Instant Participation

The primary user action should be joining an activity, not following someone or consuming content.

### 3. Online and Nearby Discovery

Users can participate globally or discover activities in their approximate physical area.

### 4. Interest-Based Discovery

Users should discover activities that match their interests without requiring an established social network.

### 5. Low-Friction Creation

Creating a Drop should take very little effort.

### 6. Organic Sharing

Each activity is independently shareable, allowing existing participants to invite new participants.

### 7. Real-Time Experience

The platform should reflect changing participant counts, activity availability and conversations without requiring manual refreshes.

---

# 11. Product Success Metrics

The product should be evaluated based on meaningful participation rather than registrations alone.

Important metrics include:

- Daily Active Users (DAU).
- Monthly Active Users (MAU).
- DAU/MAU ratio.
- D1, D7 and D30 retention.
- Drops created per day.
- Successful joins per day.
- Average participants per Drop.
- Percentage of Drops receiving at least one participant.
- Invite-link conversion rate.
- Repeat participation rate.
- User-generated activities per active user.

The most important product metric is:

**Successful participations per active user.**

A successful participation means a user joins an activity and meaningfully engages with it.

A large registration count without actual participation should not be considered product success.

---

# 12. Long-Term Product Vision

DropIn should evolve into a platform where people can find others for almost any activity.

Potential future capabilities include:

- Voice rooms.
- Video activities.
- Multiplayer integrations.
- Gaming integrations.
- Collaborative workspaces.
- Interest-based communities.
- Group challenges.
- Local events.
- Advanced recommendation systems.
- AI-powered activity suggestions.
- Community-hosted recurring activities.
- Creator-hosted experiences.

These are possibilities for the broader product vision, not requirements for the initial release.

The product should remain focused on spontaneous interaction rather than becoming a collection of unrelated features.

---

# 13. Instructions for AI Development Agents

The following principles should guide any AI coding agent working on DropIn.

1. Treat this document as the primary source of truth for product vision and requirements.
2. Understand the product before making architectural or implementation decisions.
3. Do not turn DropIn into a generic social media clone.
4. Prioritize real-time activity discovery and participation.
5. Maintain a consistent premium design language.
6. Implement both light and dark themes throughout the application.
7. Use TypeScript wherever applicable.
8. Use clean, modular and maintainable code.
9. Prefer free and open-source technologies.
10. Do not introduce paid APIs or mandatory paid infrastructure.
11. Never expose secrets, credentials or private user information.
12. Implement authorization and validation at the appropriate server/database layer.
13. Do not use mock data as a substitute for actual functionality in completed product features.
14. Clearly distinguish between implemented, partially implemented and planned functionality.
15. Keep the application responsive across desktop and mobile.
16. Add meaningful tests for critical business logic.
17. Keep technical documentation updated as the codebase evolves.
18. Do not implement unrelated features that dilute the central product concept.

## Documentation Expectations

Maintain a clear and current documentation structure within the repository.

Suggested documentation files:

- `README.md` – Product introduction, setup and project overview.
- `docs/PRODUCT_VISION.md` – Product vision and philosophy.
- `docs/REQUIREMENTS.md` – Functional and non-functional requirements.
- `docs/ARCHITECTURE.md` – System architecture and design decisions.
- `docs/DATABASE.md` – Schema, relationships, indexes and constraints.
- `docs/API.md` – API contracts and endpoint documentation.
- `docs/REALTIME.md` – Real-time events and subscription behavior.
- `docs/DESIGN_SYSTEM.md` – Colors, typography, components and themes.
- `docs/SECURITY.md` – Authentication, authorization, privacy and security rules.
- `docs/DEPLOYMENT.md` – Free-tier deployment instructions and environment configuration.
- `docs/DECISIONS.md` – Important technical decisions and their rationale.

Documentation must reflect the actual implementation. Do not document functionality as completed unless it exists and has been verified.

---

# 14. Final Product Statement

DropIn is a real-time social activity discovery platform built around a simple human need: finding someone to do something with, right now.

It removes the friction between wanting to participate in an activity and actually finding people to participate with.

Whether online or nearby, users can create temporary activities, discover others, join instantly and interact in real time.

It is not about accumulating followers, collecting likes or endlessly scrolling through content.

It is about participation.

**DROPIN — Don't plan. Just Drop In.**
