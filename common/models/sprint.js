'use strict';

module.exports = function(Sprint) {
  Sprint.on('dataSourceAttached', function(obj){
    var find = Sprint.find;
    Sprint.find = function(filter, cb) {

      // get child if callFrom project
      if (arguments[0].callFrom === 'project') {
        filter['include'] = [
          {
            relation: 'tasks',
            scope: {
              callFrom: 'sprint'
            }
          }
        ];
      }

      arguments[0] = filter;

      return find.apply(this, arguments);
    };
  });

  Sprint.disableRemoteMethodByName("prototype.__get__tasks");
  Sprint.disableRemoteMethodByName("prototype.__count__tasks");
  Sprint.disableRemoteMethodByName("prototype.__create__tasks");
  Sprint.disableRemoteMethodByName("prototype.__findById__tasks");
  Sprint.disableRemoteMethodByName("prototype.__delete__tasks");

  Sprint.disableRemoteMethodByName("upsert");                               // disables PATCH /Sprints
  Sprint.disableRemoteMethodByName("find");                                 // disables GET /Sprints
  Sprint.disableRemoteMethodByName("replaceOrCreate");                      // disables PUT /Sprints
  // Sprint.disableRemoteMethodByName("create");                               // disables POST /Sprints

  Sprint.disableRemoteMethodByName("prototype.updateAttributes");           // disables PATCH /Sprints/{id}
  Sprint.disableRemoteMethodByName("findById");                             // disables GET /Sprints/{id}
  Sprint.disableRemoteMethodByName("exists");                               // disables HEAD /Sprints/{id}
  // Sprint.disableRemoteMethodByName("replaceById");                          // disables PUT /Sprints/{id}
  // Sprint.disableRemoteMethodByName("deleteById");                           // disables DELETE /Sprints/{id}

  Sprint.disableRemoteMethodByName("createChangeStream");                   // disable GET and POST /Sprints/change-stream

  Sprint.disableRemoteMethodByName("count");                                // disables GET /Sprints/count
  Sprint.disableRemoteMethodByName("findOne");                              // disables GET /Sprints/findOne

  Sprint.disableRemoteMethodByName("update");                               // disables POST /Sprints/update
  Sprint.disableRemoteMethodByName("upsertWithWhere");                      // disables POST /Sprints/upsertWithWhere

};
