'use strict';

module.exports = function(Permission) {
  Permission.disableRemoteMethodByName("upsert");                               // disables PATCH /Permissions
  // Permission.disableRemoteMethodByName("find");                                 // disables GET /Permissions
  Permission.disableRemoteMethodByName("replaceOrCreate");                      // disables PUT /Permissions
  // Permission.disableRemoteMethodByName("create");                               // disables POST /Permissions

  Permission.disableRemoteMethodByName("prototype.updateAttributes");           // disables PATCH /Permissions/{id}
  // Permission.disableRemoteMethodByName("findById");                             // disables GET /Permissions/{id}
  Permission.disableRemoteMethodByName("exists");                               // disables HEAD /Permissions/{id}
  // Permission.disableRemoteMethodByName("replaceById");                          // disables PUT /Permissions/{id}
  // Permission.disableRemoteMethodByName("deleteById");                           // disables DELETE /Permissions/{id}

  Permission.disableRemoteMethodByName("createChangeStream");                   // disable GET and POST /Permissions/change-stream

  Permission.disableRemoteMethodByName("count");                                // disables GET /Permissions/count
  Permission.disableRemoteMethodByName("findOne");                              // disables GET /Permissions/findOne

  Permission.disableRemoteMethodByName("update");                               // disables POST /Permissions/update
  Permission.disableRemoteMethodByName("upsertWithWhere");                      // disables POST /Permissions/upsertWithWhere

};
