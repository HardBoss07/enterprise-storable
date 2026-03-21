# Refactoring Prompts

## 1. Frontend Prompt

**Context:** Next.js 16 (App Router), TypeScript, Tailwind CSS, Lucide Icons.
**Goal:** Convert the provided code into a Strict Atomic Design System while maintaining 100% functional parity.

### 1. Architectural Mandates

**App Router Constraints:** Default to React Server Components (RSC). Only add `"use client"` directives at the top of files that strictly require interactivity (`useState`, `useEffect`, event listeners).
**Atoms (`components/ui/`):** Stateless, single-purpose primitives (Buttons, Inputs, Icons). No business logic.
**Molecules (`components/shared/`):** Combinations of 2-3 UI primitives (SearchField, FileBreadcrumb). Used across the app.
**Organisms (`components/features/`):** Complex, domain-specific UI blocks (Sidebar, FileGrid, UploadModal).
**Layer Separation - UI Layer:** Purely declarative TSX.
**Layer Separation - Logic Layer:** Extract all state, effects, and data-handling into custom `hooks/`.
**Layer Separation - Data Layer:** Extract all `fetch` or Next.js Server Actions into `services/` or `lib/`.

### 2. Code Quality & Formatting

**Naming Conventions:** Use PascalCase for components/interfaces. Use camelCase for functions/variables. Functions must be "Verb-First" (e.g., `handleFileSelect`).
**Tailwind Refactor:** Avoid `@apply` and long inline strings. Extract complex conditional Tailwind classes using a `cn()` utility function (clsx + tailwind-merge) or a class-variance-authority (`cva`) setup.
**Strict Typing:** No `any`. Use strict `interface` definitions for component props. Use `type` only for unions or utility intersections.
**Documentation:** Every exported member must have a JSDoc block detailing its purpose and parameters.

### 3. Strict Constraints

**Visual Parity:** Do not change the visual output, spacing, or layout by even 1 pixel.
**Modularity:** One file per component. Do not define "Helper Components" at the bottom of a main file; extract them into their own files if they are distinct elements.

## 2. Backend Prompt

**Context:** Spring Boot 3.2.2, Java 21, MySQL, Multi-module Maven.
**Goal:** Refactor the `storable` backend modules to enforce strict Hexagonal Architecture and Domain-Driven Design (DDD) principles.

### 1. Module Boundary Enforcement

**`storable-api` (Driving Adapter):** Restricted to `@RestController`, `@ExceptionHandler`, and Request/Response Records. Maps Domain Models to DTOs. Zero business logic.
**`storable-core` (Domain/Application):** The "Source of Truth." Contains `@Service` interfaces, implementations, and pure Java Domain Models. It must never import a class from the `data` or `api` modules.
**`storable-data` (Driven Adapter):** Restricted to `@Entity`, `JpaRepository`, and Query logic. Responsible for mapping JPA Entities to Core Domain Models.
**`storable-common`:** The only globally accessible module. Contains `GlobalConstants`, `BaseExceptions`, and `SharedUtils`.

### 2. Modern Java Standards

**Data Carriers:** Convert all DTOs and simple POJOs to Java Records.
**Advanced Control Flow:** Utilize `switch` expressions with pattern matching over `if-else` chains.
**Domain Modeling:** Use `sealed` interfaces for domain events or strict hierarchical structures.
**Collections:** Use `SequencedCollection` for maintaining file/folder order predictability.
**Dependency Injection:** Use Constructor Injection via `@RequiredArgsConstructor`. Strictly forbid `@Autowired` on fields.

### 3. Clean Code Rules

**The 20-Line Rule:** If a method exceeds 20 lines, it is "Fat." Refactor into private, descriptive, atomic sub-methods.
**Mapping Protocol:** Entities must be mapped to Core Domain Models in the `data` layer. The `core` layer processes Domain Models. The `api` layer maps Domain Models to DTOs.
**Exception Strategy:** Throw custom, business-specific exceptions from `core` (e.g., `FileNotFoundException`) and map them to HTTP status codes in `api` via `@RestControllerAdvice`.
**Documentation:** Every public method requires a concise one-line summary in `/** ... */` format.

### 4. Strict Constraints

**API Integrity:** Do not change existing REST endpoint paths, methods, or JSON payload structures.
**Persistence Parity:** Do not alter the MySQL schema or `@Table` mappings unless strictly necessary to correct an explicit bug.

## Backend Alternative

**Role:** Expert Java 21 / Spring Boot Refactoring Engine.
**Protocol:** **ITERATIVE_REFACTOR_V1**

**1. State Initialization:**
Before writing any code, look for a block titled `### REFACTORING_STATE`. If it does not exist, create it. If it does exist, read the `Last_File_Processed` and `Current_Module` fields.

**2. Execution Logic:**

- **Identify:** Look at the provided file list. Find the first file marked `[PENDING]` in the current module.
- **Refactor:** Apply all Hexagonal/DDD and Java 21 rules (Records, Sealed, 20-line rule, Constructor Injection) to that specific file.
- **Map:** If the file is a Data Entity, automatically generate the corresponding Domain Model and Mapper in the response.
- **Update State:** Output a new `### REFACTORING_STATE` block at the end of the response with the updated progress.

**3. Output Format:**

1.  **Refactored Code:** [The code for the current file]
2.  **Supporting Files:** [Mappers/Records if needed]
3.  **Updated State Block:**

    ```markdown
    ### REFACTORING_STATE

    - **Current Module:** [Module Name]
    - **Last File Processed:** [Filename]
    - **Status:** [Percentage or Next File to target]
    - **Patterns Applied:** [List of Java 21 features used]
    ```

**4. Constraints:**

- Do not refactor more than 1-2 files per turn to avoid context cutoff.
- Strictly follow the "Source of Truth" rule (Core cannot see Data/API).

### How to use this for "Zero Context" sessions:

1.  **First Session:** Paste the prompt above + your list of files.
2.  **AI Response:** It refactors File A and gives you the `REFACTORING_STATE` block.
3.  **Next Session:** Paste the prompt above + the `REFACTORING_STATE` block from the previous turn + the next batch of files.

### Why this works:

- **Memory Injection:** The `REFACTORING_STATE` block acts as a "save game" file. You don't have to explain where you left off; the AI reads its own status report.
- **Pattern Persistence:** By listing the "Patterns Applied," the AI reminds itself to keep using `sealed` interfaces and `Records` without you needing to repeat those instructions.
- **Chunking:** It prevents the AI from trying to refactor 50 files at once and failing halfway through.
