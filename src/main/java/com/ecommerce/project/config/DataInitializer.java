package com.ecommerce.project.config;

import com.ecommerce.project.model.*;
import com.ecommerce.project.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    CategoryRepository categoryRepository;

    @Autowired
    ProductRepository productRepository;

    @Autowired
    ReviewRepository reviewRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        // 1. Ensure Roles Exist
        Role userRole = roleRepository.findByRoleName(AppRole.ROLE_USER)
                .orElseGet(() -> roleRepository.save(new Role(AppRole.ROLE_USER)));

        Role sellerRole = roleRepository.findByRoleName(AppRole.ROLE_SELLER)
                .orElseGet(() -> roleRepository.save(new Role(AppRole.ROLE_SELLER)));

        Role adminRole = roleRepository.findByRoleName(AppRole.ROLE_ADMIN)
                .orElseGet(() -> roleRepository.save(new Role(AppRole.ROLE_ADMIN)));

        // 2. Ensure Admin User Exists (username: admin, password: admin123)
        User adminUser = userRepository.findByUserName("admin").orElse(null);
        if (adminUser == null) {
            adminUser = new User("admin", "admin@ecommerce.com", passwordEncoder.encode("admin123"));
            adminUser.setRoles(Set.of(adminRole, userRole));
            adminUser = userRepository.save(adminUser);
            System.out.println("✅ Seeding: Created Admin User (username: admin, password: admin123)");
        }

        // 3. Ensure Demo Customer User Exists (username: john_doe, password: user123)
        User johnUser = userRepository.findByUserName("john_doe").orElse(null);
        if (johnUser == null) {
            johnUser = new User("john_doe", "john@example.com", passwordEncoder.encode("user123"));
            johnUser.setRoles(Set.of(userRole));
            johnUser = userRepository.save(johnUser);
            System.out.println("✅ Seeding: Created Customer User (username: john_doe, password: user123)");
        }

        // 4. Ensure Catalog Categories & Products Exist
        if (productRepository.count() == 0) {
            Category electronics = getOrCreateCategory("Electronics");
            Category fashion = getOrCreateCategory("Fashion");
            Category home = getOrCreateCategory("Home & Kitchen");
            Category books = getOrCreateCategory("Books & Stationery");
            Category fitness = getOrCreateCategory("Fitness & Sports");
            Category beauty = getOrCreateCategory("Beauty & Personal Care");

            List<Product> productsToSave = new ArrayList<>();

            String[] elecItems = {
                "Wireless Noise-Canceling Headphones", "Smart Fitness Watch Waterproof", "4K Ultra HD Smart LED TV 55-inch",
                "Ergonomic Wireless Optical Mouse", "Mechanical Gaming Keyboard RGB", "Portable Bluetooth Speaker 20W",
                "High-Capacity Power Bank 20000mAh", "True Wireless Earbuds IPX7", "Fast Charging USB-C Hub 7-in-1",
                "Full HD Webcam 1080p Autofocus", "Smart Home Security Camera 360", "Portable SSD 1TB High-Speed",
                "Noise-Canceling USB Headset Mic", "Wireless Charging Pad Dual 15W", "Smart Wi-Fi Router Tri-Band"
            };

            String[] fashionItems = {
                "Classic Leather Jacket for Men", "Slim Fit Denim Jeans Stretch", "Casual Cotton T-Shirt Pack of 3",
                "Women Floral Summer Maxi Dress", "Lightweight Running Sneakers", "Polarized Aviator Sunglasses",
                "Genuine Leather Minimalist Wallet", "Water Resistant Sports Windbreaker", "Fleece Pullover Hoodie Unisex",
                "Stainless Steel Quartz Watch", "Canvas Casual Messenger Bag", "Wool Blend Winter Scarf", "Thermal Compression Base Layer",
                "Ankle Boots Waterproof Synthetic", "Athletic Performance Shorts 2-in-1"
            };

            String[] homeItems = {
                "Espresso Coffee Maker 15-Bar", "Air Fryer Oven Digital 5L", "Robot Vacuum Cleaner Smart Mapping",
                "Non-Stick Ceramic Cookware Set 10-Piece", "Stainless Steel Electric Kettle 1.7L", "Memory Foam Pillow Ergonomic",
                "High-Speed Stand Blender 1200W", "Adjustable Desk Lamp LED Touch", "Aromatherapy Essential Oil Diffuser",
                "Stainless Steel Insulated Tumbler 30oz", "Digital Kitchen Scale Precision", "Cast Iron Dutch Oven 5-Quart",
                "Microfiber Sheet Set Queen 4-Piece", "Automatic Milk Frother & Steamer", "Handheld Garment Steamer Portable"
            };

            String[] bookItems = {
                "Clean Code A Handbook of Agile Craftsmanship", "The Pragmatic Programmer 20th Anniversary", "Design Patterns Elements of Reusable Software",
                "System Design Interview An Insider Guide", "Atomic Habits Tiny Changes Remarkable Results", "Deep Work Rules for Focused Success",
                "Thinking Fast and Slow Daniel Kahneman", "Zero to One Notes on Startups", "Psychology of Money Morgan Housel",
                "Hard Things About Hard Things Ben Horowitz", "Refactoring Improving Design of Existing Code", "Grokking Algorithms Illustrated Guide",
                "Fountain Pen Fine Nib Refillable", "Ergonomic Gel Pen Set 12 Colors", "Adjustable Desktop Book Stand Metal"
            };

            String[] fitnessItems = {
                "Adjustable Dumbbells Set 50lbs", "Non-Slip Eco Yoga Mat 6mm Thick", "Resistance Exercise Bands 5-Piece",
                "Smart Jump Rope Speed Counter", "Deep Tissue Muscle Massage Gun", "Foldable Treadmill Walking Pad",
                "Indoor Stationary Cycling Bike", "Ab Roller Wheel Automatic Rebound", "Heavy Duty Pull Up Bar Doorway",
                "Weighted Vest for Workouts 20lbs", "Hydration Running Belt Waist Pack", "Gym Bag Shoe Compartment",
                "Foam Roller High Density Muscle", "Agility Ladder Speed Training Kit", "Kettlebell Solid Cast Iron 25lbs"
            };

            String[] beautyItems = {
                "Sonic Electric Toothbrush Smart Sensor", "Professional Hair Dryer Negative Ionic", "Beard Grooming Kit Oil & Balm",
                "Hydrating Facial Cleanser Gentle", "Vitamin C Serum Anti-Aging Skin", "Sunscreen SPF 50 Broad Spectrum",
                "Moisturizing Cream Hyaluronic Acid", "Facial Roller Rose Quartz Gua Sha", "Deep Cleansing Clay Mask Detox",
                "Organic Argan Oil Hair Treatment", "Electric Facial Cleansing Brush", "Nail Care Manicure Pedicure Set",
                "Hot Air Brush Styler Hair Dryer", "Natural Lip Balm Set 4 Flavors", "Exfoliating Body Scrub Sea Salt"
            };

            Random random = new Random(42);

            buildCategoryProducts(productsToSave, electronics, elecItems, 1200.0, 35000.0, random);
            buildCategoryProducts(productsToSave, fashion, fashionItems, 500.0, 12000.0, random);
            buildCategoryProducts(productsToSave, home, homeItems, 800.0, 25000.0, random);
            buildCategoryProducts(productsToSave, books, bookItems, 300.0, 3500.0, random);
            buildCategoryProducts(productsToSave, fitness, fitnessItems, 400.0, 22000.0, random);
            buildCategoryProducts(productsToSave, beauty, beautyItems, 250.0, 8000.0, random);

            productRepository.saveAll(productsToSave);
            System.out.println("✅ Seeding Complete: Successfully populated " + productsToSave.size() + " products in PostgreSQL!");
        }

        // 5. Seed Global Real Customer Reviews Across Countries if no reviews exist
        if (reviewRepository.count() == 0) {
            Product headPhones = productRepository.findById(1L).orElse(null);
            if (headPhones != null && johnUser != null) {
                seedGlobalReview(headPhones, johnUser, 5, "Unmatched ANC on Tokyo Shinkansen Commute", "Active Noise Cancellation isolates high speed bullet train noise exceptionally well. Earpads are soft and breathable during Tokyo humid summer.", "Tokyo, Japan");
                seedGlobalReview(headPhones, johnUser, 4, "Sturdy in Cold Scottish Winters", "Operates perfectly in Edinburgh winter weather down to 0°C. Battery life drops only slightly around 10%.", "Edinburgh, Scotland (UK)");
                seedGlobalReview(headPhones, johnUser, 5, "Essential for NYC Subway & Flight", "Blocks out subway screech completely. 30 hour battery stamina got me through JFK to London flight with 40% left.", "New York, USA");
                seedGlobalReview(headPhones, johnUser, 4, "Great Sound in Tropical Heat", "Excellent acoustic clarity! Synthetic leather cushions cause slight ear warmth in 34°C Mumbai monsoon humidity.", "Mumbai, India");
                seedGlobalReview(headPhones, johnUser, 5, "Smooth Bluetooth in Berlin Metro", "Zero signal drops in crowded Alexanderplatz station. High fidelity bass response.", "Berlin, Germany");
            }

            Product leatherJacket = productRepository.findById(16L).orElse(null);
            if (leatherJacket != null && johnUser != null) {
                seedGlobalReview(leatherJacket, johnUser, 5, "Butter Soft Sheepskin for London Autumn", "Zero break-in period required! Keeps wind out during cool London autumn evenings.", "London, UK");
                seedGlobalReview(leatherJacket, johnUser, 4, "Great for Sydney Two-Wheeler Rides", "Superb windblocking on my motorcycle commute. Quilted lining is comfortable.", "Sydney, Australia");
                seedGlobalReview(leatherJacket, johnUser, 3, "Too Warm for Daytime Bangkok", "Beautiful leather craftsmanship, but quilted lining makes it too hot for humid summer daytime in Thailand.", "Bangkok, Thailand");
                seedGlobalReview(leatherJacket, johnUser, 5, "Stylish Fit in Chicago Fall", "Looks like a $500 jacket. Perfect layer for 10°C Windy City fall weather.", "Chicago, USA");
            }

            System.out.println("✅ Seeding Complete: Successfully populated authentic Global Customer Reviews!");
        }
    }

    private void seedGlobalReview(Product p, User u, int rating, String title, String comment, String location) {
        Review r = new Review();
        r.setProduct(p);
        r.setUser(u);
        r.setRating(rating);
        r.setTitle(title);
        r.setComment(comment);
        r.setUserLocation(location);
        r.setCreatedAt(LocalDateTime.now().minusDays(new Random().nextInt(30)));
        reviewRepository.save(r);
    }

    private Category getOrCreateCategory(String name) {
        Category cat = categoryRepository.findBycategoryName(name);
        if (cat == null) {
            cat = categoryRepository.save(new Category(null, name, null));
        }
        return cat;
    }

    private void buildCategoryProducts(List<Product> list, Category category, String[] names, double minPrice, double maxPrice, Random random) {
        for (String name : names) {
            double price = minPrice + (maxPrice - minPrice) * random.nextDouble();
            price = Math.round(price * 100.0) / 100.0;
            double discount = random.nextInt(6) * 5.0; // 0%, 5%, 10%, 15%, 20%, 25%
            double specialPrice = Math.round((price - (price * discount / 100.0)) * 100.0) / 100.0;
            int qty = 5 + random.nextInt(95);

            String desc = "Premium quality " + name + " featuring durable construction, top-tier performance, and ergonomic modern design for maximum satisfaction.";

            list.add(new Product(null, name, "default.png", desc, qty, price, discount, specialPrice, category, null, null));
        }
    }
}
