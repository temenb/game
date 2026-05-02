-- CreateTable
CREATE TABLE "gameBoard"
(
    "id"         TEXT         NOT NULL,
    "ownerId"    TEXT         NOT NULL,
    "nickname"   TEXT         NOT NULL DEFAULT 'guest',
    "level"      INTEGER      NOT NULL DEFAULT 1,
    "rating"     INTEGER      NOT NULL DEFAULT 1000,
    "experience" INTEGER      NOT NULL DEFAULT 0,
    "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"  TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gameBoard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "owner_achievement"
(
    "id"            TEXT         NOT NULL,
    "gameBoardId"     TEXT         NOT NULL,
    "achievementId" TEXT         NOT NULL,
    "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"     TIMESTAMP(3) NOT NULL,

    CONSTRAINT "owner_achievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "achievement"
(
    "id"          TEXT         NOT NULL,
    "title"       TEXT         NOT NULL,
    "description" TEXT,
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"   TIMESTAMP(3) NOT NULL,

    CONSTRAINT "achievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "experience_level"
(
    "level"        INTEGER      NOT NULL,
    "nextRequired" INTEGER      NOT NULL,
    "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"    TIMESTAMP(3) NOT NULL,

    CONSTRAINT "experience_level_pkey" PRIMARY KEY ("level")
);

-- CreateIndex
CREATE UNIQUE INDEX "gameBoard_ownerId_key" ON "gameBoard" ("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "owner_achievement_gameBoardId_achievementId_key" ON "owner_achievement" ("gameBoardId", "achievementId");

-- CreateIndex
CREATE UNIQUE INDEX "achievement_title_key" ON "achievement" ("title");

-- AddForeignKey
ALTER TABLE "owner_achievement"
    ADD CONSTRAINT "owner_achievement_gameBoardId_fkey" FOREIGN KEY ("gameBoardId") REFERENCES "gameBoard" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "owner_achievement"
    ADD CONSTRAINT "owner_achievement_achievementId_fkey" FOREIGN KEY ("achievementId") REFERENCES "achievement" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;
