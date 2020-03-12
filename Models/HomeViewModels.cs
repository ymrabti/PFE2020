using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace GestionnaireUtilisateurs.Models
{
    public class StatutsViewModel
    {
        [Required]
        [Display(Name ="Nom du Statut")]
        [StringLength(100, ErrorMessage = "La chaîne {0} doit comporter au moins {2} caractères.", MinimumLength = 6)]
        public string StatutName { get; set; }
        [Display(Name = "Description du Statut")]
        public string StatutDescription { get; set; }
    }
}