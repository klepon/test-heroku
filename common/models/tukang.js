'use strict';
const md5 = require('md5');
const sendMail = require('../../server/_send-email.js');
const langData = require('../../server/_static-lang.js');
const CONST = require('../../server/_static-const.js');

const log = (label, data) => {
  return;
  if (data === undefined) {
    console.log(`\n* ==== tukang.js ==================== ${label} ======================== *`);
  } else {
    console.log(`==== tukang.js ==================== ${label}:\n`, data);
  }
};

// get comapny id in group table by userId
const getCompanyID = ({ models, userId, callback, errorCallback = () => {} } = params) => {
  log("getCompanyID userId", userId);

  models.Group.find({
    where: {
      tukangID: userId
    }
  }, function(err, instance) {
    log("getCompanyID instance", instance);

    if (instance !== null && instance.length > 0) {
      callback(instance[0].companyID);
    } else {
      errorCallback();
    }
  });
};

// get companyName
const getCompanyName = ({ models, companyID, callback, errorCallback = () => {} } = params) => {
  models.Company.findById(companyID,
    function(err, instance) {
      if (instance !== null) {
        callback(instance);
      } else {
        errorCallback(err);
      }
    });
};

// get access
const getUserAccess = ({ models, userId, callback, errorCallback = () => {} } = params) => {
  models.Access.find({
    where: {
      tukangID: userId
    }
  }, function(err, instance) {

    log('getUserAccess instance', instance);

    if (instance !== null && instance.length > 0) {
      let access = {}
      for (let i = 0; i < instance.length; i++) {
        if (access[instance[i].projectID] === undefined) {
          access[instance[i].projectID] = [];
        }

        access[instance[i].projectID].push(instance[i].roleKey)
      }
      callback(access);
      // callback(instance);
    } else {
      errorCallback(err);
    }
  });
};

// isAdmin
const isAdmin = ({ models, userId, callback, errorCallback = () => {} } = params) => {
  getUserAccess({ models, userId,
    callback: (instance) => {
      for (let i = 0; i < instance.length; i++) {
        if (instance[i].projectID === 0 && instance[i].roleKey[0] === 'admin') {
          return callback(true);
        }
      }
      callback(false);
    },
    errorCallback
  })
}

module.exports = function(Tukang) {
  // before register add hash and send email verification
  Tukang.beforeRemote('create', function(ctx, user, next) {
    const hash = md5(md5(`${ctx.args.data.email} ${ctx.args.data.password} ${Math.random()}`));
    const lang = ctx.args.data.lang !== undefined ? ctx.args.data.lang : 'en';
    const emailMessage = langData.verifiedEmailBodyText[lang]
      .replace(/#~hash#/g, hash)
      .replace(/#~domain#/g, CONST.emailVerificationUrl)
      .replace(/#~lang#/g, lang);

    ctx.args.data = {
      "discipline": "",
      "name": "",
      "realm": "",
      hash,
      lang,
      "username": ctx.args.data.email,
      "email": ctx.args.data.email,
      "password": ctx.args.data.password,
      "emailVerified": false,
      "date": Date.now()
    }

    // send email
    // log("emailMessage: ", emailMessage.replace(/<br \/>/g, '\n'));
    // log("ctx.args.data: ", ctx.args.data);
    sendMail(
      'noreplay@ojual.com',
      ['bugs1945@gmail.com'],
      langData.verifiedEmailSubjectText[lang],
      emailMessage
    );

    next();
  });

  // after register, return only id
  Tukang.afterRemote('create', function(ctx, user, next) {
    ctx.result = {
      "id": ctx.result.id,
    }
    next();
  });

  // before login
  Tukang.beforeRemote('login', function(ctx, user, next) {
    // delete all expired unverified user
    const secondInDays = 86400;
    Tukang.destroyAll({and: [
      {date: {lt: (Date.now() - secondInDays * 3)}},
      {hash: {neq: ''}}
    ]}, function (err, instance) {
      next();
    });
  });

  // after login
  Tukang.afterRemote('login', function(ctx, user, next) {
    log("afterRemote login");

    // is email verified
    if (user.userId !== undefined) {
      Tukang.findById(user.userId,
        function (err, userData) {
          if (userData !== null && !userData.emailVerified) {
            ctx.result = {
              error: {
                status: 401,
                message: 'email not verified'
              }
            }

            next();
          } else {
            let access = {};
            let company = {}; //id, name
            let hashGroup = false;

            // generate json result
            const generateResult = () => {
              ctx.result = {
                id: user.userId,
                name: userData.name === undefined ? '' : userData.name,
                discipline: userData.discipline === undefined ? '' : userData.discipline,
                email: ctx.args.credentials.email,
                token: user.id,
                access,
                company,
                hashGroup,
              }
              next();
            }

            // get company detail by id
            const getCompany = (companyID) => {
              getCompanyName({ models: Tukang.app.models, companyID,
                callback: (instance) => {
                  company = instance;
                  generateResult();
                },
                errorCallback: () => {
                  generateResult();
                }
              });
            };

            // get group by userId
            const getGroup = () => {
              getCompanyID({ models: Tukang.app.models, userId: user.userId,
                callback: (companyID) => {
                  hashGroup = true;
                  getCompany(companyID);
                },
                errorCallback: () => {
                  generateResult();
                }
              });
            };

            // get access -> get hasGroup -> get company name
            getUserAccess({ models: Tukang.app.models, userId: user.userId,
              callback: (instance) => {
                log("getUserAccess instance", instance);

                access = instance;
                getGroup();
              },
              errorCallback: () => {
                log("getUserAccess errorCallback");
                generateResult();
              }
            });
          }
        });
    }
  });

  // before updateByID, remove company from user, update company data
  Tukang.beforeRemote('replaceById', function(ctx, user, next) {
    log("beforeRemote replaceById");

    // save company and remove form arguments
    const companyName = ctx.args.data.company;
    delete ctx.args.data.company;

    // generate user data
    const generateUserDataToRecord = () => {
      // log("ctx.args before", ctx.args);

      Tukang.findById(ctx.args.options.accessToken.userId, function(err, instance){
        // log("instance", instance);

        if (instance !== null) {
          ctx.args.data.discipline = ctx.args.data.discipline;
          ctx.args.data.name = ctx.args.data.name;
          ctx.args.data.hash = instance.hash;
          ctx.args.data.lang = instance.lang || '';
          ctx.args.data.date = instance.date;

          ctx.args.data.username = instance.username;
          ctx.args.data.email = instance.email;
          ctx.args.data.emailVerified = instance.emailVerified;
          // ctx.args.data.password = ctx.args.data.password;

          // log("ctx.args after", ctx.args);
        }

        next();
      });
    }

    /* update company name if admin; get access is admin -> get company id from group -> update company */
    // update company
    const updateCompany = (companyID) => {
      Tukang.app.models.Company.replaceById(companyID,
        { name: companyName },
        { validate: true }, // perform validate before saving, default is true
        function (err, instance) {
          generateUserDataToRecord();
        });
    }

    // get company id from group
    const getCompanyId = () => {
      getCompanyID({ models: Tukang.app.models, userId: ctx.args.id,
        callback: (companyID) => {
          log("Company companyID", companyID);

          updateCompany(companyID);
        },
        errorCallback: () => {
          // no company found, add one
          Tukang.app.models.Company.create({name: companyName}, function(err, company) {
            log("Company company", company);

            Tukang.app.models.Group.create({
              tukangID: ctx.args.id,
              projectID: [],
              companyID: company.id
            }, function(err, group) {
              log("Group group", group);

              generateUserDataToRecord();
            });
          });
        }
      });
    }

    // get access data
    const getAccess = () => {
      isAdmin({ models: Tukang.app.models, userId: ctx.args.options.accessToken.userId,
        callback: (admin) => {
          if (admin) {
            getCompanyId();
          } else {
            generateUserDataToRecord();
          }
        },
        errorCallback: () => {
          generateUserDataToRecord();
        }
      });
    }

    // check user password
    Tukang.login({
      email: ctx.args.data.email,
      password: ctx.args.data.password
    }, function(err, instance) {
      if (instance && instance.userId > 0) {
        getAccess();
      } else {
        err.message = 'Invalid password.';
        next(err);
      }
    });

  });

  // after updateByID
  Tukang.afterRemote('replaceById', function(ctx, user, next) {
    log("afterRemote replaceById");

    log("afterRemote replaceById ctx.args", ctx.args);

    // Tukang.findById(ctx.args.options.accessToken.userId, function(err, instance){
    //   log("instance", instance);
    // });

    // find companyID and then name
    getCompanyID({ models: Tukang.app.models, userId: ctx.args.id,
      callback: (companyID) => {
        getCompanyName({ models: Tukang.app.models, companyID,
          callback: (instance) => {
            ctx.result.company = instance
            next();
          },
          errorCallback: () => {
            next();
          }
        });
      },
      errorCallback: () => {
        next();
      }
    });
  });

  // // after remove error
  // Tukang.afterRemoteError('replaceById', function(ctx, next) {
  //   log("error ctx.result", ctx.result);
  //   next()
  // });

  // before deleteByID
  Tukang.beforeRemote('deleteById', function(ctx, user, next) {
    // log('beforeRemote deleteById ctx.args', ctx.args);
    // log('beforeRemote deleteById ctx.req.body', ctx.req.body);

    // let err = new Error();
    // err.statusCode = 401;
    // err.message = 'Invalid password.';
    // next(err);

    Tukang.login({
      email: ctx.req.body.email,
      password: ctx.req.body.password
    }, function(err, instance) {
      log('beforeRemote login err', err);
      log('beforeRemote login instance', instance);

      if (instance && instance.userId > 0) {
        next();
      } else {
        err.message = 'Invalid password.';
        next(err);
      }
    });
  });

  // validating hash
  Tukang.isVerified = function(hash, cb) {
    Tukang.find({
      where: {
        hash: hash
      },
      limit: 2
    }, function (err, instance) {
      if (err || instance === null || instance.length !== 1) {
        cb(null, false);
        return;
      }

      // if verified, update hash and verified
      if (instance.length === 1 && instance[0].id !== null) {
        const newData = instance[0];
        newData['hash'] = '';
        newData['emailVerified'] = true;

        Tukang.replaceById(instance[0].id,
          newData,
          { validate: true }, // perform validate before saving, default is true
          function (err, instance) {
            if (err || instance === null) {
              cb(null, false);
              return;
            }

            cb(null, true);
          });
      }
    });
  }
  Tukang.remoteMethod (
    'isVerified',
    {
      http: {path: '/verified', verb: 'get'},
      accepts: {arg: 'hash', type: 'string', http: { source: 'query' } },
      returns: {arg: 'verified', type: 'boolean'}
    }
  );

  // disable remote
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
