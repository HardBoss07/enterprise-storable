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

- **Atomic Composition:** Build UI from small, stateless atoms. Avoid "Mega-Components."
- **Tailwind Refactoring:** Consolidate repetitive Tailwind strings into centralized CSS classes in `globals.css` using `@apply` for high-frequency patterns.
- **Type Safety:** Strict TypeScript. Use `interface` for API contracts and `type` for internal shapes. No `any`.
- **Logic Extraction:** Complex UI state or data processing must be moved into custom `hooks` or `utils`.

---

## Interactive Roadmap

> **Status:** Phase 5: Access Control & Permissions (In Progress) | **Last Updated:** 2026-03-14

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
- [ ] **Data:** Add `AccessPrivilege` table (VIEW, EDIT, OWNER).
- [ ] **Logic:** Logic to check permissions before returning `FileNode` data.
- [ ] **UI:** "Share" modal mock-up.

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
