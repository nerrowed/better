/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "createRule": null,
    "deleteRule": null,
    "fields": [
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text3208210256",
        "max": 0,
        "min": 0,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "cascadeDelete": false,
        "collectionId": "_pb_users_auth_",
        "hidden": false,
        "id": "relation2431835868",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "lecturerId",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "relation"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "_clone_l8qd",
        "max": 0,
        "min": 0,
        "name": "lecturerNip",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": true,
        "system": false,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "_clone_ycNJ",
        "max": 255,
        "min": 0,
        "name": "lecturerName",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": true,
        "system": false,
        "type": "text"
      },
      {
        "cascadeDelete": false,
        "collectionId": "pbc_2651147324",
        "hidden": false,
        "id": "relation2562666392",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "studentId",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "relation"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "_clone_X5B9",
        "max": 0,
        "min": 0,
        "name": "studentNim",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": true,
        "system": false,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "_clone_FTMb",
        "max": 255,
        "min": 0,
        "name": "studentName",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": true,
        "system": false,
        "type": "text"
      },
      {
        "cascadeDelete": false,
        "collectionId": "pbc_1693433272",
        "hidden": false,
        "id": "relation3074752846",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "scheduleId",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "relation"
      },
      {
        "hidden": false,
        "id": "_clone_eVkD",
        "max": "",
        "min": "",
        "name": "schedule_start",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "date"
      },
      {
        "hidden": false,
        "id": "_clone_8b1f",
        "max": "",
        "min": "",
        "name": "schedule_end",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "date"
      },
      {
        "hidden": false,
        "id": "_clone_EVL1",
        "name": "is_requested",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "bool"
      }
    ],
    "id": "pbc_3198286104",
    "indexes": [],
    "listRule": "@request.auth.id != \"\"",
    "name": "lecturer_students_view",
    "system": false,
    "type": "view",
    "updateRule": null,
    "viewQuery": "SELECT\n  (ROW_NUMBER() OVER()) as id, \n  L.id AS lecturerId,\n  L.nip AS lecturerNip,\n  L.name AS lecturerName,\n  S.id AS studentId,\n  S.nim AS studentNim,\n  S.name AS studentName,\n  MS.id AS scheduleId,\n  MS.schedule_start,\n  MS.schedule_end,\n  MS.is_requested\nFROM lecturers L\nJOIN mentoring_schedules MS ON L.id = MS.lecturer_id\nJOIN students S ON S.id = MS.student_id",
    "viewRule": "@request.auth.id != \"\""
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3198286104");

  return app.delete(collection);
})
