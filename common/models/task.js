'use strict';

module.exports = function(Task) {
  Task.on('dataSourceAttached', function(obj){
    var find = Task.find;
    Task.find = function(filter, cb) {

      // get child if callFrom sprint
      if (arguments[0].callFrom === 'sprint') {
        let userId = 0;
        if(arguments[1].accessToken !== undefined && arguments[1].accessToken !== null) {
          userId = arguments[1].accessToken.userId;
        }

        filter['include'] = [
          {
            relation: 'notes',
            scope: {
              where: {ownerId: userId}
            }
          },
          'comments'
        ];
      }

      arguments[0] = filter;
      return find.apply(this, arguments);
    };
  });

  Task.disableRemoteMethodByName("prototype.__get__comments");
  Task.disableRemoteMethodByName("prototype.__count__comments");
  Task.disableRemoteMethodByName("prototype.__create__comments");
  Task.disableRemoteMethodByName("prototype.__findById__comments");
  Task.disableRemoteMethodByName("prototype.__delete__comments");

  Task.disableRemoteMethodByName("prototype.__get__notes");
  Task.disableRemoteMethodByName("prototype.__count__notes");
  Task.disableRemoteMethodByName("prototype.__create__notes");
  Task.disableRemoteMethodByName("prototype.__findById__notes");
  Task.disableRemoteMethodByName("prototype.__delete__notes");

  Task.disableRemoteMethodByName("upsert");                               // disables PATCH /Tasks
  Task.disableRemoteMethodByName("find");                                 // disables GET /Tasks
  Task.disableRemoteMethodByName("replaceOrCreate");                      // disables PUT /Tasks
  // Task.disableRemoteMethodByName("create");                               // disables POST /Tasks

  Task.disableRemoteMethodByName("prototype.updateAttributes");           // disables PATCH /Tasks/{id}
  Task.disableRemoteMethodByName("findById");                             // disables GET /Tasks/{id}
  Task.disableRemoteMethodByName("exists");                               // disables HEAD /Tasks/{id}
  // Task.disableRemoteMethodByName("replaceById");                          // disables PUT /Tasks/{id}
  // Task.disableRemoteMethodByName("deleteById");                           // disables DELETE /Tasks/{id}

  Task.disableRemoteMethodByName("createChangeStream");                   // disable GET and POST /Tasks/change-stream

  Task.disableRemoteMethodByName("count");                                // disables GET /Tasks/count
  Task.disableRemoteMethodByName("findOne");                              // disables GET /Tasks/findOne

  Task.disableRemoteMethodByName("update");                               // disables POST /Tasks/update
  Task.disableRemoteMethodByName("upsertWithWhere");                      // disables POST /Tasks/upsertWithWhere

};
