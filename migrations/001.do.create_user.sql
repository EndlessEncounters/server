DROP TABLE IF EXISTS  "user" CASCADE;

CREATE TABLE "user" (
  "id" SERIAL PRIMARY KEY,
  "username" TEXT NOT NULL UNIQUE,
  "password" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "entity" INT,
  "access_token" TEXT NOT NULL
);
