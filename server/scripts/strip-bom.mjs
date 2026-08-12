import fs from "fs";

const path =
  "prisma/migrations/20260809010000_sync_phase3_schema/migration.sql";

let sql = fs.readFileSync(path, "utf8");
if (sql.charCodeAt(0) === 0xfeff) {
  sql = sql.slice(1);
}

fs.writeFileSync(path, sql, { encoding: "utf8" });

const first = fs.readFileSync(path);
console.log("first3", first[0], first[1], first[2]);
console.log("startsWith", first.toString("utf8").slice(0, 20));
