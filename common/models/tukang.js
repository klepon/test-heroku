'use strict';
const md5 = require('md5');
const sendMail = require('../../server/_send-email.js');
const langData = require('../../server/_static-lang.js');
const CONST = require('../../server/_static-const.js');

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
    // console.log('====================================== emailMessage: ', emailMessage.replace(/<br \/>/g, '\n'));
    // console.log('====================================== ctx.args.data: ', ctx.args.data);
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
    // is email verified
    if (user.userId !== undefined) {
      Tukang.findById(user.userId,
      function (err, instance) {
        if (instance !== null && !instance.emailVerified) {
          ctx.result = {
            error: {
              status: 401,
              message: 'email not verified'
            }
          }
        }

        next();
      });
    }
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
          { validate: true },
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
