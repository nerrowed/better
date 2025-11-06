/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2102782606")

  // update collection data
  unmarshal({
    "listRule": "@request.auth.id != \"\"",
    "viewRule": "@request.auth.id != \"\""
  }, collection)

  // remove field
  collection.fields.removeById("_clone_uXcf")

  // remove field
  collection.fields.removeById("_clone_9TV4")

  // remove field
  collection.fields.removeById("_clone_7mm1")

  // remove field
  collection.fields.removeById("_clone_Tcnc")

  // remove field
  collection.fields.removeById("_clone_rW67")

  // remove field
  collection.fields.removeById("_clone_DCXy")

  // add field
  collection.fields.addAt(1, new Field({
    "hidden": false,
    "id": "_clone_G5DT",
    "max": "",
    "min": "",
    "name": "date",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "date"
  }))

  // add field
  collection.fields.addAt(2, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_UQ20",
    "max": 0,
    "min": 0,
    "name": "start_time",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(3, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_vWY3",
    "max": 0,
    "min": 0,
    "name": "end_time",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(4, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_2651147324",
    "hidden": false,
    "id": "_clone_kMo7",
    "maxSelect": 999,
    "minSelect": 0,
    "name": "student_ids",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(5, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_3630668853",
    "hidden": false,
    "id": "_clone_jsRS",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "room_id",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(6, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_2WrR",
    "max": 0,
    "min": 0,
    "name": "room_name",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2102782606")

  // update collection data
  unmarshal({
    "listRule": null,
    "viewRule": null
  }, collection)

  // add field
  collection.fields.addAt(1, new Field({
    "hidden": false,
    "id": "_clone_uXcf",
    "max": "",
    "min": "",
    "name": "date",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "date"
  }))

  // add field
  collection.fields.addAt(2, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_9TV4",
    "max": 0,
    "min": 0,
    "name": "start_time",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(3, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_7mm1",
    "max": 0,
    "min": 0,
    "name": "end_time",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(4, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_2651147324",
    "hidden": false,
    "id": "_clone_Tcnc",
    "maxSelect": 999,
    "minSelect": 0,
    "name": "student_ids",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(5, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_3630668853",
    "hidden": false,
    "id": "_clone_rW67",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "room_id",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(6, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_DCXy",
    "max": 0,
    "min": 0,
    "name": "room_name",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // remove field
  collection.fields.removeById("_clone_G5DT")

  // remove field
  collection.fields.removeById("_clone_UQ20")

  // remove field
  collection.fields.removeById("_clone_vWY3")

  // remove field
  collection.fields.removeById("_clone_kMo7")

  // remove field
  collection.fields.removeById("_clone_jsRS")

  // remove field
  collection.fields.removeById("_clone_2WrR")

  return app.save(collection)
})
