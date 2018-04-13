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
    {username: 'John', email: 'qw@qw.qw', password: '123456'},
    {username: 'John', email: 'qw@qw.qw2', password: '123456'},
    {username: 'John', email: 'qw@qw.qw3', password: '123456'},
    {username: 'John', email: 'qw@qw.qw4', password: '123456'},
    {username: 'John', email: 'qw@qw.qw5', password: '123456'},
    {username: 'John', email: 'qw@qw.qw6', password: '123456'},
    {username: 'John', email: 'qw@qw.qw7', password: '123456'},
    {username: 'John', email: 'qw@qw.qw8', password: '123456'},
    {username: 'John', email: 'qw@qw.qw9', password: '123456'}
  ], function(err, users) {
    if (err) throw err;
  });

  // role user pada project tertentu, kecuali admin bisa lintas project, karena sementara admin cuma di permission
  Access.create([
    {tukangID: 1, projectID: 0, roleKey: "admin"},
    {tukangID: 1, projectID: 0, roleKey: "createProject"},
    {tukangID: 1, projectID: 0, roleKey: "findMyProjects"},

    {tukangID: 1, projectID: 1, roleKey: "findProject"},
    {tukangID: 1, projectID: 1, roleKey: "createSprint"},
    {tukangID: 1, projectID: 1, roleKey: "createTask"},
    {tukangID: 1, projectID: 1, roleKey: "teamMember"},

    {tukangID: 1, projectID: 4, roleKey: "findProject"},
    {tukangID: 1, projectID: 4, roleKey: "teamMember"},
    {tukangID: 1, projectID: 6, roleKey: "findProject"},
    {tukangID: 1, projectID: 8, roleKey: "findProject"},

    {tukangID: 2, projectID: 0, roleKey: "findMyProjects"},
    {tukangID: 2, projectID: 1, roleKey: "findProject"},
    {tukangID: 2, projectID: 1, roleKey: "createSprint"},
    {tukangID: 2, projectID: 1, roleKey: "createTask"},
    {tukangID: 2, projectID: 1, roleKey: "teamMember"},

    {tukangID: 2, projectID: 4, roleKey: "findProject"},
    {tukangID: 2, projectID: 6, roleKey: "findProject"},

    {tukangID: 3, projectID: 0, roleKey: "findMyProjects"},
    {tukangID: 3, projectID: 1, roleKey: "findProject"},
    {tukangID: 3, projectID: 4, roleKey: "findProject"},

    {tukangID: 4, projectID: 0, roleKey: "findMyProjects"},
    {tukangID: 4, projectID: 6, roleKey: "findProject"},
    {tukangID: 4, projectID: 8, roleKey: "findProject"},
    {tukangID: 5, projectID: 8, roleKey: "findProject"},
    {tukangID: 6, projectID: 8, roleKey: "findProject"},

    {tukangID: 7, projectID: 0, roleKey: "admin"},
    {tukangID: 7, projectID: 0, roleKey: "createProject"},

    {tukangID: 7, projectID: 2, roleKey: "findProject"},
    {tukangID: 7, projectID: 2, roleKey: "createSprint"},
    {tukangID: 7, projectID: 2, roleKey: "createTask"},
    {tukangID: 7, projectID: 2, roleKey: "teamMember"},

    {tukangID: 8, projectID: 3, roleKey: "findProject"},
    {tukangID: 9, projectID: 9, roleKey: "findProject"},

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

  // create group
  Group.create([
    {tukangID: 1, projectID: 1, companyID: 1},
    {tukangID: 1, projectID: 4, companyID: 1},
    {tukangID: 1, projectID: 6, companyID: 1},
    {tukangID: 1, projectID: 8, companyID: 1},

    {tukangID: 2, projectID: 1, companyID: 1},
    {tukangID: 2, projectID: 4, companyID: 1},
    {tukangID: 2, projectID: 6, companyID: 1},

    {tukangID: 3, projectID: 1, companyID: 1},
    {tukangID: 3, projectID: 4, companyID: 1},

    {tukangID: 4, projectID: 6, companyID: 1},
    {tukangID: 4, projectID: 8, companyID: 1},
    {tukangID: 5, projectID: 8, companyID: 1},
    {tukangID: 6, projectID: 8, companyID: 1},

    {tukangID: 7, projectID: 2, companyID: 2},
    {tukangID: 8, projectID: 3, companyID: 2},
    {tukangID: 9, projectID: 9, companyID: 2}
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

        console.log('======= tukang - note created');

      });
    });
  });
};
