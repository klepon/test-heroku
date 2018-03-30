module.exports = function(app) {
  const permissionKey = 'admin';

  // check if user is admin
  app.models.Role.registerResolver(permissionKey, function(role, context, cb) {
    function reject() {
      process.nextTick(function() {
        cb(null, false);
      });
    }

    // commenting this because admin can access any model they assigned
    // if the target model is not 'modelName'
    // if (context.modelName !== modelName) {
    //   return reject();
    // }

    // do not allow anonymous users
    var userId = context.accessToken.userId;
    if (!userId) {
      return reject();
    }

    // current user is admin
    app.models.Team.count({
      tukangID: userId,
      roleKey: permissionKey
    }, function(err, count) {
      if (err) {
        return reject();
      }

      cb(null, count > 0); // true = allow
    });
  });
};
