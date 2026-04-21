# Project Structure

```
enterprise-storable/
├── db/
│   ├── base-data.sql
│   ├── indexes.sql
│   ├── schema.sql
│   └── test-data.sql
├── node_modules/
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
│   │       │                   │   ├── AdminSessionController.java
│   │       │                   │   ├── AuthController.java
│   │       │                   │   ├── FileController.java
│   │       │                   │   ├── SharingController.java
│   │       │                   │   └── UserController.java
│   │       │                   ├── exception/
│   │       │                   │   └── GlobalExceptionHandler.java
│   │       │                   ├── mapper/
│   │       │                   │   └── FileApiMapper.java
│   │       │                   ├── request/
│   │       │                   │   ├── ChangeEmailRequest.java
│   │       │                   │   ├── ChangePasswordRequest.java
│   │       │                   │   ├── CreateFolderRequest.java
│   │       │                   │   ├── DeleteAccountRequest.java
│   │       │                   │   ├── RecursiveFolderRequest.java
│   │       │                   │   └── ShareRequest.java
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
│   │                           │   ├── AccessPrivilegeDto.java
│   │                           │   ├── FileMetadataDto.java
│   │                           │   ├── GlobalSettingsDto.java
│   │                           │   ├── TrashMetadataDto.java
│   │                           │   ├── UserDto.java
│   │                           │   └── UserLookupDto.java
│   │                           ├── entity/
│   │                           │   ├── PrivilegeLevel.java
│   │                           │   ├── SystemSetting.java
│   │                           │   └── UserRole.java
│   │                           ├── exception/
│   │                           │   ├── ErrorCode.java
│   │                           │   └── ErrorResponse.java
│   │                           └── repository/
│   │                               └── SystemSettingRepository.java
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
│   │                           ├── domain/
│   │                           │   ├── AccessPrivilege.java
│   │                           │   ├── File.java
│   │                           │   ├── Folder.java
│   │                           │   ├── Storable.java
│   │                           │   ├── TrashItem.java
│   │                           │   └── User.java
│   │                           ├── dto/
│   │                           │   ├── AuthRequest.java
│   │                           │   ├── AuthResponse.java
│   │                           │   └── RegisterRequest.java
│   │                           ├── exception/
│   │                           │   ├── DuplicateResourceException.java
│   │                           │   ├── InternalStorableException.java
│   │                           │   ├── ResourceNotFoundException.java
│   │                           │   ├── StorableException.java
│   │                           │   ├── StorageFullException.java
│   │                           │   └── UnauthorizedAccessException.java
│   │                           ├── port/
│   │                           │   ├── FilePersistencePort.java
│   │                           │   ├── FolderPersistencePort.java
│   │                           │   ├── SharingPersistencePort.java
│   │                           │   ├── SystemSettingPort.java
│   │                           │   └── UserPersistencePort.java
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
│   │                               ├── SessionService.java
│   │                               ├── SharingService.java
│   │                               ├── SharingServiceImpl.java
│   │                               ├── StorageService.java
│   │                               ├── TrashCleanupService.java
│   │                               └── UserService.java
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
│   │                           ├── adapter/
│   │                           │   ├── FilePersistenceAdapter.java
│   │                           │   ├── FolderPersistenceAdapter.java
│   │                           │   ├── SharingPersistenceAdapter.java
│   │                           │   ├── SystemSettingAdapter.java
│   │                           │   └── UserPersistenceAdapter.java
│   │                           ├── entity/
│   │                           │   ├── AccessPrivilegeEntity.java
│   │                           │   ├── FileEntity.java
│   │                           │   ├── FolderEntity.java
│   │                           │   ├── NodeEntity.java
│   │                           │   └── UserEntity.java
│   │                           ├── mapper/
│   │                           │   ├── NodeMapper.java
│   │                           │   └── UserMapper.java
│   │                           ├── repository/
│   │                           │   ├── AccessPrivilegeRepository.java
│   │                           │   ├── FileRepository.java
│   │                           │   ├── FolderRepository.java
│   │                           │   ├── NodeRepository.java
│   │                           │   └── UserRepository.java
│   │                           └── service/
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
│   │   ├── admin/
│   │   │   ├── settings/
│   │   │   │   └── page.tsx
│   │   │   ├── users/
│   │   │   │   └── page.tsx
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── favorites/
│   │   │   └── page.tsx
│   │   ├── home/
│   │   │   └── page.tsx
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── privacy/
│   │   │   └── page.tsx
│   │   ├── recent/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   ├── settings/
│   │   │   └── page.tsx
│   │   ├── setup/
│   │   │   └── change-password/
│   │   │       └── page.tsx
│   │   ├── shared/
│   │   │   └── page.tsx
│   │   ├── terms/
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
│   │   │   │   ├── FileBrowser.tsx
│   │   │   │   ├── FileList.tsx
│   │   │   │   ├── FileListItem.tsx
│   │   │   │   ├── MoveModal.tsx
│   │   │   │   └── ShareModal.tsx
│   │   │   ├── layout/
│   │   │   │   ├── AppLayout.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   ├── Header.tsx
│   │   │   │   └── Sidebar.tsx
│   │   │   ├── recent/
│   │   │   │   ├── RecentTable.tsx
│   │   │   │   └── RecentTableRow.tsx
│   │   │   ├── settings/
│   │   │   │   ├── DeleteAccountModal.tsx
│   │   │   │   └── SettingsContainer.tsx
│   │   │   └── trash/
│   │   │       ├── RetentionSettings.tsx
│   │   │       ├── TrashTable.tsx
│   │   │       └── TrashTableRow.tsx
│   │   ├── shared/
│   │   │   ├── Breadcrumbs.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   ├── StatusBadge.tsx
│   │   │   └── UserMenu.tsx
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── FileIcon.tsx
│   │       ├── IconButton.tsx
│   │       ├── PageContainer.tsx
│   │       └── Spinner.tsx
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   ├── ConfirmContext.tsx
│   │   └── ToastContext.tsx
│   ├── hooks/
│   │   ├── useFileBrowser.ts
│   │   ├── useFileListItem.ts
│   │   ├── useMoveModal.ts
│   │   ├── useSearch.ts
│   │   ├── useSettings.ts
│   │   ├── useShareModal.ts
│   │   └── useTrash.ts
│   ├── lib/
│   │   ├── api/
│   │   │   ├── admin.ts
│   │   │   ├── auth.ts
│   │   │   ├── client.ts
│   │   │   ├── file.ts
│   │   │   ├── sharing.ts
│   │   │   ├── trash.ts
│   │   │   └── user.ts
│   │   ├── file-constants.ts
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
├── CONTRIBUTING.md
├── Dockerfile.backend
├── File Colors.md
├── GEMINI.md
├── LICENSE
├── Project Structure.md
├── README.md
├── Refactoring Prompts.md
├── docker-compose.yml
├── package-lock.json
├── package.json
├── pom.xml
├── run.ps1
└── run.sh
```
