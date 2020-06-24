using GestionnaireUtilisateurs.Models;
using Microsoft.AspNet.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace GestionnaireUtilisateurs.Controllers
{
    public class CorbeilleController : Controller
    {
        public aurs1Entities database = new aurs1Entities();
        [Authorize(Roles = WorkflowDerogationController.Administrator)]
        public ActionResult Users()
        {
            MultiModeles multiModeles = new MultiModeles
            {
                aspNetUsers = database.AspNetUsers.Where(i => i.Supp)
            };
            return View(multiModeles);
        }

        [Authorize(Roles = WorkflowDerogationController.Administrator)]
        public ActionResult RestoreUser(string id)
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
            database.AspNetUserRoles.AddRange(userRoles); database.SaveChanges();
            Notification notification = new Notification
            {
                IdUser = user.Id,
                Type = 5,
                heure_date = DateTime.Now,
                danger = 9
            };
            database.Notification.Add(notification);
            database.SaveChanges();
            HistoriqueUserDeletion historiqueUser = new HistoriqueUserDeletion
            {
                AdminSupp = User.Identity.GetUserId(),
                date_heure = DateTime.Now,
                Suppression = false,
                UserConcernee = user.Id
            };
            database.HistoriqueUserDeletion.Add(historiqueUser);
            database.SaveChanges();
            return RedirectToAction("Users");
        }

        [Authorize(Roles = WorkflowDerogationController.Administrator)]
        public ActionResult DeleteUser(string id)
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
                statuts = database.Statuts.Where(i => i.supp)
            };
            return View(multiModeles);
        }

        [HttpPost, Authorize(Roles = WorkflowDerogationController.Administrator)]
        public ActionResult RestoreStatut(string id)
        {
            Statuts statut = database.Statuts.Find(id);
            var users = statut.AspNetUsers;
            foreach (var user in users)
            {
                var tachesfromstatut = database.StatutRole.Where(st => st.StatutId == id).ToList();
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
                HistoireStatutDeletion historiqueStatut = new HistoireStatutDeletion
                {
                    AdminSupp = User.Identity.GetUserId(),
                    date_heure = DateTime.Now,
                    Suppression = false,
                    FK_Statut = statut.StatutId
                };
                database.HistoireStatutDeletion.Add(historiqueStatut);
                database.SaveChanges();
            }
            return RedirectToAction("Statuts");
        }

        [HttpPost, Authorize(Roles = WorkflowDerogationController.Administrator)]
        public ActionResult DeleteStatut(string id)
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