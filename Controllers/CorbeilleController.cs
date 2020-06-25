using GestionnaireUtilisateurs.Models;
using Microsoft.AspNet.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;

namespace GestionnaireUtilisateurs.Controllers
{
    public class CorbeilleController : Controller
    {
        public aurs1Entities database = new aurs1Entities();
        public string admin()
        {
            return User.Identity.GetUserId();
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
        private void LogUserHistoryDel(string uid)
        {
            var user = database.AspNetUsers.Find(uid);
            user.lastModif = DateTime.Now;
            database.SaveChanges();
            HistoriqueUserDeletion historiqueUser = new HistoriqueUserDeletion
            {
                AdminSupp = admin(),
                date_heure = DateTime.Now,
                IdHistoire = Guid.NewGuid().ToString(),
                Suppression = false,
                UserConcernee = uid
            };
            database.HistoriqueUserDeletion.Add(historiqueUser);
            database.SaveChanges();
        }
        private void LogStatutHistoryDel(string sid)
        {
            var statut = database.Statuts.Find(sid);
            statut.lastModif = DateTime.Now;
            HistoireStatutDeletion historiqueStatut = new HistoireStatutDeletion
            {
                AdminSupp = admin(),
                date_heure = DateTime.Now,
                IdHistoire = Guid.NewGuid().ToString(),
                Suppression = false,
                FK_Statut = sid
            };
            database.HistoireStatutDeletion.Add(historiqueStatut);
            database.SaveChanges();
        }

        [Authorize(Roles = WorkflowDerogationController.Administrator)]
        public ActionResult Users()
        {
            MultiModeles multiModeles = new MultiModeles
            {
                aspNetUsers = database.AspNetUsers.Where(i => i.Supp).OrderBy(i => i.lastModif)
            };
            return View(multiModeles);
        }




        [Authorize(Roles = WorkflowDerogationController.Administrator)]
        public ActionResult RestoreUser(string id)
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
                aspNetUserRoles = user.AspNetUserRoles,
                DemDergs = database.Demande_Derogation.Where(p => p.Maitre_Oeuvrage_DemDerg == id || p.Maitre_Oeuvre_DemDerg == id).ToList()
            };
            return View(multiModeles);
        }


        [Authorize(Roles = WorkflowDerogationController.Administrator)]
        [HttpPost,ValidateAntiForgeryToken, ActionName("RestoreUser")]
        public ActionResult RestoreUserConfirm(string id)
        {
            var user = database.AspNetUsers.Find(id);
            user.Supp = false; database.SaveChanges();
            string sid = user.StatutId;
            var tachesfromstatut = database.StatutRole.Where(statut => statut.StatutId == sid).ToList();
            var userRoles = new List<AspNetUserRoles>();
            foreach (var element in tachesfromstatut)
            {
                AspNetUserRoles userRole = new AspNetUserRoles();
                userRole.UserId = id;
                userRole.RoleId = element.RoleId;
                userRole.Create = element.Cree;
                userRole.Update = element.Modifier;
                userRole.Read = element.Lire;
                userRole.Delete = element.Supprimer;
                userRoles.Add(userRole);
            }
            database.AspNetUserRoles.AddRange(userRoles);
            database.SaveChanges();
            EnvoyerLaNotification(5, 3, user.Id);
            LogUserHistoryDel(user.Id);
            return RedirectToAction("Users");
        }



        [Authorize(Roles = WorkflowDerogationController.Administrator)]
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
                aspNetUserRoles = user.AspNetUserRoles,
                DemDergs = database.Demande_Derogation.Where(p => p.Maitre_Oeuvrage_DemDerg == id || p.Maitre_Oeuvre_DemDerg == id).ToList()
            };
            return View(multiModeles);
        }

        [Authorize(Roles = WorkflowDerogationController.Administrator)]
        [HttpPost, ValidateAntiForgeryToken, ActionName("DeleteUser")]
        public ActionResult DeleteUserConfirm(string id)
        {
            var user = database.AspNetUsers.Find(id);
            if (user.AspNetUserRoles.Where(a => a.AspNetRoles.Name == WorkflowDerogationController.Administrator).Count() == 0)
            {
                var userRoles = user.AspNetUserRoles;
                database.AspNetUserRoles.RemoveRange(userRoles);
                var h1 = user.HistoriqueUserDeletion.Union(user.HistoriqueUserDeletion1);
                var notifs = user.Notification;
                database.HistoriqueUserDeletion.RemoveRange(h1);
                database.Notification.RemoveRange(notifs);
                database.AspNetUsers.Remove(user);
                database.SaveChanges();
            }

            return RedirectToAction("Users");
        }


        /**                //////////////               */



        [Authorize(Roles = WorkflowDerogationController.Administrator)]
        public ActionResult Statuts()
        {
            MultiModeles multiModeles = new MultiModeles
            {
                statuts = database.Statuts.Where(i => i.supp).OrderBy(i => i.lastModif)
            };
            return View(multiModeles);
        }


        [Authorize(Roles = WorkflowDerogationController.Administrator)]
        public ActionResult RestoreStatut(string id)
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
            var multiModeles = new MultiModeles
            {
                aspNetUsers = statut.AspNetUsers.Where(i => i.Supp),
                statutRoles = statut.StatutRole
            };
            return View(multiModeles);
        }



        [Authorize(Roles = WorkflowDerogationController.Administrator)]
        [HttpPost, ValidateAntiForgeryToken, ActionName("RestoreStatut")]
        public ActionResult RestoreStatutConfirm(string id)
        {
            Statuts statut = database.Statuts.Find(id);
            statut.supp = false;
            var users = statut.AspNetUsers;
            foreach (var user in users)
            {
                user.Supp = false;
                database.SaveChanges();
                var tachesfromstatut = statut.StatutRole;
                var userRoles = new List<AspNetUserRoles>();
                foreach (var element in tachesfromstatut)
                {
                    AspNetUserRoles userRole = new AspNetUserRoles();
                    userRole.UserId = user.Id;
                    userRole.RoleId = element.RoleId;
                    userRole.Create = element.Cree;
                    userRole.Update = element.Modifier;
                    userRole.Read = element.Lire;
                    userRole.Delete = element.Supprimer;
                    userRoles.Add(userRole);
                }
                database.AspNetUserRoles.AddRange(userRoles);
                database.SaveChanges();
                LogStatutHistoryDel(statut.StatutId);
            }
            return RedirectToAction("Statuts");
        }


        [Authorize(Roles = WorkflowDerogationController.Administrator)]
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
            var multiModeles = new MultiModeles
            {
                aspNetUsers = statut.AspNetUsers.Where(i => !i.Supp),
                statutRoles = statut.StatutRole
            };
            return View(multiModeles);
        }


        [Authorize(Roles = WorkflowDerogationController.Administrator)]
        [HttpPost, ValidateAntiForgeryToken, ActionName("DeleteStatut")]
        public ActionResult DeleteStatutConfirm(string id)
        {
            Statuts statut = database.Statuts.Find(id);
            var users = statut.AspNetUsers;

            var statutRoles = statut.StatutRole;
            database.StatutRole.RemoveRange(statutRoles);
            var histoire = statut.HistoireStatutDeletion;
            database.HistoireStatutDeletion.RemoveRange(histoire);
            database.SaveChanges();

            foreach (var user in users)
            {
                var historique = user.HistoriqueUserDeletion.Union(user.HistoriqueUserDeletion1);
                var notifs = user.Notification;
                database.HistoriqueUserDeletion.RemoveRange(historique);
                database.Notification.RemoveRange(notifs);
                database.SaveChanges();
            }
            database.AspNetUsers.RemoveRange(users);
            database.Statuts.Remove(statut);
            database.SaveChanges();
            return RedirectToAction("Statuts");
        }

        /**                //////////////               */





        [Authorize(Roles = WorkflowDerogationController.Administrator)]
        public ActionResult DemadesDerogations()
        {
            MultiModeles multiModeles = new MultiModeles
            {
                DemDergs = database.Demande_Derogation.Where(i => i.Supp)
            };
            return View(multiModeles);
        }
    }
}