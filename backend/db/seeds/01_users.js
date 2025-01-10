exports.seed = async function (knex) {
  // テーブルのデータを初期化（外部キー制約に関係なく削除できる）
  await knex.raw("TRUNCATE TABLE users RESTART IDENTITY CASCADE");

  // Seedデータの挿入
  await knex("users").insert([
    {
      username: "Yuko",
      created_at: knex.fn.now(),
    },
    {
      username: "Tsugu",
      created_at: knex.fn.now(),
    },
    {
      username: "Kazuki",
      created_at: knex.fn.now(),
    },
    {
      username: "Kubonnu",
      created_at: knex.fn.now(),
    },
    {
      username: "Ayako",
      created_at: knex.fn.now(),
    },
    {
      username: "Tora",
      created_at: knex.fn.now(),
    },
    {
      username: "Mizushige",
      created_at: knex.fn.now(),
    },
    {
      username: "Kakeru",
      created_at: knex.fn.now(),
    },
    {
      username: "Tamaroh",
      created_at: knex.fn.now(),
    },
  ]);

  // シーケンスをリセット
  await knex.raw("SELECT setval('users_id_seq', (SELECT MAX(id) FROM users))");
};
