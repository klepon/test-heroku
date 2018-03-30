'use strict';

module.exports = function(Note) {
  // Note.on('dataSourceAttached', function(obj){
  //   var find = Note.find;
  //
  //   Note.find = function(filter, cb) {
  //     // console.log(this.super_.__rank);
  //     // console.log('=============== masuk find Note\n', arguments);
  //
  //     return find.apply(this, arguments);
  //   };
  // });

  Note.disableRemoteMethodByName("upsert");                               // disables PATCH /Notes
  Note.disableRemoteMethodByName("find");                                 // disables GET /Notes
  Note.disableRemoteMethodByName("replaceOrCreate");                      // disables PUT /Notes
  // Note.disableRemoteMethodByName("create");                               // disables POST /Notes

  Note.disableRemoteMethodByName("prototype.updateAttributes");           // disables PATCH /Notes/{id}
  Note.disableRemoteMethodByName("findById");                             // disables GET /Notes/{id}
  Note.disableRemoteMethodByName("exists");                               // disables HEAD /Notes/{id}
  // Note.disableRemoteMethodByName("replaceById");                          // disables PUT /Notes/{id}
  // Note.disableRemoteMethodByName("deleteById");                           // disables DELETE /Notes/{id}

  Note.disableRemoteMethodByName("createChangeStream");                   // disable GET and POST /Notes/change-stream

  Note.disableRemoteMethodByName("count");                                // disables GET /Notes/count
  Note.disableRemoteMethodByName("findOne");                              // disables GET /Notes/findOne

  Note.disableRemoteMethodByName("update");                               // disables POST /Notes/update
  Note.disableRemoteMethodByName("upsertWithWhere");                      // disables POST /Notes/upsertWithWhere

};
