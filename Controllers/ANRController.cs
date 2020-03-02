using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Net;
using System.Web;
using System.Web.Mvc;
using GestionnaireUtilisateurs.Models;

namespace GestionnaireUtilisateurs.Controllers
{
    public class ANRController : Controller
    {
        private aurs1Entities db = new aurs1Entities();

        public async Task<ActionResult> Index()
        {
            var aspNetRoles = db.AspNetRoles.Include(a => a.SousModule);
            return View(await aspNetRoles.ToListAsync());
        }

        public async Task<ActionResult> Details(string id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            AspNetRoles aspNetRoles = await db.AspNetRoles.FindAsync(id);
            if (aspNetRoles == null)
            {
                return HttpNotFound();
            }
            return View(aspNetRoles);
        }

        // GET: ANR/Create
        public ActionResult Create()
        {
            ViewBag.SouModuleId = new SelectList(db.SousModule, "SousModuleId", "SousModuleName");
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Create(//[Bind(Include = "Id,Name,SouModuleId,RoleDescription")] AspNetRoles aspNetRoles,
            string Id, string Name, int SouModuleId, string RoleDescription)
        {
                AspNetRoles aspNetRoles = new AspNetRoles();
            if (ModelState.IsValid)
            {
                aspNetRoles.Id = Id;
                aspNetRoles.Name = Name;
                aspNetRoles.SouModuleId = SouModuleId;
                aspNetRoles.RoleDescription = RoleDescription;
                db.AspNetRoles.Add(aspNetRoles);
                await db.SaveChangesAsync();
                return RedirectToAction("Index");
            }

            ViewBag.SouModuleId = new SelectList(db.SousModule, "SousModuleId", "SousModuleName", aspNetRoles.SouModuleId);
            return View(aspNetRoles);
        }

        // GET: ANR/Edit/5
        public async Task<ActionResult> Edit(string id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            AspNetRoles aspNetRoles = await db.AspNetRoles.FindAsync(id);
            if (aspNetRoles == null)
            {
                return HttpNotFound();
            }
            ViewBag.SouModuleId = new SelectList(db.SousModule, "SousModuleId", "SousModuleName", aspNetRoles.SouModuleId);
            return View(aspNetRoles);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Edit([Bind(Include = "Id,Name,SouModuleId,RoleDescription")] AspNetRoles aspNetRoles)
        {
            if (ModelState.IsValid)
            {
                db.Entry(aspNetRoles).State = EntityState.Modified;
                await db.SaveChangesAsync();
                return RedirectToAction("Index");
            }
            ViewBag.SouModuleId = new SelectList(db.SousModule, "SousModuleId", "SousModuleName", aspNetRoles.SouModuleId);
            return View(aspNetRoles);
        }

        // GET: ANR/Delete/5
        public async Task<ActionResult> Delete(string id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            AspNetRoles aspNetRoles = await db.AspNetRoles.FindAsync(id);
            if (aspNetRoles == null)
            {
                return HttpNotFound();
            }
            return View(aspNetRoles);
        }

        // POST: ANR/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> DeleteConfirmed(string id)
        {
            AspNetRoles aspNetRoles = await db.AspNetRoles.FindAsync(id);
            db.AspNetRoles.Remove(aspNetRoles);
            await db.SaveChangesAsync();
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
