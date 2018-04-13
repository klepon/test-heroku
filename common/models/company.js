'use strict';

module.exports = function(Company) {
  Company.disableRemoteMethodByName("upsert");                               // disables PATCH /Companys
  // Company.disableRemoteMethodByName("find");                                 // disables GET /Companys
  Company.disableRemoteMethodByName("replaceOrCreate");                      // disables PUT /Companys
  // Company.disableRemoteMethodByName("create");                               // disables POST /Companys

  Company.disableRemoteMethodByName("prototype.updateAttributes");           // disables PATCH /Companys/{id}
  // Company.disableRemoteMethodByName("findById");                             // disables GET /Companys/{id}
  Company.disableRemoteMethodByName("exists");                               // disables HEAD /Companys/{id}
  // Company.disableRemoteMethodByName("replaceById");                          // disables PUT /Companys/{id}
  // Company.disableRemoteMethodByName("deleteById");                           // disables DELETE /Companys/{id}

  Company.disableRemoteMethodByName("createChangeStream");                   // disable GET and POST /Companys/change-stream

  Company.disableRemoteMethodByName("count");                                // disables GET /Companys/count
  Company.disableRemoteMethodByName("findOne");                              // disables GET /Companys/findOne

  Company.disableRemoteMethodByName("update");                               // disables POST /Companys/update
  Company.disableRemoteMethodByName("upsertWithWhere");                      // disables POST /Companys/upsertWithWhere

};
