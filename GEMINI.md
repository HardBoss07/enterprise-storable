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

## Interactive Roadmap

> **Status:** Phase 2: Core File Management (In Progress) | **Last Updated:** 2026-03-04

### [ ] Phase 1: Infrastructure & Skeleton

- [x] Define multi-module Maven structure.
- [x] Configure Docker Compose (App + DB).
- [x] Implement `schema.sql` for `FileNode` (File/Folder metadata).
- [x] Frontend: Basic layout with Sidebar and Header.

### [ ] Phase 2: Core File Management (No-Auth)

- [x] **Service:** Local storage provider (Write/Read from disk).
- [x] **API:** Recursive folder creation.
- [x] **API:** File upload (Multipart) and Download.
- [x] **UI:** File Explorer grid/list view with navigation (breadcrumbs).

### [ ] Phase 3: Access Control & Permissions

- [ ] **Data:** Add `AccessPrivilege` table (VIEW, EDIT, OWNER).
- [ ] **Logic:** Logic to check permissions before returning `FileNode` data.
- [ ] **UI:** "Share" modal mock-up.

### [ ] Phase 4: Authentication & Security

- [ ] **Logic:** Implement JWT and User Session management.
- [ ] **Logic:** Secure all endpoints behind Spring Security.
- [ ] **UI:** Login/Register pages and Route Guards.

---

## Clarifications Needed

- **Current User Context:** Since we are skipping Auth, should I use a default `UUID` "0000-0000" to represent the "System/Guest" owner in the DB for now?
- **Recursive Deletion:** If a folder is deleted, should I implement immediate recursive deletion of physical files, or a "Trash" system?
- **Next.js Data Fetching:** Do you prefer standard `fetch` in Client Components or using Server Actions for file operations?

---

### How I will edit this file:

Whenever you ask me to "Implement X," my first task (if successful) is to run a `write_file` command to update the `[ ]` to `[x]` in the roadmap above and add any new technical decisions to the **Tech Stack** section.
