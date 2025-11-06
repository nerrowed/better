/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1693433272")

  // update collection data
  unmarshal({
    "name": "mentoring_schedules"
  }, collection)

  // add field
  collection.fields.addAt(1, new Field({
    "cascadeDelete": false,
    "collectionId": "_pb_users_auth_",
    "hidden": false,
    "id": "relation3123545954",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "lecturer_id",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(2, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_2651147324",
    "hidden": false,
    "id": "relation3415494426",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "student_id",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  // update field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "date1663079891",
    "max": "",
    "min": "",
    "name": "schedule_start",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "date"
  }))

  // update field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "date2637526715",
    "max": "",
    "min": "",
    "name": "schedule_end",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "date"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1693433272")

  // update collection data
  unmarshal({
    "name": "mentoring_schedules_duplicate"
  }, collection)

  // remove field
  collection.fields.removeById("relation3123545954")

  // remove field
  collection.fields.removeById("relation3415494426")

  // update field
  collection.fields.addAt(1, new Field({
    "hidden": false,
    "id": "date1663079891",
    "max": "",
    "min": "",
    "name": "schedule_start",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  // update field
  collection.fields.addAt(2, new Field({
    "hidden": false,
    "id": "date2637526715",
    "max": "",
    "min": "",
    "name": "schedule_end",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  return app.save(collection)
})
