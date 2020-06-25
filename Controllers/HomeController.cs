using GestionnaireUtilisateurs.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using System;
using System.Collections.Generic;
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
        public const string Administrator = "Administrator";
        //public string admin()=User.Identity.GetUserId();

        public string admin()
        {
            return User.Identity.GetUserId();
        }
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
            var rolesAdmin = database.AspNetUserRoles.Where(ol => ol.AspNetRoles.Name == Administrator);
            var mModels = new MultiModeles
            {
                aspNetUsers = database.AspNetUsers.Where(k => !k.Supp).Where(i => i.AspNetUserRoles.Where(ii => ii.AspNetRoles.Name == Administrator).Count() == 0).ToList(),
                modules = database.Module.ToList(),
                sousModules = database.SousModule.ToList(),
                aspNetRoles = database.AspNetRoles.Where(p => p.Name != Administrator).ToList(),
                statuts = database.Statuts.Where(k => !k.supp).ToList(),
                statutRoles = database.StatutRole.ToList()
            };
            return mModels;
        }

        public void EnvoyerLaNotification(int type, int danger, string uid)
        {
            Notification notification = new Notification
            {
                IdUser = uid,
                Type = type,
                heure_date = DateTime.Now,
                danger = danger
            };
            database.Notification.Add(notification);
            database.SaveChanges();
        }
        private void LogUserHistoryDel(bool supression, string uid)
        {
            var user = database.AspNetUsers.Find(uid);
            user.lastModif = DateTime.Now;
            database.SaveChanges();
            HistoriqueUserDeletion historiqueUser = new HistoriqueUserDeletion
            {
                AdminSupp = admin(),
                date_heure = DateTime.Now,
                IdHistoire = Guid.NewGuid().ToString(),
                Suppression = supression,
                UserConcernee = uid
            };
            database.HistoriqueUserDeletion.Add(historiqueUser);
            database.SaveChanges();
        }
        private void LogStatutHistoryDel(bool suppression, string sid)
        {
            var statut = database.Statuts.Find(sid);
            statut.lastModif = DateTime.Now;
            HistoireStatutDeletion historiqueStatut = new HistoireStatutDeletion
            {
                AdminSupp = admin(),
                date_heure = DateTime.Now,
                IdHistoire = Guid.NewGuid().ToString(),
                Suppression = suppression,
                FK_Statut = sid
            };
            database.HistoireStatutDeletion.Add(historiqueStatut);
            database.SaveChanges();
        }

        [Authorize(Roles = Administrator)]
        public ActionResult Index()
        {
            return View(multiModeles());
        }


        [Authorize(Roles = Administrator)]
        public ActionResult AddUser()
        {
            ViewBag.StatutId = new SelectList(database.Statuts, "StatutId", "StatutName");
            return View();
        }


        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> AddUser(RegisterViewModel model)
        {
            ViewBag.StatutId = new SelectList(database.Statuts, "StatutId", "StatutName");
            if (ModelState.IsValid)
            {
                var user = new ApplicationUser
                {
                    UserName = model.UserName,
                    Email = model.Email,
                    PhoneNumber = model.PhoneNumber
                };
                var result = await UserManager.CreateAsync(user, model.Password);
                if (result.Succeeded)
                {
                    string uid = user.Id;
                    string sid = model.StatutId;
                    var UserCreated = database.AspNetUsers.Find(uid);
                    UserCreated.Nom = model.Nom;
                    UserCreated.Prenom = model.Prenom;
                    UserCreated.NomAr = model.NomAr;
                    UserCreated.PrenomAr = model.PrenomAr;
                    UserCreated.UserNameAr = model.PrenomAr + " " + model.NomAr;
                    UserCreated.CIN = model.CIN;
                    UserCreated.Ville = model.Ville;
                    UserCreated.Sexe = model.Sexe;
                    UserCreated.StatutId = sid;
                    UserCreated.typeUtilisateur = model.typeUtilisateur;
                    UserCreated.Entreprise = model.Entreprise;

                    database.Entry(UserCreated).State = EntityState.Modified;

                    var tachesfromstatut = database.StatutRole.Where(statut => statut.StatutId == sid).ToList();
                    var userRoles = new List<AspNetUserRoles>();
                    foreach (var element in tachesfromstatut)
                    {
                        AspNetUserRoles userRole = new AspNetUserRoles();
                        userRole.UserId = uid;
                        userRole.RoleId = element.RoleId;
                        userRole.Create = element.Cree;
                        userRole.Update = element.Modifier;
                        userRole.Read = element.Lire;
                        userRole.Delete = element.Supprimer;
                        userRoles.Add(userRole);
                    }
                    database.AspNetUserRoles.AddRange(userRoles);
                    var res = await database.SaveChangesAsync();
                    // string code = await UserManager.GenerateEmailConfirmationTokenAsync(user.Id);
                    // var callbackUrl = Url.Action("ConfirmEmail", "Account", new { userId = user.Id, code = code }, protocol: Request.Url.Scheme);
                    // await UserManager.SendEmailAsync(user.Id, "Confirmez votre compte", "Confirmez votre compte en cliquant <a href=\"" + callbackUrl + "\">ici</a>");

                    LogUserHistoryDel(false, uid);
                    EnvoyerLaNotification(5, 3, uid);
                    return RedirectToAction("Index", "Home");
                }
                ViewBag.errors = result.Errors;
            }
            return View(model);
        }

        [Authorize(Roles = Administrator)]
        public ActionResult EditUser(string id)
        {
            ViewBag.Statuts = database.Statuts.Where(k => !k.supp).ToList();
            var User = database.AspNetUsers.Find(id);
            RegisterParentViewModel viewModel = new RegisterParentViewModel();
            viewModel.Id = User.Id;
            viewModel.typeUtilisateur = User.typeUtilisateur;
            viewModel.Entreprise = User.Entreprise;
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
        public async Task<ActionResult> EditUser(RegisterParentViewModel parentViewModel)
        {
            ViewBag.StatutId = new SelectList(database.Statuts, "StatutId", "StatutName");
            ViewBag.Statuts = database.Statuts.Where(k => !k.supp).ToList();
            if (ModelState.IsValid)
            {
                var user = database.AspNetUsers.Find(parentViewModel.Id);
                var old_statut = user.StatutId;
                var new_statut = parentViewModel.StatutId;
                var uid = parentViewModel.Id;
                user.typeUtilisateur = parentViewModel.typeUtilisateur;
                user.Entreprise = parentViewModel.Entreprise;
                user.Nom = parentViewModel.Nom;
                user.NomAr = parentViewModel.NomAr;
                user.Prenom = parentViewModel.Prenom;
                user.PrenomAr = parentViewModel.PrenomAr;
                user.CIN = parentViewModel.CIN;
                user.Ville = parentViewModel.Ville;
                user.Sexe = parentViewModel.Sexe;
                user.Email = parentViewModel.Email;
                user.PhoneNumber = parentViewModel.PhoneNumber;
                user.StatutId = parentViewModel.StatutId;
                database.Entry(user).State = EntityState.Modified;
                var res = await database.SaveChangesAsync();
                if (user.Email != parentViewModel.Email)
                {
                    EnvoyerLaNotification(3, 1, uid);
                }
                if (res == 0)
                {
                    return View(parentViewModel);
                }
                if (parentViewModel.Password == "" || parentViewModel.Password == null || parentViewModel.Password == "null")
                {
                    //return RedirectToAction("Index");
                }
                else
                {
                    var userManager = HttpContext.GetOwinContext().GetUserManager<ApplicationUserManager>();
                    var code = await userManager.GeneratePasswordResetTokenAsync(parentViewModel.Id);
                    var result = await userManager.ResetPasswordAsync(parentViewModel.Id, code, parentViewModel.Password);
                    if (!result.Succeeded)
                    {
                        //password does not meet standards
                        ViewBag.Statuts = database.Statuts.Where(k => !k.supp).ToList();
                        ViewBag.errors = result.Errors;
                        EnvoyerLaNotification(2, 6, uid);
                        return View(parentViewModel);
                    }
                }
                if (old_statut != new_statut)
                {

                    var aspNetUserRoles = user.AspNetUserRoles.Where(u => u.AspNetRoles.Name != Administrator);
                    var tachesfromstatut = database.StatutRole.Where(statut => statut.StatutId == new_statut).ToList();

                    database.AspNetUserRoles.RemoveRange(aspNetUserRoles);
                    var userRoles = new List<AspNetUserRoles>();
                    foreach (var element in tachesfromstatut)
                    {
                        AspNetUserRoles userRole = new AspNetUserRoles();
                        userRole.UserId = uid;
                        userRole.RoleId = element.RoleId;
                        userRole.Create = element.Cree;
                        userRole.Update = element.Modifier;
                        userRole.Read = element.Lire;
                        userRole.Delete = element.Supprimer;
                        userRoles.Add(userRole);
                    }
                    database.AspNetUserRoles.AddRange(userRoles);
                    database.SaveChanges();
                    EnvoyerLaNotification(5, 3, uid);
                }
                LogUserHistoryDel(false, uid);
                return RedirectToAction("Index");
            }
            return View(parentViewModel);
        }


        [Authorize(Roles = Administrator)]
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
            if (user.Nom == "")
            {
                if (user.Prenom == "") { ViewBag.utilisateur = "sans nom"; } else { ViewBag.utilisateur = user.Prenom; }
            }
            else
            {
                if (user.Prenom == "") { ViewBag.utilisateur = user.Nom; } else { ViewBag.utilisateur = user.Nom + " " + user.Prenom; }
            }

            if (user.Statuts == null)
            {
                ViewBag.statutName = "";
            }
            else
            {
                ViewBag.statutName = user.Statuts.StatutName;
            }

            var multiModeles = new MultiModeles
            {
                aspNetUserRoles = user.AspNetUserRoles
            };
            return View(multiModeles);
        }


        [ValidateAntiForgeryToken]
        [HttpPost, ActionName("DeleteUser")]
        public ActionResult DeleteUserConfirmed(string id)
        {

            var user = database.AspNetUsers.Find(id);
            if (user.AspNetUserRoles.Where(a => a.AspNetRoles.Name == Administrator).Count() == 0)
            {
                var userRoles = user.AspNetUserRoles;
                database.AspNetUserRoles.RemoveRange(userRoles);


                //database.AspNetUsers.Remove(user);
                user.Supp = true;

                EnvoyerLaNotification(5, 3, id); EnvoyerLaNotification(4, 9, id);
                LogUserHistoryDel(true, id);
            }

            return RedirectToAction("Index");
        }


        /// ///////////////////////              USER TACHE                    //////////////////////
        /// ///////////////////////              USER TACHE                    //////////////////////
        /// ///////////////////////              USER TACHE                    //////////////////////

        [Authorize(Roles = Administrator)]
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

            if (aspNetUser.Statuts.supp)
            {
                ViewBag.StatusName = "Supprimée";
            }
            else { ViewBag.StatusName = aspNetUser.Statuts.StatutName; }
            ViewBag.Modules = new SelectList(database.Module);

            var model = new MultiModeles
            {
                aspNetUserRoles = aspNetUser.AspNetUserRoles.Where(p => p.AspNetRoles.Name != Administrator),
                aspNetRoles = database.AspNetRoles.Where(p => p.Name != Administrator).ToList(),
                modules = database.Module.ToList(),
                sousModules = database.SousModule.ToList()
            };
            return View(model);
        }


        [ValidateAntiForgeryToken]
        [HttpPost]
        public ActionResult UserTache(string[] Create, string[] Read, string[] Update, string[] Delete
            , string[] UserId, string[] RoleId)
        {
            if (ModelState.IsValid)
            {
                var currentUser = UserId[0];
                var user = database.AspNetUsers.Find(currentUser);
                var aspNetUserRoles = user.AspNetUserRoles.Where(u => u.AspNetRoles.Name != Administrator);

                database.AspNetUserRoles.RemoveRange(aspNetUserRoles);
                for (int i = 0; i < Read.Length; i++)
                {
                    var reoleIdi = RoleId[i];
                    var role = database.AspNetRoles.Find(reoleIdi);
                    if (role.Name != Administrator)
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

                }
                database.SaveChanges();
                EnvoyerLaNotification(5, 3, currentUser);
                return RedirectToAction("Index");
            }
            return RedirectToAction("UserTache", new { id = UserId[0] });
        }

        /// ///////////////////////             STATUT                    //////////////////////
        /// ///////////////////////             STATUT                    //////////////////////
        /// ///////////////////////             STATUT                    //////////////////////



        [Authorize(Roles = Administrator)]
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
                var Sid = Guid.NewGuid();
                var sid_ = Sid.ToString();
                statut.StatutId = sid_;
                database.Statuts.Add(statut);
                database.SaveChanges();
                LogStatutHistoryDel(false, sid_);
                return RedirectToAction("IndexStatut");
            }
            return View();
        }


        [Authorize(Roles = Administrator)]
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
            if (statut.supp)
            {
                return RedirectToAction("IndexStatut");
            }
            ViewBag.statutId = statut.StatutId;
            ViewBag.statutName = statut.StatutName;
            ViewBag.statutDescription = statut.StatutDescription;
            return View();
        }

        [HttpPost, ValidateAntiForgeryToken]
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

                LogStatutHistoryDel(false, statut.StatutId);
                return RedirectToAction("IndexStatut");
            }
            return View();
        }


        [Authorize(Roles = Administrator)]
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
            if (statut.supp)
            {
                return RedirectToAction("IndexStatut");
            }
            ViewBag.statutName = statut.StatutName;
            var multiModeles = new MultiModeles
            {
                aspNetUsers = statut.AspNetUsers.Where(i => !i.Supp),
                statutRoles = statut.StatutRole
            };
            return View(multiModeles);
        }

        [HttpPost, ValidateAntiForgeryToken, ActionName("DeleteStatut")]
        public ActionResult DeleteStatutConfirmed(string id)
        {
            Statuts statut = database.Statuts.Find(id);

            if (statut.supp)
            {
                return RedirectToAction("IndexStatut");
            }
            var users = statut.AspNetUsers;
            int Admins = 0;

            foreach (var user in users)
            {
                Admins += user.AspNetUserRoles.Where(a => a.AspNetRoles.Name == Administrator).Count();
            }
            if (Admins == 0)
            {
                //var statutRoles = statut.StatutRole;
                //database.StatutRole.RemoveRange(statutRoles);


                foreach (var user in users)
                {
                    var userRoles = user.AspNetUserRoles;
                    database.AspNetUserRoles.RemoveRange(userRoles);

                    user.Supp = true;
                    database.SaveChanges();
                    EnvoyerLaNotification(5, 3, user.Id); EnvoyerLaNotification(4, 9, user.Id);
                    LogUserHistoryDel(true, user.Id);
                    //database.AspNetUsers.Remove(user);
                }
                statut.supp = true;

                LogStatutHistoryDel(true, statut.StatutId);
                //database.Statuts.Remove(statut);
                database.SaveChanges();
            }

            return RedirectToAction("IndexStatut");
        }



        [Authorize(Roles = Administrator)]
        public ActionResult AddStatutPartial()
        {
            return PartialView("_StatutModal", new StatutsViewModel());
        }


        [Authorize(Roles = Administrator)]
        public async Task<JsonResult> AddStatutPartiale([Bind(Include = "StatutName,StatutDescription")]Statuts Statut)
        {
            var data = new object();
            if (ModelState.IsValid)
            {
                Statut.StatutId = Guid.NewGuid().ToString();
                database.Statuts.Add(Statut);
                var result = await database.SaveChangesAsync();
                var statutss = from p in database.Statuts.Where(k => !k.supp).ToList()
                               select new Statuts
                               {
                                   StatutId = p.StatutId,
                                   StatutName = p.StatutName
                               };

                data = new { dd = "error", statutss };


                LogStatutHistoryDel(false, Statut.StatutId);
                return Json(data, JsonRequestBehavior.AllowGet);
            }
            return Json(new { dd = "error", data }, JsonRequestBehavior.AllowGet);
        }
        [Authorize(Roles = Administrator)]
        public JsonResult ResetRolesFromStatut(string UserId)
        {
            var statut = database.AspNetUsers.Find(UserId).Statuts;
            if (statut == null)
            {
                return Json(new { dd = "error" }, JsonRequestBehavior.AllowGet);
            }
            var tachesdestatut = statut.StatutRole.Where(z => z.AspNetRoles.Name != Administrator).ToList();
            var data = new
            {
                dd = "success",
                rolesstauts = tachesdestatut.Select(
                    item => new
                    {
                        rowidnewcc = item.RoleId,
                        r = item.Lire,
                        c = item.Cree,
                        u = item.Modifier,
                        d = item.Supprimer,
                        modulename = item.AspNetRoles.SousModule.Module.ModuleName,
                        sousmodulename = item.AspNetRoles.SousModule.SousModuleName,
                        tachename = item.AspNetRoles.Name
                    })
            };
            return Json(data, JsonRequestBehavior.AllowGet);
        }


        /// ///////////////////////              STATUT TACHE                    //////////////////////
        /// ///////////////////////              STATUT TACHE                    //////////////////////
        /// ///////////////////////              STATUT TACHE                    //////////////////////

        [Authorize(Roles = Administrator)]
        public ActionResult IndexStatut()
        {
            return View(multiModeles());
        }


        [Authorize(Roles = Administrator)]
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
            if (statuts.supp)
            {
                return RedirectToAction("IndexStatut");
            }
            ViewBag.Nom = statuts.StatutName;
            ViewBag.StatutId = statuts.StatutId;

            var model = new MultiModeles
            {
                statutRoles = database.StatutRole.Where(user => user.StatutId == id).ToList(),
                aspNetRoles = database.AspNetRoles.Where(p => p.Name != Administrator).ToList(),
                modules = database.Module.ToList(),
                sousModules = database.SousModule.ToList()
            };

            return View(model);
        }
        [HttpPost, ValidateAntiForgeryToken]
        public ActionResult StatutTache(string[] Create, string[] Read, string[] Update, string[] Delete
            , string[] StatutId, string[] RoleId)
        {
            if (ModelState.IsValid && Read.Length != 0)
            {
                var currentStatut = StatutId[0];
                var _statut = database.Statuts.Find(currentStatut);
                var statutRole = _statut.StatutRole;
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
                var userOfStatut = _statut.AspNetUsers
                    .Where(i => i.AspNetUserRoles.Where(ii => ii.AspNetRoles.Name == Administrator).Count() == 0);
                foreach (var user in userOfStatut)
                {
                    var userRoles = user.AspNetUserRoles;
                    database.AspNetUserRoles.RemoveRange(userRoles);

                    var newUserRoles = new List<AspNetUserRoles>();
                    for (int i = 0; i < Read.Length; i++)
                    {
                        var userRole = new AspNetUserRoles
                        {
                            UserId = user.Id,
                            RoleId = RoleId[i],
                            Read = Read[i].ToUpper().Equals("TRUE"),
                            Create = Create[i].ToUpper().Equals("TRUE"),
                            Update = Update[i].ToUpper().Equals("TRUE"),
                            Delete = Delete[i].ToUpper().Equals("TRUE")
                        };
                        newUserRoles.Add(userRole);
                    }
                    database.AspNetUserRoles.AddRange(newUserRoles);
                }
                database.SaveChanges();
            }
            return RedirectToAction("IndexStatut");
        }

        /// ///////////////////////              MODULE                    //////////////////////
        /// ///////////////////////              MODULE                    //////////////////////
        /// ///////////////////////              MODULE                    //////////////////////


        [Authorize(Roles = Administrator)]
        public ActionResult module()
        {
            return View(multiModeles());
        }

        [Authorize(Roles = Administrator)]
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

        [Authorize(Roles = Administrator)]
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


        [Authorize(Roles = Administrator)]
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
            var multiModeles = new MultiModeles
            {
                applicationModules = module.ApplicationModule,
                sousModules = module.SousModule
            };
            return View(multiModeles);
        }

        // POST: AspNetRoles/Delete/5
        [HttpPost, ActionName("DeleteModule")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteModuleConfirmed(int id)
        {
            Module module = database.Module.Find(id);
            var applicationModules = module.ApplicationModule;
            database.ApplicationModule.RemoveRange(applicationModules);
            var sousmodules = module.SousModule;
            foreach (var sousModule in sousmodules)
            {
                var roles = sousModule.AspNetRoles;
                foreach (var role in roles)
                {
                    var userRoles = role.AspNetUserRoles.Where(u => u.AspNetRoles.Name != Administrator);
                    var statutsRoles = role.StatutRole;
                    database.AspNetUserRoles.RemoveRange(userRoles);
                    database.StatutRole.RemoveRange(statutsRoles);
                }
                database.AspNetRoles.RemoveRange(roles);
            }
            database.SousModule.RemoveRange(sousmodules);
            database.Module.Remove(module);
            database.SaveChanges();
            return RedirectToAction("module");
        }


        [Authorize(Roles = Administrator)]
        public ActionResult AddModulePartial()
        {
            return PartialView("_Modal");
        }


        [Authorize(Roles = Administrator)]
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

        [Authorize(Roles = Administrator)]
        public ActionResult sousmodule()
        {
            return View(multiModeles());
        }

        [Authorize(Roles = Administrator)]
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

        [Authorize(Roles = Administrator)]
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


        [Authorize(Roles = Administrator)]
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

            var multiModeles = new MultiModeles
            {
                aspNetRoles = sousModule.AspNetRoles
            };
            return View(multiModeles);
        }

        [HttpPost, ActionName("DeleteSubModule")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteSubModuleConfirmed(int id)
        {
            SousModule sousModule = database.SousModule.Find(id);
            var roles = sousModule.AspNetRoles;
            foreach (var role in roles)
            {
                var userRoles = role.AspNetUserRoles.Where(u => u.AspNetRoles.Name != Administrator);
                var statutsRoles = role.StatutRole;
                database.AspNetUserRoles.RemoveRange(userRoles);
                database.StatutRole.RemoveRange(statutsRoles);
            }
            database.AspNetRoles.RemoveRange(roles);
            database.SousModule.Remove(sousModule);
            database.SaveChanges();
            return RedirectToAction("sousmodule");
        }

        [Authorize(Roles = Administrator)]
        public ActionResult AddSubModulePartial()
        {
            return PartialView("_SubModuleModal", multiModeles());
        }


        [Authorize(Roles = Administrator)]
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
                                 ModuleId = p.ModuleId
                             };

                data = new { dd = "error", smdles };
                return Json(data, JsonRequestBehavior.AllowGet);
            }
            return Json(new { dd = "error", data }, JsonRequestBehavior.AllowGet);
        }

        /// ///////////////////////             TACHES                    //////////////////////
        /// ///////////////////////             TACHES                    //////////////////////
        /// ///////////////////////             TACHES                    //////////////////////

        [Authorize(Roles = Administrator)]
        public ActionResult taches()
        {
            return View(multiModeles());
        }


        [Authorize(Roles = Administrator)]
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
                string nom = Tache.Name;
                var roles = database.AspNetRoles.Where(i => i.Name == nom);
                if (roles.Count() == 0)
                {
                    var Rid = Guid.NewGuid(); Tache.Id = Rid.ToString();
                    database.AspNetRoles.Add(Tache);
                    database.SaveChanges();
                }

                return RedirectToAction("taches");
            }
            return View(multiModeles());
        }


        [Authorize(Roles = Administrator)]
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
            if (role.Name != Administrator)
            {
                ViewBag.SousModuleId = role.SouModuleId;
                ViewBag.ModuleId = role.SousModule.Module.ModuleId;
                ViewBag.RoleId = role.Id;
            }
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
                string rn = role.Name;
                var nexist = database.AspNetRoles.Where(u => u.Name == rn).Count() == 0;
                if (nexist)
                {
                    database.Entry(role).State = EntityState.Modified;
                    database.SaveChanges();
                }

                return RedirectToAction("taches");
            }
            return View(multiModeles());
        }


        [Authorize(Roles = Administrator)]
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
            var multiModeles = new MultiModeles
            {
                Tache = role,
                statutRoles = role.StatutRole,
                aspNetUserRoles = role.AspNetUserRoles
            };
            return View(multiModeles);
        }

        [HttpPost, ActionName("DeleteTache")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteTacheConfirmed(string id)
        {
            AspNetRoles role = database.AspNetRoles.Find(id);
            var userRoles = role.AspNetUserRoles.Where(u => u.AspNetRoles.Name != Administrator);
            var statutsRoles = role.StatutRole;
            database.AspNetUserRoles.RemoveRange(userRoles);
            database.StatutRole.RemoveRange(statutsRoles);
            database.AspNetRoles.Remove(role);
            database.SaveChanges();
            return RedirectToAction("taches");
        }



        [Authorize(Roles = Administrator)]
        public ActionResult AddTachePartial()
        {
            return PartialView("_TacheModal", multiModeles());
        }


        [Authorize(Roles = Administrator)]
        public async Task<JsonResult> AddTachePartiale([Bind(Include = "Name,SouModuleId,RoleDescription")] AspNetRoles role)
        {
            var data = new object();
            if (ModelState.IsValid)
            {
                var Rid = Guid.NewGuid(); role.Id = Rid.ToString();
                string nom = role.Name;
                var roless = database.AspNetRoles.Where(i => i.Name == nom);
                if (roless.Count() == 0)
                {
                    database.AspNetRoles.Add(role);
                    var result = await database.SaveChangesAsync();

                }
                var roles = from p in database.AspNetRoles.Where(u => u.Name != Administrator).ToList()
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
        [Authorize]
        public ActionResult AURS()
        {
            ViewBag.f = -99; ViewBag.str = "..."; ViewBag.date = DateTime.UtcNow;
            return View();
        }
        [HttpPost, ValidateAntiForgeryToken]
        public JsonResult AURS(int f, string str, DateTime date)
        {
            var data = new object();
            if (ModelState.IsValid)
            {
                ViewBag.f = f; ViewBag.str = str; ViewBag.date = date;
                data = new { dd = "success", f, str, date };
                return Json(data, JsonRequestBehavior.AllowGet);
            }
            return Json(new { dd = "error", data }, JsonRequestBehavior.AllowGet);
        }
        /// ///////////////////////             AUTRESAUTRES                    //////////////////////
        /// ///////////////////////             AUTRESAUTRES                    //////////////////////
        /// ///////////////////////             AUTRESAUTRES                    //////////////////////
        /// 

        [Authorize]
        public PartialViewResult NavBar()
        {
            var UID = User.Identity.GetUserId();
            var user = database.AspNetUsers.Find(UID);
            var model = new MultiModeles
            {
                notifications = user.Notification.OrderByDescending(i=>i.heure_date).Take(5).ToList()
            };
            //C:\Users\HPr\source\repos\GestionnaireUtilisateurs\Views\Shared\_NavBar.cshtml
            return PartialView("~/Views/Shared/_NavBar.cshtml", model);
        }

        [Authorize]
        public ActionResult NotificationClick()
        {
            return
        }
    }
}