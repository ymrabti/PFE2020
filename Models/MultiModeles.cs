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
    }
}