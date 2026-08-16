-- Step 1: Add the new "details" column with a default of '[]'
ALTER TABLE "Product" ADD COLUMN "details" JSONB NOT NULL DEFAULT '[]';

-- Step 2: Populate "details" from existing "description" using Postgres JSON functions
-- This safely handles any special characters (quotes, newlines, apostrophes) in the text.
UPDATE "Product"
SET "details" = jsonb_build_array(
  jsonb_build_object('label', 'Description', 'value', "description")
)
WHERE "description" IS NOT NULL AND "description" != '';

-- Step 3: Drop the old "description" column now that data has been preserved
ALTER TABLE "Product" DROP COLUMN "description";
