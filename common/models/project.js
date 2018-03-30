'use strict';

module.exports = function(Project) {
  Project.on('dataSourceAttached', function(obj){
    const find = Project.find;
    Project.find = function(filter, cb) {
      // get child if define
      if(filter !== undefined) {
        if (filter.include && filter.include === 'child') {
          filter['include'] = [
            {
              relation: 'sprints',
              scope: {
                callFrom: 'project'
              }
            }
          ];
        }
      }

      arguments[0] = filter;

      return find.apply(this, arguments);
    };
  });


//   Project.beforeRemote( '*', function( ctx, modelInstance, next) {
//     console.log(ctx);
//     console.log(modelInstance);
//     console.log('masuk project');
//     next();
// });


  Project.disableRemoteMethodByName("prototype.__get__sprints");
  Project.disableRemoteMethodByName("prototype.__count__sprints");
  Project.disableRemoteMethodByName("prototype.__create__sprints");
  Project.disableRemoteMethodByName("prototype.__findById__sprints");
  Project.disableRemoteMethodByName("prototype.__delete__sprints");

  Project.disableRemoteMethodByName("prototype.__deleteById__sprints");
  Project.disableRemoteMethodByName("prototype.__replaceById__sprints");


  Project.disableRemoteMethodByName("upsert");                               // disables PATCH /Projects
  // Project.disableRemoteMethodByName("find");                                 // disables GET /Projects
  Project.disableRemoteMethodByName("replaceOrCreate");                      // disables PUT /Projects
  // Project.disableRemoteMethodByName("create");                               // disables POST /Projects

  Project.disableRemoteMethodByName("prototype.updateAttributes");           // disables PATCH /Projects/{id}
  // Project.disableRemoteMethodByName("findById");                             // disables GET /Projects/{id}
  Project.disableRemoteMethodByName("exists");                               // disables HEAD /Projects/{id}
  // Project.disableRemoteMethodByName("replaceById");                          // disables PUT /Projects/{id}
  // Project.disableRemoteMethodByName("deleteById");                           // disables DELETE /Projects/{id}

  Project.disableRemoteMethodByName("createChangeStream");                   // disable GET and POST /Projects/change-stream

  Project.disableRemoteMethodByName("count");                                // disables GET /Projects/count
  Project.disableRemoteMethodByName("findOne");                              // disables GET /Projects/findOne

  Project.disableRemoteMethodByName("update");                               // disables POST /Projects/update
  Project.disableRemoteMethodByName("upsertWithWhere");                      // disables POST /Projects/upsertWithWhere
};
