using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BackEnd.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace E_commerce.Controllers {
	[ApiController]
	[Route("[controller]")]
	public class AddressController : ControllerBase {

		private readonly ILogger<AddressController> _logger;
		private readonly EcommerceDbContext _dbContext;

		public AddressController(ILogger<AddressController> logger, EcommerceDbContext dbContext) {
			_logger = logger;
			_dbContext = dbContext;
		}

		[HttpGet]
		public IEnumerable<Address> Get() {
			return _dbContext.Addresses.ToList();
		}

		[HttpPost]
		public IActionResult Post(Address address) {
			_dbContext.Addresses.Add(address);
			_dbContext.SaveChanges();
			return Ok();
		}
	}
}