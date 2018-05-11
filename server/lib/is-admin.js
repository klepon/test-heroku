const log = (label, data, inline) => {
  return;
  if (data === undefined) {
    console.log(`\n* ==== lib/is-admin.js ==================== ${label} ======================== *`);
  } else {
    console.log(`==== lib/is-admin.js ==================== ${label}:${inline ? '' : '\n'}`, data);
  }
};

module.exports = ({ models, userId, callback, errorCallback = () => {} } = params, from) => {
  models.Access.find({
    where: {
      tukangID: userId
    }
  }, function(err, instance) {

    log('isAdmin instance: \n', instance);

    if (instance !== null && instance.length > 0) {
      callback(instance.filter(i => i.roleKey.indexOf('admin') >= 0).length > 0);
    } else {
      errorCallback(err);
    }
  });
};
