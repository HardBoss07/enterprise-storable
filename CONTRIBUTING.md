# Contributing to Storable

Contributions to Storable are **always** welcome\! To maintain the architectural integrity of the project, please adhere to these guidelines before submitting a Pull Request.

If you have questions or want to run an idea by the owner, reach out on Discord (**@m4tt3o**) or visit the [Contact Page](https://m4tt3o.dev/contact).

---

## 🏗 Architectural Principles (Hexagonal & DDD)

Storable follows a strict **Hexagonal Architecture**. All changes must respect the defined module boundaries:

- **`storable-api` (Driving Adapter):** Web logic only. Use Records for DTOs. Zero business logic.
- **`storable-core` (Domain/Application):** The "Source of Truth." Contains pure Java Domain Models and Service interfaces. **Strict Rule:** Never import from `data` or `api`.
- **`storable-data` (Driven Adapter):** Persistence logic only. Handles the mapping between JPA Entities and Core Domain Models.
- **`storable-common`:** Only for global constants and shared utilities.

## ☕ Modern Java Standards

Since we are using **Java 21**, all backend contributions must utilize modern features:

- **Data Carriers:** Use `record` for all DTOs and simple POJOs.
- **Pattern Matching:** Use `switch` expressions with pattern matching instead of complex `if-else` chains.
- **Hierarchies:** Use `sealed` interfaces for domain event structures or strict type hierarchies.
- **Collections:** Use `SequencedCollection` for any list where element order (e.g., file sorting) is significant.

## 🧹 Clean Code Rules

- **The 20-Line Rule:** If a method exceeds **20 lines**, it is considered "Fat." You must refactor it into private, descriptive, atomic sub-methods.
- **Injection:** Use **Constructor Injection** via Lombok's `@RequiredArgsConstructor`. The use of `@Autowired` on fields is strictly forbidden.
- **Naming:** \* Use `PascalCase` for Components, Interfaces, and Classes.
  - Use `camelCase` for variables and functions.
- **Documentation:** Every public/exported method **requires** a concise one-line JavaDoc/JSDoc summary explaining its purpose, parameters, and return value.

## 🛠 Workflow & Tooling

1.  **Strict Typing:** Frontend code must be strictly typed. The use of `any` is prohibited.
2.  **Documentation:** Update [Project Structure.md](./Project%20Structure.md) if you add, move, or delete files.
3.  **Formatting:** Before committing, run the following command to ensure uniform styling:
    ```bash
    ./run.sh format
    ```
