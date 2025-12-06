// API Configuration
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
	? "http://localhost:5000/api"
	: `${window.location.origin}/api`;

// Car data
let cars = [];
let currentFilter = "all";

// Preloader
window.addEventListener("load", () => {
	setTimeout(() => {
		document.getElementById("preloader").classList.add("hidden");
	}, 1000);
});

// Navbar scroll effect
window.addEventListener("scroll", () => {
	const navbar = document.getElementById("navbar");
	if (window.scrollY > 100) {
		navbar.classList.add("scrolled");
	} else {
		navbar.classList.remove("scrolled");
	}
});

// Mobile menu toggle
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
	navLinks.classList.toggle("active");
});

// Close mobile menu on link click
document.querySelectorAll(".nav-link").forEach((link) => {
	link.addEventListener("click", () => {
		navLinks.classList.remove("active");
	});
});

// Search overlay
const searchBtn = document.getElementById("searchBtn");
const searchOverlay = document.getElementById("searchOverlay");
const searchClose = document.getElementById("searchClose");
const searchInput = document.getElementById("searchInput");

searchBtn.addEventListener("click", () => {
	searchOverlay.classList.add("active");
	setTimeout(() => searchInput.focus(), 300);
});

searchClose.addEventListener("click", () => {
	searchOverlay.classList.remove("active");
});

searchOverlay.addEventListener("click", (e) => {
	if (e.target === searchOverlay) {
		searchOverlay.classList.remove("active");
	}
});

// Search functionality
searchInput.addEventListener("input", (e) => {
	const query = e.target.value.toLowerCase();
	if (query.length > 2) {
		const filtered = cars.filter(
			(car) =>
				car.name.toLowerCase().includes(query) ||
				car.type.toLowerCase().includes(query)
		);
		renderCars(filtered);
	} else if (query.length === 0) {
		fetchCars(currentFilter);
	}
});

// Suggestion tags
document.querySelectorAll(".suggestion-tag").forEach((tag) => {
	tag.addEventListener("click", () => {
		const filter = tag.textContent.toLowerCase();
		searchOverlay.classList.remove("active");
		currentFilter = filter;
		fetchCars(filter);
		document.querySelectorAll(".filter-btn").forEach((btn) => {
			btn.classList.remove("active");
			if (btn.dataset.filter === filter) {
				btn.classList.add("active");
			}
		});
	});
});

// Fetch cars from API
async function fetchCars(filter = "all") {
	try {
		const url =
			filter === "all" ? `${API_URL}/cars` : `${API_URL}/cars?type=${filter}`;

		const response = await fetch(url);
		cars = await response.json();
		renderCars(cars);
	} catch (error) {
		console.error("Error fetching cars:", error);
		// Fallback to sample data if API is not available
		cars = getSampleCars();
		const filtered =
			filter === "all" ? cars : cars.filter((car) => car.type === filter);
		renderCars(filtered);
	}
}

// Sample data fallback
function getSampleCars() {
	return [
		{
			_id: "1",
			name: "Mercedes-Benz S-Class",
			type: "sedan",
			year: 2024,
			mileage: "5,000 mi",
			price: "$95,000",
			icon: "🚗",
			description: "Luxury sedan with premium features and cutting-edge technology",
			features: [
				"Leather Interior",
				"Panoramic Sunroof",
				"Advanced Safety",
				"Premium Sound",
			],
			available: true,
		},
		{
			_id: "2",
			name: "BMW X5 M Sport",
			type: "suv",
			year: 2024,
			mileage: "8,000 mi",
			price: "$72,000",
			icon: "🚙",
			description: "Spacious luxury SUV perfect for families",
			features: ["All-Wheel Drive", "Third Row Seating", "Apple CarPlay", "Heated Seats"],
			available: true,
		},
		{
			_id: "3",
			name: "Porsche 911 Turbo S",
			type: "sports",
			year: 2023,
			mileage: "3,000 mi",
			price: "$125,000",
			icon: "🏎️",
			description: "High-performance sports car with incredible handling",
			features: [
				"Twin-Turbo Engine",
				"Sport Exhaust",
				"Carbon Fiber",
				"Track Mode",
			],
			available: true,
		},
		{
			_id: "4",
			name: "Audi A6 Quattro",
			type: "sedan",
			year: 2024,
			mileage: "6,500 mi",
			price: "$68,000",
			icon: "🚗",
			description: "Elegant sedan with advanced technology",
			features: [
				"Quattro AWD",
				"Virtual Cockpit",
				"Matrix LED",
				"Massage Seats",
			],
			available: true,
		},
		{
			_id: "5",
			name: "Range Rover Sport",
			type: "suv",
			year: 2023,
			mileage: "12,000 mi",
			price: "$85,000",
			icon: "🚙",
			description: "Luxury SUV with exceptional off-road capability",
			features: [
				"Terrain Response",
				"Air Suspension",
				"Meridian Audio",
				"Panoramic Roof",
			],
			available: true,
		},
		{
			_id: "6",
			name: "Ferrari F8 Tributo",
			type: "sports",
			year: 2024,
			mileage: "1,500 mi",
			price: "$280,000",
			icon: "🏎️",
			description: "Exotic supercar with breathtaking performance",
			features: [
				"V8 Engine",
				"Carbon Ceramic Brakes",
				"Launch Control",
				"Racing Seats",
			],
			available: true,
		},
		{
			_id: "7",
			name: "Bentley Continental GT",
			type: "sedan",
			year: 2024,
			mileage: "2,000 mi",
			price: "$230,000",
			icon: "🚗",
			description: "Ultimate luxury grand tourer",
			features: [
				"W12 Engine",
				"Handcrafted Interior",
				"Naim Audio",
				"Quilted Leather",
			],
			available: true,
		},
		{
			_id: "8",
			name: "Lamborghini Urus",
			type: "suv",
			year: 2024,
			mileage: "4,000 mi",
			price: "$250,000",
			icon: "🚙",
			description: "Super SUV with supercar performance",
			features: [
				"V8 Twin-Turbo",
				"Carbon Fiber",
				"Sport Exhaust",
				"Adaptive Suspension",
			],
			available: true,
		},
	];
}

// Render cars
function renderCars(carsData) {
	const carGrid = document.getElementById("carGrid");

	if (carsData.length === 0) {
		carGrid.innerHTML = '<p style="text-align: center; grid-column: 1/-1; padding: 60px 0; font-size: 1.2rem; color: #666;">No vehicles found matching your criteria.</p>';
		return;
	}

	carGrid.innerHTML = carsData
		.map(
			(car) => `
        <div class="car-card" data-type="${car.type}" onclick="openCarModal('${car._id}')">
            ${car.available ? '<div class="car-badge">Available</div>' : ""}
            <div class="car-image">${car.icon}</div>
            <div class="car-info">
                <div class="car-type">${car.type.toUpperCase()}</div>
                <h3>${car.name}</h3>
                <div class="car-specs">
                    <span>📅 ${car.year}</span>
                    <span>📍 ${car.mileage}</span>
                </div>
                ${
									car.features
										? `
                    <div class="car-features">
                        ${car.features
													.slice(0, 3)
													.map((f) => `<span class="feature-tag">${f}</span>`)
													.join("")}
                    </div>
                `
										: ""
								}
                <div class="car-price">${car.price}</div>
                <button class="view-btn">View Details</button>
            </div>
        </div>
    `
		)
		.join("");
}

// Filter functionality
document.addEventListener("DOMContentLoaded", () => {
	fetchCars();

	const filterButtons = document.querySelectorAll(".filter-btn");
	filterButtons.forEach((btn) => {
		btn.addEventListener("click", () => {
			filterButtons.forEach((b) => b.classList.remove("active"));
			btn.classList.add("active");
			currentFilter = btn.dataset.filter;
			fetchCars(btn.dataset.filter);
		});
	});

	// Smooth scrolling
	document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
		anchor.addEventListener("click", function (e) {
			e.preventDefault();
			const target = document.querySelector(this.getAttribute("href"));
			if (target) {
				target.scrollIntoView({ behavior: "smooth", block: "start" });
			}
		});
	});

	// Hero CTA buttons
	document.querySelectorAll(".hero-buttons .btn-primary").forEach((btn) => {
		btn.addEventListener("click", () => {
			document.getElementById("collection").scrollIntoView({ behavior: "smooth" });
		});
	});

	// Sort functionality
	const sortBy = document.getElementById("sortBy");
	if (sortBy) {
		sortBy.addEventListener("change", (e) => {
			const sortedCars = [...cars];
			switch (e.target.value) {
				case "price-low":
					sortedCars.sort(
						(a, b) =>
							parseInt(a.price.replace(/\D/g, "")) -
							parseInt(b.price.replace(/\D/g, ""))
					);
					break;
				case "price-high":
					sortedCars.sort(
						(a, b) =>
							parseInt(b.price.replace(/\D/g, "")) -
							parseInt(a.price.replace(/\D/g, ""))
					);
					break;
				case "year":
					sortedCars.sort((a, b) => b.year - a.year);
					break;
			}
			renderCars(sortedCars);
		});
	}

	// Contact form
	const contactForm = document.getElementById("contactForm");
	if (contactForm) {
		contactForm.addEventListener("submit", async (e) => {
			e.preventDefault();

			const formData = {
				name: `${e.target[0].value} ${e.target[1].value}`,
				email: e.target[2].value,
				phone: e.target[3].value,
				message: e.target[5].value,
			};

			try {
				const response = await fetch(`${API_URL}/contact`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(formData),
				});

				if (response.ok) {
					alert(
						"Thank you for your message! Our team will contact you within 24 hours."
					);
					e.target.reset();
				} else {
					alert("Something went wrong. Please try again.");
				}
			} catch (error) {
				console.error("Error submitting form:", error);
				alert(
					"Thank you for your message! Our team will contact you within 24 hours."
				);
				e.target.reset();
			}
		});
	}

	// Newsletter form
	const newsletterForm = document.getElementById("newsletterForm");
	if (newsletterForm) {
		newsletterForm.addEventListener("submit", async (e) => {
			e.preventDefault();
			
			const email = e.target[0].value;
			
			try {
				const response = await fetch(`${API_URL}/newsletter/subscribe`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ email }),
				});

				const data = await response.json();
				
				if (response.ok) {
					alert("Thank you for subscribing! You'll receive our latest updates.");
					e.target.reset();
				} else {
					alert(data.message || "Something went wrong. Please try again.");
				}
			} catch (error) {
				console.error("Error subscribing:", error);
				alert("Thank you for subscribing! You'll receive our latest updates.");
				e.target.reset();
			}
		});
	}

	// Testimonials slider
	let currentTestimonial = 0;
	const testimonialCards = document.querySelectorAll(".testimonial-card");
	const prevBtn = document.getElementById("prevTestimonial");
	const nextBtn = document.getElementById("nextTestimonial");

	function showTestimonial(index) {
		testimonialCards.forEach((card, i) => {
			card.style.display = i === index ? "block" : "none";
		});
	}

	if (prevBtn && nextBtn && testimonialCards.length > 0) {
		showTestimonial(0);

		prevBtn.addEventListener("click", () => {
			currentTestimonial =
				currentTestimonial === 0
					? testimonialCards.length - 1
					: currentTestimonial - 1;
			showTestimonial(currentTestimonial);
		});

		nextBtn.addEventListener("click", () => {
			currentTestimonial =
				currentTestimonial === testimonialCards.length - 1
					? 0
					: currentTestimonial + 1;
			showTestimonial(currentTestimonial);
		});

		// Auto-rotate testimonials
		setInterval(() => {
			currentTestimonial =
				currentTestimonial === testimonialCards.length - 1
					? 0
					: currentTestimonial + 1;
			showTestimonial(currentTestimonial);
		}, 5000);
	}
});

// Car detail modal
function openCarModal(id) {
	const modal = document.getElementById("carModal");
	const modalBody = document.getElementById("modalBody");

	const car = cars.find((c) => c._id == id);
	if (!car) return;

	modalBody.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px;">
            <div>
                <div style="width: 100%; height: 400px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; font-size: 8rem; margin-bottom: 20px;">
                    ${car.icon}
                </div>
                ${
									car.features
										? `
                    <div>
                        <h3 style="margin-bottom: 15px;">Features</h3>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                            ${car.features.map((f) => `<div style="padding: 10px; background: #f8f9fa; font-size: 0.9rem;">✓ ${f}</div>`).join("")}
                        </div>
                    </div>
                `
										: ""
								}
            </div>
            <div>
                <div style="color: var(--primary); font-size: 0.9rem; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 10px;">
                    ${car.type}
                </div>
                <h2 style="font-size: 2.5rem; margin-bottom: 20px;">${car.name}</h2>
                <div style="display: flex; gap: 30px; margin-bottom: 30px; font-size: 1.1rem; color: #666;">
                    <span>📅 ${car.year}</span>
                    <span>📍 ${car.mileage}</span>
                    <span>${car.available ? "✓ Available" : "⚠ Reserved"}</span>
                </div>
                <div style="font-size: 3rem; color: var(--primary); font-weight: 700; margin-bottom: 30px;">
                    ${car.price}
                </div>
                ${car.description ? `<p style="font-size: 1.1rem; line-height: 1.8; color: #666; margin-bottom: 30px;">${car.description}</p>` : ""}
                <div style="display: flex; gap: 15px; flex-wrap: wrap;">
                    <button onclick="scheduleTestDrive('${car.name}')" style="flex: 1; padding: 15px 30px; background: var(--primary); color: var(--secondary); border: none; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; cursor: pointer;">
                        Schedule Test Drive
                    </button>
                    <button onclick="contactAboutCar('${car.name}')" style="flex: 1; padding: 15px 30px; background: var(--secondary); color: white; border: none; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; cursor: pointer;">
                        Contact Us
                    </button>
                </div>
                <div style="margin-top: 40px; padding: 30px; background: #f8f9fa;">
                    <h4 style="margin-bottom: 15px;">Financing Available</h4>
                    <p style="color: #666; line-height: 1.6;">We offer flexible financing options with competitive rates. Get pre-approved in minutes.</p>
                    <button onclick="getFinancing('${car.name}')" style="margin-top: 15px; padding: 12px 25px; background: transparent; color: var(--secondary); border: 2px solid var(--secondary); font-weight: 600; cursor: pointer;">
                        Get Financing Quote
                    </button>
                </div>
            </div>
        </div>
    `;

	modal.classList.add("active");
}

function closeCarModal() {
	const modal = document.getElementById("carModal");
	modal.classList.remove("active");
}

// Modal close handlers
document.getElementById("modalClose").addEventListener("click", closeCarModal);
document.getElementById("modalOverlay").addEventListener("click", closeCarModal);

// Car actions
async function scheduleTestDrive(carName) {
	const car = cars.find(c => c.name === carName);
	if (!car) return;
	
	// Create a simple prompt for test drive details
	const customerName = prompt("Please enter your full name:");
	if (!customerName) return;
	
	const email = prompt("Please enter your email:");
	if (!email) return;
	
	const phone = prompt("Please enter your phone number:");
	if (!phone) return;
	
	const preferredDate = prompt("Preferred date (YYYY-MM-DD):");
	if (!preferredDate) return;
	
	const preferredTime = prompt("Preferred time (e.g., 10:00 AM):");
	if (!preferredTime) return;
	
	try {
		const response = await fetch(`${API_URL}/testdrive`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				carId: car._id,
				carName: car.name,
				customerName,
				email,
				phone,
				preferredDate,
				preferredTime,
				message: `Test drive request for ${car.name}`
			}),
		});

		if (response.ok) {
			alert(
				`Thank you for your interest in the ${carName}!\n\nYour test drive has been scheduled. Our team will contact you shortly to confirm.`
			);
		} else {
			alert("Test drive request submitted! Our team will contact you shortly.");
		}
	} catch (error) {
		console.error("Error scheduling test drive:", error);
		alert(
			`Thank you for your interest in the ${carName}!\n\nOur team will contact you shortly to schedule your test drive.`
		);
	}
	
	closeCarModal();
}

function contactAboutCar(carName) {
	closeCarModal();
	document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
	setTimeout(() => {
		const messageField = document.querySelector(
			'#contactForm textarea[placeholder="Your Message"]'
		);
		if (messageField) {
			messageField.value = `I'm interested in the ${carName}. Please contact me with more information.`;
			messageField.focus();
		}
	}, 500);
}

function getFinancing(carName) {
	alert(
		`Financing options for ${carName}\n\nWe'll help you find the best financing solution. Our team will contact you with personalized options.`
	);
}

// Animations on scroll
const observerOptions = {
	threshold: 0.1,
	rootMargin: "0px 0px -100px 0px",
};

const observer = new IntersectionObserver((entries) => {
	entries.forEach((entry) => {
		if (entry.isIntersecting) {
			entry.target.style.opacity = "1";
			entry.target.style.transform = "translateY(0)";
		}
	});
}, observerOptions);

// Observe elements for animation
document.addEventListener("DOMContentLoaded", () => {
	const animateElements = document.querySelectorAll(
		".service-card, .testimonial-card, .car-card"
	);
	animateElements.forEach((el) => {
		el.style.opacity = "0";
		el.style.transform = "translateY(30px)";
		el.style.transition = "all 0.6s ease";
		observer.observe(el);
	});
});

// Duplicate brands track for seamless marquee
const brandsTrack = document.querySelector(".brands-track");
if (brandsTrack) {
	const clone = brandsTrack.cloneNode(true);
	brandsTrack.parentElement.appendChild(clone);
}
