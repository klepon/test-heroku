const modelPermissions = require('../_static-permissions.js');

module.exports = function(app) {
  var Permission = app.models.permission;

  // add default permission, first check make sure permission admin not exists before save data
  Permission.count({
    roleKey: 'admin'
  }, function(err, count) {
    if (err) {
      return cb(null, false);
    }

    if(count === 0) {
      Permission.create(modelPermissions.map(p => {
        // destructuring operator not working here :(
        return {
          roleKey: p.roleKey,
          descriptionEn: p.descriptionEn,
          descriptionId: p.descriptionId
        };
      }),
      function(err, permissions) {
        if (err) throw err;
      });
    }
  });
}
