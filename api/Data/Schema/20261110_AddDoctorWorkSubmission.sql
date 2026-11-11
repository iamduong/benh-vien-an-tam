CREATE TABLE IF NOT EXISTS "DoctorWorkSubmission" (
    "Uuid" uuid NOT NULL,
    "DoctorUuid" uuid NOT NULL,
    "DoctorWorkingHourUuid" uuid NULL,
    "PreviousWorkingHourUuid" uuid NULL,
    "RequestedWorkingHourUuid" uuid NULL,
    "Type" integer NOT NULL DEFAULT 0,
    "Reason" character varying(1000) NOT NULL,
    "Status" integer NOT NULL,
    "ReviewNote" character varying(1000) NOT NULL,
    "ReviewedByAccountUuid" uuid NULL,
    "ReviewedAt" timestamp with time zone NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT "PK_DoctorWorkSubmission" PRIMARY KEY ("Uuid"),
    CONSTRAINT "FK_DoctorWorkSubmission_DoctorProfile_DoctorUuid"
        FOREIGN KEY ("DoctorUuid") REFERENCES "DoctorProfile" ("Uuid") ON DELETE NO ACTION,
    CONSTRAINT "FK_DoctorWorkSubmission_DoctorWorking_DoctorWorkingHourUuid"
        FOREIGN KEY ("DoctorWorkingHourUuid") REFERENCES "DoctorWorking" ("Uuid") ON DELETE SET NULL,
    CONSTRAINT "FK_DoctorWorkSubmission_TimeWorking_PreviousWorkingHourUuid"
        FOREIGN KEY ("PreviousWorkingHourUuid") REFERENCES "TimeWorking" ("Uuid") ON DELETE NO ACTION,
    CONSTRAINT "FK_DoctorWorkSubmission_TimeWorking_RequestedWorkingHourUuid"
        FOREIGN KEY ("RequestedWorkingHourUuid") REFERENCES "TimeWorking" ("Uuid") ON DELETE NO ACTION,
    CONSTRAINT "FK_DoctorWorkSubmission_Account_ReviewedByAccountUuid"
        FOREIGN KEY ("ReviewedByAccountUuid") REFERENCES "Account" ("Uuid") ON DELETE NO ACTION
);

CREATE INDEX IF NOT EXISTS "IX_DoctorWorkSubmission_DoctorUuid_Status"
    ON "DoctorWorkSubmission" ("DoctorUuid", "Status");
CREATE INDEX IF NOT EXISTS "IX_DoctorWorkSubmission_DoctorWorkingHourUuid"
    ON "DoctorWorkSubmission" ("DoctorWorkingHourUuid");
CREATE INDEX IF NOT EXISTS "IX_DoctorWorkSubmission_PreviousWorkingHourUuid"
    ON "DoctorWorkSubmission" ("PreviousWorkingHourUuid");
CREATE INDEX IF NOT EXISTS "IX_DoctorWorkSubmission_RequestedWorkingHourUuid"
    ON "DoctorWorkSubmission" ("RequestedWorkingHourUuid");
CREATE INDEX IF NOT EXISTS "IX_DoctorWorkSubmission_ReviewedByAccountUuid"
    ON "DoctorWorkSubmission" ("ReviewedByAccountUuid");
