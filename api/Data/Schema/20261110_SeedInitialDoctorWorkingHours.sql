INSERT INTO "DoctorWorking" ("Uuid", "DoctorUuid", "WorkingUuid")
SELECT
    md5(doctor."Uuid"::text || ':' || working."Uuid"::text)::uuid,
    doctor."Uuid",
    working."Uuid"
FROM "DoctorProfile" AS doctor
CROSS JOIN "TimeWorking" AS working
WHERE working."DeletedAt" IS NULL
  AND working."Status" = 0
  AND working."StartTime" < TIME '12:00'
  AND NOT EXISTS (
      SELECT 1
      FROM "DoctorWorking" AS assigned
      WHERE assigned."DoctorUuid" = doctor."Uuid"
  )
ON CONFLICT ("Uuid") DO NOTHING;
