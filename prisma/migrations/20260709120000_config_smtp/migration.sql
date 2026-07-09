-- AlterTable
ALTER TABLE "Config" ADD COLUMN     "smtpHost" TEXT,
ADD COLUMN     "smtpPort" INTEGER NOT NULL DEFAULT 587,
ADD COLUMN     "smtpUser" TEXT,
ADD COLUMN     "smtpPass" TEXT;
