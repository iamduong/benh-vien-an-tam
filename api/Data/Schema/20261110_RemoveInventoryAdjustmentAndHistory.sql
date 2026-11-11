DELETE FROM "RolePermission"
WHERE "PermissionUuid" IN (
    '0d7511d1-4ed5-478f-ae55-aa0691fb4e7f',
    '3a8ded95-de99-4ba7-98e6-147328997e06'
);

DELETE FROM "Permission"
WHERE "Uuid" IN (
    '0d7511d1-4ed5-478f-ae55-aa0691fb4e7f',
    '3a8ded95-de99-4ba7-98e6-147328997e06'
);
