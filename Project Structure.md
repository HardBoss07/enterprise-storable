# Project Structure

```
./
├── db/
│   ├── schema.sql
│   └── test-data.sql
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
├── storage/
│   ├── documents/
│   │   ├── projects/
│   │   │   └── project-plan.txt
│   │   └── document1.txt
│   └── root-file.txt
├── web/
│   ├── app/
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── Footer.tsx
│   │   └── Header.tsx
│   ├── public/
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
├── Project Structure.md
├── docker-compose.yml
└── pom.xml
```