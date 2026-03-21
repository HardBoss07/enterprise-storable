# GEMINI.md: The Storable Manifest

This file is the **Source of Truth** for the project. Every session should begin by reading this file.

## Project Identity

**Storable** is a self-hosted, Google Drive-style cloud storage platform.

- **Goal:** A high-performance, private file management system.
- **Unique Logic:** Virtual file system stored in MySQL; physical files stored on disk.
- **Storage Rule:** Files are **never** BLOBs. The DB stores `path` references.

---

## Tech Stack & Architecture

### Backend (Spring Boot 3.x - Multi-module)

- `storable-api`: REST layer. **Rule:** Controllers must be thin.
- `storable-core`: Services & DTOs. **Rule:** All business logic lives here.
- `storable-data`: JPA Entities & Repositories.
- **Persistence:** MySQL 8.0.
- **Auth Strategy:** Phase 1-3 uses a fixed Guest UUID (`00000000-0000-0000-0000-000000000000`) for data ownership, toggleable in `StorableAuthConfig`.

### Frontend (Next.js 16 - App Router)

- **Language:** TypeScript.
- **Styling:** Tailwind CSS + Lucide Icons (for file/folder icons).
- **UI Components:** Modular, functional-first.
- **Component Structure:** **Atomic Composition.** Use "Components of Components" (e.g., a `FileList` is composed of `FileRow`, which is composed of `FileIcon`, `FileName`, and `ActionMenu`). Avoid large, monolithic component files.
- **Data Fetching:** **Server Actions** for mutations (create, rename, delete); **Client-side Fetching** for navigation and viewing.

### Infrastructure

- **Containerization:** Docker & Docker Compose.
- **File Volume:** `./storage` on host → `/app/storage` in container.

---

## AI Behavioral Rules (CLI Guidelines)

1. **Functionality Before Auth:** Build the UI and the "plumbing" (upload/download/folders) first. Authentication logic is deferred to Phase 4.
2. **Self-Updating Documentation:** After completing a significant feature, **I must update the "Implementation Progress" section below** by marking tasks as `[x]` and updating the "Last Updated" timestamp.
3. **Modular Coding:** When generating Java code, always respect the three-module split.
4. **No Assumptions:** If a path, naming convention, or logic flow is unclear, I will list it in the **"Clarifications Needed"** section and wait for user input.

---

## Development & Refactoring Standards

### 1. General Code Quality (All Layers)

- **Atomic Functions:** Every function/method must perform exactly **one** discrete task. If a logic block exceeds 20 lines, it must be refactored into sub-methods.
- **Self-Documentation:** _ **Java:** Every public method requires a concise, one-line Javadoc (`/\*\* ... _/`).
- **TypeScript:** Every exported component/utility requires a one-line JSDoc comment.

- **Naming:** Use descriptive, "verb-first" names (e.g., `executeFileDeletion` instead of `delete`).
- **Clean Transitions:** Never leak Implementation/Database Entities to the Frontend; always map to Records/DTOs.

### 2. Java (Spring Boot 3.2.2 + Java 21) Standards

- **Modern Features:** Use **Java 21** syntax: **Records** for all DTOs, **Pattern Matching** for `switch`, and `SequencedCollections` where applicable.
- **Dependency Injection:** Use **Constructor Injection** via Lombok's `@RequiredArgsConstructor`. **Field injection (`@Autowired`) is strictly forbidden.**
- **Virtual Threads:** Since we are on Java 21, prefer `Executors.newVirtualThreadPerTaskExecutor()` for blocking I/O operations (like disk writes).
- **Module Scopes & Boundaries:**
- **`storable-api` (The Gateway):** Handles REST controllers and `@RestControllerAdvice`. **Logic-free zone.**
- **`storable-core` (The Brain):** Contains `@Service` classes and business logic. This is the only module that understands the "Virtual File System."
- **`storable-data` (The Library):** Contains `@Entity` classes (MySQL) and Spring Data Repositories. It provides data to `core` but is isolated from the Web layer.

### 3. Frontend (Next.js 16 + Tailwind) Standards

- **Strict Atomic Design:** UI is built from stateless **Atoms** (`ui/`), combined into **Molecules** (`shared/`), and orchestrated by **Organisms** (`features/`).
- **Logic Extraction:** All state, effects, and complex data handling are extracted into custom **Hooks**.
- **Data Layer:** API calls are isolated in `lib/api/` and consumed via hooks or server actions.
- **Tailwind Refactoring:** Repetitive styles are handled via centralized CSS or the `cn()` utility (clsx + tailwind-merge).
- **Type Safety:** Strict TypeScript interfaces for all props. No `any`.
- **Self-Documentation:** Every exported component, hook, or utility requires a JSDoc block.

---

## Interactive Roadmap

> **Status:** Phase 10: User Onboarding & Branding (In Progress) | **Last Updated:** 2026-03-21

### [x] Phase 1: Infrastructure & Skeleton

- [x] Define multi-module Maven structure.
- [x] Configure Docker Compose (App + DB).
- [x] Implement `schema.sql` for `FileNode` (File/Folder metadata).
- [x] Frontend: Basic layout with Sidebar and Header.

### [x] Phase 2: Core File Management (No-Auth)

- [x] **Service:** Local storage provider (Write/Read from disk).
- [x] **API:** Recursive folder creation.
- [x] **API:** File upload (Multipart) and Download.
- [x] **UI:** File Explorer grid/list view with navigation (breadcrumbs).
- [x] **Feature:** Rename files/folders with extension preservation.
- [x] **Feature:** Smart Duplicate with collision avoidance.
- [x] **Feature:** Move files/folders with circular reference protection and search-to-move UI.
- [x] **Feature:** Recent Files (5 most recently modified files) - UI Synced with Trash.

### [x] Phase 3: Base File Structure (Virtual Pathing) - DEFERRED

- [x] **Logic:** Implement `UserHome` resolution logic (Maps `UUID` to `/{username}`).
- [x] **Security:** Implement "Jailbreak" prevention (Ensure users cannot navigate `..` or traverse above their assigned home directory).
- [x] **Admin Privileges:** Define `IsAdmin` flag for the Guest UUID to allow global directory traversal.
- [x] **API:** Update File Discovery endpoints to default to the User's home directory instead of the system root.

### [x] Phase 4: Authentication & Security

- [x] **Logic:** Implement JWT and User Session management.
- [x] **Logic:** Secure all endpoints behind Spring Security.
- [x] **UI:** Login/Register pages and Route Guards.
- [x] **Password:** BCrypt for hashing.
- [x] **Registration:** Automated 'Home Directory' creation for new users.

### [x] Phase 5: Access Control & Permissions

- [x] **Logic:** Implement Soft Delete (Trash) system with recursive deletion and restoration.
- [x] **Logic:** Background task for trash cleanup.
- [x] **UI:** Delete action in File Explorer.
- [x] **Admin:** Comprehensive Admin Panel for User Management and Global Settings.
- [x] **Logic:** Implement Global Time Offset solution (UTC to Local Time display).
- [x] **Data:** Implement the `AccessPrivilege` schema to support granular sharing (VIEW, EDIT, OWNER).
- [x] **Logic:** Logic to check permissions before returning `FileNode` data.
- [x] **UI:** "Share" modal mock-up.

### [x] Phase 6: Design System & Global UI Refinement

- [x] **Styling:** Define CSS variables for `primary` (Neon Pink), `accent` (Yellow), and `neutral-surface` weights in `globals.css`.
- [x] **Components:** Create a `PageContainer` atomic component to standardize margins, paddings, and responsive behavior.
- [x] **Refactor:** Audit existing components to remove inline styles and implement the new color palette and Lucide icon set globally.
- [x] **Feedback:** Implement standardized Toast notifications for success/error states using the primary/accent theme.

### [x] Phase 7: Advanced Discovery & Organization

- [x] **Logic:** Add `is_favorite` (boolean) to the `nodes` table in `storable-data`.
- [x] **API:** Create `PATCH /api/files/{id}/favorite` and `GET /api/files/favorites` endpoints.
- [x] **UI:** Add "Favorites" tab to Sidebar; implement "Jump to Location" logic when clicking a file in Recent/Favorites.
- [x] **Search:** Implement a global search bar in the Header with debounced API calls to filter the user's `FileNodes`.
- [x] **Public Space:** Initialize a "Public" root-level folder with universal `VIEW/EDIT` permissions for all authenticated users.

### [x] Phase 8: Social Sharing & Permissions

- [x] **Data:** Implement the `AccessPrivilege` schema to support granular sharing (VIEW, EDIT, OWNER).
- [x] **Logic:** Develop the sharing engine—allowing users to lookup other users by email/username and assign specific rights to a `FileNode`.
- [x] **UI:** Build the "Share" modal with user search and a permission toggle list.
- [x] **Validation:** Ensure the backend enforces these permissions on every CRUD operation.

### [x] Phase 9: User Profile & Account Lifecycle

- [x] **UI:** Create a "Settings" page accessible from the Header/Sidebar.
- [x] **Feature:** Implementation of "Change Password" (with current password verification) and "Change Email" flows.
- [x] **Security:** Implement the "Nuclear Option" - a "Delete Account" flow that recursively wipes the user's database entries and physical `/storage` directory after a "Confirm Password" warning.

### [ ] Phase 10: User Onboarding & Branding

- [ ] **UI:** Create a high-conversion Landing Page at `/` featuring project info, feature showcases (dummy components), and a prominent Login CTA.
- [ ] **Navigation:** Move the existing File Explorer/Dashboard to `/home`.
- [ ] **Logic:** Implement "First Login" interceptor. If `user.password == 'root'`, redirect to a mandatory `/setup/change-password` flow.
- [ ] **Footer:** Standardize global footer with Creator links and GitHub repository integration.

### [ ] Phase 11: Admin Control & Session Management

- [ ] **Logic:** Implement a Session Registry in `storable-core`.
- [ ] **API:** `POST /api/admin/sessions/revoke-all` (Logic: Invalidate all JWTs/Sessions except for UID `root`).
- [ ] **UI:** Add "Nuclear Session Reset" button to the Admin Panel.

### [ ] Phase 12: Self-Hosting & Portability (The "Final Wrap")

- [ ] **Config:** Refactor Spring Boot to use `${ENV_VAR}` mapping for all `application.yaml` properties, ensuring 100% `.env` driven configuration.
- [ ] **Docker:** Multi-stage `Dockerfile` to compile Java and Next.js into a single, optimized production image.
- [ ] **Documentation:** Create a `docker-compose.yml` template and "One-Click" setup guide for Portainer/Nginx Proxy Manager users.

---

## Technical Decisions & Architecture (Updated)

### Circular Dependency Resolution

- **Shared Module:** Created `storable-common` to hold DTOs, Entities, and shared Interfaces.
- **Dependency Flow:** `storable-api` -> `storable-core` -> `storable-common` and `storable-api` -> `storable-data` -> `storable-common`. This breaks the cycle between `core` and `data`.

### Database Schema Alignment

- **Table Names:** Unified all SQL and Java Entities to use `users` and `nodes` table names.
- **Column Mapping:** Ensured `User` entity matches `users` table (`id`, `username`, `email`, `password`, `role`).
- **Initialization:** Fixed `test-data.sql` to use correct column names (`password`, `role`) instead of deprecated/incorrect ones.

### User Registration & Home Directory

- **Automation:** Implemented a transactional registration flow that creates a user in `users` and their corresponding home folder in `nodes` (named after the username, parented to Root ID 1).
- **Recent Files:** Added `GET /api/files/recent` to fetch the 5 most recently modified files for the current user. UI synced with Trash page design.

### Social Sharing & Permissions (Phase 8)

- **Engine:** Implemented `SharingService` to handle granular permissions (VIEW, EDIT, OWNER) with recursive inheritance (children inherit parent permissions).
- **UI:** Added "Shared with me" section and a "Share" modal with user lookup (by email/username) and permission management.
- **Validation:** Updated `FileService` to enforce permissions on all CRUD operations using the sharing engine.

### Strict Atomic Design System Refactor

- **Architecture:** Transitioned to a "Strict Atomic Design System" to ensure modularity, scalability, and strict separation of concerns.
- **Organization:**
  - **Atoms (`components/ui/`):** Stateless, single-purpose primitives like `Button`, `IconButton`, `FileIcon`, `Spinner`.
  - **Molecules (`components/shared/`):** Combinations of 2-3 UI primitives like `SearchBar`, `Breadcrumbs`, `UserMenu`, `StatusBadge`.
  - **Organisms (`components/features/`):** Complex, domain-specific UI blocks like `FileBrowser`, `RecentTable`, `SettingsContainer`, `TrashTable`, and layout components (`Header`, `Sidebar`, `Footer`).
- **Logic Separation:** Fully decoupled business logic from the UI layer using specialized custom **Hooks** (e.g., `useSearch`, `useMoveModal`, `useShareModal`, `useFileListItem`, `useSettings`).
- **Standardization:** Implemented a global `cn()` utility for robust Tailwind class merging and enforced JSDoc documentation for all exported members to ensure maintainability.

---

## Clarifications Needed

- **Current User Context:** Since we are skipping Auth, should I use a default `UUID` "0000-0000" to represent the "System/Guest" owner in the DB for now?
- **Recursive Deletion:** If a folder is deleted, should I implement immediate recursive deletion of physical files, or a "Trash" system?
- **Next.js Data Fetching:** Do you prefer standard `fetch` in Client Components or using Server Actions for file operations?

---

### How I will edit this file:

Whenever you ask me to "Implement X," my first task (if successful) is to run a `write_file` command to update the `[ ]` to `[x]` in the roadmap above and add any new technical decisions to the **Tech Stack** section.

---

## Current Issues:

- [x] Guest User still gets created but no file entires for guest user are created
- [x] Downloading doesn't work, gives me a 403 Error
- [x] Upload of larger files gets a NET::CONNECTION_ABORTED error with "Maximum upload size exceeded" (about limit of 1K)
- [x] On shared files the options (deleting, moving etc) are still visible, but when trying to delete something i have only view privileges to it doesnt actually delete
- [x] Each modal / popup should be cancellable by pressing 'Esc' which doesnt perform anything and just returns to the previous state
- [x] Nodes directly below root shouldnt be able to be moved or renamed
- [x] Clear distictions on what privildges differences there are between "FULL ACCESS", "READ", "EDIT" inside UI
- [x] Search bar for root user (all with ADMIN role) doesnt work since search bar searches based off what is owned, not what is visible to user
- [x] Folder Color should be the accent yellow
- [x] Remove italics from all frontend stuff
- [x] Use brand colors during login / registration process
- [x] Search bar should be hidden if no one is logged in
