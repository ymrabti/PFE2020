using GestionnaireUtilisateurs.Models;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace GestionnaireUtilisateurs.Controllers
{
    public class HomeController : Controller
    {
        aurs1Entities database = new aurs1Entities();
        private MultiModeles multiModeles()
        {
            var mModels = new MultiModeles
            {
                aspNetUsers = database.AspNetUsers.ToList(),
                modules = database.Module.ToList()
                ,
                sousModules = database.SousModule.ToList(),
                aspNetRoles = database.AspNetRoles.ToList()
                ,
                statuts = database.Statuts.ToList(),
                statutRoles = database.StatutRole.ToList()
            };
            return mModels;
        }
        [Authorize]
        public ActionResult Index()
        {
            return View(multiModeles());
        }
        [Authorize]
        public ActionResult AddUser()
        {

            return View(multiModeles());
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult AddUser([Bind(Include = ",ModuleDescription")] AspNetUserRoles module)
        {
            return View();
        }
        /// ///////////////////////              USER TACHE                    //////////////////////
        /// ///////////////////////              USER TACHE                    //////////////////////
        /// ///////////////////////              USER TACHE                    //////////////////////
        [Authorize]
        public ActionResult UserTache(string id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            AspNetUsers aspNetUser = database.AspNetUsers.Find(id);
            if (aspNetUser == null)
            {
                return HttpNotFound();
            }
            ViewBag.Nom = aspNetUser.Nom;
            ViewBag.UserId = aspNetUser.Id;
            ViewBag.Prenom = aspNetUser.Prenom;
            ViewBag.Email = aspNetUser.Email;
            ViewBag.StatusName = aspNetUser.Statuts.StatutName;
            ViewBag.Modules = new SelectList(database.Module);

            var model = new MultiModeles
            {
                aspNetUserRoles = database.AspNetUserRoles.Where(user => user.UserId == id).ToList(),
                aspNetRoles = database.AspNetRoles.ToList(),
                modules = database.Module.ToList(),
                sousModules = database.SousModule.ToList()
            };
            return View(model);
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult UserTache(string[] Create, string[] Read, string[] Update, string[] Delete
            , string[] UserId, string[] RoleId)
        {
            if (ModelState.IsValid && Read.Length != 0)
            {
                var currentUser = UserId[0];
                var aspNetUserRoles = database.AspNetUserRoles.Where(iden => iden.UserId == currentUser);
                database.AspNetUserRoles.RemoveRange(aspNetUserRoles);
                for (int i = 0; i < Read.Length; i++)
                {
                    AspNetUserRoles NewRoleOfUser = new AspNetUserRoles();
                    NewRoleOfUser.UserId = UserId[0];
                    NewRoleOfUser.RoleId = RoleId[i];
                    NewRoleOfUser.Read = Read[i].ToUpper().Equals("TRUE");
                    NewRoleOfUser.Create = Create[i].ToUpper().Equals("TRUE");
                    NewRoleOfUser.Update = Update[i].ToUpper().Equals("TRUE");
                    NewRoleOfUser.Delete = Delete[i].ToUpper().Equals("TRUE");
                    database.AspNetUserRoles.Add(NewRoleOfUser);
                }
                database.SaveChanges();
            }
            return RedirectToAction("Index");
        }

        /// ///////////////////////              STATUT TACHE                    //////////////////////
        /// ///////////////////////              STATUT TACHE                    //////////////////////
        /// ///////////////////////              STATUT TACHE                    //////////////////////
        [Authorize]
        public ActionResult IndexStatut()
        {
            var statuts = database.Statuts.ToList();
            return View(statuts);
        }

        [Authorize]
        public ActionResult StatutTache(string id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Statuts statuts = database.Statuts.Find(id);
            if (statuts == null)
            {
                return HttpNotFound();
            }
            ViewBag.Nom = statuts.StatutName;
            ViewBag.StatutId = statuts.StatutId;

            var model = new MultiModeles
            {
                statutRoles = database.StatutRole.Where(user => user.StatutId == id).ToList(),
                aspNetRoles = database.AspNetRoles.ToList(),
                modules = database.Module.ToList(),
                sousModules = database.SousModule.ToList()
            };

            return View(model);
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult StatutTache(string[] Create, string[] Read, string[] Update, string[] Delete
            , string[] StatutId, string[] RoleId)
        {
            if (ModelState.IsValid && Read.Length != 0)
            {
                var currentStatut = StatutId[0];
                var statutRole = database.StatutRole.Where(iden => iden.StatutId == currentStatut);
                database.StatutRole.RemoveRange(statutRole);
                for (int i = 0; i < Read.Length; i++)
                {
                    StatutRole NewRoleOfStatut = new StatutRole();
                    NewRoleOfStatut.StatutId = StatutId[0];
                    NewRoleOfStatut.RoleId = RoleId[i];
                    NewRoleOfStatut.Lire = Read[i].ToUpper().Equals("TRUE");
                    NewRoleOfStatut.Cree = Create[i].ToUpper().Equals("TRUE");
                    NewRoleOfStatut.Modifier = Update[i].ToUpper().Equals("TRUE");
                    NewRoleOfStatut.Supprimer = Delete[i].ToUpper().Equals("TRUE");
                    database.StatutRole.Add(NewRoleOfStatut);
                }
                database.SaveChanges();
            }
            return RedirectToAction("IndexStatut");
        }

        /// ///////////////////////              MODULE                    //////////////////////
        /// ///////////////////////              MODULE                    //////////////////////
        /// ///////////////////////              MODULE                    //////////////////////

        [Authorize]
        public ActionResult module()
        {
            return View(multiModeles());
        }
        [Authorize]
        public ActionResult AddModule()
        {
            return View(multiModeles());
        }



        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult UserTacheAddModule([Bind(Include = "ModuleName,ModuleDescription")] Module module)
        {

            if (ModelState.IsValid)
            {
                database.Module.Add(module);
                database.SaveChanges();
                return RedirectToAction("module");
            }
            return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
        }
        public ActionResult AddModulePartial()
        {
            return PartialView("_Modal");
        }

        
        public async Task<JsonResult> AddModulePartiale([Bind(Include = "ModuleName,ModuleDescription")] Module model)
        {
            var data = new object();
            if (ModelState.IsValid)
            {
                database.Module.Add(model);
                var result = await database.SaveChangesAsync();
                var mdles = from p in database.Module.ToList()
                            select new Module
                            {
                                ModuleId = p.ModuleId,
                                ModuleName = p.ModuleName
                            };

                data = new { dd = "error", mdles };
                return Json(data, JsonRequestBehavior.AllowGet);
            }
            return Json(new { dd = "error", data }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult EditModule(int CodeModule)
        {
            if (CodeModule == 0)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            var module = database.Module.Find(CodeModule);
            return View(module);
        }
        /// ///////////////////////             SUB MODULE                    //////////////////////
        /// ///////////////////////             SUB MODULE                    //////////////////////
        /// ///////////////////////             SUB MODULE                    //////////////////////

        public ActionResult sousmodule()
        {
            return View(database.SousModule.ToList());
        }
        [Authorize]


        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult UserTacheAddSousModule([Bind(Include = "SousModuleName,SousModuleDescription,ModuleId")] SousModule sousModule)
        {

            if (ModelState.IsValid)
            {
                database.SousModule.Add(sousModule);
                database.SaveChanges();
                return RedirectToAction("Index");
            }
            return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
        }


        public ActionResult AddSubModulePartial()
        {
            return PartialView("_SubModuleModal", multiModeles());
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<JsonResult> AddSubModulePartial([Bind(Include = "ModuleName,ModuleDescription")] Module model)
        {
            var data = "";
            if (ModelState.IsValid)
            {
                database.Module.Add(model);
                var result = await database.SaveChangesAsync();
                data += result;
            }
            return Json(new { dd = "error", data }, JsonRequestBehavior.AllowGet);
        }

        /// ///////////////////////             TACHES                    //////////////////////
        /// ///////////////////////             TACHES                    //////////////////////
        /// ///////////////////////             TACHES                    //////////////////////

        public ActionResult taches()
        {
            return View(database.AspNetRoles.ToList());
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult UserTacheAddTache([Bind(Include = "Name,SousModuleId,RoleDescription")] AspNetRoles Tache)
        {

            if (ModelState.IsValid)
            {
                database.AspNetRoles.Add(Tache);
                database.SaveChanges();
                return RedirectToAction("Index");
            }
            return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
        }



        public ActionResult AddTachePartial()
        {
            return PartialView("_TacheModal", multiModeles());
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<JsonResult> AddTachePartial([Bind(Include = "ModuleName,ModuleDescription")] Module model)
        {
            var data = "";
            if (ModelState.IsValid)
            {
                database.Module.Add(model);
                var result = await database.SaveChangesAsync();
                data += result;
            }
            return Json(new { dd = "error", data }, JsonRequestBehavior.AllowGet);
        }

        /// ///////////////////////             STATUT                    //////////////////////
        /// ///////////////////////             STATUT                    //////////////////////
        /// ///////////////////////             STATUT                    //////////////////////



        public ActionResult AddStatutPartial()
        {
            return PartialView("_StatutModal");
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<JsonResult> AddStatutPartial([Bind(Include = "ModuleName,ModuleDescription")] Module model)
        {
            var data = "";
            if (ModelState.IsValid)
            {
                database.Module.Add(model);
                var result = await database.SaveChangesAsync();
                data += result;
            }
            return Json(new { dd = "error", data }, JsonRequestBehavior.AllowGet);
        }



        /// ///////////////////////             AUTRES                    //////////////////////
        /// ///////////////////////             AUTRES                    //////////////////////
        /// ///////////////////////             AUTRES                    //////////////////////



        public ActionResult About()
        {
            return View();
        }

        [HttpPost]
        //[ValidateAntiForgeryToken]
        public JsonResult Aboutir()
        {
            var mdles = from p in database.Module.ToList()
                        select new Module
                        {
                            ModuleId = p.ModuleId,
                            ModuleName = p.ModuleName
                        };
            //    return Json(mdles, JsonRequestBehavior.AllowGet);
            //if (ModelState.IsValid)
            //{
            //}
            var data = new { dd = "error",mdles};
            return Json(data, JsonRequestBehavior.AllowGet);
        }
        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }

        
        public JsonResult Test([Bind(Include = "ModuleName,ModuleDescription")] Module module)
        {
            if (ModelState.IsValid)
            {
                database.Module.Add(module);
            }
            var insertedRecords = database.SaveChanges();
            //var user = new ApplicationUser { UserName = model.UserName, Email = model.Email };
            //var tacheUse = new UserManager<IdentityUser>(new UserStore<IdentityUser>(new ApplicationDbContext()));
            //var result = tacheUse.Create(user, model.Password);
            //ViewBag.success = result.Succeeded;
            //AspNetUsers users = new AspNetUsers();
            //users.Nom = Nom;users.Prenom = Prenom; users.NomAr = NomAr; users.PrenomAr = PrenomAr;
            //users.CIN = CIN; users.Ville = Ville; users.Email = Email; users.PhoneNumber = PhoneNumber;
            //users.PasswordHash = Password; users.StatutId = StatutId;users.typeUtilisateur = typeUtilisateur;
            //users.Sexe = Sexe;


            //var tache = new RoleManager<IdentityRole>(new RoleStore<IdentityRole>(new ApplicationDbContext())) ;
            //var tachee = tache.Create(new IdentityRole(sousModules.Name));
            //var identifiant = tachee.Succeeded;
            //sousModules.SouModuleId = SousModuleId;
            //database.AspNetRoles.Add(sousModules);database.SaveChanges();
            return Json(new { dd = "error", data = insertedRecords }, JsonRequestBehavior.AllowGet);
        }
        //public ActionResult Inde(string id, int? courseID)
        //{
        //    var multiModels = new MultiModeles();
        //    multiModels.aspNetUsers = database.AspNetUsers;
        //    if (id != null)
        //    {
        //        ViewBag.InstructorID = id;
        //        multiModels.aspNetUsers = multiModels.aspNetUsers.Where(i => i.Id == id).Single().Adresse;
        //    }

        //    if (courseID != null)
        //    {
        //        ViewBag.CourseID = courseID.Value;
        //        viewModel.Enrollments = viewModel.Courses.Where(x => x.CourseID == courseID).Single().Enrollments;
        //    }


        //    return View(viewModel);
        //}
    }
}