/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1426649972")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT\n  (ROW_NUMBER() OVER()) as id, -- ID wajib untuk View Collection\n  L.id AS lecturerId,\n  L.name AS lecturerName,\n  L.nip AS lecturerNip,\n  COUNT(MS.student_id) AS currentStudentsCount,\n  S.value AS maxStudentsAllowed,\n  -- Sub-query baru untuk mendapatkan array JSON dari student\n  (\n    SELECT\n      JSON_GROUP_ARRAY(\n        JSON_OBJECT(\n          'id', ST.id\n        )\n      )\n    FROM mentoring_schedules AS SubMS\n    JOIN students AS ST ON SubMS.student_id = ST.id\n    WHERE SubMS.lecturer_id = L.id\n  ) AS mentoredStudents\nFROM lecturers L\n-- 1. Hitung jumlah mahasiswa bimbingan saat ini (MS = mentoring_schedules)\nLEFT JOIN mentoring_schedules MS ON L.id = MS.lecturer_id\n-- 2. Gabungkan dengan tabel settings untuk mendapatkan batas maksimum\nJOIN settings S ON S.\"key\" = 'max_students_per_lecturer'\n-- Kelompokkan berdasarkan Dosen\nGROUP BY\n  L.id,\n  L.name,\n  L.nip,\n  S.value\n-- 3. Filter Dosen yang jumlah mahasiswanya kurang dari batas maksimum\nHAVING COUNT(MS.student_id) < CAST(S.value AS REAL)"
  }, collection)

  // remove field
  collection.fields.removeById("_clone_p7x6")

  // remove field
  collection.fields.removeById("_clone_BnjJ")

  // remove field
  collection.fields.removeById("_clone_JU0V")

  // add field
  collection.fields.addAt(2, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_qsFL",
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
  collection.fields.addAt(3, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_eSnq",
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
  collection.fields.addAt(5, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_W2J3",
    "max": 0,
    "min": 0,
    "name": "maxStudentsAllowed",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1426649972")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT\n  (ROW_NUMBER() OVER()) as id, -- ID wajib untuk View Collection\n  L.id AS lecturerId,\n  L.name AS lecturerName,\n  L.nip AS lecturerNip,\n  COUNT(MS.student_id) AS currentStudentsCount,\n  S.value AS maxStudentsAllowed,\n  -- Sub-query baru untuk mendapatkan array JSON dari student\n  (\n    SELECT\n      JSON_GROUP_ARRAY(\n        JSON_OBJECT(\n          'id', ST.id,\n          'name', ST.name,\n          'nim', ST.nim\n        )\n      )\n    FROM mentoring_schedules AS SubMS\n    JOIN students AS ST ON SubMS.student_id = ST.id\n    WHERE SubMS.lecturer_id = L.id\n  ) AS mentoredStudents\nFROM lecturers L\n-- 1. Hitung jumlah mahasiswa bimbingan saat ini (MS = mentoring_schedules)\nLEFT JOIN mentoring_schedules MS ON L.id = MS.lecturer_id\n-- 2. Gabungkan dengan tabel settings untuk mendapatkan batas maksimum\nJOIN settings S ON S.\"key\" = 'max_students_per_lecturer'\n-- Kelompokkan berdasarkan Dosen\nGROUP BY\n  L.id,\n  L.name,\n  L.nip,\n  S.value\n-- 3. Filter Dosen yang jumlah mahasiswanya kurang dari batas maksimum\nHAVING COUNT(MS.student_id) < CAST(S.value AS REAL)"
  }, collection)

  // add field
  collection.fields.addAt(2, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_p7x6",
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
  collection.fields.addAt(3, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_BnjJ",
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
  collection.fields.addAt(5, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_JU0V",
    "max": 0,
    "min": 0,
    "name": "maxStudentsAllowed",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // remove field
  collection.fields.removeById("_clone_qsFL")

  // remove field
  collection.fields.removeById("_clone_eSnq")

  // remove field
  collection.fields.removeById("_clone_W2J3")

  return app.save(collection)
})
