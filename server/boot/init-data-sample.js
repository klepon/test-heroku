// Copyright IBM Corp. 2015,2016. All Rights Reserved.
// Node module: loopback-example-access-control
// This file is licensed under the Artistic License 2.0.
// License text available at https://opensource.org/licenses/Artistic-2.0

module.exports = function(app) {
  var Tukang = app.models.tukang;
  var Project = app.models.project;
  var Access = app.models.access;
  var Company = app.models.company;
  var Group = app.models.group;

  Tukang.create([
    {username: 'John', email: 'qw@qw.qw', password: '123456', date: Date.now(), hash: '', emailVerified: true},
    {username: 'John1', email: 'qw@qw.qw1', password: '123456', date: Date.now() - 269200, hash: '8a90497b2b05d6f80ebb6332855f849f', emailVerified: false},
    {username: 'John2', email: 'qw@qw.qw2', password: '123456', date: Date.now() - 359200, hash: '', emailVerified: true},
    {username: 'John3', email: 'qw@qw.qw3', password: '123456', date: Date.now() - 219200, hash: '', emailVerified: true},
    {username: 'John4', email: 'qw@qw.qw4', password: '123456', date: Date.now() - 312200, hash: '8a90497b2b05d6f80ebb6332855f8492', emailVerified: false},
    {username: 'John5', email: 'qw@qw.qw5', password: '123456', date: Date.now(), hash: '8a90497b2b05d6f80ebb6332855f8493', emailVerified: false},
    {username: 'John6', email: 'qw@qw.qw6', password: '123456', date: Date.now(), hash: '8a90497b2b05d6f80ebb6332855f8494', emailVerified: false},
    {username: 'John7', email: 'qw@qw.qw7', password: '123456', date: Date.now(), hash: '8a90497b2b05d6f80ebb6332855f8495', emailVerified: true},
    {username: 'John8', email: 'qw@qw.qw8', password: '123456', date: Date.now(), hash: '8a90497b2b05d6f80ebb6332855f8496', emailVerified: false},
    {username: 'John9', email: 'qw@qw.qw9', password: '123456', date: Date.now(), hash: '', emailVerified: true}
  ], function(err, users) {
    if (err) throw err;
  });

  // role user per project, admin bisa lintas project
  Access.create([
    {tukangID: 1, projectID: 0, roleKey: ["admin"]},
    {tukangID: 1, projectID: 1, roleKey: ["findProject", "createSprint", "createTask", "teamMember"]},

    {tukangID: 1, projectID: 4, roleKey: ["findProject", "teamMember"]},
    {tukangID: 1, projectID: 6, roleKey: ["findProject"]},
    {tukangID: 1, projectID: 8, roleKey: ["findProject"]},

    {tukangID: 2, projectID: 1, roleKey: ["findProject", "createSprint", "createTask", "teamMember"]},

    {tukangID: 2, projectID: 4, roleKey: ["findProject"]},
    {tukangID: 2, projectID: 6, roleKey: ["findProject"]},

    {tukangID: 3, projectID: 1, roleKey: ["findProject"]},
    {tukangID: 3, projectID: 4, roleKey: ["findProject"]},

    {tukangID: 4, projectID: 6, roleKey: ["findProject"]},
    {tukangID: 4, projectID: 8, roleKey: ["findProject"]},
    {tukangID: 5, projectID: 8, roleKey: ["findProject"]},
    {tukangID: 6, projectID: 8, roleKey: ["findProject"]},

    {tukangID: 7, projectID: 0, roleKey: ["admin"]},

    {tukangID: 7, projectID: 2, roleKey: ["findProject", "createSprint", "createTask", "teamMember"]},

    {tukangID: 8, projectID: 3, roleKey: ["findProject"]},
    {tukangID: 9, projectID: 10, roleKey: ["findProject"]},

    {tukangID: 10, projectID: 0, roleKey: ["admin"]},

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
    {tukangID: 1, projectID: [1, 4, 6, 8], companyID: 1},

    {tukangID: 2, projectID: [1, 4, 6], companyID: 1},

    {tukangID: 3, projectID: [1, 4], companyID: 1},

    // {tukangID: 4, projectID: [6, 8], companyID: 1},
    {tukangID: 5, projectID: [8], companyID: 1},
    {tukangID: 6, projectID: [8], companyID: 1},

    {tukangID: 7, projectID: [2], companyID: 2},
    {tukangID: 8, projectID: [3], companyID: 2},
    // {tukangID: 10, projectID: [], companyID: 2},
    {tukangID: 9, projectID: [9], companyID: 2}
  ], function(err, teams) {
    if (err) throw err;
  });

  Project.create([
    {name: '1 project company 1', description: 'description project 1, total ada 2', date: '2017-03-27T12:51:15.795Z'},
    {name: '2 lorem ipsum company 2', description: 'kolor ijo suka bubur sumsum', date: '2017-03-20T12:51:15.795Z'},
    {name: '3 dolor ipsum company 2', description: 'kolor ijo suka bikin sumsum', date: '2017-03-20T12:51:15.795Z'},
    {name: '4 lorem amet company 1', description: 'kolor ijo suka jual sumsum', date: '2017-04-20T12:51:15.795Z'},
    {name: '5 kolor ipsum company 3', description: 'kolor ijo suka masak sumsum', date: '2018-03-20T12:51:15.795Z'},
    {name: '6 lorem ijo company 1', description: 'kolor ijo suka bagi sumsum', date: '2017-03-20T12:51:15.795Z'},
    {name: '7 ape ipsum company 3', description: 'kolor ijo suka bubur sumsum warna warni', date: '2015-12-20T12:51:15.795Z'},
    {name: '8 lorem kaden company 1', description: 'kolor ijo kaden bubur sumsum', date: '2017-03-15T12:51:15.795Z'},
    {name: '9 lorem ipsum company 2', description: 'kolor ijo suka bubur sumsum', date: '2017-07-20T12:51:15.795Z'},
    {name: '10 lorem ipsum', description: 'kolor ijo suka bubur sumsum', date: '2017-03-20T12:51:15.795Z'},
    {name: '11 lorem ipsum', description: 'kolor ijo suka bubur sumsum', date: '2017-03-20T12:51:15.795Z'},
    {name: '12 lorem ipsum', description: 'kolor ijo suka bubur sumsum', date: '2017-03-20T12:51:15.795Z'},
    {name: '13 lorem ipsum', description: 'kolor ijo suka bubur sumsum', date: '2017-03-20T12:51:15.795Z'},
    {name: '14 lorem ipsum', description: 'kolor ijo suka bubur sumsum', date: '2017-03-20T12:51:15.795Z'},
    {name: '15 lorem ipsum', description: 'kolor ijo suka bubur sumsum', date: '2017-03-20T12:51:15.795Z'},
    {name: '16 lorem ipsum', description: 'kolor ijo suka bubur sumsum', date: '2017-03-20T12:51:15.795Z'},
    {name: '17 lorem ipsum', description: 'kolor ijo suka bubur sumsum', date: '2017-03-20T12:51:15.795Z'},
    {name: '18 lorem ipsum', description: 'kolor ijo suka bubur sumsum', date: '2017-03-20T12:51:15.795Z'},
    {name: '19 lorem ipsum', description: 'kolor ijo suka bubur sumsum', date: '2017-03-20T12:51:15.795Z'},
    {name: '20 lorem ipsum', description: 'kolor ijo suka bubur sumsum', date: '2017-03-20T12:51:15.795Z'},
    {name: '21 lorem ipsum', description: 'kolor ijo suka bubur sumsum', date: '2017-03-20T12:51:15.795Z'},
    {name: '22 lorem ipsum', description: 'kolor ijo suka bubur sumsum', date: '2017-03-20T12:51:15.795Z'},
    {name: '23 lorem ipsum', description: 'kolor ijo suka bubur sumsum', date: '2017-03-20T12:51:15.795Z'},
    {name: '24 lorem ipsum', description: 'kolor ijo suka bubur sumsum', date: '2017-03-20T12:51:15.795Z'},
    {name: '25 lorem ipsum', description: 'kolor ijo suka bubur sumsum', date: '2017-03-20T12:51:15.795Z'},
    {name: '26 lorem ipsum', description: 'kolor ijo suka bubur sumsum', date: '2017-03-20T12:51:15.795Z'},
    {name: '27 lorem ipsum', description: 'kolor ijo suka bubur sumsum', date: '2017-03-20T12:51:15.795Z'},
    {name: '28 lorem ipsum', description: 'kolor ijo suka bubur sumsum', date: '2017-03-20T12:51:15.795Z'},
    {name: '29 lorem ipsum', description: 'kolor ijo suka bubur sumsum', date: '2017-03-20T12:51:15.795Z'},
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
