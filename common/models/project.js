'use strict';

module.exports = function(Project) {
  // after create -> update group and access?

  // assign date to project on create
  Project.beforeRemote('create', function(ctx, model, next) {
    ctx.args.data.date = Date.now();
    next();
  });

  // allowe only project ids base on user group before find
  Project.beforeRemote('find', function(ctx, model, next) {
    // if no user token, return empty result, this my not happen since user token already filter on global permission
    if (ctx.args.options.accessToken === null) {
      // console.log('masuk null');
      ctx.args.filter = {
        where: {
          id: 0
        }
      };
      next();
    }

    // if user token exist
    if (ctx.args.options.accessToken !== null) {
      // console.log('masuk tak null');
      Project.app.models.Group.find({
        fields: {
          projectID: true
        },
        where: {
          tukangID: ctx.args.options.accessToken.userId
        }
      }, function(err, rs) {
        if (rs) {
          ctx.args.filter = {
            where: {
              id: {
                inq: rs.map(i => i.projectID),
              }
            }
          };
        }

        next();
      });
    }
  });

  // get sprint, task, comment, and note on request project
  Project.on('dataSourceAttached', function(obj){
    const find = Project.find;
    Project.find = function(filter, cb) {
      /* argument already modify on before remove find, adding where in ids user goup */

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

  // find my company projects
  Project.getCompanyProjects = function(modelID, cb) {
    Project.findById( modelID, function (err, instance) {

      console.log(instance);

      var response = `Name of coffee shop is ${instance.name}`;
      cb(null, response);

      console.log(response);

    });
  }

  Project.remoteMethod (
    'getCompanyProjects',
    {
      http: {path: '/getname', verb: 'get'},
      accepts: {arg: 'id', type: 'number', http: { source: 'query' } },
      returns: {arg: 'name', type: 'string'}
    }
  );

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
