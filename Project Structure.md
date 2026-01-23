# Project Structure

```
./
├── storable-api/
│   ├── src/
│   │   ├── main/
│   │   │   └── java/
│   │   │       └── dev/
│   │   │           └── m4tt3o/
│   │   │               └── storable/
│   │   │                   └── api/
│   │   │                       ├── controller/
│   │   │                       │   └── FileController.java
│   │   │                       └── StorableApiApplication.java
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
│   │                           ├── dto/
│   │                           │   └── FileMetadataDto.java
│   │                           └── service/
│   │                               └── FileService.java
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
│   │                           └── repository/
│   │                               └── FileNodeRepository.java
│   └── pom.xml
├── web/
│   ├── app/
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── public/
│   │   ├── file.svg
│   │   ├── globe.svg
│   │   ├── next.svg
│   │   ├── vercel.svg
│   │   └── window.svg
│   ├── Dockerfile
│   ├── README.md
│   ├── eslint.config.mjs
│   ├── next.config.ts
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.mjs
│   └── tsconfig.json
├── Dockerfile.backend
├── LICENSE
├── docker-compose.yml
└── pom.xml
```