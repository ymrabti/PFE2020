using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using GestionnaireUtilisateurs.Models;

namespace GestionnaireUtilisateurs.Controllers
{
    public class UsersController : Controller
    {
        private aurs1Entities db = new aurs1Entities();

        // GET: Users
        public ActionResult Index()
        {
            var aspNetUsers = db.AspNetUsers.Include(a => a.Statuts);
            return View(aspNetUsers.ToList());
        }

        // GET: Users/Details/5
        public ActionResult Details(string id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            AspNetUsers aspNetUsers = db.AspNetUsers.Find(id);
            if (aspNetUsers == null)
            {
                return HttpNotFound();
            }
            return View(aspNetUsers);
        }

        // GET: Users/Create
        public ActionResult Create()
        {
            ViewBag.StatutId = new SelectList(db.Statuts, "StatutId", "StatutName");
            return View();
        }

        // POST: Users/Create
        // Afin de déjouer les attaques par sur-validation, activez les propriétés spécifiques que vous voulez lier. Pour 
        // plus de détails, voir  https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "Id,UserNameAr,Nom,Prenom,Ville,CIN,Sexe,NomAr,PrenomAr,Intiulé,Adresse,demandeur,Email,EmailConfirmed,PasswordHash,SecurityStamp,PhoneNumber,PhoneNumberConfirmed,TwoFactorEnabled,LockoutEndDateUtc,LockoutEnabled,AccessFailedCount,UserName,StatutId,typeUtilisateur,Organisme")] AspNetUsers aspNetUsers)
        {
            if (ModelState.IsValid)
            {
                aspNetUsers.Id = Guid.NewGuid().ToString();
                db.AspNetUsers.Add(aspNetUsers);
                db.SaveChanges();
                return RedirectToAction("Index");
            }

            ViewBag.StatutId = new SelectList(db.Statuts, "StatutId", "StatutName", aspNetUsers.StatutId);
            return View(aspNetUsers);
        }

        // GET: Users/Edit/5
        public ActionResult Edit(string id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            AspNetUsers aspNetUsers = db.AspNetUsers.Find(id);
            if (aspNetUsers == null)
            {
                return HttpNotFound();
            }
            ViewBag.StatutId = new SelectList(db.Statuts, "StatutId", "StatutName", aspNetUsers.StatutId);
            return View(aspNetUsers);
        }

        // POST: Users/Edit/5
        // Afin de déjouer les attaques par sur-validation, activez les propriétés spécifiques que vous voulez lier. Pour 
        // plus de détails, voir  https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "Id,UserNameAr,Nom,Prenom,Ville,CIN,Sexe,NomAr,PrenomAr,Intiulé,Adresse,demandeur,Email,EmailConfirmed,PasswordHash,SecurityStamp,PhoneNumber,PhoneNumberConfirmed,TwoFactorEnabled,LockoutEndDateUtc,LockoutEnabled,AccessFailedCount,UserName,StatutId,typeUtilisateur,Organisme")] AspNetUsers aspNetUsers)
        {
            //if (ModelState.IsValid)
            //{
            //    db.Entry(aspNetUsers).State = EntityState.Modified;
            //    db.SaveChanges();
            //    return RedirectToAction("Index");
            //}
            //ViewBag.StatutId = new SelectList(db.Statuts, "StatutId", "StatutName", aspNetUsers.StatutId);
            //return View(aspNetUsers);
            if (ModelState.IsValid)
            {
                aspNetUsers.Id = Guid.NewGuid().ToString();
                aspNetUsers.Email = Guid.NewGuid().ToString();
                aspNetUsers.UserName = Guid.NewGuid().ToString();
                
                db.AspNetUsers.Add(aspNetUsers);
                db.SaveChanges();
                return RedirectToAction("Index");
            }

            ViewBag.StatutId = new SelectList(db.Statuts, "StatutId", "StatutName", aspNetUsers.StatutId);
            return View(aspNetUsers);
        }

        // GET: Users/Delete/5
        public ActionResult Delete(string id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            AspNetUsers aspNetUsers = db.AspNetUsers.Find(id);
            if (aspNetUsers == null)
            {
                return HttpNotFound();
            }
            return View(aspNetUsers);
        }

        // POST: Users/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(string id)
        {
            AspNetUsers aspNetUsers = db.AspNetUsers.Find(id);
            db.AspNetUsers.Remove(aspNetUsers);
            db.SaveChanges();
            return RedirectToAction("Index");
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
