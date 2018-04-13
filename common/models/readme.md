
"email":"qw@qw.qw",
"password":"123456"

access -> user - project - role
group -> user - project - company 
company -> name



** user role:
--- need to create invite mapping model

* Super watcher (me)
- can see all project, task, note, report
- cannot add, delete, update

* $auth can
- create 1 project -> auto upgrade to `admin` for own project
- be invite to joint project -> auto upgrade to `teamMember` for the project

* team member can
- see project detail
- create task, edit/delete on own task
- see all task and detail include comment, atachment, log, etc, except other note in project
- add comment and etc, edit/delete comment and etc on own task
- add note, see, edit/delete on own note
- add attachment, edit/delete on own attachment
- add time log, edit/delete on own time log
- change status/progress
- mark/pin task
- see project report exclude cost report

* team lead/producer/pm can
- create a project
- invite new member
- assign existing member into team
- assign `accounting` and `productManager`
- all team member ability
- edit all task detail plus put task onhold
- order task
- move task sprint
- put project on hold
- see max hours
- estimate max hours

* accounting can
- see project detail
- see all task and detail
- see cost report
- set cost setting, ie: $30 per hour

* product manager/director/ceo can
- see project detail
- see all task and detail
- see all report include cost report
- put project on hold
