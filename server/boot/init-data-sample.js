// Copyright IBM Corp. 2015,2016. All Rights Reserved.
// Node module: loopback-example-access-control
// This file is licensed under the Artistic License 2.0.
// License text available at https://opensource.org/licenses/Artistic-2.0

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
  var Tukang = app.models.tukang;
  var Project = app.models.project;
  var Access = app.models.access;
  var Company = app.models.company;
  var Group = app.models.group;

  Tukang.create([
    {name: 'John ke-1', username: 'qw@qw.qw1', email: 'qw@qw.qw1', password: '123456', date: Date.now(), hash: '', emailVerified: true},
    {name: 'John ke-2', username: 'qw@qw.qw2', email: 'qw@qw.qw2', password: '123456', date: Date.now(), hash: '', emailVerified: true},
    {name: 'John ke-3', username: 'qw@qw.qw3', email: 'qw@qw.qw3', password: '123456', date: Date.now() - 219200, hash: '', emailVerified: true},
    {name: 'John ke-4', username: 'qw@qw.qw4', email: 'qw@qw.qw4', password: '123456', date: Date.now() - 312200, hash: '8a90497b2b05d6f80ebb6332855f8492', emailVerified: false},
    {name: 'John ke-5', username: 'qw@qw.qw5', email: 'qw@qw.qw5', password: '123456', date: Date.now() - 269200, hash: '8a90497b2b05d6f80ebb6332855f8493', emailVerified: false},
    {name: 'John ke-6', username: 'qw@qw.qw6', email: 'qw@qw.qw6', password: '123456', date: Date.now(), hash: '8a90497b2b05d6f80ebb6332855f8494', emailVerified: false},
    {name: 'John ke-7', username: 'qw@qw.qw7', email: 'qw@qw.qw7', password: '123456', date: Date.now(), hash: '', emailVerified: true},
    {name: 'John ke-8', username: 'qw@qw.qw8', email: 'qw@qw.qw8', password: '123456', date: Date.now(), hash: '', emailVerified: true},
    {name: 'John ke-9', username: 'qw@qw.qw9', email: 'qw@qw.qw9', password: '123456', date: Date.now() - 359200, hash: '8a90497b2b05d6f80ebb6332855f849f', emailVerified: false},
    {name: 'John ke-10', username: 'qw@qw.qw10', email: 'qw@qw.qw10', password: '123456', date: Date.now(), hash: '', emailVerified: true}
  ], function(err, users) {
    if (err) throw err;

    users[7].projects.create(
      {name: 'project by John ke-8', description: 'description project 1, total ada 2', date: '2017-03-27T12:51:15.795Z'},
      function(err, project) {
        log('create ptoject by user', users[7]);
        log('create ptoject by user', project);

        Access.create({
          tukangID: users[7].id,
          projectID: project.id,
          roleKey: modelPermissions.filter(i => {
            if(i.type === undefined) { // for unpaid user
              return true;
            }
          }).map(i => i.roleKey)
        }, function(err, rs) {
          log('access created', rs);
        });
      }
    );
  });

  // role user per project, admin bisa lintas project
  // Access.create([
  //   {tukangID: 1, projectID: 0, roleKey: ["admin"]},
  //   {tukangID: 1, projectID: 1, roleKey: ["findProject", "createSprint", "createTask", "teamMember"]},
  //
  //   {tukangID: 1, projectID: 4, roleKey: ["findProject", "teamMember"]},
  //   {tukangID: 1, projectID: 6, roleKey: ["findProject"]},
  //   {tukangID: 1, projectID: 8, roleKey: ["findProject"]},
  //
  //   {tukangID: 2, projectID: 1, roleKey: ["findProject", "createSprint", "createTask", "teamMember"]},
  //
  //   {tukangID: 2, projectID: 4, roleKey: ["findProject"]},
  //   {tukangID: 2, projectID: 6, roleKey: ["findProject"]},
  //
  //   {tukangID: 3, projectID: 1, roleKey: ["findProject"]},
  //   {tukangID: 3, projectID: 4, roleKey: ["findProject"]},
  //
  //   {tukangID: 4, projectID: 6, roleKey: ["findProject"]},
  //   {tukangID: 4, projectID: 8, roleKey: ["findProject"]},
  //   {tukangID: 5, projectID: 8, roleKey: ["findProject"]},
  //   {tukangID: 6, projectID: 8, roleKey: ["findProject"]},
  //
  //   {tukangID: 7, projectID: 0, roleKey: ["admin"]},
  //
  //   {tukangID: 7, projectID: 2, roleKey: ["findProject", "createSprint", "createTask", "teamMember"]},
  //
  //   {tukangID: 8, projectID: 3, roleKey: ["findProject"]},
  //   {tukangID: 9, projectID: 10, roleKey: ["findProject"]},
  //
  //   {tukangID: 10, projectID: 0, roleKey: ["admin"]},
  //
  // ], function(err, teams) {
  //   if (err) throw err;
  // });
  Access.create([
    {tukangID: 1, projectID: 0, roleKey: "admin"},
    {tukangID: 1, projectID: 1, roleKey: "findProject"},
    {tukangID: 1, projectID: 1, roleKey: "createSprint"},
    {tukangID: 1, projectID: 1, roleKey: "createTask"},
    {tukangID: 1, projectID: 1, roleKey: "teamMember"},
    {tukangID: 1, projectID: 4, roleKey: "findProject"},
    {tukangID: 1, projectID: 4, roleKey: "teamMember"},
    {tukangID: 1, projectID: 6, roleKey: "findProject"},
    {tukangID: 1, projectID: 8, roleKey: "findProject"},
    {tukangID: 1, projectID: 15, roleKey: "findProject"},
    {tukangID: 1, projectID: 16, roleKey: "findProject"},
    {tukangID: 1, projectID: 17, roleKey: "findProject"},
    {tukangID: 1, projectID: 18, roleKey: "findProject"},
    {tukangID: 1, projectID: 19, roleKey: "findProject"},
    {tukangID: 1, projectID: 20, roleKey: "findProject"},
    {tukangID: 1, projectID: 21, roleKey: "findProject"},
    {tukangID: 1, projectID: 22, roleKey: "findProject"},
    {tukangID: 1, projectID: 23, roleKey: "findProject"},
    {tukangID: 1, projectID: 24, roleKey: "findProject"},
    {tukangID: 1, projectID: 25, roleKey: "findProject"},
    {tukangID: 1, projectID: 26, roleKey: "findProject"},
    {tukangID: 1, projectID: 27, roleKey: "findProject"},
    {tukangID: 1, projectID: 28, roleKey: "findProject"},
    {tukangID: 1, projectID: 29, roleKey: "findProject"},
    {tukangID: 1, projectID: 30, roleKey: "findProject"},

    {tukangID: 2, projectID: 1, roleKey: "findProject"},
    {tukangID: 2, projectID: 1, roleKey: "createSprint"},
    {tukangID: 2, projectID: 1, roleKey: "createTask"},
    {tukangID: 2, projectID: 1, roleKey: "teamMember"},
    {tukangID: 2, projectID: 4, roleKey: "findProject"},
    {tukangID: 2, projectID: 6, roleKey: "findProject"},

    {tukangID: 3, projectID: 1, roleKey: "findProject"},
    {tukangID: 3, projectID: 4, roleKey: "findProject"},

    {tukangID: 4, projectID: 6, roleKey: "findProject"},
    {tukangID: 4, projectID: 8, roleKey: "findProject"},

    {tukangID: 5, projectID: 8, roleKey: "findProject"},
    {tukangID: 6, projectID: 8, roleKey: "findProject"},

    {tukangID: 7, projectID: 0, roleKey: "admin"},
    {tukangID: 7, projectID: 2, roleKey: "findProject"},
    {tukangID: 7, projectID: 2, roleKey: "createSprint"},
    {tukangID: 7, projectID: 2, roleKey: "createTask"},
    {tukangID: 7, projectID: 2, roleKey: "teamMember"},

    {tukangID: 8, projectID: 3, roleKey: "findProject"},
    {tukangID: 9, projectID: 10, roleKey: "findProject"},

    // {tukangID: 10, projectID: 0, roleKey: "admin"},

  ], function(err, teams) {
    if (err) throw err;
  });

  // create company
  Company.create([
    {name: "company 1"},
    {name: "company 2"},
  ], function(err, teams) {
    if (err) throw err;
  });

  // create group, only for user with at least one paid member/admin
  Group.create([
    {tukangID: 1, companyID: 1},

    {tukangID: 2, companyID: 1},

    {tukangID: 3, companyID: 1},

    {tukangID: 4, companyID: 1},
    {tukangID: 5, companyID: 1},
    {tukangID: 6, companyID: 1},

    // {tukangID: 7, companyID: 2},
    {tukangID: 8, companyID: 2},
    // {tukangID: 10, companyID: 2},
    {tukangID: 9, companyID: 2}
  ], function(err, teams) {
    if (err) throw err;
  });

  Project.create([
    {name: '1 project company 1', description: 'description project 1, total ada 2', date: '2017-03-27T12:51:15.795Z'},
    {name: '2 lorem ipsum company 2', description: 'kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum', date: '2017-03-20T12:51:15.795Z'},
    {name: '3 dolor ipsum company 2', description: 'kolor ijo suka bikin sumsum', date: '2017-03-20T12:51:15.795Z'},
    {name: '4 lorem amet company 1', description: 'kolor ijo suka jual sumsum', date: '2017-04-20T12:51:15.795Z'},
    {name: '5 kolor ipsum company 3', description: 'kolor ijo suka masak sumsum', date: '2018-03-20T12:51:15.795Z'},
    {name: '6 lorem ijo company 1', description: 'kolor ijo suka bagi sumsum', date: '2017-03-20T12:51:15.795Z'},
    {name: '7 ape ipsum company 3', description: 'kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum warna warni', date: '2015-12-20T12:51:15.795Z'},
    {name: '8 lorem kaden company 1', description: 'kolor ijo kaden bubur sumsum', date: '2017-03-15T12:51:15.795Z'},
    {name: '9 lorem ipsum company 2', description: 'kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum', date: '2017-07-20T12:51:15.795Z'},
    {name: '10 lorem ipsum', description: 'kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum', date: '2017-03-20T12:51:15.795Z'},
    {name: '11 lorem ipsum', description: 'kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum', date: '2017-03-20T12:51:15.795Z'},
    {name: '12 lorem ipsum', description: 'kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum', date: '2017-03-20T12:51:15.795Z'},
    {name: '13 lorem ipsum', description: 'kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum', date: '2017-03-20T12:51:15.795Z'},
    {name: '14 lorem ipsum', description: 'kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum', date: '2017-03-20T12:51:15.795Z'},
    {name: '15 lorem ipsum', description: 'kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum', date: '2017-03-20T12:51:15.795Z'},
    {name: '16 lorem ipsum', description: 'kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum', date: '2017-03-20T12:51:15.795Z'},
    {name: '17 lorem ipsum', description: 'kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum', date: '2017-03-20T12:51:15.795Z'},
    {name: '18 lorem ipsum', description: 'kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum', date: '2017-03-20T12:51:15.795Z'},
    {name: '19 lorem ipsum', description: 'kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum', date: '2017-03-20T12:51:15.795Z'},
    {name: '20 lorem ipsum', description: 'kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum', date: '2017-03-20T12:51:15.795Z'},
    {name: '21 lorem ipsum', description: 'kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum', date: '2017-03-20T12:51:15.795Z'},
    {name: '22 lorem ipsum', description: 'kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum', date: '2017-03-20T12:51:15.795Z'},
    {name: '23 lorem ipsum', description: 'kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum', date: '2017-03-20T12:51:15.795Z'},
    {name: '24 lorem ipsum', description: 'kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum', date: '2017-03-20T12:51:15.795Z'},
    {name: '25 lorem ipsum', description: 'kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum', date: '2017-03-20T12:51:15.795Z'},
    {name: '26 lorem ipsum', description: 'kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum', date: '2017-03-20T12:51:15.795Z'},
    {name: '27 lorem ipsum', description: 'kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum', date: '2017-03-20T12:51:15.795Z'},
    {name: '28 lorem ipsum', description: 'kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum', date: '2017-03-20T12:51:15.795Z'},
    {name: '29 lorem ipsum', description: 'kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum kolor ijo suka bubur sumsum', date: '2017-03-20T12:51:15.795Z'},
    {name: '30 project', description: 'description project 2, total ada 2', date: '2017-03-27T12:51:15.795Z'}
  ], function(err, projects) {
    if (err) throw err;

    projects[0].sprints.create([
      {title: 'sprint 1', description: 'description sprint 1', date: '2018-03-27T12:51:15.795Z'},
    ], function(err, sprints) {
      if (err) throw err;

      sprints[0].tasks.create([
        {title: 'task 1', description: 'description task 1', date: '2018-03-27T12:51:15.795Z'},
        {title: 'task 2', description: 'description task 2', date: '2018-03-27T12:51:15.795Z'},
      ], function(err, tasks) {
        if (err) throw err;

        // create comment
        tasks[0].comments.create([
          {content: 'comment 1', date: '2018-03-27T12:51:15.795Z', ownerId: 1},
          {content: 'comment 2', date: '2018-03-27T12:51:15.795Z', ownerId: 2}
        ], function(err, comments) {
          if (err) throw err;
        });

        // create note
        tasks[0].notes.create([
          {content: 'notes 1 owner 1', date: '2018-03-27T12:51:15.795Z', ownerId: 1},
          {content: 'notes 2 owner 2', date: '2018-03-27T12:51:15.795Z', ownerId: 2}
        ], function(err, notes) {
          if (err) throw err;
        });

        console.log('======= data sample created ====== debug ready ====>');

      });
    });
  });
};
