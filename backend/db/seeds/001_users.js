const knex = require("knex");
const { v4: uuidv4 } = require("uuid");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("users").del(); // 既存データの削除（リセット）

  // Inserts seed entries
  await knex("users").insert([
    {
      id: knex.raw("gen_random_uuid()"),
      name: "Yuko",
      created_at: knex.fn.now(),
    },
    {
      id: knex.raw("gen_random_uuid()"),
      name: "Kazuki",
      created_at: knex.fn.now(),
    },
    {
      id: knex.raw("gen_random_uuid()"),
      name: "Tsugu",
      created_at: knex.fn.now(),
    },
    {
      id: knex.raw("gen_random_uuid()"),
      name: "Tora",
      created_at: knex.fn.now(),
    },
  ]);
};
