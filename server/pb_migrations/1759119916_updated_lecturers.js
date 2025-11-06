/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE UNIQUE INDEX `idx_tokenKey__pb_users_auth_` ON `lecturers` (`tokenKey`)",
      "CREATE UNIQUE INDEX `idx_nip__pb_users_auth_` ON `lecturers` (`nip`) WHERE `nip` != ''",
      "CREATE UNIQUE INDEX `idx_email__pb_users_auth_` ON `lecturers` (`email`) WHERE `email` != ''"
    ]
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE UNIQUE INDEX `idx_tokenKey__pb_users_auth_` ON `lecturers` (`tokenKey`)",
      "CREATE UNIQUE INDEX `idx_email__pb_users_auth_` ON `lecturers` (`email`) WHERE `email` != ''",
      "CREATE UNIQUE INDEX `idx_nip__pb_users_auth_` ON `lecturers` (`nip`) WHERE `nip` != ''"
    ]
  }, collection)

  return app.save(collection)
})
