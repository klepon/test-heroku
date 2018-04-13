const modelPermissions = require('../_static-permissions.js');

module.exports = function(app) {
  const MODEL_PROJECT = 'project';
  const MODEL_SPRINT = 'sprint';
  const MODEL_TASK = 'task';

  const parentMapping = {
    comment: MODEL_TASK,
    note: MODEL_TASK,
    task: MODEL_SPRINT,
    sprint: MODEL_PROJECT,
    project: false
  };

  const getProjectId = (model, parentID, contextID, callback) => {
    // if current model is project
    if (!parentMapping[model]) {
      // console.log('================================================== masuk ancestor');
      callback(contextID); // it is top ancester
      return;
    }

    // get project id (has permission) or 0 (no permission)
    switch (parentMapping[model]) {
      case MODEL_TASK:
        // console.log("================================================== masuk task");
        app.models.Task.findById(parentID, function(err, task) {
          if (err || task === null) {
            callback(0);
          }
          // console.log("================================================== ada task parent");
          getProjectId(MODEL_TASK, task.parentID, 0, callback);
        });

        break;
      case MODEL_SPRINT:
        // console.log("================================================== masuk sprint");
        app.models.Sprint.findById(parentID, function(err, sprint) {
          if (err || sprint === null) {
            callback(0);
          }
          // console.log("================================================== ada sprint parent:", sprint.parentID);
          callback(sprint.parentID);
        });

        break;
      case MODEL_PROJECT:
        callback(parentID);

        break;
      default:
        // console.log('================================================== masuk default');
        callback(0);
    }
  };

  for(const roleObj of modelPermissions) {
    // exclude admin
    if(roleObj.roleKey === 'admin') continue;

    // handle permissions
    app.models.Role.registerResolver(roleObj.roleKey, function(role, context, cb) {
      function reject() {
        process.nextTick(function() {
          cb(null, false);
        });
      }

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

      // console.log(modelName);

      if (context.modelName !== modelName) {
        return reject();
      }

      // if has parent and parentID == 0 => reject
      if(parentMapping[modelName] && parentID === 0) {
        return reject();
      }

      // do not allow anonymous users
      if (!context.accessToken.userId) {
        return reject();
      }

      // if user have roleObj.roleKey
      getProjectId(modelName, parentID, contextID, function(projectID){

        // console.log('masuk callback projectID: ', projectID);

        app.models.Access.count({
          tukangID: context.accessToken.userId,
          projectID: projectID,
          roleKey: roleObj.roleKey
        }, function(err, count) {
          if (err) {
            return reject();
          }

          cb(null, count > 0); // true = has permission
        });
      });
    });
  }
};
