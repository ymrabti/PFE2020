using GestionnaireUtilisateurs.Models;
using Microsoft.AspNet.Identity.Owin;
using System;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace GestionnaireUtilisateurs.Controllers
{
    public class HomeController : Controller
    {
        private ApplicationUserManager _userManager;
        aurs1Entities database = new aurs1Entities();
        public ApplicationUserManager UserManager
        {
            get
            {
                return _userManager ?? HttpContext.GetOwinContext().GetUserManager<ApplicationUserManager>();
            }
            private set
            {
                _userManager = value;
            }
        }
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
            ViewBag.StatutId = new SelectList(database.Statuts, "StatutId", "StatutName");
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> AddUser(RegisterViewModel model)
        {
            if (ModelState.IsValid)
            {
                ViewBag.StatutId = new SelectList(database.Statuts, "StatutId", "StatutName");
                var user = new ApplicationUser
                {
                    UserName = model.UserName,
                    Email = model.Email,
                    PhoneNumber = model.PhoneNumber
                };
                var result = await UserManager.CreateAsync(user, model.Password);
                if (result.Succeeded)
                {
                    var UserCreated = database.AspNetUsers.Find(user.Id);
                    UserCreated.Nom =model.Nom;
                    UserCreated.Prenom =model.Prenom;
                    UserCreated.NomAr =model.NomAr;
                    UserCreated.PrenomAr =model.PrenomAr;
                    UserCreated.UserNameAr =model.PrenomAr+" "+model.NomAr;
                    UserCreated.CIN =model.CIN;
                    UserCreated.Ville =model.Ville;
                    UserCreated.Sexe =model.Sexe;
                    UserCreated.StatutId =model.StatutId;
                    UserCreated.typeUtilisateur =model.typeUtilisateur;
                    UserCreated.Intiulé =model.Entreprise;

                    database.Entry(UserCreated).State = EntityState.Modified;
                    var res = await database.SaveChangesAsync();
                    // string code = await UserManager.GenerateEmailConfirmationTokenAsync(user.Id);
                    // var callbackUrl = Url.Action("ConfirmEmail", "Account", new { userId = user.Id, code = code }, protocol: Request.Url.Scheme);
                    // await UserManager.SendEmailAsync(user.Id, "Confirmez votre compte", "Confirmez votre compte en cliquant <a href=\"" + callbackUrl + "\">ici</a>");

                    return RedirectToAction("Index", "Home");
                }
                ViewBag.errors = result.Errors;
            }
            return View(model);
        }

        public ActionResult EditUser(string id)
        {
            ViewBag.Statuts = database.Statuts.ToList();
            var User = database.AspNetUsers.Find(id);
            RegisterParentViewModel viewModel = new RegisterParentViewModel ();
            viewModel.typeUtilisateur = User.typeUtilisateur;
            viewModel.Entreprise = User.Intiulé;
            viewModel.Nom = User.Nom;
            viewModel.Prenom = User.Prenom;
            viewModel.NomAr = User.NomAr;
            viewModel.PrenomAr = User.PrenomAr;
            viewModel.CIN = User.CIN;
            viewModel.Ville = User.Ville;
            viewModel.Sexe = User.Sexe;
            viewModel.Email = User.Email;
            viewModel.PhoneNumber = User.PhoneNumber;
            viewModel.Password = User.PasswordHash;
            viewModel.StatutId = User.StatutId;
            ViewBag.StatutId = new SelectList(database.Statuts, "StatutId", "StatutName");
            return View(viewModel);
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> EditUser(AspNetUsers user)
        {
            database.Entry(user).State = EntityState.Modified;
            var res = await database.SaveChangesAsync();
            if (res==0)
            {
            ViewBag.StatutId = new SelectList(database.Statuts, "StatutId", "StatutName");
                return View();
            }
            return RedirectToAction("Index");
        }


        public ActionResult DeleteUser(string id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            var user = database.AspNetUsers.Find(id);
            if (user == null)
            {
                return HttpNotFound();
            }
            ViewBag.statutName = user.Nom+" " +user.Prenom;
            return View();
        }

        [HttpPost, ActionName("DeleteUser")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteUserConfirmed(string id)
        {
            var user = database.AspNetUsers.Find(id);
            database.AspNetUsers.Remove(user);
            database.SaveChanges();
            return RedirectToAction("IndexStatut");
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

        /// ///////////////////////             STATUT                    //////////////////////
        /// ///////////////////////             STATUT                    //////////////////////
        /// ///////////////////////             STATUT                    //////////////////////


        [Authorize]
        public ActionResult AddStatut()
        {
            return View();
        }


        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult AddStatut([Bind(Include = "StatutName,StatutDescription")] Statuts statut)
        {

            if (ModelState.IsValid)
            {
                var Sid = Guid.NewGuid(); statut.StatutId = Sid.ToString();
                database.Statuts.Add(statut);
                database.SaveChanges();
                return RedirectToAction("IndexStatut");
            }
            return View();
        }

        [Authorize]
        public ActionResult EditStatut(string id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            var statut = database.Statuts.Find(id);
            if (statut == null)
            {
                return HttpNotFound();
            }
            ViewBag.statutId = statut.StatutId;
            ViewBag.statutName = statut.StatutName;
            ViewBag.statutDescription = statut.StatutDescription;
            return View();
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult EditStatut([Bind(Include = "StatutId,StatutName,StatutDescription")] Statuts statut)
        {
            if (ModelState.IsValid)
            {
                if (statut == null)
                {
                    return View();
                }
                database.Entry(statut).State = EntityState.Modified;
                database.SaveChanges();
                return RedirectToAction("IndexStatut");
            }
            return View();
        }


        public ActionResult DeleteStatut(string id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            var statut = database.Statuts.Find(id);
            if (statut == null)
            {
                return HttpNotFound();
            }
            ViewBag.statutName = statut.StatutName;
            return View();
        }

        [HttpPost, ActionName("DeleteStatut")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteStatutConfirmed(string id)
        {
            Statuts statut = database.Statuts.Find(id);
            database.Statuts.Remove(statut);
            database.SaveChanges();
            return RedirectToAction("IndexStatut");
        }



        public ActionResult AddStatutPartial()
        {
            return PartialView("_StatutModal");
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<JsonResult> AddStatutPartiale([Bind(Include = "ModuleName,ModuleDescription")] Module model)
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


        /// ///////////////////////              STATUT TACHE                    //////////////////////
        /// ///////////////////////              STATUT TACHE                    //////////////////////
        /// ///////////////////////              STATUT TACHE                    //////////////////////
        [Authorize]
        public ActionResult IndexStatut()
        {
            return View(multiModeles());
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

        public ActionResult EditModule(int id)
        {
            if (id == 0)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            var module = database.Module.Find(id);
            if (module == null)
            {
                return HttpNotFound();
            }
            ViewBag.ModuleName = module.ModuleName;
            ViewBag.ModuleDescription = module.ModuleDescription;
            ViewBag.ModuleId = module.ModuleId;
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult EditModule([Bind(Include = "ModuleId,ModuleName,ModuleDescription")] Module module)
        {
            if (ModelState.IsValid)
            {
                if (module == null)
                {
                    return View(module);
                }
                database.Entry(module).State = EntityState.Modified;
                database.SaveChanges();
                return RedirectToAction("module");
            }
            return View(module);
        }
        public ActionResult DeleteModule(int id)
        {
            if (id + "" == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Module module = database.Module.Find(id);
            if (module == null)
            {
                return HttpNotFound();
            }

            ViewBag.ModuleName = module.ModuleName;
            ViewBag.ModuleDescription = module.ModuleDescription;
            ViewBag.ModuleId = module.ModuleId;
            return View();
        }

        // POST: AspNetRoles/Delete/5
        [HttpPost, ActionName("DeleteModule")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteModuleConfirmed(int id)
        {
            Module module = database.Module.Find(id);
            database.Module.Remove(module);
            database.SaveChanges();
            return RedirectToAction("module");
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



        /// ///////////////////////             SUB MODULE                    //////////////////////
        /// ///////////////////////             SUB MODULE                    //////////////////////
        /// ///////////////////////             SUB MODULE                    //////////////////////

        public ActionResult sousmodule()
        {
            return View(multiModeles());
        }
        [Authorize]
        public ActionResult AddSubModule()
        {
            return View(multiModeles());
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult UserTacheAddSousModule([Bind(Include = "SousModuleName,SousModuleDescription,ModuleId")] SousModule sousModule)
        {

            if (ModelState.IsValid)
            {
                database.SousModule.Add(sousModule);
                database.SaveChanges();
                return RedirectToAction("sousmodule");
            }
            return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
        }
        [Authorize]
        public ActionResult EditSubModule(int id)
        {
            if (id == 0)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            var sousmodule = database.SousModule.Find(id);
            if (sousmodule == null)
            {
                return HttpNotFound();
            }
            ViewBag.SousModuleName = sousmodule.SousModuleName;
            ViewBag.SousModuleDescription = sousmodule.SousModuleDescription;
            ViewBag.SousModuleId = sousmodule.SousModuleId;
            ViewBag.ModuleId = sousmodule.ModuleId;
            return View(multiModeles());
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult EditSubModule([Bind(Include = "SousModuleId,SousModuleName,SousModuleDescription,ModuleId")] SousModule sousModule)
        {
            if (ModelState.IsValid)
            {
                if (sousModule == null)
                {
                    return View(sousModule);
                }
                database.Entry(sousModule).State = EntityState.Modified;
                database.SaveChanges();
                return RedirectToAction("sousmodule");
            }
            return View(sousModule);
        }

        
        public ActionResult DeleteSubModule(int id)
        {
            if (id + "" == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            SousModule sousModule = database.SousModule.Find(id);
            if (sousModule == null)
            {
                return HttpNotFound();
            }

            ViewBag.SousModuleName = sousModule.SousModuleName;
            ViewBag.ModuleParent = sousModule.Module.ModuleName;
            ViewBag.SousModuleId = sousModule.SousModuleId;
            return View();
        }

        [HttpPost, ActionName("DeleteSubModule")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteSubModuleConfirmed(int id)
        {
            SousModule sousModule = database.SousModule.Find(id);
            database.SousModule.Remove(sousModule);
            database.SaveChanges();
            return RedirectToAction("sousmodule");
        }

        public ActionResult AddSubModulePartial()
        {
            return PartialView("_SubModuleModal", multiModeles());
        }

        
        public async Task<JsonResult> AddSubModulePartiale([Bind(Include = "SousModuleName,SousModuleDescription,ModuleId")] 
        SousModule sousModule)
        {
            var data = new object();
            if (ModelState.IsValid)
            {
                database.SousModule.Add(sousModule);
                var result = await database.SaveChangesAsync();
                var smdles = from p in database.SousModule.ToList()
                            select new SousModule
                            {
                                SousModuleId = p.SousModuleId,
                                SousModuleName = p.SousModuleName,
                                ModuleId=p.ModuleId
                            };

                data = new { dd = "error", smdles };
                return Json(data, JsonRequestBehavior.AllowGet);
            }
            return Json(new { dd = "error", data }, JsonRequestBehavior.AllowGet);
        }

        /// ///////////////////////             TACHES                    //////////////////////
        /// ///////////////////////             TACHES                    //////////////////////
        /// ///////////////////////             TACHES                    //////////////////////

        public ActionResult taches()
        {
            return View(multiModeles());
        }

        [Authorize]
        public ActionResult AddTache()
        {
            return View(multiModeles());
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult AddTache([Bind(Include = "Name,SouModuleId,RoleDescription")] AspNetRoles Tache)
        {

            if (ModelState.IsValid)
            {
                var Rid = Guid.NewGuid(); Tache.Id = Rid.ToString();
                database.AspNetRoles.Add(Tache);
                database.SaveChanges();
                return RedirectToAction("taches");
            }
            return View(multiModeles());
        }

        [Authorize]
        public ActionResult EditTache(string id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            var role = database.AspNetRoles.Find(id);
            if (role == null)
            {
                return HttpNotFound();
            }
            ViewBag.RoleName = role.Name;
            ViewBag.RoleDescription = role.RoleDescription;
            ViewBag.SousModuleId = role.SouModuleId;
            ViewBag.ModuleId = role.SousModule.Module.ModuleId;
            ViewBag.RoleId = role.Id;
            return View(multiModeles());
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult EditTache([Bind(Include = "Id,Name,RoleDescription,SouModuleId")] AspNetRoles role)
        {
            if (ModelState.IsValid)
            {
                if (role == null)
                {
                    return View(role);
                }
                database.Entry(role).State = EntityState.Modified;
                database.SaveChanges();
                return RedirectToAction("taches");
            }
            return View(multiModeles());
        }


        public ActionResult DeleteTache(string id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            var role = database.AspNetRoles.Find(id);
            if (role == null)
            {
                return HttpNotFound();
            }
            ViewBag.RoleName = role.Name;
            ViewBag.SousModuleName = role.SousModule.SousModuleName;
            ViewBag.ModuleName = role.SousModule.Module.ModuleName;
            ViewBag.RoleId = role.Id;
            return View();
        }

        [HttpPost, ActionName("DeleteTache")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteTacheConfirmed(string id)
        {
            AspNetRoles role = database.AspNetRoles.Find(id);
            database.AspNetRoles.Remove(role);
            database.SaveChanges();
            return RedirectToAction("taches");
        }



        public ActionResult AddTachePartial()
        {
            return PartialView("_TacheModal", multiModeles());
        }

        
        public async Task<JsonResult> AddTachePartiale([Bind(Include = "Name,SouModuleId,RoleDescription")] AspNetRoles role)
        {
            var data = new object();
            if (ModelState.IsValid)
            {
                var Rid = Guid.NewGuid(); role.Id = Rid.ToString();
                database.AspNetRoles.Add(role);
                var result = await database.SaveChangesAsync();
                var roles = from p in database.AspNetRoles.ToList()
                            select new AspNetRoles
                            {
                                Id = p.Id,
                                Name = p.Name,
                                SouModuleId = p.SouModuleId
                            };

                data = new { dd = "error", roles };
                return Json(data, JsonRequestBehavior.AllowGet);
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

        [HttpPost]
        public ActionResult Test(RegisterViewModel model)
        {
            ViewBag.StatutId = new SelectList(database.Statuts, "StatutId", "StatutName");
            return View(model);
        }
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
        //return Json(new { dd = "error", data = insertedRecords }, JsonRequestBehavior.AllowGet);
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