const modelPermissions = require('../_static-permissions.js');

const log = (label, data, inline) => {
  return;
  if (data === undefined) {
    console.log(`\n* ==== permision-project-create.js ==================== ${label} ======================== *`);
  } else {
    console.log(`==== permision-project-create.js ==================== ${label}:${inline ? '' : '\n'}`, data);
  }
};

const countMyProjects = (models, userId, callback) => {
  models.Project.count({
    ownerID: userId
  }, function(err, count) {
    callback(count);
  })
}

module.exports = function(app) {
  for(const roleObj of modelPermissions) {
    // only for createProject
    if(roleObj.roleKey !== 'createProject') continue;

    // handle permissions
    app.models.Role.registerResolver(roleObj.roleKey, function(role, context, cb) {
      function reject() {
        process.nextTick(function() {
          cb(null, false);
        });
      }

      // check only correct model (project)
      if (context.modelName !== roleObj.model) {
        return reject();
      }

      // log("auth disabled lo");
      // do not allow anonymous users
      if (!context.accessToken.userId) {
        return reject();
      }

      /* is admin? allow
      * no admin? no project created? allowed
      */
      log('context.accessToken', context.accessToken);
      log('context.accessToken.userId', context.accessToken.userId, true);
      app.models.Access.find({
        where: {
          tukangID: context.accessToken.userId
        }
      }, function(err, instance){
        log('instance', instance);

        // no project at all, allowed
        if (instance.length === 0) {
          log('no project no admin');
          cb(null, true); // no project found for this user
          return;
        }

        // found project, let check if admin
        if (instance.length > 0) {

          if (instance.find(access => access.roleKey === 'admin')) { // admin
            log('is admin');
            cb(null, true);
          } else { // no project created
            countMyProjects(app.models, context.accessToken.userId, function(count){
              log('no project created, count === 0', count === 0, true);
              cb(null, count === 0);
            });
          }
        }
      });
    });
  }
};
