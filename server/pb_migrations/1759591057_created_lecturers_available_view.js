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
        "id": "_clone_YT1D",
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
        "autogeneratePattern": "",
        "hidden": false,
        "id": "_clone_WkIf",
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
        "hidden": false,
        "id": "number2866102321",
        "max": null,
        "min": null,
        "name": "currentStudentsCount",
        "onlyInt": false,
        "presentable": false,
        "required": false,
        "system": false,
        "type": "number"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "_clone_vZHb",
        "max": 0,
        "min": 0,
        "name": "maxStudentsAllowed",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      }
    ],
    "id": "pbc_1426649972",
    "indexes": [],
    "listRule": null,
    "name": "lecturers_available_view",
    "system": false,
    "type": "view",
    "updateRule": null,
    "viewQuery": "SELECT\n  (ROW_NUMBER() OVER()) as id, -- ID wajib untuk View Collection\n  L.id AS lecturerId,\n  L.name AS lecturerName,\n  L.nip AS lecturerNip,\n  COUNT(MS.student_id) AS currentStudentsCount,\n  S.value AS maxStudentsAllowed\nFROM lecturers L\n-- 1. Hitung jumlah mahasiswa bimbingan saat ini (MS = mentoring_schedules)\nLEFT JOIN mentoring_schedules MS ON L.id = MS.lecturer_id\n-- 2. Gabungkan dengan tabel settings untuk mendapatkan batas maksimum\nJOIN settings S ON S.\"key\" = 'max_students_per_lecturer'\n-- Kelompokkan berdasarkan Dosen\nGROUP BY \n  L.id, \n  L.name, \n  L.nip, \n  S.value\n-- 3. Filter Dosen yang jumlah mahasiswanya kurang dari batas maksimum\nHAVING COUNT(MS.student_id) < CAST(S.value AS REAL)",
    "viewRule": null
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1426649972");

  return app.delete(collection);
})
