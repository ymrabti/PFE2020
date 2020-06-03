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
    public class StatutRolesController : Controller
    {
        private aurs1Entities db = new aurs1Entities();

        // GET: StatutRoles
        public ActionResult Index()
        {
            var statutRole = db.StatutRole.Include(s => s.AspNetRoles).Include(s => s.Statuts);
            return View(statutRole.ToList());
        }

        // GET: StatutRoles/Details/5
        public ActionResult Details(string id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            StatutRole statutRole = db.StatutRole.Find(id);
            if (statutRole == null)
            {
                return HttpNotFound();
            }
            return View(statutRole);
        }

        // GET: StatutRoles/Create
        public ActionResult Create()
        {
            ViewBag.RoleId = new SelectList(db.AspNetRoles, "Id", "Name");
            ViewBag.StatutId = new SelectList(db.Statuts, "StatutId", "StatutName");
            return View();
        }

        // POST: StatutRoles/Create
        // Afin de déjouer les attaques par sur-validation, activez les propriétés spécifiques que vous voulez lier. Pour 
        // plus de détails, voir  https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "StatutId,RoleId,Lire,Cree,Modifier,Supprimer")] StatutRole statutRole)
        {
            if (ModelState.IsValid)
            {
                db.StatutRole.Add(statutRole);
                db.SaveChanges();
                return RedirectToAction("Index");
            }

            ViewBag.RoleId = new SelectList(db.AspNetRoles, "Id", "Name", statutRole.RoleId);
            ViewBag.StatutId = new SelectList(db.Statuts, "StatutId", "StatutName", statutRole.StatutId);
            return View(statutRole);
        }

        // GET: StatutRoles/Edit/5
        public ActionResult Edit(string id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            StatutRole statutRole = db.StatutRole.Find(id);
            if (statutRole == null)
            {
                return HttpNotFound();
            }
            ViewBag.RoleId = new SelectList(db.AspNetRoles, "Id", "Name", statutRole.RoleId);
            ViewBag.StatutId = new SelectList(db.Statuts, "StatutId", "StatutName", statutRole.StatutId);
            return View(statutRole);
        }

        // POST: StatutRoles/Edit/5
        // Afin de déjouer les attaques par sur-validation, activez les propriétés spécifiques que vous voulez lier. Pour 
        // plus de détails, voir  https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "StatutId,RoleId,Lire,Cree,Modifier,Supprimer")] StatutRole statutRole)
        {
            if (ModelState.IsValid)
            {
                db.Entry(statutRole).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            ViewBag.RoleId = new SelectList(db.AspNetRoles, "Id", "Name", statutRole.RoleId);
            ViewBag.StatutId = new SelectList(db.Statuts, "StatutId", "StatutName", statutRole.StatutId);
            return View(statutRole);
        }

        // GET: StatutRoles/Delete/5
        public ActionResult Delete(string id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            StatutRole statutRole = db.StatutRole.Find(id);
            if (statutRole == null)
            {
                return HttpNotFound();
            }
            return View(statutRole);
        }

        // POST: StatutRoles/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(string id)
        {
            StatutRole statutRole = db.StatutRole.Find(id);
            db.StatutRole.Remove(statutRole);
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
