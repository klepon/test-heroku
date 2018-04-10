// Copyright IBM Corp. 2015,2016. All Rights Reserved.
// Node module: loopback-example-access-control
// This file is licensed under the Artistic License 2.0.
// License text available at https://opensource.org/licenses/Artistic-2.0

module.exports = function(app) {
  var Tukang = app.models.tukang;
  var Project = app.models.project;
  var Team = app.models.team;

  Tukang.create([
    {username: 'John', email: 'qw@qw.qw', password: '123456'},
    {username: 'Jane', email: 'qw@qw.qwq', password: '123456'}
  ], function(err, users) {
    if (err) throw err;
  });

  // role user pada prject tertentu, kecuali admin bisa lintas project, karena sementara admin cuma di permission
  Team.create([
    {tukangID: 1, projectID: 0, roleKey: "admin"},
    {tukangID: 1, projectID: 0, roleKey: "createProject"},
    {tukangID: 1, projectID: 1, roleKey: "findProject"},
    {tukangID: 1, projectID: 1, roleKey: "createSprint"},
    {tukangID: 1, projectID: 1, roleKey: "createTask"},
    {tukangID: 1, projectID: 1, roleKey: "teamMember"},

    {tukangID: 2, projectID: 1, roleKey: "updateSprint"},

    {tukangID: 1, projectID: 2, roleKey: "createSprint"},
    {tukangID: 1, projectID: 2, roleKey: "createTask"}
  ], function(err, teams) {
    if (err) throw err;
  });

  Project.create([
    {name: '1 project 1', description: 'description project 1, total ada 2', date: '2017-03-27T12:51:15.795Z'},
    {name: '2 lorem ipsum', description: 'kolor ijo suka bubur sumsum', date: '2017-03-20T12:51:15.795Z'},
    {name: '3 dolor ipsum', description: 'kolor ijo suka bikin sumsum', date: '2017-03-20T12:51:15.795Z'},
    {name: '4l orem amet', description: 'kolor ijo suka jual sumsum', date: '2017-04-20T12:51:15.795Z'},
    {name: '5k olor ipsum', description: 'kolor ijo suka masak sumsum', date: '2018-03-20T12:51:15.795Z'},
    {name: '6l orem ijo', description: 'kolor ijo suka bagi sumsum', date: '2017-03-20T12:51:15.795Z'},
    {name: '7a pe ipsum', description: 'kolor ijo suka bubur sumsum warna warni', date: '2015-12-20T12:51:15.795Z'},
    {name: '8l orem kaden', description: 'kolor ijo kaden bubur sumsum', date: '2017-03-15T12:51:15.795Z'},
    {name: '9l orem ipsum', description: 'kolor ijo suka bubur sumsum', date: '2017-07-20T12:51:15.795Z'},
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
    {name: '30 project 2', description: 'description project 2, total ada 2', date: '2017-03-27T12:51:15.795Z'}
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
