using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Web;

namespace GestionnaireUtilisateurs.Models
{
    public class MultiModeles
    {

        [DisplayName("Utilisateur")]
        public IEnumerable<AspNetUsers> aspNetUsers { get; set; }

        [DisplayName("Tache")]
        public IEnumerable<AspNetRoles> aspNetRoles { get; set; }
        public IEnumerable<AspNetUserRoles> aspNetUserRoles { get; set; }
        public IEnumerable<Statuts> statuts { get; set; }
        public IEnumerable<StatutRole> statutRoles { get; set; }

        [DisplayName("Sous Module")]
        public IEnumerable<SousModule> sousModules { get; set; }

        [DisplayName("Module")]
        public IEnumerable<Module> modules { get; set; }
        public IEnumerable<Application> applications { get; set; }


        public IEnumerable<Commission> Comss { get; set; }
        public IEnumerable<Demande_Derogation> DemDergs { get; set; }
        public Demande_Derogation DemDerg { get; set; }
        public IEnumerable<Forme_MaitreOeuvrage_DemDerg> ForMaitreOeuvrages { get; set; }
        public IEnumerable<Nature_Courrier> NatCours { get; set; }
        public IEnumerable<Nature_Demande_Derg> NatDemDerogs { get; set; }
        public IEnumerable<Nature_Projet_DemDerg> NatPrjDerogs { get; set; }
        public IEnumerable<Organisme> Orgs { get; set; }
        public IEnumerable<Statut_Juridique_DemDerg> StatutJurds { get; set; }
        public IEnumerable<Avis_Org> AvisOrgs { get; set; }
        public IEnumerable<Type_Avis> TypAviss { get; set; }
        public IEnumerable<EtatAvancement> EtatAvancements { get; set; }
        public IEnumerable<PROVINCES_RSK> Provs { get; set; }
        public IEnumerable<COMMUNES_RSK> Communes { get; set; }
        public IEnumerable<References_Foncieres> References_Foncieres { get; set; }
        public IEnumerable<parcell> Parcells { get; set; }
        public IEnumerable<TYPE_DOC> TYPE_DOCs { get; set; }
        public IEnumerable<derogs_demandees> Derogs_Demandees { get; set; }
    }
}