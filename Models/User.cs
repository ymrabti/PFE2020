using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;

namespace GestionnaireUtilisateurs.Models
{
    //[MetadataType(typeof(UserMetaData))]
    //public class User : IdentityUser<int, UserLogin, UserRole, UserClaim>, IEntity
    //{
    //    public async Task<ClaimsIdentity> GenerateUserIdentityAsync(UserManager<User, int> manager)
    //    {
    //        var userIdentity = await manager.CreateIdentityAsync(this, DefaultAuthenticationTypes.ApplicationCookie);
    //        return userIdentity;
    //    }
    //}

    //public class UserMetaData
    //{
    //    [Display(Name = "Nom Ar")]
    //    public virtual string NomAr { get; set; }
    //}
}