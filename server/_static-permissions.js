// all login user can create project
// free user only can create one project
module.exports = [
   {
      type: "paid",
      roleKey:"admin",
      descriptionEn:"Admin can add, edit, delete permission",
      descriptionId:"Admin bisa menambah, mengubah, menghapus permission",
      model:"project"
   },
   {
      type: "all",
      roleKey:"createProject",
      descriptionEn:"Create project",
      descriptionId:"Membuat proyek",
      model:"project"
   },
   {
      roleKey:"findProject",
      descriptionEn:"Find project",
      descriptionId:"Mencari proyek",
      model:"project"
   },
   {
      roleKey:"updateProject",
      descriptionEn:"update project",
      descriptionId:"Merubah proyek",
      model:"project"
   },
   {
      roleKey:"deleteProject",
      descriptionEn:"delete project",
      descriptionId:"Hapus proyek",
      model:"project"
   },
   {
      roleKey:"createSprint",
      descriptionEn:"Create sprint",
      descriptionId:"Membuat tahapan",
      model:"sprint"
   },
   {
      roleKey:"updateSprint",
      descriptionEn:"update sprint",
      descriptionId:"Perbaharui tahapan",
      model:"sprint"
   },
   {
      roleKey:"deleteSprint",
      descriptionEn:"delete sprint",
      descriptionId:"Hapus tahapan",
      model:"sprint"
   },
   {
      roleKey:"createTask",
      descriptionEn:"Create task",
      descriptionId:"Membuat tugas",
      model:"task"
   },
   {
      roleKey:"updateTask",
      descriptionEn:"Update task",
      descriptionId:"Perbaharui tugas",
      model:"task"
   },
   {
      roleKey:"deleteTask",
      descriptionEn:"Delete task",
      descriptionId:"Hapus tugas",
      model:"task"
   },
   {
      roleKey:"teamMember",
      descriptionEn:"Team member can create, edit, read comment and note",
      descriptionId:"Anggota tim dapat membuat, merubah, membaca pesan dan catatan",
      model:["comment", "note"]
   }
];
