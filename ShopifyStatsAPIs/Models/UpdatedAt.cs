using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace ShopifyStatsAPIs.Models
{
    
    public class UpdatedAt
    {
        [Key]
        public int Id { get; set; }
        public string StoreName { get; set; }
        public DateTime Date { get; set; }
    }
}
