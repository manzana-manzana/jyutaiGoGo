/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex("locations").del();
  await knex("locations").insert([
    {
      user_id: "user_1",
      latitude: 35.18019,
      longitude: 136.9066,
      created_at: knex.fn.now(),
    }, // 名古屋市
    {
      user_id: "user_2",
      latitude: 34.96691,
      longitude: 137.08091,
      created_at: knex.fn.now(),
    }, // 岡崎市
    {
      user_id: "user_3",
      latitude: 35.05236,
      longitude: 137.17056,
      created_at: knex.fn.now(),
    }, // 豊田市
    {
      user_id: "user_4",
      latitude: 34.86614,
      longitude: 136.90672,
      created_at: knex.fn.now(),
    }, // 刈谷市
    {
      user_id: "user_5",
      latitude: 35.38141,
      longitude: 136.93774,
      created_at: knex.fn.now(),
    }, // 一宮市
    {
      user_id: "user_6",
      latitude: 35.31656,
      longitude: 137.19351,
      created_at: knex.fn.now(),
    }, // 瀬戸市
    {
      user_id: "user_7",
      latitude: 35.17463,
      longitude: 136.93137,
      created_at: knex.fn.now(),
    }, // 熱田区（熱田神宮）
    {
      user_id: "user_8",
      latitude: 34.71208,
      longitude: 137.39627,
      created_at: knex.fn.now(),
    }, // 蒲郡市（ラグーナ蒲郡）
    {
      user_id: "user_9",
      latitude: 35.09384,
      longitude: 137.15963,
      created_at: knex.fn.now(),
    }, // 長久手市（愛・地球博記念公園）
  ]);
};
