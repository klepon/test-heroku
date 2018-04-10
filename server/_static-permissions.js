module.exports = [
   {
      roleKey:"admin",
      descriptionEn:"Admin can add, edit, delete permission",
      descriptionId:"Admin bisa menambah, mengubah, menghapus permission",
      model:"project",
      permission:"admin"
   },
   {
      roleKey:"createProject",
      descriptionEn:"Create project",
      descriptionId:"Membuat proyek",
      model:"project",
      permission:"createProject"
   },
   {
      roleKey:"findProject",
      descriptionEn:"Find project",
      descriptionId:"Mencari proyek",
      model:"project",
      permission:"findProject"
   },
   {
      roleKey:"updateProject",
      descriptionEn:"update project",
      descriptionId:"Merubah proyek",
      model:"project",
      permission:"updateProject"
   },
   {
      roleKey:"deleteProject",
      descriptionEn:"delete project",
      descriptionId:"Hapus proyek",
      model:"project",
      permission:"deleteProject"
   },
   {
      roleKey:"createSprint",
      descriptionEn:"Create sprint",
      descriptionId:"Membuat tahapan",
      model:"sprint",
      permission:"createSprint"
   },
   {
      roleKey:"updateSprint",
      descriptionEn:"update sprint",
      descriptionId:"Perbaharui tahapan",
      model:"sprint",
      permission:"updateSprint"
   },
   {
      roleKey:"deleteSprint",
      descriptionEn:"delete sprint",
      descriptionId:"Hapus tahapan",
      model:"sprint",
      permission:"deleteSprint"
   },
   {
      roleKey:"createTask",
      descriptionEn:"Create task",
      descriptionId:"Membuat tugas",
      model:"task",
      permission:"createTask"
   },
   {
      roleKey:"updateTask",
      descriptionEn:"Update task",
      descriptionId:"Perbaharui tugas",
      model:"task",
      permission:"updateTask"
   },
   {
      roleKey:"deleteTask",
      descriptionEn:"Delete task",
      descriptionId:"Hapus tugas",
      model:"task",
      permission:"deleteTask"
   },
   {
      roleKey:"teamMember",
      descriptionEn:"Team member can create, edit, read comment",
      descriptionId:"Anggota tim dapat membuat, merubah, membaca pesan",
      model:["comment", "note"],
      permission:"teamMember"
   }
];
