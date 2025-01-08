/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable("locations", (table) => {
    table.increments("id").primary(); // ID
    table.uuid("uuid").unique(); // ユーザーID (重複不可)
    table.float("latitude").notNullable(); // 緯度
    table.float("longitude").notNullable(); // 経度
    table.timestamp("created_at").defaultTo(knex.fn.now()); // データ記録時刻
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("locations"); // テーブルを削除
};
