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

        [HttpPost]
        public ActionResult SubmitModule(FormCollection formcollection)
        {
            TempData["Message"] = "Fruit Name: " + formcollection["UserName"];
            TempData["Message"] += "\\nFruit Id: " + formcollection["Id"]; ;
            return RedirectToAction("UserTache");
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
                aspNetUsers = database.AspNetUsers.Where(p => p.Id == id).ToList(),
                aspNetRoles = database.AspNetRoles.ToList(),
                aspNetUserRoles = database.AspNetUserRoles.Where(user => user.UserId == id).ToList(),
                modules = database.Module.ToList(),
                sousModules = database.SousModule.ToList()
            };
            ViewBag.modules = new SelectList(database.Module, "ModuleId", "ModuleName");
            ViewBag.sousmodules = new SelectList(database.SousModule, "SousModuleId", "SousModuleName");
            ViewBag.taches = new SelectList(database.AspNetRoles, "Id", "Name");
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
        public ViewResult StatutTache()
        {
            var model = new MultiModeles
            {
                statuts = database.Statuts.ToList(),
                aspNetRoles = database.AspNetRoles.ToList(),
                statutRoles = database.StatutRole.ToList(),
                modules = database.Module.ToList(),
                sousModules = database.SousModule.ToList()
            };

            ViewBag.modules = new SelectList(database.Module, "ModuleId", "ModuleName");
            ViewBag.sousmodules = new SelectList(database.SousModule, "SousModuleId", "SousModuleName");
            ViewBag.taches = new SelectList(database.AspNetRoles, "Id", "Name");

            ViewBag.Statut = new SelectList(database.Statuts, "StatutId", "StatutName");
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

        public JsonResult SaveData(string getepassdata)
        {
            //try
            //{
            //    var serializeData = JsonConvert.DeserializeObject<List<AspNetUserRoles>>(getepassdata);

            //    foreach (var data in serializeData)
            //    {
            //        database.AspNetUserRoles.Add(data);
            //    }

            //    database.SaveChanges();
            //}
            //catch (Exception)
            //{
            //    return Json("fail");
            //}

            return Json(getepassdata);
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult TableResult([Bind(Include = "Id,Name,SouModuleId,RoleDescription")] AspNetUserRoles aspNetRoles)
        {
            if (!ModelState.IsValid)
            {
                ViewBag.tab = "modele non valide";
            }
            else
            {
                ViewBag.tab = aspNetRoles.ToString();
            }

            return View();
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