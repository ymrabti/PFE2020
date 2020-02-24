using GestionnaireUtilisateurs.Models;
using System;
using System.Collections.Generic;
using System.Linq;
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
        public ActionResult AddUser() {
            return View();
        }

        [Authorize]
        public ActionResult UserTache() {
            var model = new MultiModeles
            {
                aspNetUsers = database.AspNetUsers.Where(p => p.NomAr != null).ToList(),
                aspNetRoles = database.AspNetRoles.ToList(),
                aspNetUserRoles = database.AspNetUserRoles.ToList(),
                modules = database.Module.ToList(),
                sousModules = database.SousModule.ToList()
            };
            ViewBag.Users = new SelectList(database.AspNetUsers, "Id", "UserName");
            ViewBag.modules = new SelectList(database.Module, "ModuleId", "ModuleName");
            ViewBag.sousmodules = new SelectList(database.SousModule, "SousModuleId", "SousModuleName");
            ViewBag.taches = new SelectList(database.AspNetRoles, "Id", "Name");
            return View(model);
        }
        
        [Authorize]
        public ActionResult StatutTache() {
            var model = new MultiModeles
            {
                statuts = database.Statuts.ToList(),
                aspNetRoles = database.AspNetRoles.ToList(),
                statutRoles = database.StatutRole.ToList(),
                modules = database.Module.ToList(),
                sousModules = database.SousModule.ToList()
            };
            ViewBag.Statut = new SelectList(database.Statuts, "StatutId", "StatutName");
            ViewBag.modules = new SelectList(database.Module, "ModuleId", "ModuleName");
            ViewBag.sousmodules = new SelectList(database.SousModule, "SousModuleId", "SousModuleName");
            ViewBag.taches = new SelectList(database.AspNetRoles, "Id", "Name");
            return View(model);
        }


        [Authorize]
        public ActionResult module() {
            return View(database.Module.ToList());
        }
        [Authorize]
        public ActionResult sousmodule() {
            return View(database.SousModule.ToList());
        }
        [Authorize]
        public ActionResult taches() {
            return View(database.AspNetRoles.ToList());
        }




        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}