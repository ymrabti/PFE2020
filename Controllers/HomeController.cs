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
            return View(database.AspNetUsers.ToList());
        }


        [Authorize]
        public ActionResult AddUser() {
            return View();
        }

        [Authorize]

        public ActionResult UserTache() {
            return View();
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