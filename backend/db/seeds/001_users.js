exports.seed = async function (knex) {
  // テーブルのデータを初期化
  await knex("users").del();

  // Seedデータの挿入
  await knex("users").insert([
    {
      uuid: "1a2b3c4d-5678-90ab-cdef-1234567890ab",
      created_at: knex.fn.now(),
    },
    {
      uuid: "2b3c4d5e-6789-01ab-cdef-2345678901bc",
      created_at: knex.fn.now(),
    },
    {
      uuid: "3c4d5e6f-7890-12ab-cdef-3456789012cd",
      created_at: knex.fn.now(),
    },
    {
      uuid: "4d5e6f7a-8901-23ab-cdef-4567890123de",
      created_at: knex.fn.now(),
    },
    {
      uuid: "5e6f7a8b-9012-34ab-cdef-5678901234ef",
      created_at: knex.fn.now(),
    },
  ]);
};
