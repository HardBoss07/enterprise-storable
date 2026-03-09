# Refactoring Prompts

## 1. Frontend Prompt

**Context:** Next.js 16 (App Router), TypeScript, Tailwind CSS, Lucide Icons.

**Role:** You are a Senior Frontend Architect. Your goal is to convert the provided code into a **Strict Atomic Design System** while maintaining 100% functional parity.

### 1. Architectural Mandates (The "How")

- **Atomic Hierarchy:** \* `components/atoms`: Stateless, single-purpose UI (Buttons, Inputs, Icons). No business logic.
- `components/molecules`: Combinations of 2-3 atoms (SearchField, FileBreadcrumb).
- `components/organisms`: Complex UI blocks (Sidebar, FileGrid, UploadModal).

- **Layered Separation:** \* **UI Layer:** Purely declarative JSX.
- **Logic Layer:** Extract all `useState`, `useEffect`, and data-handling into custom `hooks/`.
- **Data Layer:** Extract all `fetch` or `Server Actions` into `services/` or `lib/`.

### 2. Code Quality & Formatting

- **Naming:** Use **PascalCase** for components/interfaces and **camelCase** for functions/variables. Functions must be "Verb-First" (e.g., `handleFileSelect`).
- **Tailwind Refactor:** Abstract complex Tailwind strings (e.g., `flex items-center justify-between p-4 bg-slate-50...`) into a `const CLASSES` object within the file or a `@apply` rule if used in 3+ files.
- **Documentation:** Every exported member **must** have a JSDoc block:

```typescript
/** * Handles the recursive deletion of virtual file nodes.
 * @param nodeIds - Array of UUIDs to be deleted.
 */
```

- **No "Any":** Use strict `interface` definitions. Use `type` only for unions or utility intersections.

### 3. Constraints

- **Purity:** Do not change the visual output by even 1 pixel.
- **Modularity:** One file per component. No "Helper Components" defined at the bottom of a main file.

## 2. Backend Prompt

**Focus:** Spring Boot 3.2.2, Java 21, and Multi-Module Decoupling.

**Role:** Senior Java Software Architect (Java 21 & Spring Boot 3.2.2 Specialist).

**Task:** Refactor the `storable` backend modules to enforce strict hexagonal-style boundaries.

**Module-Specific Rules:**

**Context:** Java 21, Spring Boot 3.2.2, MySQL, Multi-module Maven.

**Role:** You are a Principal Java Architect. Your mission is to enforce **Hexagonal Architecture** and **Domain-Driven Design (DDD)** principles across the `storable` modules.

### 1. Module Boundary Enforcement

- **`storable-api`:** Restricted to `@RestController`, `@ExceptionHandler`, and `Request/Response` Records. **Zero business logic.**
- **`storable-core`:** The "Source of Truth." Contains `@Service` interfaces and implementations. It must never import a class from the `data` module.
- **`storable-data`:** Restricted to `@Entity`, `JpaRepository`, and Query logic.
- **`storable-common`:** The only module allowed to be imported by everyone. Contains `GlobalConstants`, `BaseExceptions`, and `SharedUtils`.

### 2. Modern Java 21 Standards

- **Data Carriers:** Convert all DTOs and simple Pojos to **Records**.
- **Logic Flow:** Favor `switch` expressions with pattern matching over `if-else` blocks.
- **Collections:** Use `SequencedCollection` (Java 21) for maintaining file/folder order.
- **DI Pattern:** Use **Constructor Injection** via `@RequiredArgsConstructor`. Remove all `@Autowired` annotations from fields.

### 3. Clean Code Rules

- **The 20-Line Rule:** If a method exceeds 20 lines, it is "Fat." Refactor into private "Atomic" sub-methods with descriptive names.
- **Mapping:** Entities must be converted to DTOs in the `data` layer (using MapStruct or manual mappers) before reaching the `core` layer.
- **Javadoc:** Every public method requires a one-line summary in `/** ... */` format.
- **Exception Strategy:** Throw custom exceptions from `core` (e.g., `FileNotFoundException`) and map them to HTTP status codes in `api` via `@RestControllerAdvice`.

### 4. Constraints

- **API Integrity:** Do not change existing REST endpoints or JSON structures.
- **Persistence:** Do not alter the MySQL schema or `@Table` mappings unless correcting a bug.
