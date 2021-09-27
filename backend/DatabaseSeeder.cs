using System;
using System.Collections.Generic;
using Ecommerce.Models;
using Ecommerce.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Ecommerce {
	public class DatabaseSeeder {
		public static void Seed(
			EcommerceDbContext context,
			IPasswordService passwordService,
			IConfiguration config
		) {

			if (!context.Database.CanConnect()) {
				Console.WriteLine("Unable to Connect to Database!");
				return;
			}
			var clear = config["SeedDatabase"];
			if (clear != null && clear.Equals("false")) return;

			Console.WriteLine("Clearing Database!");
			context.Database.ExecuteSqlRaw(
				"DELETE from Addresses; ALTER TABLE Addresses AUTO_INCREMENT=1;"
				+ "DELETE from Products; ALTER TABLE Products AUTO_INCREMENT=1;"
				+ "DELETE from Users; ALTER TABLE Users AUTO_INCREMENT=1;"
				+ "DELETE from Categories; ALTER TABLE Categories AUTO_INCREMENT=1;"
				+ "DELETE from Roles; ALTER TABLE Roles AUTO_INCREMENT=1;"
			);

			Console.WriteLine("Seeding Database!");
			context.Categories.AddRange(new List<Category> {
				new(1, "test"),
				new(2, "Alimentos"),
				new(3, "XYZ"),
				new(4, "Itens"),
				new(5, "Empty"),
			});

			context.Roles.AddRange(new List<Role> {
				new(1, "Admin"),
				new(2, "Vendedor"),
				new(3, "Teste"),
			});

			context.Addresses.AddRange(new List<Address> {
				new("29104020", "Rua Rosa Amarela", "Novo México", "Vila Velha", "ES"),
				new("29104050", "Rua Sesquicentenário", "Novo México", "Vila Velha", "ES"),
				new("29104070", "Rua Leila Diniz", "Novo México", "Vila Velha", "ES"),
				new("29150031", "Rua Guarapari", "Itacibá", "Cariacica", "ES"),
				new("29150080", "Rua Cleto Trancoso", "Itacibá", "Cariacica", "ES"),
			});

			context.Products.AddRange(new List<Product> {
				new("ABC", 3.8, 8.8, 800, false, 1, 1, null),
				new("Comida", 1.2, 2.8, 220, false, 2, 2, null),
				new("Caro", 244.6, 340.99, 112, false, 3, 3, null),
				new("Teste", 4.6, 12.2, 618, false, 4, 4, null),
				new("Belo Teste", 175, 240, 46, false, 3, 5, null),
			});

			passwordService.HashedPassword("string", out var hash, out var salt);
			context.Users.AddRange(new List<User> {
				new("string", "string", hash, salt, 1, 1),
			});

			Console.WriteLine("Saving Changes!");
			context.SaveChanges();
			Console.WriteLine("DONE!");
		}
	}
}