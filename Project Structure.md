# Project Structure

```
enterprise-storable/
├── db/
│   ├── schema.sql
│   └── test-data.sql
├── storable-api/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── dev/
│   │   │   │       └── m4tt3o/
│   │   │   │           └── storable/
│   │   │   │               └── api/
│   │   │   │                   ├── controller/
│   │   │   │                   │   └── FileController.java
│   │   │   │                   ├── request/
│   │   │   │                   │   └── CreateFolderRequest.java
│   │   │   │                   ├── security/
│   │   │   │                   │   └── CorsConfig.java
│   │   │   │                   └── StorableApiApplication.java
│   │   │   └── resources/
│   │   │       └── application.yml
│   │   └── test/
│   │       └── java/
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
│   │                           │   ├── StorableAuthConfig.java
│   │                           │   └── StorageProperties.java
│   │                           ├── dto/
│   │                           │   └── FileMetadataDto.java
│   │                           └── service/
│   │                               ├── FileService.java
│   │                               ├── LocalStorageService.java
│   │                               └── StorageService.java
│   └── pom.xml
├── storable-data/
│   ├── src/
│   │   └── main/
│   │       └── java/
│   │           └── dev/
│   │               └── m4tt3o/
│   │                   └── storable/
│   │                       └── data/
│   │                           ├── entity/
│   │                           │   └── FileNode.java
│   │                           ├── repository/
│   │                           │   └── FileNodeRepository.java
│   │                           └── service/
│   │                               └── FileServiceImpl.java
│   └── pom.xml
├── storage/
├── web/
│   ├── app/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── recent/
│   │   │   └── page.tsx
│   │   ├── trash/
│   │   │   └── page.tsx
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
│   │   └── layout/
│   │       ├── Footer.tsx
│   │       ├── Header.tsx
│   │       └── Sidebar.tsx
│   ├── lib/
│   │   ├── api.ts
│   │   └── mock-data.ts
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
├── docker-compose.yml
├── pom.xml
├── run.ps1
└── run.sh
```