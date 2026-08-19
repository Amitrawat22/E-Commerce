package com.ecommerce.project.config;

import com.ecommerce.project.model.*;
import com.ecommerce.project.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

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
        if (!userRepository.existsByUserName("admin")) {
            User admin = new User("admin", "admin@ecommerce.com", passwordEncoder.encode("admin123"));
            admin.setRoles(Set.of(adminRole, userRole));
            userRepository.save(admin);
            System.out.println("✅ Seeding: Created Admin User (username: admin, password: admin123)");
        }

        // 3. Ensure Demo Customer User Exists (username: john_doe, password: user123)
        if (!userRepository.existsByUserName("john_doe")) {
            User user = new User("john_doe", "john@example.com", passwordEncoder.encode("user123"));
            user.setRoles(Set.of(userRole));
            userRepository.save(user);
            System.out.println("✅ Seeding: Created Customer User (username: john_doe, password: user123)");
        }

        // 4. Seed 100+ Products if product count < 100
        if (productRepository.count() < 100) {
            Category electronics = getOrCreateCategory("Electronics");
            Category fashion = getOrCreateCategory("Fashion & Apparel");
            Category home = getOrCreateCategory("Home & Kitchen");
            Category books = getOrCreateCategory("Books & Stationery");
            Category fitness = getOrCreateCategory("Fitness & Sports");
            Category beauty = getOrCreateCategory("Beauty & Personal Care");

            List<Product> productsToSave = new ArrayList<>();

            // Electronics (25 items)
            String[] elecItems = {
                "UltraHD 4K Smart OLED TV 55 Inch", "Pro Wireless Noise Canceling Headphones", "Smart Watch Ultra GPS & Cellular",
                "Ergonomic Gaming Mouse 16000 DPI", "RGB Mechanical Gaming Keyboard Pro", "Thunderbolt 4 Docking Station",
                "High Speed Wi-Fi 6 Mesh Router", "Portable Bluetooth Speaker Waterproof", "Fast Charging Power Bank 20000mAh",
                "Noise Canceling Earbuds True Wireless", "4K Webcam with Dual Microphones", "External NVMe SSD 1TB USB-C",
                "Smart Home Security Camera 1080p", "Curved Ultrawide Monitor 34 Inch", "Mirrorless Camera 4K Video Kit",
                "Smart Voice Assistant Speaker", "Quad-Core Tablet 10.5 Inch", "Foldable Drone with 4K Camera",
                "Subwoofer Soundbar 300W Dolby", "Universal GaN Fast Charger 65W", "VR Headset Motion Controllers",
                "Wireless Presenter Remote Control", "Digital Drawing Graphics Tablet", "Electric Standing Desk Dual Motor",
                "Smart LED Strip Light Sync RGB"
            };

            // Fashion (25 items)
            String[] fashionItems = {
                "Classic Lambskin Leather Jacket", "Slim Fit Denim Jeans Dark Wash", "100% Organic Cotton Polo T-Shirt",
                "Casual Canvas Sneakers Unisex", "Formal Oxford Dress Shoes Leather", "Waterproof Winter Down Parka",
                "Breathable Running Athletic Shoes", "Vintage Polarized Sunglasses UV400", "Handcrafted Leather Travel Duffle",
                "Tailored Fit Suit Blazer Navy", "Women Silk Evening Wrap Dress", "Comfortable Jogger Sweatpants",
                "Chronograph Stainless Steel Watch", "Lightweight Puffer Vest Sleeveless", "Knit Wool Beanie Hat Winter",
                "Classic Aviator Metal Sunglasses", "Soft Cashmere Sweater V-Neck", "High Waist Athletic Leggings",
                "Floral Summer Beach Sundress", "Genuine Leather Belt Silver Buckle", "Canvas Laptop Backpack 15 Inch",
                "Casual Slip-on Loafers Leather", "Thermal Base Layer Fleece Suit", "Water Resistant Windbreaker Jacket",
                "Designer Minimalist Wallet Cardholder"
            };

            // Home & Kitchen (25 items)
            String[] homeItems = {
                "Automatic Espresso Machine Barista", "Air Fryer Oven XL 6-in-1", "Robotic Vacuum Cleaner Mop Combo",
                "Non-Stick Ceramic Cookware 10-Piece", "High Speed Blender 1500W Smoothie", "Stainless Steel French Press Coffee",
                "Ergonomic Memory Foam Pillow", "Luxury Egyptian Cotton Sheet Set", "Cast Iron Dutch Oven 6-Quart",
                "Smart Electric Kettle Temperature", "Compact Countertop Microwave Oven", "Stainless Steel Knife Set Block",
                "HEPA Air Purifier Quiet Bedroom", "Ultrasonic Cool Mist Humidifier", "Handheld Cordless Vacuum Cleaner",
                "Insulated Stainless Steel Water Bottle", "Chef Precision Digital Food Scale", "Automatic Bread Maker 2lb Pan",
                "Electric Pressure Cooker 7-in-1", "Bamboo Cutting Board Heavy Duty", "Silicone Baking Mat Set Non-stick",
                "Modern Table Lamp Touch Dimmer", "Aromatherapy Essential Oil Diffuser", "Stainless Steel Trash Can Motion",
                "Microfiber Spin Mop Bucket System"
            };

            // Books & Stationery (20 items)
            String[] bookItems = {
                "Clean Code: Handbook of Agile Craft", "Design Patterns: Reusable Object Oriented", "The Pragmatic Programmer 20th Anniversary",
                "Refactoring: Improving Existing Code", "System Design Interview Insider Guide", "Database Internals: Storage & Architecture",
                "Designing Data-Intensive Applications", "Introduction to Algorithms 4th Edition", "Atomic Habits: Easy & Proven Way", "The Psychology of Money Timeless Lessons",
                "Deep Work: Rules for Focused Success", "Zero to One: Notes on Startups", "Sapiens: Brief History of Humankind",
                "Thinking, Fast and Slow Paperback", "Rich Dad Poor Dad Financial Education", "Executive Leather Journal Notebook",
                "Fountain Pen Fine Nib Refillable", "Ergonomic Gel Pen Set 12 Colors", "Adjustable Desktop Book Stand Metal",
                "Minimalist Weekly Desk Planner Pad"
            };

            // Fitness & Sports (15 items)
            String[] fitnessItems = {
                "Adjustable Dumbbells Set 50lbs", "Non-Slip Eco Yoga Mat 6mm Thick", "Resistance Exercise Bands 5-Piece",
                "Smart Jump Rope Speed Counter", "Deep Tissue Muscle Massage Gun", "Foldable Treadmill Walking Pad",
                "Indoor Stationary Cycling Bike", "Ab Roller Wheel Automatic Rebound", "Heavy Duty Pull Up Bar Doorway",
                "Weighted Vest for Workouts 20lbs", "Hydration Running Belt Waist Pack", "Gym Gym Bag Shoe Compartment",
                "Foam Roller High Density Muscle", "Agility Ladder Speed Training Kit", "Kettlebell Solid Cast Iron 25lbs"
            };

            // Beauty & Personal Care (15 items)
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
