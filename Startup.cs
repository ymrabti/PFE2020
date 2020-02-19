using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(GestionnaireUtilisateurs.Startup))]
namespace GestionnaireUtilisateurs
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
