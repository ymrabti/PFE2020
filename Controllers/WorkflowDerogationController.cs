using GestionnaireUtilisateurs.Models;
using Microsoft.AspNet.Identity;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace GestionnaireUtilisateurs.Controllers
{
    public enum Workflow
    {
        Renseignements = 15,
        Situation_Géographique = 16,
        GED = 17,
        Programmation = 18,
        Avis = 19,
        Echanges = 20,
        Autorisation = 21,
        Cloture = 22
    }
    public class WorkflowDerogationController : Controller
    {
        static int nombre_res_ppage = 5;
        public const string Administrator = "Administrator";

        public const string _Rensegnement = "Rensegnement";
        public const string _Programmation = "Programmation";
        public const string _Autorisation = "Autorisation";

        public const string _GED = "GED";
        public const string _Avis = "Avis";
        public const string _SitGeo = "Situation Géographique";

        public const string _Cloture = "Cloture";
        public const string _Echanges = "Echanges";

        public const string _WorkflowDerogationExeptAdmin = _Rensegnement
            + "," + _SitGeo + "," + _GED + "," + _Echanges + ","
            + _Autorisation + "," + _Cloture + "," + _Avis + "," + _Programmation;



        public const string _WorkflowDerogation = Administrator + "," + _WorkflowDerogationExeptAdmin;
        public ActionResult correctAction(int idTache, int IdDemDerog, MultiModeles multiTab)
        {
            if (IdDemDerog == 0)
            {
                return RedirectToAction("BadGateAway");
            }

            Demande_Derogation demande = database.Demande_Derogation.Find(IdDemDerog);
            if (demande == null)
            {
                return RedirectToAction("NotFound");
            }
            else
            {
                int etat = demande.FK_DemDerg_EtatAvc;
                if (idTache != etat)
                {
                    if (etat == 15)
                    {
                        return RedirectToAction("Rensegnements_Fait", "WorkflowDerogation", new { Id_DemDerg = IdDemDerog });
                    }
                    else if (etat == 16)
                    {
                        return RedirectToAction("SituationGeo", "WorkflowDerogation", new { Id_DemDerg = IdDemDerog });
                    }
                    else if (etat == 17)
                    {
                        return RedirectToAction("Ged", "WorkflowDerogation", new { FK_DemDerg_DocDerg = IdDemDerog });
                    }
                    else if (etat == 18)
                    {
                        return RedirectToAction("Programmation", "WorkflowDerogation", new { FK_DemDerg_Com = IdDemDerog });
                    }
                    else if (etat == 19)
                    {
                        return RedirectToAction("AvisOrg", "WorkflowDerogation", new { FK_DemDerg = IdDemDerog });
                    }
                    else if (etat == 20)
                    {
                        return RedirectToAction("Echanges", "WorkflowDerogation", new { FK_DemDerg = IdDemDerog });
                    }
                    else if (etat == 21)
                    {
                        return RedirectToAction("Autorisation", "WorkflowDerogation", new { FK_DemDerg = IdDemDerog });
                    }
                    else if (etat == 22)
                    {
                        return RedirectToAction("Cloture", "WorkflowDerogation", new { FK_DemDerg = IdDemDerog });
                    }
                    else { return RedirectToAction("Encours", "WorkflowDerogation", new { page = 1 }); }
                }
                else
                {
                    return View(multiTab);
                }
            }
        }

        public bool[] Actions(string RoleName)
        {
            bool[] _actions = new bool[4];
            var UserId = User.Identity.GetUserId();
            var RoleId = database.AspNetRoles.Where(role => role.Name == RoleName).FirstOrDefault().Id;
            if (User.IsInRole(Administrator))
            {
                _actions[0] = true;
                _actions[1] = true;
                _actions[2] = true;
                _actions[3] = true;
            }
            else
            {
                AspNetUserRoles Actions = database.AspNetUserRoles.Find(UserId, RoleId);
                _actions[0] = Actions.Read;
                _actions[1] = Actions.Create;
                _actions[2] = Actions.Update;
                _actions[3] = Actions.Delete;
            }
            return _actions;
        }

        public aurs1Entities database = new aurs1Entities();
        public static bool Deleted = false;

        public void checkUserDeleted()
        {
            Deleted= database.AspNetUsers.Find(User.Identity.GetUserId()).Supp;
        }

        [Authorize(Roles = Administrator + "," + _Rensegnement)]
        public ActionResult Rensegnements()
        {
            var _Actions = Actions(_Rensegnement);
            ViewBag.Read = _Actions[0];
            ViewBag.Create = _Actions[1];
            ViewBag.Update = _Actions[2];
            ViewBag.Delete = _Actions[3];
            var demDerog = database.Demande_Derogation.ToList();
            if (demDerog.Count() != 0)
            {
                ViewBag.numVers = demDerog[demDerog.Count() - 1].NumVersion_DemDerog + 1;
            }
            else
            {
                ViewBag.numVers = 1;
            }

            var multiTab = new MultiModeles
            {
                NatDemDerogs = database.Nature_Demande_Derg.OrderBy(d => d.nature_Demande_Derogation).ToList(),
                ForMaitreOeuvrages = database.Forme_MaitreOeuvrage_DemDerg.OrderBy(Z => Z.FormeMaitreOeuvrage_DemDerg).ToList(),
                NatPrjDerogs = database.Nature_Projet_DemDerg.OrderBy(u => u.last).ThenBy(u => u.Nature_Projet_DemDerg1).ToList(),
                StatutJurds = database.Statut_Juridique_DemDerg.OrderBy(u => u.last).ThenBy(i => i.StatutJuridique_DemDerg).ToList(),
                Communes = database.COMMUNES_RSK.OrderBy(U => U.COMMUNE).ToList(),
                Provs = database.PROVINCES_RSK.OrderBy(x => x.Provicne).ToList(),
                References_Foncieres = database.References_Foncieres.OrderBy(x => x.NomRF).ToList(),
                aspNetUsers = database.AspNetUsers.Where(a => !a.Supp).OrderBy(p => p.Email).ToList(),
                Derogs_Demandees = database.derogs_demandees.OrderBy(u => u.last).ThenBy(u => u.NOM).ToList()
            };
            return View(multiTab);

        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Rensegnements(Demande_Derogation DemDerg, int enregistrer
            , string StJrAut, string NatPrjAut, string derogationDemAut)
        {
            ViewBag.Message = "";
            Statut_Juridique_DemDerg _statut = new Statut_Juridique_DemDerg();
            derogs_demandees _derogs = new derogs_demandees();
            Nature_Projet_DemDerg _nature = new Nature_Projet_DemDerg();
            var _Actions = Actions(_Rensegnement);
            bool Read = _Actions[0];
            bool Create = _Actions[1];
            bool Update = _Actions[2];
            bool Delete = _Actions[3];


            if (Create)
            {
                DemDerg.Type_Terrain = DemDerg.Type_Terrain.Trim();
                DemDerg.Cloture_DemDerg = false;
                DemDerg.Couverture_DemDerg = false;
                DemDerg.FK_DemDerg_EtatAvc = 15;
                if (StJrAut != "" && DemDerg.FK_DemDerg_StatutJuridique_DemDerg == 4)
                {
                    var statutJ = database.Statut_Juridique_DemDerg.Where(u => u.StatutJuridique_DemDerg == StJrAut);
                    if (statutJ.Count() == 0)
                    {
                        Statut_Juridique_DemDerg statut_Juridique = new Statut_Juridique_DemDerg
                        {
                            StatutJuridique_DemDerg = StJrAut,
                            last = false
                        };
                        database.Statut_Juridique_DemDerg.Add(statut_Juridique);
                        database.SaveChanges();
                        _statut = database.Statut_Juridique_DemDerg.Where(i => i.StatutJuridique_DemDerg == StJrAut).FirstOrDefault();
                    }
                    else
                    { _statut = statutJ.FirstOrDefault(); }
                }
                else { _statut = database.Statut_Juridique_DemDerg.Find(DemDerg.FK_DemDerg_StatutJuridique_DemDerg); }
                if (NatPrjAut != "" && DemDerg.FK_DemDerg_Nature_Projet_DemDerg == 13)
                {
                    var NatureProjet = database.Nature_Projet_DemDerg.Where(u => u.Nature_Projet_DemDerg1 == NatPrjAut);
                    if (NatureProjet.Count() == 0)
                    {
                        Nature_Projet_DemDerg nature_Projet = new Nature_Projet_DemDerg
                        {
                            Nature_Projet_DemDerg1 = NatPrjAut,
                            last = false
                        };
                        database.Nature_Projet_DemDerg.Add(nature_Projet);
                        database.SaveChanges();
                        _nature = database.Nature_Projet_DemDerg.Where(i => i.Nature_Projet_DemDerg1 == NatPrjAut).FirstOrDefault();
                    }
                    else { _nature = NatureProjet.FirstOrDefault(); }
                }
                else { _nature = database.Nature_Projet_DemDerg.Find(DemDerg.FK_DemDerg_Nature_Projet_DemDerg); }
                if (derogationDemAut != "" && DemDerg.Dero_demande_DemDerg == 5)
                {
                    var DerogationDemandee = database.derogs_demandees.Where(u => u.NOM == derogationDemAut);
                    if (DerogationDemandee.Count() == 0)
                    {
                        derogs_demandees derogs_Demandees = new derogs_demandees
                        {
                            NOM = derogationDemAut,
                            last = false
                        };
                        database.derogs_demandees.Add(derogs_Demandees);
                        database.SaveChanges();
                        _derogs = database.derogs_demandees.Where(w => w.NOM == derogationDemAut).FirstOrDefault();
                    }
                    else { _derogs = DerogationDemandee.FirstOrDefault(); }
                }
                else { _derogs = database.derogs_demandees.Find(DemDerg.Dero_demande_DemDerg); }
                DemDerg.Statut_Juridique_DemDerg = _statut;
                DemDerg.Nature_Projet_DemDerg = _nature;
                DemDerg.derogs_demandees = _derogs;
                database.Demande_Derogation.Add(DemDerg);
                database.SaveChanges();
                if (enregistrer == 0)
                {
                    return RedirectToAction("Encours", "WorkflowDerogation", new { page = 1 });
                    //return RedirectToAction("Rensegnements_Fait", "WorkflowDerogation", new { Id_DemDerg = DemDerg.Id_DemDerg });
                }
                else
                {
                    DemDerg.FK_DemDerg_EtatAvc = 16;
                    database.SaveChanges();
                    return RedirectToAction("SituationGeo", "WorkflowDerogation", new { DemDerg.Id_DemDerg });
                    //return RedirectToAction("SituationGeo", "WorkflowDerogation", new { Id_DemDerg = DemDerg.Id_DemDerg });
                }
            }
            else
            {
                return RedirectToAction("Encours", "WorkflowDerogation", new { page = 1 });
            }

            //}
            //ViewBag.FK_DemDerg_FormeMaitreOeuvrage_DemDerg = new SelectList(db.Forme_MaitreOeuvrage_DemDerg, "Id_FormeMaitreOeuvrage_DemDerg", "FormeMaitreOeuvrage_DemDerg", DemDerg.FK_DemDerg_FormeMaitreOeuvrage_DemDerg);
            //ViewBag.FK_DemDerg_Nature_Dem = new SelectList(db.Nature_Demande_Derg, "Id_NatureDemDerog", "nature_Demande_Derogation", DemDerg.FK_DemDerg_Nature_Dem);
            //ViewBag.FK_DemDerg_Nature_Projet_DemDerg = new SelectList(db.Nature_Projet_DemDerg, "Id_Nature_Projet_DemDerg", "Nature_Projet_DemDerg1", DemDerg.FK_DemDerg_Nature_Projet_DemDerg);
            //ViewBag.FK_DemDerg_StatutJuridique_DemDerg = new SelectList(db.Statut_Juridique_DemDerg, "Id_StatutJuridique_DemDerg", "StatutJuridique_DemDerg", DemDerg.FK_DemDerg_StatutJuridique_DemDerg);
            //return View(DemDerg);
        }

        [Authorize(Roles = Administrator + "," + _Rensegnement)]
        public ActionResult Rensegnements_Fait(int Id_DemDerg)
        {
            var _Actions = Actions(_Rensegnement);
            ViewBag.Read = _Actions[0];
            ViewBag.Create = _Actions[1];
            ViewBag.Update = _Actions[2];
            ViewBag.Delete = _Actions[3];
            var demDerog = database.Demande_Derogation.ToList();
            if (demDerog.Count() != 0)
            {
                ViewBag.numVers = demDerog[demDerog.Count() - 1].NumVersion_DemDerog + 1;
            }
            else
            {
                ViewBag.numVers = 1;
            }

            var multiTab = new MultiModeles
            {
                DemDerg = database.Demande_Derogation.Find(Id_DemDerg),
                NatDemDerogs = database.Nature_Demande_Derg.OrderBy(d => d.nature_Demande_Derogation).ToList(),
                ForMaitreOeuvrages = database.Forme_MaitreOeuvrage_DemDerg.OrderBy(Z => Z.FormeMaitreOeuvrage_DemDerg).ToList(),
                NatPrjDerogs = database.Nature_Projet_DemDerg.OrderBy(u => u.last).ThenBy(u => u.Nature_Projet_DemDerg1).ToList(),
                StatutJurds = database.Statut_Juridique_DemDerg.OrderBy(u => u.last).ThenBy(i => i.StatutJuridique_DemDerg).ToList(),
                Communes = database.COMMUNES_RSK.OrderBy(U => U.COMMUNE).ToList(),
                Provs = database.PROVINCES_RSK.OrderBy(x => x.Provicne).ToList(),
                References_Foncieres = database.References_Foncieres.OrderBy(x => x.NomRF).ToList(),
                aspNetUsers = database.AspNetUsers.Where(a=>!a.Supp).OrderBy(p => p.Email).ToList(),
                Derogs_Demandees = database.derogs_demandees.OrderBy(u => u.last).ThenBy(u => u.NOM).ToList()
            };
            //return View(multiTab);
            return correctAction(15, Id_DemDerg, multiTab);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Rensegnements_Fait(Demande_Derogation DemDerg, int enregistrer
            , string StJrAut, string NatPrjAut, string derogationDemAut)
        {
            var demExist = database.Demande_Derogation.Find(DemDerg.Id_DemDerg);
            Statut_Juridique_DemDerg _statut = new Statut_Juridique_DemDerg();
            derogs_demandees _derogs = new derogs_demandees();
            Nature_Projet_DemDerg _nature = new Nature_Projet_DemDerg();
            var _Actions = Actions(_Rensegnement);
            bool Read = _Actions[0];
            bool Create = _Actions[1];
            bool Update = _Actions[2];
            bool Delete = _Actions[3];
            if (Create)
            {
                if (StJrAut != "" && DemDerg.FK_DemDerg_StatutJuridique_DemDerg == 4)
                {
                    var statutJ = database.Statut_Juridique_DemDerg.Where(u => u.StatutJuridique_DemDerg == StJrAut);
                    if (statutJ.Count() == 0)
                    {
                        Statut_Juridique_DemDerg statut_Juridique = new Statut_Juridique_DemDerg
                        {
                            StatutJuridique_DemDerg = StJrAut,
                            last = false
                        };
                        database.Statut_Juridique_DemDerg.Add(statut_Juridique);
                        database.SaveChanges();
                        _statut = database.Statut_Juridique_DemDerg.Where(i => i.StatutJuridique_DemDerg == StJrAut).FirstOrDefault();
                    }
                    else
                    { _statut = statutJ.FirstOrDefault(); }
                }
                else { _statut = database.Statut_Juridique_DemDerg.Find(DemDerg.FK_DemDerg_StatutJuridique_DemDerg); }
                if (NatPrjAut != "" && DemDerg.FK_DemDerg_Nature_Projet_DemDerg == 13)
                {
                    var NatureProjet = database.Nature_Projet_DemDerg.Where(u => u.Nature_Projet_DemDerg1 == NatPrjAut);
                    if (NatureProjet.Count() == 0)
                    {
                        Nature_Projet_DemDerg nature_Projet = new Nature_Projet_DemDerg
                        {
                            Nature_Projet_DemDerg1 = NatPrjAut,
                            last = false
                        };
                        database.Nature_Projet_DemDerg.Add(nature_Projet);
                        database.SaveChanges();
                        _nature = database.Nature_Projet_DemDerg.Where(i => i.Nature_Projet_DemDerg1 == NatPrjAut).FirstOrDefault();
                    }
                    else { _nature = NatureProjet.FirstOrDefault(); }
                }
                else { _nature = database.Nature_Projet_DemDerg.Find(DemDerg.FK_DemDerg_Nature_Projet_DemDerg); }
                if (derogationDemAut != "" && DemDerg.Dero_demande_DemDerg == 5)
                {
                    var DerogationDemandee = database.derogs_demandees.Where(u => u.NOM == derogationDemAut);
                    if (DerogationDemandee.Count() == 0)
                    {
                        derogs_demandees derogs_Demandees = new derogs_demandees
                        {
                            NOM = derogationDemAut,
                            last = false
                        };
                        database.derogs_demandees.Add(derogs_Demandees);
                        database.SaveChanges();
                        _derogs = database.derogs_demandees.Where(w => w.NOM == derogationDemAut).FirstOrDefault();
                    }
                    else { _derogs = DerogationDemandee.FirstOrDefault(); }
                }
                else { _derogs = database.derogs_demandees.Find(DemDerg.Dero_demande_DemDerg); }
            }
            else
            {
                _derogs = database.derogs_demandees.Find(DemDerg.Dero_demande_DemDerg);
                _nature = database.Nature_Projet_DemDerg.Find(DemDerg.FK_DemDerg_Nature_Projet_DemDerg);
                _statut = database.Statut_Juridique_DemDerg.Find(DemDerg.FK_DemDerg_StatutJuridique_DemDerg);
            }
            if (Read && Update)
            {
                var Trim = DemDerg.Type_Terrain.Trim();
                demExist.Type_Terrain = Trim;
                demExist.Id_Commune = DemDerg.Id_Commune;
                demExist.Intitule_DemDerg = DemDerg.Intitule_DemDerg;
                demExist.PrevisionUrbanistique_DemDerg = DemDerg.PrevisionUrbanistique_DemDerg;

                demExist.FK_DemDerg_Nature_Dem = DemDerg.FK_DemDerg_Nature_Dem;
                demExist.Superficie_Terrain_DemDerg = DemDerg.Superficie_Terrain_DemDerg;
                demExist.Maitre_Oeuvrage_DemDerg = DemDerg.Maitre_Oeuvrage_DemDerg;
                demExist.Maitre_Oeuvre_DemDerg = DemDerg.Maitre_Oeuvre_DemDerg;
                demExist.FK_DemDerg_FormeMaitreOeuvrage_DemDerg = DemDerg.FK_DemDerg_FormeMaitreOeuvrage_DemDerg;
                demExist.Montant_Investissement_DemDerg = DemDerg.Montant_Investissement_DemDerg;
                demExist.Adresse_DemDerg = DemDerg.Adresse_DemDerg;
                demExist.Emploi_generer_DemDerg = DemDerg.Emploi_generer_DemDerg;
                demExist.Duree_realisation_DemDerg = DemDerg.Duree_realisation_DemDerg;

                demExist.Contribution_Projet_DemDerg = DemDerg.Contribution_Projet_DemDerg;

                demExist.Ratio_indus_DemDerg = DemDerg.Ratio_indus_DemDerg;
                demExist.Ratio_resid_DemDerg = DemDerg.Ratio_resid_DemDerg;
                demExist.Ratio_Social_DemDerg = DemDerg.Ratio_Social_DemDerg;
                demExist.Ratio_touris_DemDerg = DemDerg.Ratio_touris_DemDerg;

                demExist.Statut_Juridique_DemDerg = _statut;
                demExist.Nature_Projet_DemDerg = _nature;
                demExist.derogs_demandees = _derogs;
                //if (_statut.StatutJuridique_DemDerg!=null)
                //{
                //}
                //if (_nature.Nature_Projet_DemDerg1!=null)
                //{
                //}
                //if (_derogs.NOM!=null)
                //{
                //}
                database.SaveChanges();
            }


            if (enregistrer == 0)
            {
                demExist.FK_DemDerg_EtatAvc = 15;
                database.SaveChanges();
                return RedirectToAction("Encours", "WorkflowDerogation", new { page = 1 });
                //return RedirectToAction("Rensegnements_Fait", "WorkflowDerogation", new { Id_DemDerg = DemDerg.Id_DemDerg });
            }
            else
            {
                demExist.FK_DemDerg_EtatAvc = 16;
                database.SaveChanges();
                return RedirectToAction("SituationGeo", "WorkflowDerogation", new { DemDerg.Id_DemDerg });
                //return RedirectToAction("SituationGeo", "WorkflowDerogation", new { Id_DemDerg = DemDerg.Id_DemDerg });
            }
        }




        [Authorize(Roles = Administrator + "," + _SitGeo)]
        public ActionResult SituationGeo(int Id_DemDerg)
        {
            var _Actions = Actions(_SitGeo);
            ViewBag.Read = _Actions[0];
            ViewBag.Create = _Actions[1];
            ViewBag.Update = _Actions[2];
            ViewBag.Delete = _Actions[3];
            var multiTab = new MultiModeles
            {
                DemDerg = database.Demande_Derogation.Find(Id_DemDerg),
                References_Foncieres = database.References_Foncieres.ToList()
            };
            return correctAction(16, Id_DemDerg, multiTab);
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult SituationGeo(int? Id_DemDerg, int enregistrer)
        {
            var demandeDerg = database.Demande_Derogation.Find(Id_DemDerg);
            if (enregistrer == 0)
            {

                demandeDerg.FK_DemDerg_EtatAvc = 16;
                database.SaveChanges();
                //return RedirectToAction("Encours", "WorkflowDerogation");
                return RedirectToAction("Encours", "WorkflowDerogation", new { page = 1 });
            }
            else
            {
                demandeDerg.FK_DemDerg_EtatAvc = 17;
                database.SaveChanges();
                //return RedirectToAction("GED", "WorkflowDerogation", new { Id_DemDerg = Id_DemDerg });
                return RedirectToAction("Ged", "WorkflowDerogation", new { FK_DemDerg_DocDerg = Id_DemDerg });
            }

        }


        [Authorize(Roles = Administrator + "," + _GED)]
        public ActionResult Ged(int FK_DemDerg_DocDerg)
        {
            var _Actions = Actions(_GED);
            ViewBag.Read = _Actions[0];
            ViewBag.Create = _Actions[1];
            ViewBag.Update = _Actions[2];
            ViewBag.Delete = _Actions[3];
            var multiTab = new MultiModeles()
            {
                DemDerg = database.Demande_Derogation.Find(FK_DemDerg_DocDerg),
                TYPE_DOCs = database.TYPE_DOC.ToList(),
                Message2View = ""
            };

            return correctAction(17, FK_DemDerg_DocDerg, multiTab);
        }


        public ActionResult DeleteDocument(int Id_Doc_Derog, int FK_DemDerg_DocDerg)
        {
            var _Actions = Actions(_GED);
            ViewBag.Read = _Actions[0];
            ViewBag.Create = _Actions[1];
            ViewBag.Update = _Actions[2];
            ViewBag.Delete = _Actions[3];
            if (ModelState.IsValid)
            {
                bool Read = _Actions[0];
                bool Delete = _Actions[3];
                if (Read && Delete)
                {
                    var document = database.Document_Derogation.Find(Id_Doc_Derog);
                    database.Document_Derogation.Remove(document);
                    database.SaveChanges();
                    return RedirectToAction("Ged", new { FK_DemDerg_DocDerg });
                }
                else
                {
                    return RedirectToAction("Ged", new { FK_DemDerg_DocDerg });
                }
            }
            return RedirectToAction("Ged", new { FK_DemDerg_DocDerg });
        }



        [HttpPost]
        public ActionResult Ged(HttpPostedFileBase[] url_Doc_Derg, int[] Intitule_Doc_Derg
            , int valider, int FK_DemDerg_DocDerg)
        {
            var _Actions = Actions(_GED);
            bool Read = _Actions[0];
            bool Create = _Actions[1];
            bool Update = _Actions[2];
            bool Delete = _Actions[3];
            ViewBag.Read = _Actions[0];
            ViewBag.Create = _Actions[1];
            ViewBag.Update = _Actions[2];
            ViewBag.Delete = _Actions[3];
            if (ModelState.IsValid)
            {
                Demande_Derogation demande = database.Demande_Derogation.Find(FK_DemDerg_DocDerg);
                if (Read && Create)
                {
                    if (url_Doc_Derg != null)
                    {
                        string pathDemande = CheckFolder(FK_DemDerg_DocDerg, 0);
                        for (int n = 0; n < url_Doc_Derg.Length; n++)
                        {
                            var file = url_Doc_Derg[n];
                            String path1 = Path.Combine(pathDemande, file.FileName /*+ Path.GetExtension(file.FileName)*/);
                            file.SaveAs(path1);
                            Document_Derogation d = new Document_Derogation();
                            d.url_Doc_Derg = path1.ToString();
                            d.Intitule_Doc_Derg = Intitule_Doc_Derg[n];
                            d.FK_DemDerg_DocDerg = FK_DemDerg_DocDerg;
                            d.FileName = file.FileName;
                            d.ContentType = file.ContentType;
                            d.ContentLenght = file.ContentLength;
                            database.Document_Derogation.Add(d);
                            database.SaveChanges();
                        }
                    }
                }
                if (valider == 1)
                {
                    if (demande.Document_Derogation.Count() == 0)
                    {
                        return RedirectToAction("Ged", new { FK_DemDerg_DocDerg });
                    }
                    else
                    {
                        demande.FK_DemDerg_EtatAvc = 18;
                        database.SaveChanges();
                        return RedirectToAction("Programmation", new { FK_DemDerg_DocDerg });
                    }
                }
                else
                {
                    return RedirectToAction("Encours");
                }

            }
            return RedirectToAction("Ged", new { FK_DemDerg_DocDerg });
        }

        bool FileExist(string filename, int FK_DemDerg_DocDerg)
        {
            var path = Server.MapPath("~/GED_DEROG/" + FK_DemDerg_DocDerg + "/");
            var files = Directory.GetFiles(path); bool exist = false;
            foreach (string filepath in files)
            {
                if (filename.Split(new string[] { "\\GED_DEROG\\" + FK_DemDerg_DocDerg + "\\" }, StringSplitOptions.None).Last() == filename)
                {
                    exist = true;
                }
            }
            return exist;
        }

        //[HttpPost]
        //public JsonResult Ged(FormCollection form, HttpPostedFileBase[] filetype)
        //{
        //    var av = form["ged"];
        //    var avv = JsonConvert.DeserializeObject<List<Document_Derogation>>(av);
        //    for (int i = 0; i < avv.Count; i++)
        //    {
        //        var con = new Document_Derogation
        //        {
        //            Code_Doc_Derg = avv[i].Code_Doc_Derg,
        //            Intitule_Doc_Derg = avv[i].Intitule_Doc_Derg,
        //            url_Doc_Derg = avv[i].url_Doc_Derg,
        //            FK_DemDerg_DocDerg = avv[i].FK_DemDerg_DocDerg
        //        };
        //        db.Document_Derogation.Add(con);

        //    }
        //    var id_derg = Int32.Parse(form["id"]);
        //    var valider = form["valider"];
        //    var demderg = db.Demande_Derogation.Find((id_derg));
        //    if (valider == "1")
        //    {
        //        demderg.FK_DemDerg_EtatAvc = 18;
        //        db.SaveChanges();
        //        return Json(Url.Action("Programmation", "WorkflowDerogation", new { FK_DemDerg_Com = id_derg }));
        //    }
        //    else
        //    {
        //        demderg.FK_DemDerg_EtatAvc = 17;
        //        db.SaveChanges();
        //        return Json(Url.Action("Encours", "WorkflowDerogation", new { page = 1 }));
        //    }
        //}

        [Authorize(Roles = Administrator + "," + _Programmation)]
        public ActionResult Programmation(int? FK_DemDerg_Com)
        {
            var _Actions = Actions(_Programmation);
            ViewBag.Read = _Actions[0];
            ViewBag.Create = _Actions[1];
            ViewBag.Update = _Actions[2];
            ViewBag.Delete = _Actions[3];
            ViewBag.idDerog = FK_DemDerg_Com;
            List<Commission> ComssList = database.Commission.ToList();
            if (ComssList.Count() != 0)
            {
                ViewBag.codeCom = ComssList[ComssList.Count() - 1].Code_Commission + 1;
            }
            else
            {
                ViewBag.codeCom = 1;
            }
            var multiTab = new MultiModeles
            {
                Comss = database.Commission.Where(v => v.Date_Commission > DateTime.Today).OrderBy(var => var.Date_Commission).ToList(),
                DemDerg = database.Demande_Derogation.Find(FK_DemDerg_Com)
            };
            return correctAction(18, FK_DemDerg_Com.Value, multiTab);
        }


        [HttpPost]
        public ActionResult Programmation(int FK_DemDerg_Com, int enregistrer)
        {
            var _Actions = Actions(_Programmation);
            bool Read = _Actions[0];
            bool Create = _Actions[1];
            bool Update = _Actions[2];
            bool Delete = _Actions[3];
            ViewBag.Read = _Actions[0];
            ViewBag.Create = _Actions[1];
            ViewBag.Update = _Actions[2];
            ViewBag.Delete = _Actions[3];
            var demandeDerg = database.Demande_Derogation.Find(FK_DemDerg_Com);

            if (enregistrer == 0)
            {
                demandeDerg.FK_DemDerg_EtatAvc = 18;
                database.SaveChanges();
                return RedirectToAction("Encours", "WorkflowDerogation", new { page = 1 });
            }
            else
            {
                if (Read && demandeDerg.Commission != null)
                {
                    demandeDerg.FK_DemDerg_EtatAvc = 19;
                    database.SaveChanges();
                    return RedirectToAction("AvisOrg", "WorkflowDerogation", new { FK_DemDerg = FK_DemDerg_Com });
                }
                else { return RedirectToAction("Programmation", "WorkflowDerogation", new { page = 1 }); }
            }
        }


        [Authorize(Roles = Administrator + "," + _Programmation)]
        public ActionResult CreateCommission(Commission commission, int FK_DemDerg_Com)
        {
            var _Actions = Actions(_Programmation);
            bool Read = _Actions[0];
            bool Create = _Actions[1];
            bool Update = _Actions[2];
            bool Delete = _Actions[3];
            ViewBag.Read = _Actions[0];
            ViewBag.Create = _Actions[1];
            ViewBag.Update = _Actions[2];
            ViewBag.Delete = _Actions[3];
            if (Read && Create)
            {
                if (commission.Date_Commission < DateTime.Now)
                {
                    commission.Date_Commission = DateTime.Now;
                }
                database.Commission.Add(commission);
                database.SaveChanges();
                if (Update)
                {
                    Demande_Derogation demande = database.Demande_Derogation.Find(FK_DemDerg_Com);
                    demande.Commission = commission;
                    database.Entry(demande).State = EntityState.Modified;
                    database.SaveChanges();
                }

            }

            return RedirectToAction("Programmation", "WorkflowDerogation", new { FK_DemDerg_Com });
        }

        [Authorize(Roles = Administrator + "," + _Programmation)]
        public ActionResult Programmation_Affectation(int FK_DemDerg_Com, int Id_Commission)
        {
            var _Actions = Actions(_Programmation);
            bool Read = _Actions[0];
            bool Create = _Actions[1];
            bool Update = _Actions[2];
            bool Delete = _Actions[3];
            ViewBag.Read = _Actions[0];
            ViewBag.Create = _Actions[1];
            ViewBag.Update = _Actions[2];
            ViewBag.Delete = _Actions[3];
            if (Read && Update)
            {
                Demande_Derogation demande = database.Demande_Derogation.Find(FK_DemDerg_Com);
                demande.Fk_Commission = Id_Commission;
                database.Entry(demande).State = EntityState.Modified;
                database.SaveChanges();
            }

            return RedirectToAction("Programmation", "WorkflowDerogation", new { FK_DemDerg_Com });
        }

        private string CheckFolder(int Id_DemDerg, int typeDoc)//0 ged,1 pv,2 courrier
        {
            String path = Server.MapPath("~/GED_DEROG/");
            String pathDemande = "";
            switch (typeDoc)
            {
                case 0:
                    pathDemande = Server.MapPath("~/GED_DEROG/" + Id_DemDerg + "/");
                    break;
                case 1:
                    pathDemande = Server.MapPath("~/GED_DEROG/" + Id_DemDerg + "/PV_COMMISSION/");
                    break;
                case 2:
                    pathDemande = Server.MapPath("~/GED_DEROG/" + Id_DemDerg + "/COURRIER/");
                    break;
                default:
                    pathDemande = Server.MapPath("~/GED_DEROG/" + Id_DemDerg + "/COURRIER/");
                    break;
            }

            var x = Directory.Exists(path);
            if (!x)
            {
                Directory.CreateDirectory(path);
                var y = Directory.Exists(pathDemande);
                if (!y)
                {
                    Directory.CreateDirectory(pathDemande);
                }
            }
            else
            {
                var y = Directory.Exists(pathDemande);
                if (!y)
                {
                    Directory.CreateDirectory(pathDemande);
                }
            }
            return pathDemande;
        }


        [Authorize(Roles = Administrator + "," + _Avis)]
        public ActionResult AvisOrg(int FK_DemDerg)
        {
            var _Actions = Actions(_Avis);
            bool Read = _Actions[0];
            bool Create = _Actions[1];
            bool Update = _Actions[2];
            bool Delete = _Actions[3];
            ViewBag.Read = _Actions[0];
            ViewBag.Create = _Actions[1];
            ViewBag.Update = _Actions[2];
            ViewBag.Delete = _Actions[3];
            var multiTab = new MultiModeles
            {
                //DocDerg = db.Document_Derogation.Where(p => p.FK_DemDerg_DocDerg == FK_DemDerg).Where(s => s.Intitule_Doc_Derg.Equals("PV de la commission")).Single(),
                TypAviss = database.Type_Avis.ToList(),
                Orgs = database.Organisme.Where(p => p.Id_Organisme > 6).ToList(),
                AvisOrgs = database.Avis_Org.Where(p => p.FK_DemDerg == FK_DemDerg)
                .ToList(),
                DemDerg = database.Demande_Derogation.Find(FK_DemDerg)
            };
            return correctAction(19, FK_DemDerg, multiTab);
        }
        [Authorize(Roles = Administrator + "," + _Avis), HttpPost]
        public ActionResult AvisOrg(int[] FK_Organisme, int[] FK_TypAvis,
                    string[] Detail_Avis, int FK_DemDerg, string Avis_Remarque_DemDerg,
                    HttpPostedFileBase url_Doc_Derg, int valider, Avis_Org[] avis_Orgs)
        {
            var _Actions = Actions(_Avis);
            bool Read = _Actions[0];
            bool Create = _Actions[1];
            bool Update = _Actions[2];
            bool Delete = _Actions[3];
            ViewBag.Read = _Actions[0];
            ViewBag.Create = _Actions[1];
            ViewBag.Update = _Actions[2];
            ViewBag.Delete = _Actions[3];
            var demdeg = database.Demande_Derogation.Find(FK_DemDerg);
            if (Read && Update)
            {
                for (int i = 0; i < FK_Organisme.Count(); i++)
                {
                    var fk_org = FK_Organisme[i];
                    Avis_Org avis_ = database.Avis_Org
                        .Where(ink => ink.FK_DemDerg == FK_DemDerg && ink.FK_Organisme == fk_org)
                        .FirstOrDefault();
                    if (avis_ == null)
                    {
                        var con = new Avis_Org();
                        con.FK_DemDerg = FK_DemDerg;
                        con.FK_Organisme = FK_Organisme[i];
                        con.FK_TypAvis = FK_TypAvis[i];
                        con.Detail_Avis = Detail_Avis[i];

                        database.Avis_Org.Add(con);
                    }
                    else
                    {//avv[i].FK_DemDerg, avv[i].FK_Organisme
                        Avis_Org avis = database.Avis_Org
                            .Where(s => s.FK_DemDerg == FK_DemDerg && s.FK_Organisme == fk_org).FirstOrDefault();
                        avis.FK_TypAvis = FK_TypAvis[i]; avis.Detail_Avis = Detail_Avis[i];
                        var res = database.Entry(avis).State = EntityState.Modified;
                    }

                }
                demdeg.Avis_Remarque_DemDerg = Avis_Remarque_DemDerg;
                var docCommission = demdeg.Document_Derogation.Where(o => o.Intitule_Doc_Derg == 201);
                var pvExist = docCommission.Count() != 0; var pvDoesNotExist = !pvExist;
                string pathDemande = CheckFolder(FK_DemDerg, 1);
                //bool notexistFile = !FileExist(url_Doc_Derg.FileName, FK_DemDerg);
                if (url_Doc_Derg != null)
                {
                    string path1 = Path.Combine(pathDemande, url_Doc_Derg.FileName);
                    url_Doc_Derg.SaveAs(path1);
                    Document_Derogation d = new Document_Derogation();
                    d.url_Doc_Derg = path1.ToString();
                    d.Intitule_Doc_Derg = 201;
                    d.FK_DemDerg_DocDerg = FK_DemDerg;
                    d.FileName = url_Doc_Derg.FileName;
                    d.ContentType = url_Doc_Derg.ContentType;
                    d.ContentLenght = url_Doc_Derg.ContentLength;
                    database.Document_Derogation.Add(d);
                    database.SaveChanges();
                }



                if (valider == 1)
                {
                    demdeg.FK_DemDerg_EtatAvc = 20;
                    database.SaveChanges();
                    //return Json(Url.Action("Echanges", "WorkflowDerogation"));
                    return RedirectToAction("Echanges", "WorkflowDerogation", new { FK_DemDerg });
                }
                else
                {
                    demdeg.FK_DemDerg_EtatAvc = 19;
                    database.SaveChanges();
                    return RedirectToAction("Encours", "WorkflowDerogation", new { page = 1 });
                    //return Json(Url.Action("AvisOrg", "WorkflowDerogation", new { FK_DemDerg = id }));
                }
            }
            else
            {
                if (demdeg.Avis_Org.Where(i => i.FK_Organisme < 6).Count() == 0)
                {
                    return RedirectToAction("Encours", "WorkflowDerogation", new { page = 1 });
                }
                else
                {
                    if (valider == 1)
                    {
                        demdeg.FK_DemDerg_EtatAvc = 20;
                        database.SaveChanges();
                        //return Json(Url.Action("Echanges", "WorkflowDerogation"));
                        return RedirectToAction("Echanges", "WorkflowDerogation", new { FK_DemDerg });
                    }
                    else
                    {
                        demdeg.FK_DemDerg_EtatAvc = 19;
                        database.SaveChanges();
                        return RedirectToAction("Encours", "WorkflowDerogation", new { page = 1 });
                        //return Json(Url.Action("AvisOrg", "WorkflowDerogation", new { FK_DemDerg = id }));
                    }
                }
            }
        }
        [Authorize(Roles = Administrator + "," + _Avis)]
        public ActionResult DeleteAvis(int Id_Avis, int FK_DemDerg)
        {
            var _Actions = Actions(_Avis);
            bool Read = _Actions[0];
            bool Create = _Actions[1];
            bool Update = _Actions[2];
            bool Delete = _Actions[3];
            ViewBag.Read = _Actions[0];
            ViewBag.Create = _Actions[1];
            ViewBag.Update = _Actions[2];
            ViewBag.Delete = _Actions[3];
            if (Read && Delete)
            {
                Avis_Org avis = database.Avis_Org.Find(Id_Avis);
                database.Avis_Org.Remove(avis);
                database.SaveChanges();
            }
            return RedirectToAction("AvisOrg", "WorkflowDerogation", new { FK_DemDerg });
        }


        [Authorize(Roles = Administrator + "," + _Echanges)]
        public ActionResult Echanges(int FK_DemDerg)
        {
            var _Actions = Actions(_Echanges);
            bool Read = _Actions[0];
            bool Create = _Actions[1];
            bool Update = _Actions[2];
            bool Delete = _Actions[3];
            ViewBag.Read = _Actions[0];
            ViewBag.Create = _Actions[1];
            ViewBag.Update = _Actions[2];
            ViewBag.Delete = _Actions[3];
            var multiTab = new MultiModeles
            {
                NatCours = database.Nature_Courrier.ToList(),
                DemDerg = database.Demande_Derogation.Find(FK_DemDerg),
            };
            return correctAction(20, FK_DemDerg, multiTab);
        }




        [HttpPost, Authorize(Roles = Administrator + "," + _Echanges)]
        public ActionResult Echanges(int[] FK_Nature_Courrier, DateTime[] Date_Courier, int FK_DemDerg
            , string[] Source_Courrier, string[] Destination_Courrier, HttpPostedFileBase[] file, int valider)
        {
            var _Actions = Actions(_Echanges);
            bool Read = _Actions[0];
            bool Create = _Actions[1];
            bool Update = _Actions[2];
            bool Delete = _Actions[3];
            var demdeg = database.Demande_Derogation.Find(FK_DemDerg);
            if (Read && Update)
            {
                if (file != null)
                {
                    List<Courrier> courriers = new List<Courrier>();
                    string pathDemande = CheckFolder(FK_DemDerg, 2);
                    var longeur = FK_Nature_Courrier.Length;
                    var count = FK_Nature_Courrier.Count();
                    for (int n = 0; n < longeur; n++)
                    {
                        HttpPostedFileBase filen = file[n];
                        String path1 = Path.Combine(pathDemande, filen.FileName /*+ Path.GetExtension(file.FileName)*/);
                        filen.SaveAs(path1);
                        Courrier courrier = new Courrier();
                        DateTime dateChecked = new DateTime();
                        if (Date_Courier[n] < DateTime.Now)
                        { dateChecked = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day + 1, 08, 00, 00); }
                        else { dateChecked = Date_Courier[n]; }
                        courrier.FK_Nature_Courrier = FK_Nature_Courrier[n];
                        courrier.Date_Courier = dateChecked;
                        courrier.FK_DemDerg_Cour = FK_DemDerg;
                        courrier.Source_Courrier = Source_Courrier[n];
                        courrier.Destination_Courrier = Destination_Courrier[n];
                        courrier.url_Courrier = path1.ToString();
                        //courriers.Add(courrier);
                        database.Courrier.Add(courrier);
                        database.SaveChanges();
                    }
                    //database.Courrier.AddRange(courriers);
                }
            }
            if (valider == 1)
            {
                if (demdeg.Courrier.Count() == 0)
                {
                    return RedirectToAction("Echanges", "WorkflowDerogation", new { FK_DemDerg });
                }
                else
                {
                    demdeg.FK_DemDerg_EtatAvc = 21;
                    database.SaveChanges();
                    return RedirectToAction("Autorisation", "WorkflowDerogation", new { FK_DemDerg });
                }
            }
            else
            {
                demdeg.FK_DemDerg_EtatAvc = 20;
                database.SaveChanges();
                return RedirectToAction("Encours", "WorkflowDerogation", new { page = 1 });
            }
        }

        [Authorize, Authorize(Roles = Administrator + "," + _Echanges)]
        public ActionResult DeleteCourrier(int id_Courrier, int FK_DemDerg)
        {
            var _Actions = Actions(_Echanges);
            bool Read = _Actions[0];
            bool Create = _Actions[1];
            bool Update = _Actions[2];
            bool Delete = _Actions[3];
            if (Read && Delete)
            {
                var courrier = database.Courrier.Find(id_Courrier);
                database.Courrier.Remove(courrier);
                database.SaveChanges();
            }

            return RedirectToAction("Echanges", "WorkflowDerogation", new { FK_DemDerg });
        }





        [Authorize(Roles = Administrator + "," + _Autorisation)]
        public ActionResult Autorisation(int FK_DemDerg)
        {
            var _Actions = Actions(_Autorisation);
            bool Read = _Actions[0];
            bool Create = _Actions[1];
            bool Update = _Actions[2];
            bool Delete = _Actions[3];
            ViewBag.Read = _Actions[0];
            ViewBag.Create = _Actions[1];
            ViewBag.Update = _Actions[2];
            ViewBag.Delete = _Actions[3];
            var multiTab = new MultiModeles
            {
                DemDerg = database.Demande_Derogation.Find(FK_DemDerg),
            };
            return correctAction(21, FK_DemDerg, multiTab);
        }
        [HttpPost]
        public ActionResult Autorisation(int Id_Aut, Autorisation_Derogation AutDerog, int valider, int Fk_DEMDEROG)
        {
            var _Actions = Actions(_Autorisation);
            bool Read = _Actions[0];
            bool Create = _Actions[1];
            bool Update = _Actions[2];
            bool Delete = _Actions[3];

            var demdeg = database.Demande_Derogation.Find(Fk_DEMDEROG);

            if (demdeg.Autorisation_Derogation == null)
            {
                if (Read && Create)
                {
                    database.Autorisation_Derogation.Add(AutDerog);
                    demdeg.Autorisation_Derogation = AutDerog;
                }
            }
            else
            {
                if (Read && Update)
                {
                    Autorisation_Derogation autorisation_Derogation = database.Autorisation_Derogation.Find(Id_Aut);
                    autorisation_Derogation.Dae_Avis_Autorisation = AutDerog.Dae_Avis_Autorisation;
                    autorisation_Derogation.Date_Aut_Autorisation = AutDerog.Date_Aut_Autorisation;
                    autorisation_Derogation.Date_Comt_Autorisation = AutDerog.Date_Comt_Autorisation;
                    autorisation_Derogation.Date_Demande_Autorisation = AutDerog.Date_Demande_Autorisation;
                    autorisation_Derogation.EtatAvancemt_Autorisation = AutDerog.EtatAvancemt_Autorisation;
                    autorisation_Derogation.Nature_Autorisation = AutDerog.Nature_Autorisation;
                    database.Entry(autorisation_Derogation).State = EntityState.Modified;
                }

            }

            if (valider == 0)
            {
                demdeg.FK_DemDerg_EtatAvc = 21;
                database.SaveChanges();
                return RedirectToAction("Encours", "WorkflowDerogation", new { page = 1 });
            }
            else
            {
                if (demdeg.Autorisation_Derogation != null)
                {
                    demdeg.FK_DemDerg_EtatAvc = 22;
                    database.SaveChanges();
                    return RedirectToAction("Cloture", "WorkflowDerogation", new { FK_DemDerg = Fk_DEMDEROG });
                }
                else
                {
                    return RedirectToAction("Autorisation", "WorkflowDerogation", new { FK_DemDerg = Fk_DEMDEROG });
                }
            }
        }



        [Authorize(Roles = Administrator + "," + _Cloture)]
        public ActionResult Cloture(int FK_DemDerg)
        {
            var _Actions = Actions(_Cloture);
            bool Read = _Actions[0];
            bool Create = _Actions[1];
            bool Update = _Actions[2];
            bool Delete = _Actions[3];
            ViewBag.Read = _Actions[0];
            ViewBag.Create = _Actions[1];
            ViewBag.Update = _Actions[2];
            ViewBag.Delete = _Actions[3];
            var multiTab = new MultiModeles
            {
                //AutDerog = db.Autorisation_Derogation.Where(p => p.FK_DemDerg_AutDerg == FK_DemDerg).Single(),
                DemDerg = database.Demande_Derogation.Find(FK_DemDerg)
            };
            return correctAction(22, FK_DemDerg, multiTab);
        }
        [HttpPost]
        public ActionResult Cloture(int? FK_DemDerg_AutDerg)
        {
            var _Actions = Actions(_Cloture);
            bool Read = _Actions[0];
            bool Create = _Actions[1];
            bool Update = _Actions[2];
            bool Delete = _Actions[3];
            if (Read && Update)
            {
                var demdeg = database.Demande_Derogation.Find(FK_DemDerg_AutDerg);
                demdeg.Cloture_DemDerg = true;
                database.SaveChanges();
            }
            return RedirectToAction("Encours", "WorkflowDerogation", new { page = 1 });

        }

        public ActionResult NotFound()
        {
            return View();
        }
        public ActionResult BadGateAway()
        {
            return View();
        }





        [Authorize(Roles = _WorkflowDerogation)]
        public ActionResult Encours(short? page, bool? finalisees)
        {
            if (page == null) { page = 1; }
            if (!finalisees.HasValue)
            {
                finalisees = false;
            }
            var demandes = database.Demande_Derogation.Where(k => !k.Supp).Where(f => f.Cloture_DemDerg == finalisees);

            int totale_resultats = demandes.Count();

            int nombre_de_pages = totale_resultats / nombre_res_ppage + 1;

            ViewBag.page = page; ViewBag.nombre_de_pages = nombre_de_pages;
            ViewBag.finalisees = finalisees;

            if (page < 1)
            {
                return RedirectToAction("Encours", new { page = 1 });
            }
            else if (page > nombre_de_pages)
            {
                return RedirectToAction("Encours", new { page = nombre_de_pages });
            }
            else
            {
                var model = new MultiModeles
                {
                    DemDergs = demandes
                    .OrderByDescending(p => p.Id_DemDerg)
                    .Skip((page.Value - 1) * nombre_res_ppage)
                    .Take(nombre_res_ppage)
                    .ToList()
                };
                return View(model);
            }
        }


        [HttpPost]
        public ActionResult Encours(int Id_DemDerg)
        {
            Demande_Derogation demande = database.Demande_Derogation.Find(Id_DemDerg);
            if (demande == null)
            {
                return RedirectToAction("NotFound");
            }
            else
            {
                var model = new MultiModeles
                {
                    DemDerg = demande,
                };
                if (model.DemDerg.FK_DemDerg_EtatAvc == 15)
                {
                    return RedirectToAction("Rensegnements_Fait", "WorkflowDerogation", new { Id_DemDerg });
                }
                else if (model.DemDerg.FK_DemDerg_EtatAvc == 16)
                {
                    return RedirectToAction("SituationGeo", "WorkflowDerogation", new { Id_DemDerg });
                }
                else if (model.DemDerg.FK_DemDerg_EtatAvc == 17)
                {
                    return RedirectToAction("Ged", "WorkflowDerogation", new { FK_DemDerg_DocDerg = Id_DemDerg });
                }
                else if (model.DemDerg.FK_DemDerg_EtatAvc == 18)
                {
                    return RedirectToAction("Programmation", "WorkflowDerogation", new { FK_DemDerg_Com = Id_DemDerg });
                }
                else if (model.DemDerg.FK_DemDerg_EtatAvc == 19)
                {
                    return RedirectToAction("AvisOrg", "WorkflowDerogation", new { FK_DemDerg = Id_DemDerg });
                }
                else if (model.DemDerg.FK_DemDerg_EtatAvc == 20)
                {
                    return RedirectToAction("Echanges", "WorkflowDerogation", new { FK_DemDerg = Id_DemDerg });
                }
                else if (model.DemDerg.FK_DemDerg_EtatAvc == 21)
                {
                    return RedirectToAction("Autorisation", "WorkflowDerogation", new { FK_DemDerg = Id_DemDerg });
                }
                else if (model.DemDerg.FK_DemDerg_EtatAvc == 22)
                {
                    return RedirectToAction("Cloture", "WorkflowDerogation", new { FK_DemDerg = Id_DemDerg });
                }
                return View(model);
            }
        }

        [Authorize(Roles = _WorkflowDerogationExeptAdmin)]
        public ActionResult EncoursParProfils()
        {
            List<int> etas_user = new List<int>();
            var demandes = database.Demande_Derogation.Where(k => !k.Supp).Where(i => !i.Cloture_DemDerg);
            IEnumerable<Demande_Derogation> d15 = demandes.Where(i => i.FK_DemDerg_EtatAvc == 1);
            IEnumerable<Demande_Derogation> d16 = demandes.Where(i => i.FK_DemDerg_EtatAvc == 1);
            IEnumerable<Demande_Derogation> d17 = demandes.Where(i => i.FK_DemDerg_EtatAvc == 1);
            IEnumerable<Demande_Derogation> d18 = demandes.Where(i => i.FK_DemDerg_EtatAvc == 1);
            IEnumerable<Demande_Derogation> d19 = demandes.Where(i => i.FK_DemDerg_EtatAvc == 1);
            IEnumerable<Demande_Derogation> d20 = demandes.Where(i => i.FK_DemDerg_EtatAvc == 1);
            IEnumerable<Demande_Derogation> d21 = demandes.Where(i => i.FK_DemDerg_EtatAvc == 1);
            IEnumerable<Demande_Derogation> d22 = demandes.Where(i => i.FK_DemDerg_EtatAvc == 1);
            if (User.IsInRole(_Rensegnement)) { d15 = demandes.Where(i => i.FK_DemDerg_EtatAvc == 15); }
            if (User.IsInRole(_SitGeo)) { d16 = demandes.Where(i => i.FK_DemDerg_EtatAvc == 16); ; }
            if (User.IsInRole(_GED)) { d17 = demandes.Where(i => i.FK_DemDerg_EtatAvc == 17); }
            if (User.IsInRole(_Programmation)) { d18 = demandes.Where(i => i.FK_DemDerg_EtatAvc == 18); ; }
            if (User.IsInRole(_Avis)) { d19 = demandes.Where(i => i.FK_DemDerg_EtatAvc == 19); ; }
            if (User.IsInRole(_Echanges)) { d20 = demandes.Where(i => i.FK_DemDerg_EtatAvc == 20); ; }
            if (User.IsInRole(_Autorisation)) { d21 = demandes.Where(i => i.FK_DemDerg_EtatAvc == 21); ; }
            if (User.IsInRole(_Cloture)) { d22 = demandes.Where(i => i.FK_DemDerg_EtatAvc == 22); ; }
            var d = d15.Union(d16).Union(d17).Union(d18).Union(d19).Union(d20).Union(d21).Union(d22);
            var model = new MultiModeles
            {
                DemDergs = d.ToList()
            };

            return View(model);
        }






        [Authorize(Roles = _WorkflowDerogation)]
        public ActionResult WorkflowG(int idDemDerog)
        {
            MultiModeles multiModeles = new MultiModeles
            {
                DemDerg = database.Demande_Derogation.Find(idDemDerog)
            };
            return View(multiModeles);
        }

    }




}