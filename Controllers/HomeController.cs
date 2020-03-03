using GestionnaireUtilisateurs.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web;
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

            var model = new MultiModeles
            {
                statutRoles = database.StatutRole.Where(user => user.StatutId == id).ToList(),
                aspNetRoles = database.AspNetRoles.ToList(),
                modules = database.Module.ToList(),
                sousModules = database.SousModule.ToList()
            };

            return View(model);
        }


        [Authorize]
        public ActionResult module()
        {
            return View(database.Module.ToList());
        }
        [Authorize]
        public ActionResult sousmodule()
        {
            return View(database.SousModule.ToList());
        }
        [Authorize]
        public ActionResult taches()
        {
            return View(database.AspNetRoles.ToList());
        }


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
    }
}