using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using ShopifyStatsAPIs.Models;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using System.Linq.Expressions;
using Azure.ResourceManager.AppService;
using Newtonsoft.Json.Linq;
using ShopifyStatsAPIs.Data;
using System.Numerics;

namespace ShopifyStatsAPIs.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class StoreController : ControllerBase
    {
        private readonly MyDatabaseContext _context;


        public StoreController(MyDatabaseContext context)
        {
            _context = context;

        }
        private async Task AddUpdatedAtDataToDatabase(MainObject mainObject)

        {
            try
            {
                DateTime UpdatedAt = mainObject.products
                    .Where(p => p.updated_at != null)
                    .Select(p => p.updated_at)
                    .FirstOrDefault();
                string vendor = mainObject.products
                    .Where(p => p.vendor != null)
                    .Select(p => p.vendor)
                    .FirstOrDefault();
                UpdatedAt updatedAt = new UpdatedAt
                {
                    StoreName = vendor,
                    Date = UpdatedAt
                };
                _context.UpdatedAt.Add(updatedAt);
                _context.SaveChanges();
            }
            catch (Exception ex)
            {
                throw ex.InnerException;

            }

        }



        // Other actions for CRUD operations

        private async Task AssociateShopName(string UserId, string StoreName, string StoreLink)
        {
            try
            {
                var existingAssociation = await _context.UserStoreAssociations
                    .SingleOrDefaultAsync(usa =>
                        usa.UserId == UserId && usa.StoreName == StoreName);
                if (existingAssociation == null)
                {
                    var association = new UserStoreAssocitation()
                    {
                        UserId = UserId,
                        StoreName = StoreName,
                        StoreLink = StoreLink,
                        IsTracked = 1
                    };

                    _context.UserStoreAssociations.Add(association);
                    _context.SaveChanges();

                }

                else if (existingAssociation.IsTracked == 0 && existingAssociation != null)
                {
                    existingAssociation.IsTracked = 1;
                    _context.UserStoreAssociations.Update(existingAssociation);
                    _context.SaveChanges();
                }
            }
            catch (Exception e)
            {

                throw e.InnerException;
            }



        }
        [HttpPost]
        [Route("/AddStoresUserDataToDb")]
        public async Task<IActionResult> GetStoresDataMainObject([FromBody] StoreControllerMainRequestModel mainRequest)
        {
            try
            {
                MainObject product = await FetchProductData(mainRequest.shopUrl);

                if (product != null)
                {
                    Product productForVendor = product.products.Find(i => i.vendor != null);
                    await AssociateShopName(mainRequest.UserId, productForVendor?.vendor, mainRequest.shopUrl);
                    await AddUpdatedAtDataToDatabase(product);

                    return Ok("Data added to the database.");
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

            return NotFound();
        }

        private async Task<MainObject> FetchProductData(string shopUrl)
        {
            using (HttpClient client = new HttpClient())
            {
                client.DefaultRequestHeaders.Add("User-Agent",
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36");

                if (shopUrl.StartsWith("https://"))
                {
                    shopUrl = shopUrl.Replace("https://", "");
                }

                HttpResponseMessage response = await client.GetAsync($"https://{shopUrl}/products.json");

                if (response.IsSuccessStatusCode)
                {
                    string responseBody = await response.Content.ReadAsStringAsync();
                    return JsonConvert.DeserializeObject<MainObject>(responseBody);
                }

                return null;
            }
        }

        [HttpGet]
        [Route("/GetUserStores")]
        public IActionResult GetAssociatedShops([FromQuery] string userId)
        {
            var associatedShops = _context.UserStoreAssociations
                .Where(usa => usa.UserId == userId && usa.IsTracked == 1)
                .Select(usa => new { usa.StoreName, usa.StoreLink })
                .ToList();

            if (associatedShops.Count == 0)
            {
                return NotFound("No associated shops found for the user.");
            }

            return Ok(associatedShops);
        }

        [HttpPost]
        [Route("/RemoveUserStoreAssociation")]
        public IActionResult RemoveUserStoreAssociation([FromBody] StoreControllerMainRequestModel mainRequest)
        {
            var record = _context.UserStoreAssociations
                .FirstOrDefault(e => e.UserId == mainRequest.UserId && e.StoreLink == mainRequest.shopUrl);

            if (record == null)
            {
                return NotFound(); // Record not found
            }

            // Set IsActive to 0
            record.IsTracked = 0;

            // Save changes to the database
            _context.SaveChanges();

            return Ok(); // Record updated successfully
        }
        [HttpGet]
        [Route("/GetStoreUpdatedAts")]
        public IActionResult GetStoreUpdatedAts([FromQuery] string storeLink)
        {
            string storeLinkNameAssociation = _context.UserStoreAssociations
                .Where(p => p.StoreLink == storeLink)
                .Select(p => p.StoreName)
                .FirstOrDefault();
            var storeUpdatedAts = _context.UpdatedAt
                .Where(p => p.StoreName == storeLinkNameAssociation)
                .Select(p => p.Date)
                .ToList();

            if (storeUpdatedAts.Count == 0)
            {
                return NotFound("No updated ats found for this store name");
            }

            return Ok(storeUpdatedAts);
        }

        [HttpPost]
        [Route("/UpdatedAtDatabaseLogic")]
        public IActionResult UpdatedAtDatabaseLogic()
        {
            List<string> storeLinks = new List<string>();
            HashSet<string> uniqueLinks = new HashSet<string>();

            var currentRecords = _context.UpdatedAt
                .Where(p => p.Date != null && p.StoreName != null)
                .GroupBy(p => p.StoreName)
                .Select(group => group.OrderByDescending(p => p.Date).FirstOrDefault())
                .ToList();

            foreach (var store in currentRecords)
            {
                var linksForStore = _context.UserStoreAssociations
                    .Where(p => p.StoreName == store.StoreName)
                    .Select(p => p.StoreLink)
                    .Distinct();

                foreach (var link in linksForStore)
                {
                    uniqueLinks.Add(link);
                }
            }
            storeLinks.AddRange(uniqueLinks);
            foreach (var storeLink in storeLinks)
            {
                Task<MainObject> newMainObject = FetchProductData(storeLink);
                Product newStoreData = newMainObject.Result.products.Find(i => i.vendor != null);
                UpdatedAt currentRecord = currentRecords.Find(i => i.StoreName == newStoreData.vendor);
                if (currentRecord.Date < newStoreData.updated_at)
                {
                    UpdatedAt updatedAt = new UpdatedAt
                    {
                        StoreName = newStoreData.vendor,
                        Date = newStoreData.updated_at
                    };

                    _context.UpdatedAt.Add(updatedAt);
                }

            }
            _context.SaveChanges();


            return Ok();
        }
        [HttpGet]
        [Route("/GetTopStores")]
        public IActionResult GetTopStores([FromQuery] int numberOfDays, [FromQuery] int topCount)
        {
            DateTime startDate = DateTime.UtcNow.AddDays(-numberOfDays);
            DateTime endDate = DateTime.UtcNow;

            var topStores = _context.UpdatedAt
                .Where(x => x.Date >= startDate && x.Date <= endDate)
                .GroupBy(x => x.StoreName)
                .Select(g => new
                {
                    StoreName = g.Key,
                    StoreLink = _context.UserStoreAssociations
                        .Where(usa => usa.StoreName == g.Key)
                        .Select(usa => usa.StoreLink)
                        .FirstOrDefault(),
                    RecordCount = g.Count(),
                })
                .OrderByDescending(x => x.RecordCount)
                .Take(topCount)
                .ToList();

            if (topStores.Count == 0)
            {
                return NotFound("No records found within the specified timeframe.");
            }

            return Ok(topStores);
        }
    }
}