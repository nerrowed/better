/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1693433272")

  // update field
  collection.fields.addAt(3, new Field({
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
  collection.fields.addAt(4, new Field({
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
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1693433272")

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
})
