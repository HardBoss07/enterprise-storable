# Project Structure

```
enterprise-storable/
├── db/
│   ├── base-data.sql
│   ├── indexes.sql
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
│   │       │                   ├── config/
│   │       │                   │   └── JacksonConfig.java
│   │       │                   ├── controller/
│   │       │                   │   ├── AdminController.java
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
│   │                           │   ├── FileMetadataDto.java
│   │                           │   ├── GlobalSettingsDto.java
│   │                           │   ├── TrashMetadataDto.java
│   │                           │   └── UserDto.java
│   │                           ├── entity/
│   │                           │   ├── AccessPrivilege.java
│   │                           │   ├── FileNode.java
│   │                           │   ├── SystemSetting.java
│   │                           │   ├── User.java
│   │                           │   └── UserRole.java
│   │                           └── repository/
│   │                               ├── AccessPrivilegeRepository.java
│   │                               ├── FileNodePersistence.java
│   │                               ├── FileNodeRepository.java
│   │                               ├── SystemSettingRepository.java
│   │                               └── UserRepository.java
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
│   │                               ├── AdminService.java
│   │                               ├── AuthService.java
│   │                               ├── ConfigService.java
│   │                               ├── CustomUserDetailsService.java
│   │                               ├── FileService.java
│   │                               ├── FileServiceImpl.java
│   │                               ├── GlobalTimeProvider.java
│   │                               ├── LocalStorageService.java
│   │                               ├── StorageService.java
│   │                               └── TrashCleanupService.java
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
│   └── pom.xml
├── storage/
│   ├── 0c739db5-8341-4e5f-b639-01af13e12dc8
│   ├── 6c5106ff-54e6-4f8f-a159-85195763fc10
│   ├── 8ae365c8-b2dc-44d8-968f-05f3fc1fe097
│   ├── a92fffd8-8286-4ac3-8c90-5488b105587f
│   └── dffd5f1b-9b77-409a-a126-3be1e8e41351
├── web/
│   ├── app/
│   │   ├── admin/
│   │   │   ├── settings/
│   │   │   │   └── page.tsx
│   │   │   ├── users/
│   │   │   │   └── page.tsx
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── favorites/
│   │   │   └── page.tsx
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── recent/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   ├── trash/
│   │   │   └── page.tsx
│   │   ├── Providers.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── features/
│   │   │   ├── file-browser/
│   │   │   │   ├── Breadcrumbs.tsx
│   │   │   │   ├── FileBrowser.tsx
│   │   │   │   ├── FileList.tsx
│   │   │   │   ├── FileListItem.tsx
│   │   │   │   └── MoveModal.tsx
│   │   │   ├── recent/
│   │   │   │   ├── RecentTable.tsx
│   │   │   │   └── RecentTableRow.tsx
│   │   │   └── trash/
│   │   │       ├── RetentionSettings.tsx
│   │   │       ├── TrashTable.tsx
│   │   │       └── TrashTableRow.tsx
│   │   ├── icons/
│   │   │   └── FileIcon.tsx
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── shared/
│   │   │   ├── EmptyState.tsx
│   │   │   └── StatusBadge.tsx
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── IconButton.tsx
│   │       ├── PageContainer.tsx
│   │       └── Spinner.tsx
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   ├── ConfirmContext.tsx
│   │   └── ToastContext.tsx
│   ├── hooks/
│   │   ├── useFileBrowser.ts
│   │   └── useTrash.ts
│   ├── lib/
│   │   ├── api/
│   │   │   ├── admin.ts
│   │   │   ├── auth.ts
│   │   │   ├── client.ts
│   │   │   ├── file.ts
│   │   │   └── trash.ts
│   │   ├── file-constants.ts
│   │   ├── mock-data.ts
│   │   └── utils.ts
│   ├── public/
│   │   └── logo/
│   │       ├── icon.svg
│   │       └── logo.svg
│   ├── styles/
│   │   ├── base/
│   │   │   ├── reset.css
│   │   │   └── variables.css
│   │   ├── components/
│   │   │   ├── badges.css
│   │   │   ├── buttons.css
│   │   │   ├── inputs.css
│   │   │   ├── spinner.css
│   │   │   └── surfaces.css
│   │   ├── features/
│   │   │   ├── file-browser.css
│   │   │   └── trash.css
│   │   └── layouts/
│   │       └── main-layout.css
│   ├── types/
│   │   └── api/
│   │       ├── admin.ts
│   │       ├── auth.ts
│   │       ├── files.ts
│   │       ├── index.ts
│   │       └── trash.ts
│   ├── Dockerfile
│   ├── README.md
│   ├── eslint.config.mjs
│   ├── next.config.ts
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.mjs
│   └── tsconfig.json
├── Dockerfile.backend
├── File Colors.md
├── GEMINI.md
├── LICENSE
├── Project Structure.md
├── Refactoring Prompts.md
├── docker-compose.yml
├── pom.xml
├── run.ps1
└── run.sh
```