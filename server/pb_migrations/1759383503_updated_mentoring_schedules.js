/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1693433272")

  // add field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "bool2678748864",
    "name": "is_requested",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1693433272")

  // remove field
  collection.fields.removeById("bool2678748864")

  return app.save(collection)
})
