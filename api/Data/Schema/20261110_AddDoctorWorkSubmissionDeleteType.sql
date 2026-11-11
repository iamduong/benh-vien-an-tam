ALTER TABLE "DoctorWorkSubmission"
    ADD COLUMN IF NOT EXISTS "Type" integer NOT NULL DEFAULT 0;

ALTER TABLE "DoctorWorkSubmission"
    ALTER COLUMN "DoctorWorkingHourUuid" DROP NOT NULL,
    ALTER COLUMN "PreviousWorkingHourUuid" DROP NOT NULL,
    ALTER COLUMN "RequestedWorkingHourUuid" DROP NOT NULL;

ALTER TABLE "DoctorWorkSubmission"
    DROP CONSTRAINT IF EXISTS "FK_DoctorWorkSubmission_DoctorWorking_DoctorWorkingHourUuid";

ALTER TABLE "DoctorWorkSubmission"
    ADD CONSTRAINT "FK_DoctorWorkSubmission_DoctorWorking_DoctorWorkingHourUuid"
    FOREIGN KEY ("DoctorWorkingHourUuid")
    REFERENCES "DoctorWorking" ("Uuid")
    ON DELETE SET NULL;
