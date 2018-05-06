const modelPermissions = require('../_static-permissions.js');

const log = (label, data, inline) => {
  return;
  if (data === undefined) {
    console.log(`\n\n* ==== permission-crud.js ==================== ${label} ======================== *`);
  } else {
    console.log(`==== permission-crud.js ==================== ${label}:${inline ? '' : '\n'}`, data);
  }
};

module.exports = function(app) {
  const MODEL_ANCESTOR = 'ancestor';
  const MODEL_PROJECT = 'project';
  const MODEL_SPRINT = 'sprint';
  const MODEL_TASK = 'task';

  const parentMapping = {
    comment: MODEL_TASK,
    note: MODEL_TASK,
    task: MODEL_SPRINT,
    sprint: MODEL_PROJECT,
    project: MODEL_ANCESTOR
  };

  // return 0: new project, projectID: has access, -1: no access
  const getProjectId = (model, parentID, contextID, callback) => {
    const noPermision = -1;
    switch (parentMapping[model]) {
      case MODEL_TASK:
        // log("masuk task");
        app.models.Task.findById(parentID, function(err, task) {
          if (err || task === null) {
            callback(noPermision);
          }
          // log("ada task parent");
          getProjectId(MODEL_TASK, task.parentID, 0, callback);
        });

        break;
      case MODEL_SPRINT:
        // log("masuk sprint");
        app.models.Sprint.findById(parentID, function(err, sprint) {
          if (err || sprint === null) {
            callback(noPermision);
          }
          // log("ada sprint parent:", sprint.parentID, true);
          callback(sprint.parentID);
        });

        break;
      case MODEL_PROJECT:
        callback(parentID);

        break;
      case MODEL_ANCESTOR: // return requested id: 0 or id
        log('masuk ancestor');
        callback(contextID);

        break;
      default:
        log('masuk default');
        callback(noPermision);
    }
  };

  for(const roleObj of modelPermissions) {
    // exclude admin, createProject
    if(roleObj.roleKey === 'admin') continue;
    if(roleObj.roleKey === 'createProject') continue;

    // handle permissions
    app.models.Role.registerResolver(roleObj.roleKey, function(role, context, cb) {
      function reject(from) {

        log('reject', from, true);

        process.nextTick(function() {
          cb(null, false);
        });
      }

      log('masuk crud permissions roleObj.roleKey: ', roleObj.roleKey, true);

      // define contextID and parentID
      const contextID = context.modelId === undefined ? 0 : context.modelId;
      const parentID = context.remotingContext.args.data === undefined ? 0
        : (context.remotingContext.args.data.parentID === undefined ? 0 : context.remotingContext.args.data.parentID);

      // if the target model is not roleObj.model
      let modelName = roleObj.model;
      if(typeof(roleObj.model) === "array" || typeof(roleObj.model) === "object") {
        if(roleObj.model.indexOf(context.modelName) >= 0) {
          modelName = context.modelName;
        }
      }

      // log('modelName', modelName, true);
      if (context.modelName !== modelName) {
        return reject('context.modelName !== modelName');
      }

      // if has parent and parentID == 0 => reject
      if(parentMapping[modelName] !== MODEL_ANCESTOR && parentID === 0) {
        return reject('parentMapping[modelName] && parentID === 0');
      }

      // do not allow anonymous users
      if (!context.accessToken.userId) {
        return reject('!context.accessToken.userId');
      }

      // if user have roleObj.roleKey
      getProjectId(modelName, parentID, contextID, function(projectID){

        log('masuk callback projectID: ', projectID, true);

        // if projectID === 0, mean it create project, let it go
        if (projectID === 0) {
          cb(null, true);
          return;
        }

        if (projectID === -1) {
          return reject('projectID === -1');
        }

        app.models.Access.count({
          tukangID: context.accessToken.userId,
          roleKey: roleObj.roleKey
        }, function(err, count) {

          log('app.models.Access.find instance', count, true);

          if (err) {
            return reject('err');
          }

          cb(null, count > 0); // true = has permission
        });
      });
    });
  }
};
