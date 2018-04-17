'use strict';

const modelPermissions = require('../../server/_static-permissions.js');

module.exports = function(Project) {
  /* ======= create ======== */
  // assign date to project on create
  Project.beforeRemote('create', function(ctx, model, next) {
    ctx.args.data.date = Date.now();
    next();
  });

  // after create project, create access
  Project.afterRemote('create', function(ctx, model, next) {
    Project.app.models.Access.create({
      tukangID: ctx.args.options.accessToken.userId,
      projectID: model.id,
      roleKey: modelPermissions.filter(i => {
        if(i.type === undefined) {
          return true;
        }
      }).map(i => i.roleKey)
    }, function(err, rs) {
      next();
    });
  });

  /* ======= find ======== */
  // allowed to find all project in company if any but only can see detail of assigned project, handle in afterRemote
  Project.beforeRemote('find', function(ctx, model, next) {
    function noProjectAllowed() {
      ctx.args.filter = {
        where: {
          id: 0
        }
      };
      next();
      // console.log('===== find - noProjectAllowed - ctx.args:', ctx.args);
    }

    function returnProjectIds(data) {
      if(data && data.length > 0) {
        ctx.args.filter = {
          where: {
            id: {
              inq: data.map(i => i.projectID),
            }
          }
        };
        next();
      } else {
        noProjectAllowed()
      }
      // console.log('===== find - returnProjectIds - ctx.args:', ctx.args);
    }

    function getProjectByCompany(companyID) {
      Project.app.models.Group.find({
        fields: {
          projectID: true
        },
        where: {
          companyID
        }
      }, function(err, rs) {
        if (err || rs.length === 0) {
          noProjectAllowed();
        }

        returnProjectIds(rs)
      });
    }

    // if no user token, return empty result
    if (ctx.args.options.accessToken === null) {
      noProjectAllowed();
    }

    // if user token exist, find allowed project ids
    if (ctx.args.options.accessToken !== null) {
      // find all projects by access
      Project.app.models.Access.find({
        fields: {
          projectID: true
        },
        where: {
          tukangID: ctx.args.options.accessToken.userId
        }
      }, function(err, rs) {
        if(err || rs.length === 0) {
          noProjectAllowed();
        }

        // find companyID
        Project.app.models.Group.find({
          fields: {
            companyID: true
          },
          where: {
            projectID: {
              inq: rs.map(i => i.projectID),
            }
          }
        }, function(err, group) {
          if(err || group.length === 0) { // if no company profile === free user project
            returnProjectIds(rs);
          } else { // if companyID found
            getProjectByCompany(group[0].companyID);
          }
        });
      });
    }
  });

  /* ======= findById ======== */
  // filter on find by id, make sure user assign to requested project
  // Project.beforeRemote('findById', function(ctx, model, next) {
  //   console.log('====== before findById - ctx.args:', ctx.args);
  //   next();
  // });

  // remove all detail project if not admin and not asigned project
  Project.afterRemote('findById', function(ctx, model, next) {
    console.log('======= after findById - ctx.args:', ctx.args);
    console.log('======= after findById - model:', model);

    // if not user and project not in group, trim  detail, add message code to contact admin/manager


    next();
  });

  /* ======= dataSourceAttached ======== */
  // get sprint, task, comment, and note on request project
  Project.on('dataSourceAttached', function(obj){
    const find = Project.find;
    Project.find = function(filter, cb) {
      /* argument already modify on beforeRemote find, adding where in ids user goup */

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

  // find my company projects only for user register in a  group
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
