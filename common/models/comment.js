'use strict';

module.exports = function(Comment) {

    Comment.disableRemoteMethodByName("upsert");                               // disables PATCH /Comments
    Comment.disableRemoteMethodByName("find");                                 // disables GET /Comments
    Comment.disableRemoteMethodByName("replaceOrCreate");                      // disables PUT /Comments
    // Comment.disableRemoteMethodByName("create");                               // disables POST /Comments

    Comment.disableRemoteMethodByName("prototype.updateAttributes");           // disables PATCH /Comments/{id}
    Comment.disableRemoteMethodByName("findById");                             // disables GET /Comments/{id}
    Comment.disableRemoteMethodByName("exists");                               // disables HEAD /Comments/{id}
    // Comment.disableRemoteMethodByName("replaceById");                          // disables PUT /Comments/{id}
    // Comment.disableRemoteMethodByName("deleteById");                           // disables DELETE /Comments/{id}

    Comment.disableRemoteMethodByName("createChangeStream");                   // disable GET and POST /Comments/change-stream

    Comment.disableRemoteMethodByName("count");                                // disables GET /Comments/count
    Comment.disableRemoteMethodByName("findOne");                              // disables GET /Comments/findOne

    Comment.disableRemoteMethodByName("update");                               // disables POST /Comments/update
    Comment.disableRemoteMethodByName("upsertWithWhere");                      // disables POST /Comments/upsertWithWhere

};
