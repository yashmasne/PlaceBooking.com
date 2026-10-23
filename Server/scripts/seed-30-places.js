import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, "..", "data", "db.json");

export const new30Accommodations = [
  {
    _id: "p12-jaipur-oberoi",
    owner: null,
    title: "The Oberoi Grand Heritage Palace & Spa",
    address: "Amer Road, Jaipur, Rajasthan",
    category: "Luxury stays",
    photos: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Experience regal Rajasthani hospitality in a restored royal palace featuring hand-painted frescoes, manicured Mughal gardens, an azure marble swimming pool, and bespoke butler service.",
    perks: ["wifi", "parking", "tv", "entrance"],
    extraInfo: "Traditional Rajasthani thali dinner included upon request. Strict no-smoking policy inside heritage chambers.",
    checkIn: 14,
    checkOut: 12,
    maxGuests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 2,
    price: 18500,
    rating: 4.97,
    reviewsCount: 142
  },
  {
    _id: "p13-kochi-haven",
    owner: null,
    title: "Backpacker's Haven Boutique Heritage Suites",
    address: "Princess Street, Fort Kochi, Kerala",
    category: "City apartments",
    photos: [
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Vibrant budget-friendly boutique stay located in the heart of historic Fort Kochi, walking distance from the iconic Chinese fishing nets and spice markets.",
    perks: ["wifi", "tv"],
    extraInfo: "Free high-speed WiFi and complimentary Ayurvedic morning tea.",
    checkIn: 13,
    checkOut: 11,
    maxGuests: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    price: 1650,
    rating: 4.86,
    reviewsCount: 94
  },
  {
    _id: "p14-pondicherry-maison",
    owner: null,
    title: "The French Quarter Boutique Maison",
    address: "Rue Romain Rolland, White Town, Puducherry",
    category: "Design stays",
    photos: [
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "A pastel yellow colonial mansion restored with chic contemporary minimalist interiors, courtyard bougainvillea, and artisanal French bakery downstairs.",
    perks: ["wifi", "tv", "entrance"],
    extraInfo: "Complimentary vintage bicycle rentals provided to explore the promenade.",
    checkIn: 14,
    checkOut: 11,
    maxGuests: 3,
    bedrooms: 1,
    beds: 2,
    bathrooms: 1,
    price: 4900,
    rating: 4.93,
    reviewsCount: 78
  },
  {
    _id: "p15-goa-aguada-resort",
    owner: null,
    title: "Horizon Sea View Beachfront Resort & Chalets",
    address: "Sinquerim Beach, Candolim, Goa",
    category: "Beachfront",
    photos: [
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Perched directly above the golden sands of Sinquerim beach with private beach pathway access, infinity pool overlooking the Arabian Sea, and sunset deck.",
    perks: ["wifi", "parking", "tv", "entrance"],
    extraInfo: "Water sports gear available on-site. Breakfast buffet included.",
    checkIn: 15,
    checkOut: 11,
    maxGuests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 2,
    price: 11200,
    rating: 4.95,
    reviewsCount: 164
  },
  {
    _id: "p16-shimla-peak-retreat",
    owner: null,
    title: "Wildflower Himalayan Peak Mountain Retreat",
    address: "Mashobra Ridge, Shimla, Himachal Pradesh",
    category: "Mountains",
    photos: [
      "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Surrounded by centuries-old cedar and pine forests at 8,250 feet, this colonial-style mountain lodge features heated stone floors, roaring fireplaces, and panoramic snow peaks.",
    perks: ["wifi", "parking", "tv"],
    extraInfo: "Equipped with mountain-view jacuzzi and guided pine-trail walks.",
    checkIn: 14,
    checkOut: 11,
    maxGuests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 2,
    price: 14500,
    rating: 4.98,
    reviewsCount: 112
  },
  {
    _id: "p17-lonavala-pool-villa",
    owner: null,
    title: "Eucalyptus Hilltop Infinity Pool Villa",
    address: "Tungarli, Lonavala, Maharashtra",
    category: "Pools",
    photos: [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "4-bedroom luxury estate atop Tungarli hills with a private 40-foot temperature-controlled infinity pool, barbecue deck, and mist-covered monsoon valley views.",
    perks: ["wifi", "parking", "tv", "entrance"],
    extraInfo: "Full private chef available upon request. Accommodates large families.",
    checkIn: 14,
    checkOut: 11,
    maxGuests: 10,
    bedrooms: 4,
    beds: 5,
    bathrooms: 4,
    price: 22000,
    rating: 4.92,
    reviewsCount: 86
  },
  {
    _id: "p18-mumbai-colaba-harbor",
    owner: null,
    title: "Colaba Art Deco Harbor Residence",
    address: "Merryweather Road, Colaba, Mumbai",
    category: "City apartments",
    photos: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "1930s heritage Art Deco residence with soaring 14-foot ceilings, teak wood furnishings, vintage record player, and views toward the Gateway of India harbor.",
    perks: ["wifi", "tv", "entrance"],
    extraInfo: "Prime South Mumbai location, 2 minutes from cafes, art galleries, and restaurants.",
    checkIn: 15,
    checkOut: 11,
    maxGuests: 3,
    bedrooms: 1,
    beds: 2,
    bathrooms: 1,
    price: 5800,
    rating: 4.91,
    reviewsCount: 104
  },
  {
    _id: "p19-bengaluru-tech-penthouse",
    owner: null,
    title: "Koramangala Tech Executive Penthouse",
    address: "80 Feet Road, Koramangala 4th Block, Bengaluru",
    category: "City apartments",
    photos: [
      "https://images.unsplash.com/photo-1502005229762-ee1b2b8ab98f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Ultra-sleek top-floor duplex penthouse with ergonomic Herman Miller work desks, fiber-optic 1 Gbps WiFi, private rooftop terrace, and smart home automation.",
    perks: ["wifi", "parking", "tv", "entrance"],
    extraInfo: "Ideal for visiting founders, remote executives, and tech conferences.",
    checkIn: 14,
    checkOut: 11,
    maxGuests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 2,
    price: 6500,
    rating: 4.94,
    reviewsCount: 67
  },
  {
    _id: "p20-coorg-coffee-homestay",
    owner: null,
    title: "Coorg Rainforest Coffee Plantation Homestay",
    address: "Suntikoppa, Madikeri, Coorg, Karnataka",
    category: "Countryside",
    photos: [
      "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Immerse yourself in a 50-acre active Arabica and Robusta organic coffee estate with morning birdsong, traditional Kodava home-cooked meals, and guided plantation trails.",
    perks: ["wifi", "parking", "pets", "entrance"],
    extraInfo: "Farm-to-table breakfast and authentic Kodava filter coffee included daily.",
    checkIn: 13,
    checkOut: 11,
    maxGuests: 6,
    bedrooms: 3,
    beds: 3,
    bathrooms: 3,
    price: 4200,
    rating: 4.96,
    reviewsCount: 118
  },
  {
    _id: "p21-mumbai-bandra-boho",
    owner: null,
    title: "Bandra Bohemian Artist Sunlight Studio",
    address: "Pali Hill, Bandra West, Mumbai",
    category: "City apartments",
    photos: [
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Sun-drenched, plant-filled bohemian studio loft surrounded by old Bandra village lanes, cozy coffee roasteries, and seaside promenades.",
    perks: ["wifi", "tv"],
    extraInfo: "Walkable to Carter Road and Bandstand promenades.",
    checkIn: 14,
    checkOut: 11,
    maxGuests: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    price: 3600,
    rating: 4.89,
    reviewsCount: 82
  },
  {
    _id: "p22-goa-nomad-hostel",
    owner: null,
    title: "The Nomad Tribe Social Eco-Hostel & Co-Work",
    address: "Deul Vaddo, Anjuna, Goa",
    category: "Beachfront",
    photos: [
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Spirited coastal social hub with private ensuite pods, community pool, fiber co-working lounge, and weekly live music evenings.",
    perks: ["wifi", "parking", "pets"],
    extraInfo: "Community kitchen, surfboard storage, and yoga deck on premises.",
    checkIn: 13,
    checkOut: 11,
    maxGuests: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    price: 1400,
    rating: 4.82,
    reviewsCount: 153
  },
  {
    _id: "p23-udaipur-haveli",
    owner: null,
    title: "Fateh Prakash Lakeview Royal Haveli",
    address: "Pichola Lakefront, Udaipur, Rajasthan",
    category: "Lakefront",
    photos: [
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Direct waterfront 18th-century Haveli suite boasting ornate Jharokha stone balconies directly overlooking Lake Pichola and the illuminated Lake Palace.",
    perks: ["wifi", "parking", "tv", "entrance"],
    extraInfo: "Sunset boat ride and private candlelit rooftop dining available.",
    checkIn: 14,
    checkOut: 11,
    maxGuests: 3,
    bedrooms: 1,
    beds: 2,
    bathrooms: 1,
    price: 13800,
    rating: 4.97,
    reviewsCount: 176
  },
  {
    _id: "p24-manali-stone-cottage",
    owner: null,
    title: "Whispering Cedars Stone & Pine Cottage",
    address: "Old Manali Road, Manali, Himachal Pradesh",
    category: "Cabins",
    photos: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Handcrafted Kath-Kuni stone and cedar wood cottage nestled among apple orchards with an authentic wood-burning bukhari stove and stream views.",
    perks: ["wifi", "parking", "tv", "pets"],
    extraInfo: "Firewood supplied. 10 minutes walk to Old Manali cafes.",
    checkIn: 13,
    checkOut: 11,
    maxGuests: 5,
    bedrooms: 2,
    beds: 3,
    bathrooms: 2,
    price: 3800,
    rating: 4.93,
    reviewsCount: 124
  },
  {
    _id: "p25-kerala-lotus-sanctuary",
    owner: null,
    title: "Kumarakom Backwater Lotus Villa Sanctuary",
    address: "Vembanad Lake, Kumarakom, Kerala",
    category: "Lakefront",
    photos: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Waterfront wooden cottage directly on the banks of Vembanad Lake featuring a private boat jetty, open-to-sky shower, and Ayurvedic herbal garden.",
    perks: ["wifi", "parking", "tv", "entrance"],
    extraInfo: "Includes complimentary canoe paddle rides through canal villages.",
    checkIn: 14,
    checkOut: 11,
    maxGuests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 2,
    price: 7600,
    rating: 4.96,
    reviewsCount: 88
  },
  {
    _id: "p26-goa-saffron-pool",
    owner: null,
    title: "The Saffron Plunge Pool Sanctuary",
    address: "Assagao, North Goa, Goa",
    category: "Pools",
    photos: [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Portuguese-Goan villa with terracotta tiled roofs, private turquoise plunge pool bordered by heliconia flowers, and an open-air tropical courtyard.",
    perks: ["wifi", "parking", "tv", "entrance"],
    extraInfo: "Located in the fashionable culinary village of Assagao.",
    checkIn: 15,
    checkOut: 11,
    maxGuests: 6,
    bedrooms: 3,
    beds: 3,
    bathrooms: 3,
    price: 16500,
    rating: 4.95,
    reviewsCount: 110
  },
  {
    _id: "p27-mahabaleshwar-strawberry",
    owner: null,
    title: "Strawberry Hill Valley Resort & Cottages",
    address: "Panchgani-Mahabaleshwar Road, Mahabaleshwar, Maharashtra",
    category: "Amazing views",
    photos: [
      "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Family-friendly hillside cottages overlooking Krishna river valley, surrounded by organic strawberry farms with private sunset viewing terraces.",
    perks: ["wifi", "parking", "tv"],
    extraInfo: "Seasonal fresh strawberry picking activity included for guests.",
    checkIn: 13,
    checkOut: 11,
    maxGuests: 6,
    bedrooms: 2,
    beds: 3,
    bathrooms: 2,
    price: 4500,
    rating: 4.88,
    reviewsCount: 92
  },
  {
    _id: "p28-hyderabad-hitec-suite",
    owner: null,
    title: "Hitec City Metro Grand Business Suite",
    address: "Madhapur, Hitec City, Hyderabad, Telangana",
    category: "City apartments",
    photos: [
      "https://images.unsplash.com/photo-1502005229762-ee1b2b8ab98f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "High-floor corporate serviced suite next to Cyber Towers with express check-in, conference desk, high-speed Wi-Fi, and 24/7 fitness center.",
    perks: ["wifi", "parking", "tv", "entrance"],
    extraInfo: "Housekeeping and airport transfer available.",
    checkIn: 14,
    checkOut: 12,
    maxGuests: 3,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    price: 3400,
    rating: 4.87,
    reviewsCount: 74
  },
  {
    _id: "p29-munnar-clouds-whisper",
    owner: null,
    title: "Clouds Whisper Honeymoon Mountain Chalet",
    address: "Chithirapuram, Munnar, Kerala",
    category: "Amazing views",
    photos: [
      "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Private wooden honeymoon cottage set amidst rolling tea plantations with floor-to-ceiling glass windows where mist rolls through the bedroom balcony.",
    perks: ["wifi", "parking", "tv"],
    extraInfo: "Complimentary evening bonfire and freshly plucked estate tea tasting.",
    checkIn: 14,
    checkOut: 11,
    maxGuests: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    price: 5200,
    rating: 4.97,
    reviewsCount: 135
  },
  {
    _id: "p30-wayanad-bamboo-grove",
    owner: null,
    title: "Bamboo Grove Sustainable Eco Reserve",
    address: "Meppadi, Wayanad, Kerala",
    category: "Countryside",
    photos: [
      "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "100% solar-powered eco-friendly stilt cottage constructed entirely of treated bamboo and teak wood, bordering the Wayanad wildlife sanctuary.",
    perks: ["wifi", "parking", "pets"],
    extraInfo: "Zero single-use plastics. Pure natural spring water supplied.",
    checkIn: 13,
    checkOut: 11,
    maxGuests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 1,
    price: 3900,
    rating: 4.91,
    reviewsCount: 63
  },
  {
    _id: "p31-nashik-sula-vineyard",
    owner: null,
    title: "Sula Vineyard Countryside Farmhouse & Cellar",
    address: "Gangapur Dam Road, Nashik, Maharashtra",
    category: "Countryside",
    photos: [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Rustic Tuscan-inspired villa overlooking rolling vineyards and the tranquil Gangapur reservoir, with private wine cellar tastings and cycling trails.",
    perks: ["wifi", "parking", "tv", "entrance"],
    extraInfo: "Sommelier tour and complimentary bottle of sparkling wine included.",
    checkIn: 14,
    checkOut: 11,
    maxGuests: 6,
    bedrooms: 3,
    beds: 3,
    bathrooms: 3,
    price: 9800,
    rating: 4.93,
    reviewsCount: 114
  },
  {
    _id: "p32-jibhi-river-chalet",
    owner: null,
    title: "Tirthan Valley Riverbank Wood Chalet",
    address: "Gushaini, Tirthan Valley, Himachal Pradesh",
    category: "Cabins",
    photos: [
      "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Timber chalet situated 20 meters from the crystalline Tirthan trout stream, with a riverside pebble beach, hammocks, and trout angling equipment.",
    perks: ["wifi", "parking", "pets"],
    extraInfo: "Gateway to the UNESCO World Heritage Great Himalayan National Park.",
    checkIn: 13,
    checkOut: 11,
    maxGuests: 5,
    bedrooms: 2,
    beds: 3,
    bathrooms: 2,
    price: 3600,
    rating: 4.96,
    reviewsCount: 79
  },
  {
    _id: "p33-kodaikanal-pine-manor",
    owner: null,
    title: "Pine Forest Colonial Heritage Manor",
    address: "Upper Lake Road, Kodaikanal, Tamil Nadu",
    category: "Mountains",
    photos: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "British-era stone manor nestled amidst eucalyptus and pine woods, featuring antique rosewood furniture, bay windows, and private garden croquet lawn.",
    perks: ["wifi", "parking", "tv"],
    extraInfo: "Warm hospitality with homemade plum cakes and evening fireplace logs.",
    checkIn: 14,
    checkOut: 11,
    maxGuests: 6,
    bedrooms: 3,
    beds: 3,
    bathrooms: 3,
    price: 6800,
    rating: 4.92,
    reviewsCount: 95
  },
  {
    _id: "p34-mumbai-worli-penthouse",
    owner: null,
    title: "Worli Sea Face Glasshouse Penthouse",
    address: "Khan Abdul Ghaffar Khan Road, Worli, Mumbai",
    category: "Amazing views",
    photos: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "45th-floor luxury glasshouse penthouse with unobstructed 270-degree vistas of the Arabian Sea and the glittering Bandra-Worli Sea Link bridge.",
    perks: ["wifi", "parking", "tv", "entrance"],
    extraInfo: "Private elevator access, jacuzzi terrace, and 24-hour concierge.",
    checkIn: 15,
    checkOut: 12,
    maxGuests: 6,
    bedrooms: 3,
    beds: 3,
    bathrooms: 3,
    price: 29500,
    rating: 4.98,
    reviewsCount: 88
  },
  {
    _id: "p35-bengaluru-indiranagar-loft",
    owner: null,
    title: "Indiranagar Minimalist Urban Loft",
    address: "12th Main Road, Indiranagar, Bengaluru, Karnataka",
    category: "City apartments",
    photos: [
      "https://images.unsplash.com/photo-1502005229762-ee1b2b8ab98f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Industrial chic loft with polished exposed concrete walls, curated indie art, espresso bar, and steps away from the finest microbreweries in town.",
    perks: ["wifi", "tv", "entrance"],
    extraInfo: "Metro station is 400m away. Self check-in with smart digital keypad.",
    checkIn: 14,
    checkOut: 11,
    maxGuests: 3,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    price: 3200,
    rating: 4.91,
    reviewsCount: 110
  },
  {
    _id: "p36-jaisalmer-glamping-tents",
    owner: null,
    title: "Desert Stargazing Royal Swiss Glamping Tents",
    address: "Sam Sand Dunes, Jaisalmer, Rajasthan",
    category: "Amazing views",
    photos: [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Opulent Swiss royal tents in the golden Thar desert dunes with king-size plush beds, ensuite marble bathrooms, camel safaris, and Rajasthani folk dances around bonfires.",
    perks: ["wifi", "parking", "entrance"],
    extraInfo: "Includes sunset camel ride and multi-course desert buffet dinner.",
    checkIn: 15,
    checkOut: 10,
    maxGuests: 3,
    bedrooms: 1,
    beds: 2,
    bathrooms: 1,
    price: 5900,
    rating: 4.94,
    reviewsCount: 146
  },
  {
    _id: "p37-solang-timber-cabin",
    owner: null,
    title: "Apple Blossom Timber Alpine Ski Cabin",
    address: "Solang Valley, Manali, Himachal Pradesh",
    category: "Cabins",
    photos: [
      "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "A-frame Nordic-style alpine cabin built from pine timber, with ski-in access during winter, open loft bedroom, and glass skylight for midnight stargazing.",
    perks: ["wifi", "parking", "tv", "pets"],
    extraInfo: "Equipped with electric heated blankets and ski gear locker.",
    checkIn: 14,
    checkOut: 11,
    maxGuests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 1,
    price: 4800,
    rating: 4.95,
    reviewsCount: 98
  },
  {
    _id: "p38-gokarna-cliff-resort",
    owner: null,
    title: "Gokarna Cliffside Sunset Beach Retreat",
    address: "Kudle Beach Road, Gokarna, Karnataka",
    category: "Beachfront",
    photos: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Eco-resort situated on the serene cliffs between Kudle and Om beach, providing sweeping 180-degree ocean views, morning yoga shala, and coastal hikes.",
    perks: ["wifi", "parking", "entrance"],
    extraInfo: "Direct cliff-stairs down to Kudle Beach. Fresh seafood cafe on site.",
    checkIn: 13,
    checkOut: 11,
    maxGuests: 3,
    bedrooms: 1,
    beds: 2,
    bathrooms: 1,
    price: 3700,
    rating: 4.90,
    reviewsCount: 117
  },
  {
    _id: "p39-delhi-aerocity-suite",
    owner: null,
    title: "Aerocity Luxury Transit Executive Suite",
    address: "Asset Area 4, Aerocity, New Delhi",
    category: "City apartments",
    photos: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502005229762-ee1b2b8ab98f?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Soundproofed luxury suite located 5 minutes from Indira Gandhi International Airport Terminal 3, featuring blackout drapes, soaking tub, and high-speed transit access.",
    perks: ["wifi", "parking", "tv", "entrance"],
    extraInfo: "24/7 airport terminal shuttle and 24-hour dining service.",
    checkIn: 12,
    checkOut: 12,
    maxGuests: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    price: 7200,
    rating: 4.92,
    reviewsCount: 140
  },
  {
    _id: "p40-delhi-cp-heritage",
    owner: null,
    title: "Connaught Place Heritage High-Ceiling Suite",
    address: "Inner Circle, Connaught Place, New Delhi",
    category: "City apartments",
    photos: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Iconic colonial Georgian-architecture suite in the historic heart of Delhi with 16-foot vaulted ceilings, hardwood floors, and instant access to metro interchange.",
    perks: ["wifi", "tv", "entrance"],
    extraInfo: "Steps away from classic cafes, bookshops, and central Delhi monuments.",
    checkIn: 14,
    checkOut: 11,
    maxGuests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 2,
    price: 5400,
    rating: 4.88,
    reviewsCount: 102
  },
  {
    _id: "p41-alleppey-houseboat",
    owner: null,
    title: "Vedic Luxury Houseboat Serenity Cruise",
    address: "Finishing Point, Punnamada, Alleppey, Kerala",
    category: "Lakefront",
    photos: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Private traditional Kettuvallam air-conditioned houseboat crafted from Anjili wood and coir, cruising peacefully through palm-fringed Kerala backwater lagoons with on-board private chef.",
    perks: ["wifi", "tv", "entrance"],
    extraInfo: "Includes three traditional Kerala meals prepared fresh on board (Karimeen Pollichathu, Appams, and Payasam).",
    checkIn: 12,
    checkOut: 9,
    maxGuests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 2,
    price: 15500,
    rating: 4.99,
    reviewsCount: 186
  }
];

export async function runSeed() {
  console.log("Reading database from:", DB_FILE);
  let db = { users: [], places: [], bookings: [], payments: [] };
  try {
    const raw = await fs.readFile(DB_FILE, "utf-8");
    db = JSON.parse(raw);
  } catch (err) {
    console.warn("Could not read db.json, initializing fresh structure:", err.message);
  }

  if (!Array.isArray(db.places)) db.places = [];
  if (!Array.isArray(db.payments)) db.payments = [];

  const existingIds = new Set(db.places.map((p) => String(p._id)));
  let addedCount = 0;

  for (const acc of new30Accommodations) {
    if (!existingIds.has(String(acc._id))) {
      db.places.push(acc);
      existingIds.add(String(acc._id));
      addedCount++;
    }
  }

  await fs.writeFile(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
  console.log(`Seed script executed successfully.`);
  console.log(`Added: ${addedCount} new accommodations.`);
  console.log(`Total places now in database: ${db.places.length}`);
  return { addedCount, total: db.places.length };
}

// Execute directly if run as a script
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runSeed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Seed script failed:", err);
      process.exit(1);
    });
}
