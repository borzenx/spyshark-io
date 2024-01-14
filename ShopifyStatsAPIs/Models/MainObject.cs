using Azure.ResourceManager.Resources.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace ShopifyStatsAPIs.Models
{
    
  
 
    public class Product
    {
        public string vendor { get; set; }
        public DateTime updated_at { get; set; }
    }
   
    public class MainObject
    {
        
        public List<Product> products { get; set; }
    }

  
  

}
