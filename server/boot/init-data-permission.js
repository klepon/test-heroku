module.exports = function(app) {
  var Permission = app.models.permission;

  Permission.count({
    roleKey: 'admin'
  }, function(err, count) {
    if (err) {
      return cb(null, false);
    }

    if(count === 0) {
      Permission.create([
        {roleKey: 'admin', descriptionEn: 'Admin can add, edit, delete permission', descriptionId: 'Admin bisa menambah, mengubah, menghapus permission'},

        {roleKey: 'createProject', descriptionEn: 'Create project', descriptionId: 'Membuat proyek'},
        {roleKey: 'findProject', descriptionEn: 'Find project', descriptionId: 'Mencari proyek'},
        {roleKey: 'updateProject', descriptionEn: 'update project', descriptionId: 'Merubah proyek'},
        {roleKey: 'deleteProject', descriptionEn: 'delete project', descriptionId: 'Hapus proyek'},

        {roleKey: 'createSprint', descriptionEn: 'Create sprint', descriptionId: 'Membuat tahapan'},
        {roleKey: 'updateSprint', descriptionEn: 'update sprint', descriptionId: 'Perbaharui tahapan'},
        {roleKey: 'deleteSprint', descriptionEn: 'delete sprint', descriptionId: 'Hapus tahapan'},

        {roleKey: 'createTask', descriptionEn: 'Create task', descriptionId: 'Membuat tugas'},
        {roleKey: 'updateTask', descriptionEn: 'Update task', descriptionId: 'Perbaharui tugas'},
        {roleKey: 'deleteTask', descriptionEn: 'Delete task', descriptionId: 'Hapus tugas'},

        {roleKey: 'teamMember', descriptionEn: 'Team member can create, edit, read comment', descriptionId: 'Anggota tim dapat membuat, merubah, membaca pesan'},
      ], function(err, permissions) {
        if (err) throw err;
      });
    }
  });
}
