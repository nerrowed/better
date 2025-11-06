/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1300507843")

  // update collection data
  unmarshal({
    "name": "mentoring_schedules_limit_per_lecturer"
  }, collection)

  // add field
  collection.fields.addAt(1, new Field({
    "cascadeDelete": false,
    "collectionId": "_pb_users_auth_",
    "hidden": false,
    "id": "relation349131078",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "lecturer",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(2, new Field({
    "hidden": false,
    "id": "number2140596320",
    "max": null,
    "min": null,
    "name": "limit",
    "onlyInt": false,
    "presentable": false,
    "required": true,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1300507843")

  // update collection data
  unmarshal({
    "name": "mentoring_schedules_limit_per"
  }, collection)

  // remove field
  collection.fields.removeById("relation349131078")

  // remove field
  collection.fields.removeById("number2140596320")

  return app.save(collection)
})
