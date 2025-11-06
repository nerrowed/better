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
        "hidden": false,
        "id": "_clone_uXcf",
        "max": "",
        "min": "",
        "name": "date",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "date"
      },
      {
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
      },
      {
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
      },
      {
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
      },
      {
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
      },
      {
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
      },
      {
        "hidden": false,
        "id": "json4033404265",
        "maxSize": 1,
        "name": "examiners_data",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "json"
      }
    ],
    "id": "pbc_2102782606",
    "indexes": [],
    "listRule": null,
    "name": "finale_exam_schedule_with_examiners_view",
    "system": false,
    "type": "view",
    "updateRule": null,
    "viewQuery": "SELECT\n    s.id AS id, \n    s.date,\n    s.start_time,\n    s.end_time,\n    s.student_ids,\n    s.room AS room_id,\n    r.room_name,\n    (\n        SELECT json_group_array(\n            json_object(\n                'examiner_id', e.id,\n                'lecturer_id', l.id,\n                'lecturer_name', l.name,\n                'lecturer_nip', l.nip,\n                'role_id', er.id,\n                'role_name', er.role\n            )\n        )\n        FROM finale_exam_examiner AS e\n        JOIN lecturers AS l ON l.id = e.id_lecturer\n        JOIN finale_exam_examiner_role AS er ON er.id = e.role\n        WHERE e.id_schedule = s.id\n    ) AS examiners_data\nFROM finale_exam_schedules AS s\nLEFT JOIN finale_exam_rooms AS r ON r.id = s.room",
    "viewRule": null
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2102782606");

  return app.delete(collection);
})
