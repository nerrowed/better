/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3198286104")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT\n  (ROW_NUMBER() OVER()) as id, \n  L.id AS lecturerId,\n  L.nip AS lecturerNip,\n  L.nidn AS lecturerNidn,\n  L.name AS lecturerName,\n  S.id AS studentId,\n  S.nim AS studentNim,\n  S.name AS studentName,\n  MS.id AS scheduleId,\n  MS.schedule_start,\n  MS.schedule_end,\n  MS.is_requested\nFROM lecturers L\nJOIN mentoring_schedules MS ON L.id = MS.lecturer_id\nJOIN students S ON S.id = MS.student_id"
  }, collection)

  // remove field
  collection.fields.removeById("_clone_T463")

  // remove field
  collection.fields.removeById("_clone_M4To")

  // remove field
  collection.fields.removeById("_clone_T7BQ")

  // remove field
  collection.fields.removeById("_clone_5J8w")

  // remove field
  collection.fields.removeById("_clone_jTRO")

  // remove field
  collection.fields.removeById("_clone_rvGt")

  // remove field
  collection.fields.removeById("_clone_xUMG")

  // add field
  collection.fields.addAt(2, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_NHne",
    "max": 0,
    "min": 0,
    "name": "lecturerNip",
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
    "id": "_clone_UjmV",
    "max": 0,
    "min": 0,
    "name": "lecturerNidn",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(4, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_WPWT",
    "max": 255,
    "min": 0,
    "name": "lecturerName",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(6, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_vnWt",
    "max": 0,
    "min": 0,
    "name": "studentNim",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(7, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_c6BH",
    "max": 255,
    "min": 0,
    "name": "studentName",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(9, new Field({
    "hidden": false,
    "id": "_clone_1O1r",
    "max": "",
    "min": "",
    "name": "schedule_start",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  // add field
  collection.fields.addAt(10, new Field({
    "hidden": false,
    "id": "_clone_xETl",
    "max": "",
    "min": "",
    "name": "schedule_end",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  // add field
  collection.fields.addAt(11, new Field({
    "hidden": false,
    "id": "_clone_CeNx",
    "name": "is_requested",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3198286104")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT\n  (ROW_NUMBER() OVER()) as id, \n  L.id AS lecturerId,\n  L.nip AS lecturerNip,\n  L.name AS lecturerName,\n  S.id AS studentId,\n  S.nim AS studentNim,\n  S.name AS studentName,\n  MS.id AS scheduleId,\n  MS.schedule_start,\n  MS.schedule_end,\n  MS.is_requested\nFROM lecturers L\nJOIN mentoring_schedules MS ON L.id = MS.lecturer_id\nJOIN students S ON S.id = MS.student_id"
  }, collection)

  // add field
  collection.fields.addAt(2, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_T463",
    "max": 0,
    "min": 0,
    "name": "lecturerNip",
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
    "id": "_clone_M4To",
    "max": 255,
    "min": 0,
    "name": "lecturerName",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(5, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_T7BQ",
    "max": 0,
    "min": 0,
    "name": "studentNim",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(6, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_5J8w",
    "max": 255,
    "min": 0,
    "name": "studentName",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(8, new Field({
    "hidden": false,
    "id": "_clone_jTRO",
    "max": "",
    "min": "",
    "name": "schedule_start",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  // add field
  collection.fields.addAt(9, new Field({
    "hidden": false,
    "id": "_clone_rvGt",
    "max": "",
    "min": "",
    "name": "schedule_end",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  // add field
  collection.fields.addAt(10, new Field({
    "hidden": false,
    "id": "_clone_xUMG",
    "name": "is_requested",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  // remove field
  collection.fields.removeById("_clone_NHne")

  // remove field
  collection.fields.removeById("_clone_UjmV")

  // remove field
  collection.fields.removeById("_clone_WPWT")

  // remove field
  collection.fields.removeById("_clone_vnWt")

  // remove field
  collection.fields.removeById("_clone_c6BH")

  // remove field
  collection.fields.removeById("_clone_1O1r")

  // remove field
  collection.fields.removeById("_clone_xETl")

  // remove field
  collection.fields.removeById("_clone_CeNx")

  return app.save(collection)
})
