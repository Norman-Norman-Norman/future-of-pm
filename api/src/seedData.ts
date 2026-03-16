import { Supplier } from './models/supplier';
import { Product } from './models/product';
import { Review } from './models/review';
import { Headquarters } from './models/headquarters';
import { Branch } from './models/branch';
import { Order } from './models/order';
import { OrderDetail } from './models/orderDetail';
import { Delivery } from './models/delivery';
import { OrderDetailDelivery } from './models/orderDetailDelivery';

// Suppliers
export const suppliers: Supplier[] = [
    {
        supplierId: 1,
        name: "PurrTech Innovations",
        description: "Leading supplier of premium smart cat technology",
        contactPerson: "Felix Whiskerton",
        email: "felix@purrtech.co",
        phone: "555-0101"
    },
    {
        supplierId: 2,
        name: "WhiskerWare Systems",
        description: "Advanced feline-focused smart product supplier",
        contactPerson: "Tabitha Pawson",
        email: "tabitha@whiskerware.com",
        phone: "555-0102"
    },
    {
        supplierId: 3,
        name: "CatNip Creations",
        description: "Supplier of eco-friendly cat toys and accessories",
        contactPerson: "Nina Nibbles",
        email: "nina@catnip.com",
        phone: "555-0103"
    }
];

// Products
export const products: Product[] = [
    {
        productId: 13,
        supplierId: 1,
        name: "GitHub Copilot Chef's Hat",
        description: "The purrfect headwear for the coding chef in your life. This premium AI-powered chef's hat features the iconic GitHub Copilot logo embroidered in signature blue and is crafted from breathable, stain-resistant fabric designed to withstand both kitchen splatters and late-night coding sessions. Whether you're cooking up a gourmet meal or cooking up a deploy, this hat keeps you looking sharp. One size fits most humans (and ambitious cats).",
        price: 72.99,
        sku: "GHCP-HAT-001",
        unit: "piece",
        imgName: "GHCP_ChefsHat.png",
        images: ["GHCP_ChefsHat.png"],
        averageRating: 4.7,
        reviewCount: 12,
        specifications: {
            "Material": "Breathable cotton-blend",
            "Size": "One size fits most",
            "Care": "Machine washable",
            "Logo": "Embroidered GitHub Copilot"
        }
    },
    {
        productId: 1,
        supplierId: 3,
        name: "SmartFeeder One",
        description: "This AI-powered feeder learns your cat's snack schedule based on nap cycles and mealtime habits. It detects overeating, undernapping, and auto-updates a Feline Health Repo.",
        price: 129.99,
        sku: "CAT-FEED-001",
        unit: "piece",
        imgName: "feeder.png",
        discount: 0.25,
        images: ["feeder.png"],
        averageRating: 4.5,
        reviewCount: 34,
        specifications: {
            "Capacity": "4 lbs dry food",
            "Power": "AC adapter + battery backup",
            "Connectivity": "Wi-Fi 2.4GHz",
            "App": "iOS & Android",
            "Dimensions": "10\" x 10\" x 16\""
        }
    },
    {
        productId: 2,
        supplierId: 3,
        name: "AutoClean Litter Dome",
        description: "A self-cleaning litter box that detects patterns in your cat's... commits. Sends you a health report and Slack alert if things look off.",
        price: 199.99,
        sku: "CAT-LITTER-001",
        unit: "piece",
        imgName: "litter-box.png",
        discount: 0.25,
        images: ["litter-box.png"],
        averageRating: 4.2,
        reviewCount: 58,
        specifications: {
            "Capacity": "Up to 15 lbs litter",
            "Cycle Time": "20 minutes after use",
            "Power": "AC adapter required",
            "Waste Drawer": "Removable, odor-sealed",
            "Dimensions": "22\" x 22\" x 26\""
        }
    },
    {
        productId: 3,
        supplierId: 2,
        name: "CatFlix Entertainment Portal",
        description: "On-demand laser shows, motion videos, and bird-watching streams - customized per cat using AI interest tracking. Think Netflix, but for felines.",
        price: 89.99,
        sku: "CAT-FLIX-001",
        unit: "piece",
        imgName: "catflix.png",
        images: ["catflix.png"],
        averageRating: 4.8,
        reviewCount: 21,
        specifications: {
            "Display": "7\" HD touchscreen",
            "Content": "500+ hours of feline programming",
            "Connectivity": "Wi-Fi + Bluetooth",
            "Laser": "Class 1 safe laser module",
            "Power": "USB-C"
        }
    },
    {
        productId: 4,
        supplierId: 2,
        name: "PawTrack Smart Collar",
        description: "GPS and activity tracker with AI-powered mood detection based on tail position, purring frequency, and movement patterns. Syncs with your phone for walk stats and zoomie alerts.",
        price: 79.99,
        sku: "CAT-COLLAR-001",
        unit: "piece",
        imgName: "smart-collar.png",
        images: ["smart-collar.png"],
        averageRating: 4.3,
        reviewCount: 47,
        specifications: {
            "GPS Accuracy": "±3 meters",
            "Battery Life": "7 days",
            "Water Resistance": "IPX7",
            "Weight": "18g",
            "Sizes": "XS, S, M"
        }
    },
    {
        productId: 5,
        supplierId: 1,
        name: "SleepNest ThermoPod",
        description: "A smart bed that adjusts its temperature, lighting, and white noise based on your cat's REM cycles. Auto-generates nap metrics in JSON.",
        price: 149.99,
        sku: "CAT-BED-001",
        unit: "piece",
        imgName: "sleep-nest.png",
        images: ["sleep-nest.png"],
        averageRating: 4.6,
        reviewCount: 29,
        specifications: {
            "Temperature Range": "68°F – 104°F",
            "Lighting": "Adjustable warm LED",
            "Sound": "10 white noise modes",
            "Material": "Orthopedic memory foam",
            "Dimensions": "24\" x 20\" x 8\""
        }
    },
    {
        productId: 6,
        supplierId: 1,
        name: "ClawMate Auto Groomer",
        description: "Your cat brushes itself. This AI station detects which areas need grooming, dispenses treats for patience, and logs grooming history to your pet portal.",
        price: 119.99,
        sku: "CAT-GROOM-001",
        unit: "piece",
        imgName: "auto-groomer.png",
        images: ["auto-groomer.png"],
        averageRating: 4.1,
        reviewCount: 16,
        specifications: {
            "Brush Type": "Rotating soft-bristle",
            "Treat Capacity": "50 treats",
            "Power": "USB-C rechargeable",
            "Noise Level": "<40 dB",
            "Weight": "1.2 lbs"
        }
    },
    {
        productId: 7,
        supplierId: 3,
        name: "Smart Fountain Flow+",
        description: "This water fountain adjusts flow patterns based on time of day, cat hydration levels, and even playfulness. Uses facial recognition to distinguish multiple cats.",
        price: 69.99,
        sku: "CAT-FOUNTAIN-001",
        unit: "piece",
        imgName: "smart-fountain.png",
        discount: 0.25,
        images: ["smart-fountain.png"],
        averageRating: 4.4,
        reviewCount: 63,
        specifications: {
            "Capacity": "2.5 liters",
            "Filter": "Triple-stage charcoal",
            "Noise Level": "<25 dB",
            "Power": "5V DC adapter",
            "Material": "BPA-free plastic"
        }
    },
    {
        productId: 8,
        supplierId: 2,
        name: "ScratchPad Pro",
        description: "More than a scratcher - this one detects scratching habits, gamifies it with leaderboard stats for multi-cat homes, and awards digital badges.",
        price: 59.99,
        sku: "CAT-SCRATCH-001",
        unit: "piece",
        imgName: "scratch-pad.png",
        images: ["scratch-pad.png"],
        averageRating: 4.0,
        reviewCount: 38,
        specifications: {
            "Surface": "Sisal rope + cardboard combo",
            "Display": "2\" LCD leaderboard screen",
            "Sensors": "Pressure + capacitive touch",
            "Power": "3x AA batteries",
            "Dimensions": "18\" x 12\" x 24\""
        }
    },
    {
        productId: 9,
        supplierId: 2,
        name: "ChirpCam Window Mount",
        description: "Motion-activated smart cam that records wildlife outside the window and sends curated 'Birdflix' highlights to your cat's personal feed.",
        price: 99.99,
        sku: "CAT-CAM-001",
        unit: "piece",
        imgName: "chirp-cam.png",
        images: ["chirp-cam.png"],
        averageRating: 4.5,
        reviewCount: 19,
        specifications: {
            "Resolution": "1080p HD",
            "Field of View": "120°",
            "Night Vision": "IR up to 10ft",
            "Storage": "32GB SD card included",
            "Mounting": "Suction cup + adhesive"
        }
    },
    {
        productId: 10,
        supplierId: 3,
        name: "SnackVault Puzzle Dispenser",
        description: "Treat puzzle toy that evolves in difficulty with your cat's cleverness. AI engine auto-adjusts pathways and provides tips to the human if the cat cheats.",
        price: 49.99,
        sku: "CAT-SNACK-001",
        unit: "piece",
        imgName: "snack-vault.png",
        discount: 0.25,
        images: ["snack-vault.png"],
        averageRating: 4.7,
        reviewCount: 52,
        specifications: {
            "Difficulty Levels": "5 (auto-adjusting)",
            "Treat Capacity": "1 cup",
            "Material": "Food-safe ABS plastic",
            "Power": "2x AAA batteries",
            "Dimensions": "12\" x 12\" x 4\""
        }
    },
    {
        productId: 11,
        supplierId: 1,
        name: "DoorDash Pet Portal",
        description: "Smart cat door with facial recognition and time-based access. Prevents midnight squirrel parties and tracks in/out commits to your dashboard.",
        price: 159.99,
        sku: "CAT-DOOR-001",
        unit: "piece",
        imgName: "door-dash.png",
        images: ["door-dash.png"],
        averageRating: 4.3,
        reviewCount: 27,
        specifications: {
            "Opening Size": "6.3\" x 7.1\"",
            "Recognition": "Up to 10 pet profiles",
            "Power": "4x AA batteries",
            "Insulation": "Dual-flap magnetic seal",
            "Installation": "Fits doors 0.4\"–1.4\" thick"
        }
    },
    {
        productId: 12,
        supplierId: 2,
        name: "ZoomieTracker AI Mat",
        description: "A motion-sensing mat that detects zoomies, spins up chase lights, and logs agility bursts to a weekly health report. Yes, it graphs zoomies per hour.",
        price: 79.99,
        sku: "CAT-TRACKER-001",
        unit: "piece",
        imgName: "tracker-mat.png",
        images: ["tracker-mat.png"],
        averageRating: 4.6,
        reviewCount: 41,
        specifications: {
            "Sensors": "Pressure + IR motion grid",
            "Surface": "Non-slip rubberized fabric",
            "Lights": "RGB LED chase strip",
            "Power": "USB-C",
            "Dimensions": "36\" x 24\""
        }
    }
];

// Headquarters
export const headquarters: Headquarters[] = [
    {
        headquartersId: 1,
        name: "CatTech Global HQ",
        description: "Feline tech innovations headquarters",
        address: "123 Whisker Lane, Purrington District",
        contactPerson: "Catherine Purrston",
        email: "catherine@octocat.com",
        phone: "555-0001"
    }
];

// Branches
export const branches: Branch[] = [
    {
        branchId: 1,
        headquartersId: 1,
        name: "Meowtown Branch",
        description: "Main downtown cat tech showroom",
        address: "456 Purrfect Plaza",
        contactPerson: "Chloe Whiskers",
        email: "cwhiskers@octocat.com",
        phone: "555-0201"
    },
    {
        branchId: 2,
        headquartersId: 1,
        name: "Tabby Terrace Branch",
        description: "Western district cat tech hub",
        address: "789 Feline Avenue",
        contactPerson: "Tom Pouncer",
        email: "tpouncer@octocat.com",
        phone: "555-0202"
    }
];

// Orders
export const orders: Order[] = [
    {
        orderId: 1,
        branchId: 1,
        orderDate: new Date().toISOString(),
        name: "Q2 Feline Tech Refresh",
        description: "Quarterly smart cat tech product refresh",
        status: "pending"
    },
    {
        orderId: 2,
        branchId: 2,
        orderDate: new Date().toISOString(),
        name: "Cat Enrichment Bundle",
        description: "Monthly cat entertainment systems restock",
        status: "processing"
    }
];

// Order Details
export const orderDetails: OrderDetail[] = [
    {
        orderDetailId: 1,
        orderId: 1,
        productId: 2,
        quantity: 5,
        unitPrice: 199.99,
        notes: "AutoClean Litter Domes for new cat café locations"
    },
    {
        orderDetailId: 2,
        orderId: 1,
        productId: 3,
        quantity: 5,
        unitPrice: 89.99,
        notes: "CatFlix Entertainment Portals for waiting areas"
    },
    {
        orderDetailId: 3,
        orderId: 2,
        productId: 4,
        quantity: 20,
        unitPrice: 79.99,
        notes: "PawTrack Smart Collars for adoption events"
    }
];

// Deliveries
export const deliveries: Delivery[] = [
    {
        deliveryId: 1,
        supplierId: 1,
        deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        name: "PurrTech Smart Home Bundle",
        description: "Premium cat tech products delivery for smart cat homes",
        status: "pending"
    },
    {
        deliveryId: 2,
        supplierId: 2,
        deliveryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
        name: "WhiskerWare Entertainment Package",
        description: "Entertainment and tracking systems for feline companions",
        status: "in-transit"
    }
];

// Order Detail Deliveries
export const orderDetailDeliveries: OrderDetailDelivery[] = [
    {
        orderDetailDeliveryId: 1,
        orderDetailId: 1,
        deliveryId: 1,
        quantity: 5,
        notes: "Delivery batch"
    },
    {
        orderDetailDeliveryId: 2,
        orderDetailId: 2,
        deliveryId: 1,
        quantity: 5,
        notes: "Delivery batch"
    },
    {
        orderDetailDeliveryId: 3,
        orderDetailId: 3,
        deliveryId: 2,
        quantity: 20,
        notes: "Delivery"
    }
];

// Reviews
export const reviews: Review[] = [
    // SmartFeeder One (productId: 1)
    {
        reviewId: 1,
        productId: 1,
        rating: 5,
        title: "My cat controls meal times now",
        body: "Set it up in under 10 minutes and our tabby Biscuit figured out the schedule within a day. The health reports are genuinely useful — caught a dip in appetite before we even noticed.",
        authorName: "Marcus T.",
        createdAt: "2026-02-15T10:22:00.000Z",
        helpful: 14
    },
    {
        reviewId: 2,
        productId: 1,
        rating: 4,
        title: "Great feeder, app could be better",
        body: "The hardware is solid and the AI schedule is surprisingly accurate. The companion app crashes occasionally on Android but the web dashboard works perfectly.",
        authorName: "Priya S.",
        createdAt: "2026-01-28T14:05:00.000Z",
        helpful: 9
    },
    {
        reviewId: 3,
        productId: 1,
        rating: 4,
        title: "Worth every penny for multi-cat homes",
        body: "We have three cats with different dietary needs. This feeder handles all three profiles without confusion. Setup takes a bit of patience but the result is fantastic.",
        authorName: "Elena R.",
        createdAt: "2026-01-10T08:47:00.000Z",
        helpful: 22
    },
    // AutoClean Litter Dome (productId: 2)
    {
        reviewId: 4,
        productId: 2,
        rating: 5,
        title: "Never scooping again",
        body: "After three months, I cannot imagine going back to manual scooping. The Slack health alerts saved us a vet visit when it flagged unusual patterns early.",
        authorName: "David K.",
        createdAt: "2026-02-20T09:15:00.000Z",
        helpful: 31
    },
    {
        reviewId: 5,
        productId: 2,
        rating: 4,
        title: "Noisy but worth it",
        body: "The cleaning cycle is louder than I expected — about 55 dB. Our cat was spooked for the first week but now ignores it completely. Health reporting is excellent.",
        authorName: "Carmen D.",
        createdAt: "2026-02-01T16:30:00.000Z",
        helpful: 18
    },
    {
        reviewId: 6,
        productId: 2,
        rating: 3,
        title: "Good concept, occasional jams",
        body: "Works great 90% of the time. Occasionally gets jammed with clumping litter and requires manual intervention. Support team was responsive and helpful.",
        authorName: "Gary P.",
        createdAt: "2026-01-05T11:20:00.000Z",
        helpful: 12
    },
    // CatFlix Entertainment Portal (productId: 3)
    {
        reviewId: 7,
        productId: 3,
        rating: 5,
        title: "My cat is obsessed",
        body: "Luna watches the bird streams for hours. The AI figured out she prefers finches over robins in less than a week. The laser show at 3pm keeps her from knocking things off my desk.",
        authorName: "Yuki N.",
        createdAt: "2026-02-18T13:40:00.000Z",
        helpful: 27
    },
    {
        reviewId: 8,
        productId: 3,
        rating: 5,
        title: "Best cat enrichment device ever made",
        body: "I was skeptical but this genuinely reduced our cat's anxiety-driven behavior. Vet confirmed he's calmer and more active. Worth every cent.",
        authorName: "Sophie W.",
        createdAt: "2026-01-22T10:05:00.000Z",
        helpful: 19
    },
    {
        reviewId: 9,
        productId: 3,
        rating: 4,
        title: "Impressive tech, small screen",
        body: "The content library is remarkable and the personalization is spot-on. Only gripe is the 7\" screen — wish it was larger for multi-cat viewing.",
        authorName: "Kenji T.",
        createdAt: "2025-12-30T15:55:00.000Z",
        helpful: 8
    },
    // PawTrack Smart Collar (productId: 4)
    {
        reviewId: 10,
        productId: 4,
        rating: 5,
        title: "Found my cat in 3 minutes",
        body: "Our cat escaped through a torn screen. Had GPS coordinates on my phone within 60 seconds. Found her 200 yards away hiding under a deck. This collar paid for itself that day.",
        authorName: "Aisha J.",
        createdAt: "2026-02-12T08:30:00.000Z",
        helpful: 45
    },
    {
        reviewId: 11,
        productId: 4,
        rating: 4,
        title: "Accurate tracking, slight bulk",
        body: "GPS is impressively accurate — within a few meters consistently. The collar is slightly heavier than our cat's previous one but she adjusted within a few days.",
        authorName: "Tom W.",
        createdAt: "2026-01-18T14:22:00.000Z",
        helpful: 11
    },
    {
        reviewId: 12,
        productId: 4,
        rating: 4,
        title: "Mood detection is surprisingly good",
        body: "I was most curious about the mood detection and it's genuinely accurate. It flagged 'stressed' before thunderstorms before we noticed any behavioral change ourselves.",
        authorName: "Nina C.",
        createdAt: "2025-12-15T09:10:00.000Z",
        helpful: 16
    },
    // SleepNest ThermoPod (productId: 5)
    {
        reviewId: 13,
        productId: 5,
        rating: 5,
        title: "Cat won't sleep anywhere else now",
        body: "Within 48 hours of setup, our senior cat chose the ThermoPod over every other sleeping spot in the house. Her arthritis flare-ups have noticeably decreased.",
        authorName: "Helen M.",
        createdAt: "2026-02-08T11:00:00.000Z",
        helpful: 23
    },
    {
        reviewId: 14,
        productId: 5,
        rating: 4,
        title: "Nap metrics are surprisingly informative",
        body: "I bought this expecting a gimmick. The REM cycle data is legitimately useful — our vet used the sleep data to adjust our cat's medication timing.",
        authorName: "Dr. Osei",
        createdAt: "2026-01-25T16:45:00.000Z",
        helpful: 30
    },
    // Smart Fountain Flow+ (productId: 7)
    {
        reviewId: 15,
        productId: 7,
        rating: 5,
        title: "Solved our cat's chronic dehydration",
        body: "Our vet recommended increasing water intake. Since switching to this fountain, kidney enzyme levels are back to normal at the last checkup. The flow adjustment throughout the day is clever.",
        authorName: "Lisa O.",
        createdAt: "2026-02-25T10:30:00.000Z",
        helpful: 38
    },
    {
        reviewId: 16,
        productId: 7,
        rating: 4,
        title: "Ultra quiet and multi-cat friendly",
        body: "Handles our four cats without any territorial disputes over the fountain. The facial recognition to log individual drinking amounts is a nice touch for a multi-cat home.",
        authorName: "Elena R.",
        createdAt: "2026-01-30T13:15:00.000Z",
        helpful: 21
    },
    {
        reviewId: 17,
        productId: 7,
        rating: 4,
        title: "Filter lasts longer than advertised",
        body: "Three months in and still on the first filter with crystal-clear water. Great value at this price point, especially with the discount.",
        authorName: "Brenda L.",
        createdAt: "2026-01-12T09:05:00.000Z",
        helpful: 14
    },
    // SnackVault Puzzle Dispenser (productId: 10)
    {
        reviewId: 18,
        productId: 10,
        rating: 5,
        title: "My genius cat met his match",
        body: "Our Bengal has outsmarted every puzzle toy we've bought. This one keeps adjusting the difficulty and he's completely engaged. Three months later and he hasn't 'beaten' it yet.",
        authorName: "Brian K.",
        createdAt: "2026-02-22T14:20:00.000Z",
        helpful: 29
    },
    {
        reviewId: 19,
        productId: 10,
        rating: 5,
        title: "Amazing for weight management",
        body: "Vet recommended puzzle feeders to slow down our overweight cat. This one does it perfectly AND provides mental enrichment. Down 0.4 lbs in 6 weeks.",
        authorName: "Carmen D.",
        createdAt: "2026-02-05T11:40:00.000Z",
        helpful: 17
    },
    {
        reviewId: 20,
        productId: 10,
        rating: 4,
        title: "Works as advertised, treat size matters",
        body: "Works great with small treats but the pathways can get stuck with larger treats. Stick to kibble-sized treats and it's flawless.",
        authorName: "Javier M.",
        createdAt: "2026-01-20T08:55:00.000Z",
        helpful: 12
    }
];