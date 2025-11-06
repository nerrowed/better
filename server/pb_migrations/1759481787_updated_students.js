/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2651147324")

  // update collection data
  unmarshal({
    "createRule": "id != \"\"",
    "deleteRule": "id != \"\"",
    "updateRule": "id != \"\"",
    "viewRule": "id != \"\""
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2651147324")

  // update collection data
  unmarshal({
    "createRule": "id = @request.auth.id",
    "deleteRule": "id = @request.auth.id",
    "updateRule": "id = @request.auth.id",
    "viewRule": "id = @request.auth.id"
  }, collection)

  return app.save(collection)
})
