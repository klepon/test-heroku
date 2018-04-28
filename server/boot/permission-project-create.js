const modelPermissions = require('../_static-permissions.js');

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

      // console.log("======================================= auth disabled lo =======================================");
      // do not allow anonymous users
      if (!context.accessToken.userId) {
        return reject();
      }

      // limit 1 except has access roleKey admin or in a company
      app.models.Access.find({
        fields: {
          roleKey: true,
          projectID: true
        },
        where: {
          tukangID: context.accessToken.userId
        }
      }, function(err, rs) {
        if (err) {
          cb(null, true); // no project found for this user
        }

        // user exist on access, check it roleKey
        if (rs) {
          // console.log('=== access rs:', rs);
          // if admin
          if(rs.find(i => {
            return i.roleKey.find(r => r === 'admin')
          })) {
            cb(null, true);
          }

          // if not admin, let check the group/company; exist on group = allow, no exist = disallow
          else {
            app.model.Group.count({
              projectID: {
                inq: rs.map(i => i.projectID)
              }
            }, function(err, rs) {
              if (err) { // not in a company, but already have on project, no mor project for you :D
                reject();
              }

              return cb(null, rs > 0);
            });
          }
        }
      });
    });
  }
};
