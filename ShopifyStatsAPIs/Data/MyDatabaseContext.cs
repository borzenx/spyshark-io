using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Migrations.Operations;
using ShopifyStatsAPIs.Models;

namespace ShopifyStatsAPIs.Data
{
    public class MyDatabaseContext : DbContext
    {
        public DbSet<UserStoreAssocitation> UserStoreAssociations { get; set; }
        public DbSet<UpdatedAt> UpdatedAt { get; set; }
        public MyDatabaseContext(DbContextOptions<MyDatabaseContext> options)
            : base(options)
        {
        }

        // Other DbSet and configuration properties as needed

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

           
            modelBuilder.Entity<UserStoreAssocitation>()
                .HasKey(x => new { x.UserId, x.StoreName });
            base.OnModelCreating(modelBuilder);

        }



    }
}