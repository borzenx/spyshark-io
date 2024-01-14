using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShopifyStatsAPIs.Models
{
    public class StoreControllerMainRequestModel
    {
        [Required]
        public string UserId { get; set; }
        [Required]
        public string shopUrl { get; set; }
    }

}
