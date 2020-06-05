using GestionnaireUtilisateurs.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;

namespace AURS_Derogation.Controllers
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
        public ActionResult correctAction(int idTache, int IdDemDerog, MultiModeles multiTab)
        {
            if (IdDemDerog == 0)
            {
                return RedirectToAction("BadGateAway");
            }

            Demande_Derogation demande = db.Demande_Derogation.Find(IdDemDerog);
            if (demande == null)
            {
                return RedirectToAction("NotFound");
            }
            else
            {
                int etat = demande.FK_DemDerg_EtatAvc.Value;
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
                    else { return RedirectToAction("Encours", "WorkflowDerogation",new { page=1}); }
                }
                else
                {
                    return View(multiTab);
                }
            }
        }
        public aurs1Entities db = new aurs1Entities();
        public ActionResult Rensegnements()
        {
            var demDerog = db.Demande_Derogation.ToList();
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
                NatDemDerogs = db.Nature_Demande_Derg.ToList(),
                ForMaitreOeuvrages = db.Forme_MaitreOeuvrage_DemDerg.ToList(),
                NatPrjDerogs = db.Nature_Projet_DemDerg.ToList(),
                StatutJurds = db.Statut_Juridique_DemDerg.ToList(),
                Communes = db.COMMUNES_RSK.ToList(),
                Provs = db.PROVINCES_RSK.ToList(),
                References_Foncieres = db.References_Foncieres.ToList()

            };
            return View(multiTab);

        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Rensegnements(Demande_Derogation DemDerg, int enregistrer, string CommuneArrondissement)
        {
            ViewBag.Message = "";
            if (DemDerg.Type_Terrain == null)
            {
                ViewBag.Message = "Reference Fonciere est Obligatoire!!";
                return RedirectToAction("Rensegnements", "WorkflowDerogation");
            }
            else
            {
                var commune = db.COMMUNES_RSK.Where(P => P.code_commu == CommuneArrondissement).FirstOrDefault();
                if (commune != null)
                {
                    DemDerg.COMMUNES_RSK = commune;
                }
                DemDerg.Type_Terrain = DemDerg.Type_Terrain.Trim();
                if (enregistrer == 0)
                {
                    DemDerg.FK_DemDerg_EtatAvc = 15;
                    db.Demande_Derogation.Add(DemDerg);
                    db.SaveChanges();
                    return RedirectToAction("Encours", "WorkflowDerogation", new { page = 1 });
                    //return RedirectToAction("Rensegnements_Fait", "WorkflowDerogation", new { Id_DemDerg = DemDerg.Id_DemDerg });
                }
                else
                {
                    DemDerg.FK_DemDerg_EtatAvc = 16;
                    db.Demande_Derogation.Add(DemDerg);
                    db.SaveChanges();
                    return RedirectToAction("SituationGeo", "WorkflowDerogation", new { DemDerg.Id_DemDerg });
                    //return RedirectToAction("SituationGeo", "WorkflowDerogation", new { Id_DemDerg = DemDerg.Id_DemDerg });
                }
            }


            //}
            //ViewBag.FK_DemDerg_FormeMaitreOeuvrage_DemDerg = new SelectList(db.Forme_MaitreOeuvrage_DemDerg, "Id_FormeMaitreOeuvrage_DemDerg", "FormeMaitreOeuvrage_DemDerg", DemDerg.FK_DemDerg_FormeMaitreOeuvrage_DemDerg);
            //ViewBag.FK_DemDerg_Nature_Dem = new SelectList(db.Nature_Demande_Derg, "Id_NatureDemDerog", "nature_Demande_Derogation", DemDerg.FK_DemDerg_Nature_Dem);
            //ViewBag.FK_DemDerg_Nature_Projet_DemDerg = new SelectList(db.Nature_Projet_DemDerg, "Id_Nature_Projet_DemDerg", "Nature_Projet_DemDerg1", DemDerg.FK_DemDerg_Nature_Projet_DemDerg);
            //ViewBag.FK_DemDerg_StatutJuridique_DemDerg = new SelectList(db.Statut_Juridique_DemDerg, "Id_StatutJuridique_DemDerg", "StatutJuridique_DemDerg", DemDerg.FK_DemDerg_StatutJuridique_DemDerg);
            //return View(DemDerg);
        }


        public ActionResult SituationGeo(int Id_DemDerg)
        {
            var multiTab = new MultiModeles
            {
                DemDerg = db.Demande_Derogation.Find(Id_DemDerg)
            };
            return correctAction(16, Id_DemDerg, multiTab);
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult SituationGeo(int? Id_DemDerg, int enregistrer)
        {
            var demandeDerg = db.Demande_Derogation.Find(Id_DemDerg);
            if (enregistrer == 0)
            {

                demandeDerg.FK_DemDerg_EtatAvc = 16;
                db.SaveChanges();
                //return RedirectToAction("Encours", "WorkflowDerogation");
                return RedirectToAction("Encours", "WorkflowDerogation", new { page = 1 });
            }
            else
            {
                demandeDerg.FK_DemDerg_EtatAvc = 17;
                db.SaveChanges();
                //return RedirectToAction("GED", "WorkflowDerogation", new { Id_DemDerg = Id_DemDerg });
                return RedirectToAction("Ged", "WorkflowDerogation", new { FK_DemDerg_DocDerg = Id_DemDerg });
            }

        }


        public ActionResult Ged(int FK_DemDerg_DocDerg)
        {

            var multiTab = new MultiModeles()
            {
                DemDerg = db.Demande_Derogation.Find(FK_DemDerg_DocDerg)

            };

            return correctAction(17, FK_DemDerg_DocDerg, multiTab);
        }

        [HttpPost]
        public JsonResult Ged(FormCollection form, HttpPostedFileBase[] url_Doc_Derg)
        {
            var av = form["ged"];
            var avv = JsonConvert.DeserializeObject<List<Document_Derogation>>(av);
            for (int i = 0; i < avv.Count; i++)
            {
                var con = new Document_Derogation
                {
                    Code_Doc_Derg = avv[i].Code_Doc_Derg,
                    Intitule_Doc_Derg = avv[i].Intitule_Doc_Derg,
                    url_Doc_Derg = avv[i].url_Doc_Derg,
                    FK_DemDerg_DocDerg = avv[i].FK_DemDerg_DocDerg
                };
                db.Document_Derogation.Add(con);

            }
            var id_derg = Int32.Parse(form["id"]);
            var valider = form["valider"];
            var demderg = db.Demande_Derogation.Find((id_derg));
            if (valider == "1")
            {
                demderg.FK_DemDerg_EtatAvc = 18;
                db.SaveChanges();
                return Json(Url.Action("Programmation", "WorkflowDerogation", new { FK_DemDerg_Com = id_derg }));
            }
            else
            {
                demderg.FK_DemDerg_EtatAvc = 17;
                db.SaveChanges();
                return Json(Url.Action("Encours", "WorkflowDerogation", new { page = 1 }));
            }
        }



        public ActionResult Programmation(int? FK_DemDerg_Com)
        {
            ViewBag.idDerog = FK_DemDerg_Com;
            List<Commission> ComssList = db.Commission.ToList();
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
                Comss = db.Commission.Where(v => v.Date_Commission > DateTime.Today).OrderBy(var => var.Date_Commission).ToList(),
                DemDerg = db.Demande_Derogation.Find(FK_DemDerg_Com)
            };
            if (db.Affect_Derg_Comms.Where(p => p.FK_DemDerg_Aff_Com == FK_DemDerg_Com).ToList().Count() == 0)
            {
                multiTab.AffectDergComs = null;
                multiTab.ViewLestAffectCom = null;
            }
            else
            {
                multiTab.AffectDergComs = db.Affect_Derg_Comms.Where(p => p.FK_DemDerg_Aff_Com == FK_DemDerg_Com).ToList();
                multiTab.ViewLestAffectCom = db.View_Last_Affectation_Com.Where(p => p.Id_DemDerg == FK_DemDerg_Com).Single();
            }
            return correctAction(18, FK_DemDerg_Com.Value, multiTab);
        }


        [HttpPost]
        public ActionResult Programmation(int FK_DemDerg_Com, int enregistrer)
        {
            var demandeDerg = db.Demande_Derogation.Find(FK_DemDerg_Com);

            if (enregistrer == 0)
            {
                demandeDerg.FK_DemDerg_EtatAvc = 18;
                db.SaveChanges();
                return RedirectToAction("Encours", "WorkflowDerogation", new { page = 1 });
            }
            else
            {
                demandeDerg.FK_DemDerg_EtatAvc = 19;
                db.SaveChanges();
                return RedirectToAction("AvisOrg", "WorkflowDerogation", new { FK_DemDerg = FK_DemDerg_Com });
            }
        }


        public ActionResult CreateCommission(Commission commission, int FK_DemDerg_Com)
        {
            if (commission.Date_Commission != null)
            {
                if (commission.Date_Commission < DateTime.Now)
                {
                    commission.Date_Commission = DateTime.Now;
                }
                db.Commission.Add(commission);
                db.SaveChanges();

                Affect_Derg_Comms affDergCom = new Affect_Derg_Comms();
                var comList = db.Commission.ToList();
                if (comList.Count() != 0)
                {
                    var lastidCom = comList[comList.Count() - 1].Id_Commission;
                    affDergCom.FK_Commision = lastidCom;
                }
                affDergCom.FK_DemDerg_Aff_Com = FK_DemDerg_Com;
                db.Affect_Derg_Comms.Add(affDergCom);
                db.SaveChanges();
            }

            //return Json(data);
            return RedirectToAction("Programmation", "WorkflowDerogation", new { FK_DemDerg_Com });
        }

        public ActionResult Programmation_Affectation(int FK_DemDerg_Com, int Id_Commission)
        {
            var affDergCom = new Affect_Derg_Comms
            {
                FK_Commision = Id_Commission,
                FK_DemDerg_Aff_Com = FK_DemDerg_Com
            };
            db.Affect_Derg_Comms.Add(affDergCom);
            db.SaveChanges();
            return RedirectToAction("Programmation", "WorkflowDerogation", new { FK_DemDerg_Com });
        }




        public ActionResult AvisOrg(int FK_DemDerg)
        {
            var multiTab = new MultiModeles
            {
                //DocDerg = db.Document_Derogation.Where(p => p.FK_DemDerg_DocDerg == FK_DemDerg).Where(s => s.Intitule_Doc_Derg.Equals("PV de la commission")).Single(),
                TypAviss = db.Type_Avis.ToList(),
                Orgs = db.Organisme.Where(p => p.Id_Organisme > 6).ToList(),
                AvisOrgs = db.Avis_Org.Where(p => p.FK_DemDerg == FK_DemDerg)
                .ToList(),
                DemDerg = db.Demande_Derogation.Find(FK_DemDerg)
            };
            return correctAction(19, FK_DemDerg, multiTab);
        }
        [HttpPost]
        public JsonResult AvisOrg(FormCollection form)
        {
            if (form["avis"].Count() != 0)
            {
                var av = form["avis"];
                var avv = JsonConvert.DeserializeObject<List<Avis_Org>>(av);
                for (int i = 0; i < avv.Count; i++)
                {
                    var AA = avv[i].FK_DemDerg;
                    var A = avv[i].FK_Organisme;
                    var B = avv[i].FK_TypAvis;
                    var C = avv[i].Detail_Avis;
                    Avis_Org avis_ = db.Avis_Org.Find(AA, A);
                    if (avis_ == null)
                    {
                        var con = new Avis_Org();
                        con.FK_DemDerg = AA;
                        con.FK_Organisme = A;
                        con.FK_TypAvis = B;
                        con.Detail_Avis = C;

                        db.Avis_Org.Add(con);
                    }
                    else
                    {//avv[i].FK_DemDerg, avv[i].FK_Organisme
                        Avis_Org avis = db.Avis_Org.Where(s => s.FK_DemDerg == AA && s.FK_Organisme == A).FirstOrDefault();
                        avis.FK_TypAvis = B; avis.Detail_Avis = C;
                        var res = db.Entry(avis).State = EntityState.Modified;
                    }

                }
            }

            var valider = form["valider"];
            var remq = form["req"];
            var id = System.Convert.ToInt32(form["Id"]);
            var demdeg = db.Demande_Derogation.Find(id);
            demdeg.Avis_Remarque_DemDerg = remq;
            var file = form["file"];
            var doc = new Document_Derogation
            {
                Intitule_Doc_Derg = 1,//"PV de la commission",
                url_Doc_Derg = file,
                FK_DemDerg_DocDerg = id
            };
            db.Document_Derogation.Add(doc);

            if (valider == "1")
            {
                demdeg.FK_DemDerg_EtatAvc = 20;
                db.SaveChanges();
                //return Json(Url.Action("Echanges", "WorkflowDerogation"));
                return Json(Url.Action("Echanges", "WorkflowDerogation", new { FK_DemDerg = id }));
            }
            else
            {
                demdeg.FK_DemDerg_EtatAvc = 19;
                db.SaveChanges();
                return Json(Url.Action("Encours", "WorkflowDerogation", new { page = 1 }));
                //return Json(Url.Action("AvisOrg", "WorkflowDerogation", new { FK_DemDerg = id }));
            }
        }




        public ActionResult Echanges(int FK_DemDerg)
        {
            var multiTab = new MultiModeles
            {
                NatCours = db.Nature_Courrier.ToList(),
                DemDerg = db.Demande_Derogation.Find(FK_DemDerg),

            };
            return correctAction(20, FK_DemDerg, multiTab);
        }
        [HttpPost]
        public JsonResult Echanges(FormCollection form)
        {

            if (form["courrier"].Count() != 0)
            {
                var av = form["courrier"];
                var avv = JsonConvert.DeserializeObject<List<Courrier>>(av);
                for (int i = 0; i < avv.Count; i++)
                {
                    var con = new Courrier
                    {
                        FK_DemDerg_Cour = avv[i].FK_DemDerg_Cour,
                        FK_Nature_Courrier = avv[i].FK_Nature_Courrier,

                        Source_Courrier = avv[i].Source_Courrier,
                        Destination_Courrier = avv[i].Destination_Courrier,
                        url_Courrier = avv[i].url_Courrier
                    };
                    if (avv[i].Date_Courier > DateTime.Now) { con.Date_Courier = avv[i].Date_Courier; }
                    else { con.Date_Courier = DateTime.Today; }
                    db.Courrier.Add(con);
                    db.SaveChanges();
                }
            }

            var id = System.Convert.ToInt32(form["Id"]);
            var demdeg = db.Demande_Derogation.Find(id);
            var valider = form["valider"];
            if (valider == "1")
            {
                demdeg.FK_DemDerg_EtatAvc = 21;
                db.SaveChanges();
                //return Json(Url.Action("Encours", "WorkflowDerogation"));
                return Json(Url.Action("Autorisation", "WorkflowDerogation", new { FK_DemDerg = id }));
            }
            else
            {
                demdeg.FK_DemDerg_EtatAvc = 20;
                db.SaveChanges();
                return Json(Url.Action("Encours", "WorkflowDerogation", new { page = 1 }));
                //return Json(Url.Action("Echanges", "WorkflowDerogation", new { FK_DemDerg = id }));
            }

        }




        public ActionResult Autorisation(int FK_DemDerg)
        {
            var multiTab = new MultiModeles
            {
                DemDerg = db.Demande_Derogation.Find(FK_DemDerg),
            };
            return correctAction(21, FK_DemDerg, multiTab);
        }
        [HttpPost]
        public ActionResult Autorisation(int Id_Aut, Autorisation_Derogation AutDerog, int valider, int Fk_DEMDEROG)
        {
            ViewBag.Message = "";
            var demdeg = db.Demande_Derogation.Find(Fk_DEMDEROG);

            if (AutDerog.Nature_Autorisation == "" || AutDerog.Nature_Autorisation == null || AutDerog.Nature_Autorisation == "null")
            {
                MultiModeles multi = new MultiModeles { DemDerg = demdeg };
                return View(multi);
            }
            else
            {
                if (demdeg.Autorisation_Derogation == null)
                {
                    db.Autorisation_Derogation.Add(AutDerog);
                    demdeg.Autorisation_Derogation = AutDerog;
                }
                else
                {
                    Autorisation_Derogation autorisation_Derogation = db.Autorisation_Derogation.Find(Id_Aut);
                    autorisation_Derogation.Dae_Avis_Autorisation = AutDerog.Dae_Avis_Autorisation;
                    autorisation_Derogation.Date_Aut_Autorisation = AutDerog.Date_Aut_Autorisation;
                    autorisation_Derogation.Date_Comt_Autorisation = AutDerog.Date_Comt_Autorisation;
                    autorisation_Derogation.Date_Demande_Autorisation = AutDerog.Date_Demande_Autorisation;
                    autorisation_Derogation.EtatAvancemt_Autorisation = AutDerog.EtatAvancemt_Autorisation;
                    autorisation_Derogation.Nature_Autorisation = AutDerog.Nature_Autorisation;
                    db.Entry(autorisation_Derogation).State = EntityState.Modified;
                    //db.Autorisation_Derogation.Remove(autorisation_Derogation);
                    //db.Autorisation_Derogation.Add(AutDerog);
                }

                if (valider == 0)
                {
                    demdeg.FK_DemDerg_EtatAvc = 21;
                    db.SaveChanges();
                    return RedirectToAction("Encours", "WorkflowDerogation", new { page = 1 });
                    //return RedirectToAction("Autorisation", "WorkflowDerogation", new { FK_DemDerg = AutDerog.FK_DemDerg_AutDerg });
                }
                else
                {
                    demdeg.FK_DemDerg_EtatAvc = 22;
                    db.SaveChanges();
                    //return RedirectToAction("Encours", "WorkflowDerogation");
                    return RedirectToAction("Cloture", "WorkflowDerogation", new { FK_DemDerg = Fk_DEMDEROG });
                }
            }
        }



        public ActionResult Cloture(int FK_DemDerg)
        {
            var multiTab = new MultiModeles
            {
                //AutDerog = db.Autorisation_Derogation.Where(p => p.FK_DemDerg_AutDerg == FK_DemDerg).Single(),
                DemDerg = db.Demande_Derogation.Find(FK_DemDerg)
            };
            return correctAction(22, FK_DemDerg, multiTab);
        }
        [HttpPost]
        public ActionResult Cloture(int? FK_DemDerg_AutDerg)
        {
            var demdeg = db.Demande_Derogation.Find(FK_DemDerg_AutDerg);
            demdeg.Cloture_DemDerg = true;
            db.SaveChanges();
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




        // GET: WorkflowDerogation
        public ActionResult Encours(Int16 page)
        {
            int totale_resultats = db.Demande_Derogation.Count();
            int nombre_de_pages = totale_resultats / nombre_res_ppage + 1;
            ViewBag.page = page;ViewBag.nombre_de_pages = nombre_de_pages;
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
                    DemDergs = db.Demande_Derogation
                    .OrderByDescending(p => p.Id_DemDerg)
                    .Skip((page - 1) * nombre_res_ppage)
                    .Take(nombre_res_ppage)
                    .ToList()
                };
            return View(model);
            }
        }


        [HttpPost]
        public ActionResult Encours(int Id_DemDerg)
        {
            Demande_Derogation demande = db.Demande_Derogation.Find(Id_DemDerg);
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


        public ActionResult EncoursParProfils()
        {
            var model = new MultiModeles
            {
                //var profil = "Rens";
                //if (profil == "Rens")
                //{
                //    model.DemDergs = db.Demande_Derogation.Where(p => p.FK_DemDerg_EtatAvc == 15);
                //}
                //else if (profil == "")
                //{
                //    model.DemDergs = db.Demande_Derogation.Where(p => p.FK_DemDerg_EtatAvc == 16);
                //}
                //else if (profil == "")
                //{
                //    model.DemDergs = db.Demande_Derogation.Where(p => p.FK_DemDerg_EtatAvc == 17);
                //}
                //else if (profil == "")
                //{
                //    model.DemDergs = db.Demande_Derogation.Where(p => p.FK_DemDerg_EtatAvc == 18);
                //}
                //else if (profil == "")
                //{
                //    model.DemDergs = db.Demande_Derogation.Where(p => p.FK_DemDerg_EtatAvc == 19);
                //}
                //else if (profil == "")
                //{
                //    model.DemDergs = db.Demande_Derogation.Where(p => p.FK_DemDerg_EtatAvc == 20);
                //}
                //else if (profil == "")
                //{
                //    model.DemDergs = db.Demande_Derogation.Where(p => p.FK_DemDerg_EtatAvc == 21);
                //}
                //else
                //{
                //    model.DemDergs = db.Demande_Derogation.Where(p => p.FK_DemDerg_EtatAvc == 22);
                //}

                NatDemDerogs = db.Nature_Demande_Derg.ToList(),
                EtatAvancements = db.EtatAvancement.ToList()
            };

            return View(model);
        }





        public ActionResult Rensegnements_Fait(int Id_DemDerg)
        {
            ViewBag.Message = Workflow.Renseignements + " . " + Workflow.Situation_Géographique
                + " . " + Workflow.GED + " . " + Workflow.Programmation + " . " + Workflow.Avis
                + " . " + Workflow.Echanges + " . " + Workflow.Autorisation + " . " + Workflow.Cloture;

            var demDerog = db.Demande_Derogation.ToList();
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
                Provs = db.PROVINCES_RSK.ToList(),
                Communes = db.COMMUNES_RSK.ToList(),
                Parcells = db.parcell.ToList(),
                DemDerg = db.Demande_Derogation.Find(Id_DemDerg),
                NatDemDerogs = db.Nature_Demande_Derg.ToList(),
                ForMaitreOeuvrages = db.Forme_MaitreOeuvrage_DemDerg.ToList(),
                NatPrjDerogs = db.Nature_Projet_DemDerg.ToList(),
                StatutJurds = db.Statut_Juridique_DemDerg.ToList(),
                References_Foncieres = db.References_Foncieres.ToList()
            };
            //return View(multiTab);
            return correctAction(15, Id_DemDerg, multiTab);
        }

        [HttpPost]
        public ActionResult Rensegnements_Fait(Demande_Derogation DemDerg, int enregistrer/*, int Id_DemDerg*/)
        {
            var demExist = db.Demande_Derogation.Find(DemDerg.Id_DemDerg);

            demExist.Code_DemDerg = DemDerg.Code_DemDerg;
            demExist.Intitule_DemDerg = DemDerg.Intitule_DemDerg;
            demExist.Superficie_Terrain_DemDerg = DemDerg.Superficie_Terrain_DemDerg;
            demExist.Maitre_Oeuvrage_DemDerg = DemDerg.Maitre_Oeuvrage_DemDerg;
            demExist.Maitre_Oeuvre_DemDerg = DemDerg.Maitre_Oeuvre_DemDerg;
            demExist.Couverture_DemDerg = DemDerg.Couverture_DemDerg;
            demExist.PrevisionUrbanistique_DemDerg = DemDerg.PrevisionUrbanistique_DemDerg;
            demExist.Ratio_indus_DemDerg = DemDerg.Ratio_indus_DemDerg;
            demExist.Ratio_resid_DemDerg = DemDerg.Ratio_resid_DemDerg;
            demExist.Ratio_Social_DemDerg = DemDerg.Ratio_Social_DemDerg;
            demExist.Ratio_touris_DemDerg = DemDerg.Ratio_touris_DemDerg;
            demExist.Montant_Investissement_DemDerg = DemDerg.Montant_Investissement_DemDerg;
            demExist.Emploi_generer_DemDerg = DemDerg.Emploi_generer_DemDerg;
            demExist.Dero_demande_DemDerg = DemDerg.Dero_demande_DemDerg;
            demExist.Duree_realisation_DemDerg = DemDerg.Duree_realisation_DemDerg;
            demExist.Contribution_Projet_DemDerg = DemDerg.Contribution_Projet_DemDerg;
            demExist.Adresse_DemDerg = DemDerg.Adresse_DemDerg;
            demExist.Avis_Remarque_DemDerg = DemDerg.Avis_Remarque_DemDerg;
            demExist.Cloture_DemDerg = DemDerg.Cloture_DemDerg;
            demExist.FK_DemDerg_Nature_Dem = DemDerg.FK_DemDerg_Nature_Dem;
            demExist.FK_DemDerg_StatutJuridique_DemDerg = DemDerg.FK_DemDerg_StatutJuridique_DemDerg;
            demExist.FK_DemDerg_FormeMaitreOeuvrage_DemDerg = DemDerg.FK_DemDerg_FormeMaitreOeuvrage_DemDerg;
            demExist.FK_DemDerg_Nature_Projet_DemDerg = DemDerg.FK_DemDerg_Nature_Projet_DemDerg;

            if (enregistrer == 0)
            {
                demExist.FK_DemDerg_EtatAvc = 15;
                db.SaveChanges();
                return RedirectToAction("Encours", "WorkflowDerogation", new { page = 1 });
                //return RedirectToAction("Rensegnements_Fait", "WorkflowDerogation", new { Id_DemDerg = DemDerg.Id_DemDerg });
            }
            else
            {
                demExist.FK_DemDerg_EtatAvc = 16;
                db.SaveChanges();
                return RedirectToAction("Encours", "WorkflowDerogation", new { page = 1 });
                //return RedirectToAction("SituationGeo", "WorkflowDerogation", new { Id_DemDerg = DemDerg.Id_DemDerg });
            }
        }

        public ActionResult WorkflowG(int idDemDerog)
        {
            MultiModeles multiModeles = new MultiModeles {
                DemDerg = db.Demande_Derogation.Find(idDemDerog)
            };
            return View(multiModeles);
        }

    }




}