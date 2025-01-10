/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex("locations").del();
  await knex("locations").truncate();
  await knex("locations").insert([
    {
      user_id: 1,
      // 名古屋市
      latitude: 35.18019,
      longitude: 136.9066,
      updated_at: knex.fn.now(),
    },
    {
      user_id: 2,
      // 岡崎市
      latitude: 34.96691,
      longitude: 137.08091,
      updated_at: knex.fn.now(),
    },
    {
      user_id: 3,
      // 豊田市
      latitude: 35.05236,
      longitude: 137.17056,
      updated_at: knex.fn.now(),
    },
    {
      user_id: 4,
      // 刈谷市
      latitude: 34.86614,
      longitude: 136.90672,
      updated_at: knex.fn.now(),
    },
    {
      user_id: 5,
      // 一宮市
      latitude: 35.38141,
      longitude: 136.93774,
      updated_at: knex.fn.now(),
    },
    {
      user_id: 6,
      // 瀬戸市
      latitude: 35.31656,
      longitude: 137.19351,
      updated_at: knex.fn.now(),
    },
    {
      user_id: 7,
      // 熱田区（熱田神宮）
      latitude: 35.17463,
      longitude: 136.93137,
      updated_at: knex.fn.now(),
    },
    {
      user_id: 8,
      // 蒲郡市（ラグーナ蒲郡）
      latitude: 34.71208,
      longitude: 137.39627,
      updated_at: knex.fn.now(),
    },
    {
      user_id: 9,
      // 長久手市（愛・地球博記念公園）
      latitude: 35.09384,
      longitude: 137.15963,
      updated_at: knex.fn.now(),
    },
  ]);
  await knex.raw("SELECT setval('users_id_seq', (SELECT MAX(id) FROM users))");
};
