# Project Structure

```
enterprise-storable/
├── db/
│   ├── schema.sql
│   └── test-data.sql
├── storable-api/
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── dev/
│   │       │       └── m4tt3o/
│   │       │           └── storable/
│   │       │               └── api/
│   │       │                   ├── controller/
│   │       │                   │   ├── AuthController.java
│   │       │                   │   └── FileController.java
│   │       │                   ├── exception/
│   │       │                   │   └── GlobalExceptionHandler.java
│   │       │                   ├── request/
│   │       │                   │   ├── CreateFolderRequest.java
│   │       │                   │   └── RecursiveFolderRequest.java
│   │       │                   ├── security/
│   │       │                   │   ├── JwtAuthenticationFilter.java
│   │       │                   │   └── SecurityConfig.java
│   │       │                   └── StorableApiApplication.java
│   │       └── resources/
│   │           └── application.yml
│   ├── target/
│   └── pom.xml
├── storable-common/
│   ├── src/
│   │   └── main/
│   │       └── java/
│   │           └── dev/
│   │               └── m4tt3o/
│   │                   └── storable/
│   │                       └── common/
│   │                           ├── dto/
│   │                           │   └── FileMetadataDto.java
│   │                           ├── entity/
│   │                           │   ├── FileNode.java
│   │                           │   └── User.java
│   │                           └── repository/
│   │                               ├── FileNodePersistence.java
│   │                               ├── FileNodeRepository.java
│   │                               └── UserRepository.java
│   ├── target/
│   └── pom.xml
├── storable-core/
│   ├── src/
│   │   └── main/
│   │       └── java/
│   │           └── dev/
│   │               └── m4tt3o/
│   │                   └── storable/
│   │                       └── core/
│   │                           ├── config/
│   │                           │   ├── CoreSecurityConfig.java
│   │                           │   └── StorageProperties.java
│   │                           ├── dto/
│   │                           │   ├── AuthRequest.java
│   │                           │   ├── AuthResponse.java
│   │                           │   └── RegisterRequest.java
│   │                           ├── security/
│   │                           │   ├── CustomUserDetails.java
│   │                           │   └── JwtService.java
│   │                           └── service/
│   │                               ├── AuthService.java
│   │                               ├── CustomUserDetailsService.java
│   │                               ├── FileService.java
│   │                               ├── FileServiceImpl.java
│   │                               ├── LocalStorageService.java
│   │                               └── StorageService.java
│   ├── target/
│   └── pom.xml
├── storable-data/
│   ├── src/
│   │   └── main/
│   │       └── java/
│   │           └── dev/
│   │               └── m4tt3o/
│   │                   └── storable/
│   │                       └── data/
│   │                           └── service/
│   │                               └── FileNodePersistenceImpl.java
│   ├── target/
│   └── pom.xml
├── storage/
│   ├── 0c739db5-8341-4e5f-b639-01af13e12dc8
│   ├── 6c5106ff-54e6-4f8f-a159-85195763fc10
│   ├── 8ae365c8-b2dc-44d8-968f-05f3fc1fe097
│   ├── a92fffd8-8286-4ac3-8c90-5488b105587f
│   └── dffd5f1b-9b77-409a-a126-3be1e8e41351
├── web/
│   ├── app/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── recent/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   ├── trash/
│   │   │   └── page.tsx
│   │   ├── Providers.tsx
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── file-browser/
│   │   │   ├── Breadcrumbs.tsx
│   │   │   ├── FileBrowser.tsx
│   │   │   ├── FileList.tsx
│   │   │   └── FileListItem.tsx
│   │   ├── icons/
│   │   │   └── FileIcon.tsx
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Header.tsx
│   │   │   └── Sidebar.tsx
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── IconButton.tsx
│   │       └── Spinner.tsx
│   ├── context/
│   │   └── AuthContext.tsx
│   ├── hooks/
│   │   └── useFileBrowser.ts
│   ├── lib/
│   │   ├── api.ts
│   │   ├── mock-data.ts
│   │   └── utils.ts
│   ├── public/
│   ├── types/
│   │   └── FileNode.ts
│   ├── Dockerfile
│   ├── README.md
│   ├── eslint.config.mjs
│   ├── next.config.ts
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.mjs
│   └── tsconfig.json
├── Dockerfile.backend
├── GEMINI.md
├── LICENSE
├── Project Structure.md
├── Refactoring Prompts.md
├── docker-compose.yml
├── pom.xml
├── run.ps1
└── run.sh
```