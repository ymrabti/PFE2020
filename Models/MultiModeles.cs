using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace GestionnaireUtilisateurs.Models
{
    public class MultiModeles
    {
        public IEnumerable<AspNetUsers> aspNetUsers { get; set; }
        public IEnumerable<AspNetRoles> aspNetRoles { get; set; }
        public IEnumerable<AspNetUserRoles> aspNetUserRoles { get; set; }
        public IEnumerable<Statuts> statuts { get; set; }
        public IEnumerable<StatutRole> statutRoles { get; set; }
        public IEnumerable<SousModule> sousModules { get; set; }
        public IEnumerable<Module> modules { get; set; }
        public IEnumerable<Application> applications { get; set; }
    }
}