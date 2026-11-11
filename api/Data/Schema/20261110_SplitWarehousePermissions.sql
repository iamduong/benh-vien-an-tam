UPDATE "Permission"
SET "Slug" = 'nhap-hang', "Name" = 'Nhập hàng', "Icon" = 'ticket'
WHERE "Uuid" = '952d3443-6ca0-4001-a67e-5547b2c57f3c';

INSERT INTO "Permission" ("Uuid", "Icon", "Slug", "Name", "Description", "Scope")
VALUES ('4fe03c32-9a96-467f-a591-ff7eb7ae3a8f', 'ticket', 'xuat-hang', 'Xuất hàng', 'Kho thuốc', 1)
ON CONFLICT ("Uuid") DO UPDATE
SET "Slug" = EXCLUDED."Slug", "Name" = EXCLUDED."Name", "Icon" = EXCLUDED."Icon";

INSERT INTO "RolePermission" ("Uuid", "RoleUuid", "PermissionUuid", "Action")
SELECT gen_random_uuid(), '5264371e-ea25-47a3-ae34-b10d6a4b5c31', '4fe03c32-9a96-467f-a591-ff7eb7ae3a8f', action
FROM generate_series(0, 3) AS action
WHERE NOT EXISTS (
    SELECT 1 FROM "RolePermission"
    WHERE "RoleUuid" = '5264371e-ea25-47a3-ae34-b10d6a4b5c31'
      AND "PermissionUuid" = '4fe03c32-9a96-467f-a591-ff7eb7ae3a8f'
      AND "Action" = action
);
