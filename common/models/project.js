'use strict';
const modelPermissions = require('../../server/_static-permissions.js');

const log = (label, data, inline) => {
  return;
  if (data === undefined) {
    console.log(`\n* ==== project.js ==================== ${label} ======================== *`);
  } else {
    console.log(`==== project.js ==================== ${label}:${inline ? '' : '\n'}`, data);
  }
};

module.exports = function(Project) {
  /* ======= create ======== */
  // assign date to project on create
  Project.beforeRemote('create', function(ctx, model, next) {
    log('ctx.args', ctx.args);
    ctx.args.data.date = Date.now();
    ctx.args.data.ownerID = ctx.args.options.accessToken.userId;
    next();
  });

  // after create project, create access
  Project.afterRemote('create', function(ctx, model, next) {
    Project.app.models.Access.create({
      tukangID: ctx.args.options.accessToken.userId,
      projectID: model.id,
      roleKey: modelPermissions.filter(i => {
        if(i.type === undefined) { // for unpaid user
          return true;
        }
      }).map(i => i.roleKey)
    }, function(err, rs) {

      log('rs', rs);
      log('model', model);

      next();
    });
  });

  /* ======= find ======== */
  // allowed to find any project if have access
  Project.beforeRemote('find', function(ctx, model, next) {
    function ownProjectOnly() {
      ctx.args.filter = {
        where: {
          ownerID: ctx.args.options.accessToken.userId
        }
      };
      log('find - ownProjectOnly - ctx.args.filter:', ctx.args.filter);
      next();
    }

    function returnProjectIds(data) {
      if(data && data.length > 0) {
        ctx.args.filter = {
          where: {
            id: {
              inq: data.filter(item => item.roleKey.indexOf('findProject') >= 0).map(i => i.projectID),
            }
          }
        };
        log('find - returnProjectIds - ctx.args.filter', ctx.args.filter);
        next();
      } else {
        ownProjectOnly()
      }
    }

    log('masuk project.js find');

    // find allowed project ids
    if (ctx.args.options.accessToken !== null) {
      Project.app.models.Access.find({
        where: {
          tukangID: ctx.args.options.accessToken.userId
        }
      }, function(err, instance) {

        log('access instance', instance);

        if(err || instance.length === 0) {
          ownProjectOnly();
        } else {
          returnProjectIds(instance);
        }
      });
    }
  });

  /* ======= findById ======== */
  // filter on find by id, make sure user assign to requested project
  // Project.beforeRemote('findById', function(ctx, model, next) {
  //   console.log('====== before findById - ctx.args:', ctx.args);
  //   next();
  // });

  // // remove all detail project if not admin and not asigned project
  // Project.afterRemote('findById', function(ctx, model, next) {
  //   log('after findById - ctx.args:', ctx.args);
  //   log('after findById - model:', model);
  //
  //   // if not user and project not in group, trim  detail, add message code to contact admin/manager
  //
  //   next();
  // });

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
