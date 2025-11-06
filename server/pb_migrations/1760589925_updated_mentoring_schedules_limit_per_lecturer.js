/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1300507843")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE INDEX `idx_WiJUaQ9NRC` ON `mentoring_schedules_limit_per_lecturer` (`lecturer`)"
    ]
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1300507843")

  // update collection data
  unmarshal({
    "indexes": []
  }, collection)

  return app.save(collection)
})
