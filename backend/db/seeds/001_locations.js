/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex("locations").del();
  await knex("locations").truncate();
  await knex("locations").insert([
    {
      uuid: "6f8c5e6f-1a2b-4c3d-8a9b-1234567890ab", // 名古屋市
      latitude: 35.18019,
      longitude: 136.9066,
      created_at: knex.fn.now(),
    },
    {
      uuid: "7d4b3e2f-1a3c-5d6e-7a8b-2345678901bc", // 岡崎市
      latitude: 34.96691,
      longitude: 137.08091,
      created_at: knex.fn.now(),
    },
    {
      uuid: "8a5b3f4e-1c2d-6f7a-8b9c-3456789012cd", // 豊田市
      latitude: 35.05236,
      longitude: 137.17056,
      created_at: knex.fn.now(),
    },
    {
      uuid: "9b6d4f5e-1d2c-7a8b-9c0a-4567890123de", // 刈谷市（テストもこれで）
      latitude: 34.86614,
      longitude: 136.90672,
      created_at: knex.fn.now(),
    },
    {
      uuid: "1c2d3e4f-1e3f-8a9b-0c1a-5678901234ef", // 一宮市
      latitude: 35.38141,
      longitude: 136.93774,
      created_at: knex.fn.now(),
    },
    {
      uuid: "2d3e4f5a-2f4a-9b0a-1c2d-6789012345ab", // 瀬戸市
      latitude: 35.31656,
      longitude: 137.19351,
      created_at: knex.fn.now(),
    },
    {
      uuid: "3e4f5a6b-3a5b-0a1b-2d3e-7890123456bc", // 熱田区（熱田神宮）
      latitude: 35.17463,
      longitude: 136.93137,
      created_at: knex.fn.now(),
    },
    {
      uuid: "4f5a6b7c-4b6c-1b2c-3e4f-8901234567cd", // 蒲郡市（ラグーナ蒲郡）
      latitude: 34.71208,
      longitude: 137.39627,
      created_at: knex.fn.now(),
    },
    {
      uuid: "5a6b7c8d-5c7d-2c3d-4f5a-9012345678de", // 長久手市（愛・地球博記念公園）
      latitude: 35.09384,
      longitude: 137.15963,
      created_at: knex.fn.now(),
    },
  ]);
};
