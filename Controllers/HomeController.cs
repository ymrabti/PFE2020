using GestionnaireUtilisateurs.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System.Linq;
using System.Net;
using System.Web.Mvc;

namespace GestionnaireUtilisateurs.Controllers
{
    public class HomeController : Controller
    {
        aurs1Entities database = new aurs1Entities();
        [Authorize]
        public ActionResult Index()
        {
            var user = database.AspNetUsers.ToList();
            return View(user);
        }
        [Authorize]
        public ActionResult AddUser()
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
        public ActionResult UserTache( string[] Create, string[] Read, string[] Update, string[] Delete
            , string[] UserId, string[] RoleId)
        {
            if (ModelState.IsValid && Read.Length != 0)
            {
                var currentUser = UserId[0];
                var aspNetUserRoles = database.AspNetUserRoles.Where(iden => iden.UserId == currentUser);
                database.AspNetUserRoles.RemoveRange(aspNetUserRoles);
                for (int i=0;i<Read.Length;i++) {
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
            return View(database.Module.ToList());
        }
        [Authorize]

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult UserTacheAddModule([Bind(Include = "ModuleName,ModuleDescription")] Module module)
        {

            if (ModelState.IsValid)
            {
                database.Module.Add(module);
                database.SaveChanges();
                return RedirectToAction("Index");
            }
            return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
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


        /// ///////////////////////             AUTRES                    //////////////////////
        /// ///////////////////////             AUTRES                    //////////////////////
        /// ///////////////////////             AUTRES                    //////////////////////

        public ActionResult About()
        {
            ViewBag.RoleId = new SelectList(database.AspNetRoles, "Id", "Name");
            ViewBag.UserId = new SelectList(database.AspNetUsers, "Id", "UserNameAr");
            return View(new AspNetUserRoles { });
        }


        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }



        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Test([Bind(Include = "Name,SousModuleId,RoleDescription")] AspNetRoles sousModules
            ,int SousModuleId)
        {
            ViewBag.Test = "";
            if (sousModules==null)
            {
                ViewBag.Test += "NULL";
            }
            else
            {
                var tache = new RoleManager<IdentityRole>(new RoleStore<IdentityRole>(new ApplicationDbContext())) ;
                var tachee = tache.Create(new IdentityRole());
                sousModules.SouModuleId = SousModuleId;
                //database.AspNetRoles.Add(sousModules);database.SaveChanges();
                ViewBag.Test += sousModules.Name + " * " + sousModules.RoleDescription + " * " + sousModules.SouModuleId;
            }
            
            return View();
        }
    }
}