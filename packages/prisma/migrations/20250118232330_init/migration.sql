-- CreateTable
CREATE TABLE "IntentCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "IntentCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Intent" (
    "id" SERIAL NOT NULL,
    "intent" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "intentCategoryId" INTEGER NOT NULL,

    CONSTRAINT "Intent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "IntentCategory_name_key" ON "IntentCategory"("name");

-- CreateIndex
CREATE INDEX "IntentCategory_name_idx" ON "IntentCategory"("name");

-- CreateIndex
CREATE INDEX "Intent_intentCategoryId_idx" ON "Intent"("intentCategoryId");

-- AddForeignKey
ALTER TABLE "Intent" ADD CONSTRAINT "Intent_intentCategoryId_fkey" FOREIGN KEY ("intentCategoryId") REFERENCES "IntentCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
