/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable("locations", (table) => {
    // table.increments("id").primary();
    table.integer("user_id").unsigned().notNullable().unique().index();
    table.float("latitude").notNullable(); // 緯度
    table.float("longitude").notNullable(); // 経度
    table.timestamp("updated_at").defaultTo(knex.fn.now()); // データ記録時刻

    // 外部キー制約を追加
    table
      .foreign("user_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE") // ユーザーが削除された場合、関連するロケーションも削除
      .onUpdate("CASCADE"); // ユーザーIDが更新された場合、関連するロケーションの user_id も更新
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("locations"); // テーブルを削除
};
