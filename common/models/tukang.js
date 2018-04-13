'use strict';

module.exports = function(Tukang) {
  // on register by invite, include in team as team lead | member | accounting | product manager base on invited mapping

  // on create project, do nothing, it already as owner

  // on get data, include access, group, company data
  Tukang.afterRemote('findById', function(ctx, user, next) {
    if(ctx.result) {
      // is user have access createProject
      const getAccess = () => {
        return new Promise((resolve, reject) => {
          Tukang.app.models.Access.find({
            where: {
              roleKey: 'createProject',
              tukangID: ctx.result.id
            }
          }, function(err, rs) {
            const o = {createProject : false};

            if (rs) {
              o['createProject'] = true;
            }

            resolve(o);
            reject(o)
          });
        });
      };

      // get user company
      const getCompany = () => {
        return new Promise((resolve, reject) => {
          Tukang.app.models.Group.find({
            fields: {
              companyID: true
            },
            where: {
              tukangID: ctx.result.id
            }
          }, function(err, group) {
            const o = {name : 'My Company'};

            if (group) {
              Tukang.app.models.Company.find({
                where: {
                  id: group[0].companyID
                }
              }, function(err, rs) {
                if (rs) {
                  o['name'] = rs[0].name;
                }

                resolve(o);
                reject(o)
              });
            } else {
              resolve(o);
              reject(o)
            }
          });
        });
      };

      // add access and company to user object
      const getUserData = async () => {
        const access = await getAccess();
        const company = await getCompany();

        ctx.result.createProject = access.createProject;
        ctx.result.company = company.name;
        next();
      };

      getUserData();

    } else {
      next();
    }

  });

  // ini tester dan sudah bisa, perlu add di tukang.jason allow owner getName
  // Tukang.getName = function(shopId, cb) {
  //   Tukang.findById( shopId, function (err, instance) {
  //     var response = "Name of coffee shop is " + instance.name;
  //     cb(null, response);
  //     console.log(response);
  //   });
  // }
  //
  // Tukang.remoteMethod (
  //   'getName',
  //   {
  //     http: {path: '/getname', verb: 'get'},
  //     accepts: {arg: 'id', type: 'number', http: { source: 'query' } },
  //     returns: {arg: 'name', type: 'string'}
  //   }
  // );

  //   Project.beforeRemote( '*', function( ctx, modelInstance, next) {
  //     console.log(ctx);
  //     console.log(modelInstance);
  //     console.log('masuk project');
  //     next();
  // });

  Tukang.disableRemoteMethodByName("prototype.__delete__projects");   // disbale delete all projects
  Tukang.disableRemoteMethodByName("prototype.__delete__teams");   // disbale delete all teams

  Tukang.disableRemoteMethodByName("upsert");                               // disables PATCH /Tukangs
  Tukang.disableRemoteMethodByName("find");                                 // disables GET /Tukangs
  // Tukang.disableRemoteMethodByName("replaceOrCreate");                      // disables PUT /Tukangs
  // Tukang.disableRemoteMethodByName("create");                               // disables POST /Tukangs

  Tukang.disableRemoteMethodByName("prototype.updateAttributes");           // disables PATCH /Tukangs/{id}
  // Tukang.disableRemoteMethodByName("findById");                             // disables GET /Tukangs/{id}
  Tukang.disableRemoteMethodByName("exists");                               // disables HEAD /Tukangs/{id}
  // Tukang.disableRemoteMethodByName("replaceById");                          // disables PUT /Tukangs/{id}
  // Tukang.disableRemoteMethodByName("deleteById");                           // disables DELETE /Tukangs/{id}

  Tukang.disableRemoteMethodByName('prototype.__get__accessTokens');        // disable GET /Tukangs/{id}/accessTokens
  Tukang.disableRemoteMethodByName('prototype.__create__accessTokens');     // disable POST /Tukangs/{id}/accessTokens
  Tukang.disableRemoteMethodByName('prototype.__delete__accessTokens');     // disable DELETE /Tukangs/{id}/accessTokens

  Tukang.disableRemoteMethodByName('prototype.__findById__accessTokens');   // disable GET /Tukangs/{id}/accessTokens/{fk}
  Tukang.disableRemoteMethodByName('prototype.__updateById__accessTokens'); // disable PUT /Tukangs/{id}/accessTokens/{fk}
  Tukang.disableRemoteMethodByName('prototype.__destroyById__accessTokens');// disable DELETE /Tukangs/{id}/accessTokens/{fk}

  Tukang.disableRemoteMethodByName('prototype.__count__accessTokens');      // disable  GET /Tukangs/{id}/accessTokens/count

  Tukang.disableRemoteMethodByName("prototype.verify");                     // disable POST /Tukangs/{id}/verify
  // Tukang.disableRemoteMethodByName("changePassword");                       // disable POST /Tukangs/change-password
  Tukang.disableRemoteMethodByName("createChangeStream");                   // disable GET and POST /Tukangs/change-stream

  Tukang.disableRemoteMethodByName("confirm");                              // disables GET /Tukangs/confirm
  // Tukang.disableRemoteMethodByName("count");                                // disables GET /Tukangs/count
  Tukang.disableRemoteMethodByName("findOne");                              // disables GET /Tukangs/findOne

  //Tukang.disableRemoteMethodByName("login");                                // disables POST /Tukangs/login
  //Tukang.disableRemoteMethodByName("logout");                               // disables POST /Tukangs/logout

  // Tukang.disableRemoteMethodByName("resetPassword");                        // disables POST /Tukangs/reset
  // Tukang.disableRemoteMethodByName("setPassword");                          // disables POST /Tukangs/reset-password
  // Tukang.disableRemoteMethodByName("update");                               // disables POST /Tukangs/update
  // Tukang.disableRemoteMethodByName("upsertWithWhere");                      // disables POST /Tukangs/upsertWithWhere
};
