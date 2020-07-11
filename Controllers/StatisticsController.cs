using System;
using System.Collections.Generic;
using System.Data.Entity.Spatial;
using System.Globalization;
using System.Linq;
using System.Spatial;
using System.Web;
using System.Web.Mvc;
using GestionnaireUtilisateurs.Models;

namespace GestionnaireUtilisateurs.Controllers
{
    public class GeoLocation
    {
        public int Id { get; set; }
        public DbGeography Location { get; set; }
        public string Address { get; set; }
    }
    public class ResultData
    {
        public string GeoString { get; set; }
        public double Distance { get; set; }
        public string Address { get; set; }
    }
    public class StatisticsController : Controller
    {
        // GET: Statistics
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult TableBord()
        {
            return View();
        }
        public void AddLocationsToDataBase()
        {
            aurs1Entities context = new aurs1Entities();

            // remove all
            context.parcell.ToList().ForEach(loc => context.parcell.Remove(loc));
            context.SaveChanges();

            var location = new GeoLocation()
            {
                // Create a point using native DbGeography Factory method
                Location = DbGeography.PointFromText(
                            string.Format("POINT({0} {1})", -121.527200, 45.712113)
                            , 4326),
                Address = "301 15th Street, Hood River"
            };
            //context.parcell.Add(location);

            location = new GeoLocation()
            {
                Location = CreatePoint(45.714240, -121.517265),
                Address = "The Hatchery, Bingen"
            };
            //context.Locations.Add(location);

            location = new GeoLocation()
            {
                // Create a point using a helper function (lat/long)
                Location = CreatePoint(45.708457, -121.514432),
                Address = "Kaze Sushi, Hood River"
            };
            //context.Locations.Add(location);

            location = new GeoLocation()
            {
                Location = CreatePoint(45.722780, -120.209227),
                Address = "Arlington, OR"
            };
            //context.Locations.Add(location);

            context.SaveChanges();
        }
        public static DbGeography CreatePoint(double latitude, double longitude)
        {
            var text = string.Format(CultureInfo.InvariantCulture.NumberFormat,
                                     "POINT({0} {1})", longitude, latitude);
            // 4326 is most common coordinate system used by GPS/Maps
            return DbGeography.PointFromText(text, 4326);
        }
        public void QueryLocationsTest()
        {
            var sourcePoint = CreatePoint(45.712113, -121.527200);

            aurs1Entities context = new aurs1Entities();

            // find any locations within 5 kilometers ordered by distance
            //var matches =
            //    context.Locations
            //            .Where(loc => loc.Location.Distance(sourcePoint) < 5000)
            //            .OrderBy(loc => loc.Location.Distance(sourcePoint))
            //            .Select(loc => new { Address = loc.Address, Distance = loc.Location.Distance(sourcePoint) });

            ////Assert.IsTrue(matches.Count() > 0);

            //foreach (var location in matches)
            //{
            //    Console.WriteLine("{0} ({1:n0} meters)", location.Address, location.Distance);
            //}
        }
        /// Convert meters to miles
        /// 
        /// 
        /// 
        public static double MetersToMiles(double? meters)
        {
            if (meters == null)
                return 0F;

            return meters.Value * 0.000621371192;
        }

        /// 

        /// Convert miles to meters
        /// 
        /// 
        /// 
        public static double MilesToMeters(double? miles)
        {
            if (miles == null)
                return 0;

            return miles.Value * 1609.344;
        }
        public void QueryLocationsMilesTest()
        {
            var sourcePoint = CreatePoint(45.712113, -121.527200);

            aurs1Entities context = new aurs1Entities();

            // find any locations within 5 miles ordered by distance
            var fiveMiles = MilesToMeters(5);

            var matches =
                context.parcell;
                        //.Where(loc => loc.Location.Distance(sourcePoint) <= fiveMiles)
                        //.OrderBy(loc => loc.Location.Distance(sourcePoint))
                        //.Select(loc => new { Address = loc.Address, Distance = loc.Location.Distance(sourcePoint) });

            //Assert.IsTrue(matches.Count() > 0);

            //foreach (var location in matches)
            //{
            //    Console.WriteLine("{0} ({1:n1} miles)", location.Address, MetersToMiles(location.Distance));
            //}
        }
        public void RawSqlEfAddTest()
        {
            string sqlFormat =
            @"insert into GeoLocations( Location, Address) values
            ( geography::STGeomFromText('POINT({0} {1})', 4326),@p0 )";

            var sql = string.Format(sqlFormat, -121.527200, 45.712113);

            Console.WriteLine(sql);

            aurs1Entities context = new aurs1Entities();
            //string sqlFormat1 =@"insert into GeoLocations( Location, Address) values( geography::STGeomFromText('POINT(@p0 @p1)', 4326),@p2 )";
            context.Database.ExecuteSqlCommand(sql, -121.527200, 45.712113, "301 N. 15th Street");
            //Assert.IsTrue(context.Database.ExecuteSqlCommand(sql, "301 N. 15th Street") > 0);
        }
        public void RawSqlEfQueryTest()
        {
            var sqlFormat =
            @"
    DECLARE @s geography
    SET @s = geography:: STGeomFromText('POINT({0} {1})' , 4326);

    SELECT     
        Address,        
        Location.ToString() as GeoString,        
        @s.STDistance( Location) as Distance        
    FROM GeoLocations
    ORDER BY Distance";

            var sql = string.Format(sqlFormat, -121.527200, 45.712113);

            aurs1Entities context = new aurs1Entities();
            var locations = context.Database.SqlQuery<ResultData>(sql);

            //Assert.IsTrue(locations.Count() > 0);

            foreach (var location in locations)
            {
                Console.WriteLine(location.Address + " " + location.GeoString + " " + location.Distance);
            }
        }
        //public static Geometry Project_EPSG25832_To_EPSG3857(byte[] wkb)
        //{
        //    NetTopologySuite.IO.WKBReader reader = new NetTopologySuite.IO.WKBReader();
        //    Geometry geom = (Geometry)reader.Read(wkb);

        //    double[] pointArray = new double[geom.Coordinates.Count() * 2];
        //    double[] zArray = new double[1];
        //    zArray[0] = 1;
            
        //    int counterX = 0;
        //    int counterY = 1;
        //    foreach (var coordinate in geom.Coordinates)
        //    {
        //        pointArray[counterX] = coordinate.X;
        //        pointArray[counterY] = coordinate.Y;

        //        counterX = counterX + 2;
        //        counterY = counterY + 2;
        //    }

        //    var epsg25832 = new DotSpatial.Projections.ProjectionInfo();
        //    var epsg3857 = new DotSpatial.Projections.ProjectionInfo();
        //    epsg25832.ParseEsriString(ESRI_EPSG_25832);
        //    epsg3857.ParseEsriString(ESRI_EPSG_3857);

        //    DotSpatial.Projections.Reproject.ReprojectPoints(pointArray, zArray, epsg25832, epsg3857, 0, (pointArray.Length / 2));

        //    counterX = 0;
        //    counterY = 1;
        //    foreach (var coordinate in geom.Coordinates)
        //    {
        //        coordinate.X = pointArray[counterX];
        //        coordinate.Y = pointArray[counterY];

        //        counterX = counterX + 2;
        //        counterY = counterY + 2;
        //    }
        //    //**geom.GeometryChanged(); **
        //    return geom;
        //}
    }
    
}