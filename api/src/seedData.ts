import { Supplier } from './models/supplier';
import { Product } from './models/product';
import { ProductReview } from './models/productReview';
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
        imgName: "GHCP_ChefsHat.png"
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
        discount: 0.25
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
        discount: 0.25
    },
    {
        productId: 3,
        supplierId: 2,
        name: "CatFlix Entertainment Portal",
        description: "On-demand laser shows, motion videos, and bird-watching streams - customized per cat using AI interest tracking. Think Netflix, but for felines.",
        price: 89.99,
        sku: "CAT-FLIX-001",
        unit: "piece",
        imgName: "catflix.png"
    },
    {
        productId: 4,
        supplierId: 2,
        name: "PawTrack Smart Collar",
        description: "GPS and activity tracker with AI-powered mood detection based on tail position, purring frequency, and movement patterns. Syncs with your phone for walk stats and zoomie alerts.",
        price: 79.99,
        sku: "CAT-COLLAR-001",
        unit: "piece",
        imgName: "smart-collar.png"
    },
    {
        productId: 5,
        supplierId: 1,
        name: "SleepNest ThermoPod",
        description: "A smart bed that adjusts its temperature, lighting, and white noise based on your cat's REM cycles. Auto-generates nap metrics in JSON.",
        price: 149.99,
        sku: "CAT-BED-001",
        unit: "piece",
        imgName: "sleep-nest.png"
    },
    {
        productId: 6,
        supplierId: 1,
        name: "ClawMate Auto Groomer",
        description: "Your cat brushes itself. This AI station detects which areas need grooming, dispenses treats for patience, and logs grooming history to your pet portal.",
        price: 119.99,
        sku: "CAT-GROOM-001",
        unit: "piece",
        imgName: "auto-groomer.png"
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
        discount: 0.25
    },
    {
        productId: 8,
        supplierId: 2,
        name: "ScratchPad Pro",
        description: "More than a scratcher - this one detects scratching habits, gamifies it with leaderboard stats for multi-cat homes, and awards digital badges.",
        price: 59.99,
        sku: "CAT-SCRATCH-001",
        unit: "piece",
        imgName: "scratch-pad.png"
    },
    {
        productId: 9,
        supplierId: 2,
        name: "ChirpCam Window Mount",
        description: "Motion-activated smart cam that records wildlife outside the window and sends curated 'Birdflix' highlights to your cat's personal feed.",
        price: 99.99,
        sku: "CAT-CAM-001",
        unit: "piece",
        imgName: "chirp-cam.png"
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
        discount: 0.25
    },
    {
        productId: 11,
        supplierId: 1,
        name: "DoorDash Pet Portal",
        description: "Smart cat door with facial recognition and time-based access. Prevents midnight squirrel parties and tracks in/out commits to your dashboard.",
        price: 159.99,
        sku: "CAT-DOOR-001",
        unit: "piece",
        imgName: "door-dash.png"
    },
    {
        productId: 12,
        supplierId: 2,
        name: "ZoomieTracker AI Mat",
        description: "A motion-sensing mat that detects zoomies, spins up chase lights, and logs agility bursts to a weekly health report. Yes, it graphs zoomies per hour.",
        price: 79.99,
        sku: "CAT-TRACKER-001",
        unit: "piece",
        imgName: "tracker-mat.png"
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

// Product Reviews
export const productReviews: ProductReview[] = [
    {
        reviewId: 1,
        productId: 1,
        displayName: "Felix W.",
        rating: 5,
        title: "My cat is now a meal-prep influencer",
        body: "The SmartFeeder One has completely transformed our household. It detects my cat's nap cycles with scary precision and now Mittens eats on a schedule that would make a nutritionist jealous. Highly recommend.",
        createdAt: "2024-11-15T10:30:00.000Z",
        helpful: 14
    },
    {
        reviewId: 2,
        productId: 1,
        displayName: "Tabitha P.",
        rating: 4,
        title: "Great product, minor app glitches",
        body: "Love the auto-scheduling and health repo integration. Had a few connectivity hiccups with the app on iOS but support was responsive. Overall a solid buy for multi-cat households.",
        createdAt: "2024-12-02T14:15:00.000Z",
        helpful: 7
    },
    {
        reviewId: 3,
        productId: 2,
        displayName: "Nina N.",
        rating: 5,
        title: "Worth every penny",
        body: "The AutoClean Litter Dome changed my life. The Slack alert feature is genius — I got notified about an issue before I even noticed anything was wrong. Zero odor, zero effort. 10/10.",
        createdAt: "2024-10-20T08:00:00.000Z",
        helpful: 22
    },
    {
        reviewId: 4,
        productId: 2,
        displayName: "Marcus R.",
        rating: 3,
        title: "Good but loud during cleaning cycle",
        body: "The self-cleaning mechanism works well but the motor is surprisingly loud at night. My cat now avoids it after 10pm. The health reports are a nice touch though.",
        createdAt: "2025-01-05T20:45:00.000Z",
        helpful: 5
    },
    {
        reviewId: 5,
        productId: 4,
        displayName: "Sarah K.",
        rating: 5,
        title: "GPS accuracy is phenomenal",
        body: "PawTrack never misses a beat. The zoomie alerts crack me up every time and the mood detection is surprisingly accurate. Battery lasts 3 days on a charge.",
        createdAt: "2024-09-18T16:20:00.000Z",
        helpful: 31
    },
    {
        reviewId: 6,
        productId: 4,
        displayName: "Derek T.",
        rating: 4,
        title: "Solid tracker, wish the collar was lighter",
        body: "The tracking features are excellent and the AI mood detection adds a fun layer of insight. Collar weight is fine for larger cats but may be heavy for kittens under 3 months.",
        createdAt: "2025-02-10T11:00:00.000Z",
        helpful: 9
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