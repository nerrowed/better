/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2651147324")

  // update collection data
  unmarshal({
    "listRule": ""
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2651147324")

  // update collection data
  unmarshal({
    "listRule": "id = @request.auth.id"
  }, collection)

  return app.save(collection)
})
