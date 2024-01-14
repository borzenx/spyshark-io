using System.ComponentModel.DataAnnotations;

namespace ShopifyStatsAPIs.Models
{
    public class UserStoreAssocitation
    {
        public string UserId { get; set; }
        public string StoreName { get; set; }
        public int IsTracked { get; set; }
        public string StoreLink { get; set; }
    }
}
