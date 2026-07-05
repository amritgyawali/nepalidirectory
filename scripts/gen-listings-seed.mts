/**
 * Generates db/seeds/listings_demo.sql from the bundled demo dataset (`lib/data.ts` `businesses`).
 * The fields are duplicated here (not imported) because lib/data.ts re-exports from the "@/lib/blog"
 * tsconfig path alias, which plain `node` cannot resolve outside the Next.js bundler — this script
 * only needs a handful of read-only fields to build INSERT statements, not the live module.
 * Run: `node scripts/gen-listings-seed.mts`. Keep in sync with `lib/data.ts` if it changes.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

type Business = {
  slug: string;
  name: string;
  categories: string[];
  area: string;
  neighborhood?: string;
  address: string;
  phone: string;
  website?: string;
  email?: string;
  rating: number;
  reviews: number;
  price: number;
  status: string;
  hoursToday: string;
  image: string;
  amenities: string[];
  services?: string[];
  claimed?: boolean;
  verified?: boolean;
  coordinates?: { lat: number; lng: number };
};

function slugify(input: string): string {
  return input.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

const image = (id: string, size = "600") =>
  `https://images.unsplash.com/${id}?w=${size}&h=${size}&fit=crop&auto=format`;

// Duplicated from lib/data.ts `businesses` (read-only fields needed for the listings table).
const businesses: Business[] = [
  { slug: "newa-lahana", name: "Newa Lahana", categories: ["Newari Fine Dining", "Restaurants", "Heritage"], area: "Bhaktapur", neighborhood: "Durbar Square", address: "Inacho, Bhaktapur Durbar Square", phone: "(01) 6611945", website: "https://example.com/newa-lahana", email: "hello@newalahana.example", rating: 4.7, reviews: 842, price: 3, status: "closed", hoursToday: "Today: 11:30 am - 9:00 pm", image: image("photo-1547592180-85f173990554"), amenities: ["Heritage building", "Outdoor courtyard", "Group friendly", "Vegetarian options"], services: ["Dine-in", "Group booking", "Catering", "Festival menus", "Private events"], claimed: true, verified: true, coordinates: { lat: 27.6722, lng: 85.4298 } },
  { slug: "bhojan-griha", name: "Bhojan Griha Heritage Restaurant", categories: ["Multicuisine Nepali", "Cultural Show", "Restaurants"], area: "Dilli Bazar", neighborhood: "Dilli Bazar", address: "Dilli Bazar, Kathmandu 44600", phone: "(01) 4416423", website: "https://example.com/bhojan-griha", email: "bookings@bhojangriha.example", rating: 4.6, reviews: 1240, price: 4, status: "open", hoursToday: "Today: 6:00 pm - 11:00 pm", image: image("photo-1567188040759-fb8a883dc6d8"), amenities: ["Live cultural show", "Set menu", "Air conditioned"], services: ["Dinner", "Cultural show", "Group booking", "Set menu"], claimed: true, verified: true, coordinates: { lat: 27.7047, lng: 85.3261 } },
  { slug: "yangling-tibetan", name: "Yangling Tibetan Restaurant", categories: ["Tibetan", "Sherpa", "Momos"], area: "Boudha", neighborhood: "Boudha Stupa", address: "Boudha Stupa Road, Kathmandu", phone: "(01) 4910092", website: "https://example.com/yangling", rating: 4.5, reviews: 520, price: 2, status: "open", hoursToday: "Today: 8:00 am - 10:00 pm", image: image("photo-1496116218417-1a781b1c416c"), amenities: ["Cash only", "Family friendly"], services: ["Dine-in", "Takeout", "Delivery"], claimed: false, verified: true, coordinates: { lat: 27.7215, lng: 85.3614 } },
  { slug: "roadhouse-cafe", name: "Roadhouse Cafe Thamel", categories: ["Italian", "Pizza", "Continental", "Bars"], area: "Thamel", neighborhood: "Thamel", address: "Thamel Chowk, JP Marg", phone: "(01) 4262768", website: "https://example.com/roadhouse-thamel", rating: 4.4, reviews: 1890, price: 3, status: "open", hoursToday: "Today: 11:00 am - 11:30 pm", image: image("photo-1565299624946-b28f40a0ae38"), amenities: ["Rooftop", "Wood-fired oven", "Bar"], services: ["Dine-in", "Delivery", "Rooftop seating", "Bar service"], claimed: true, verified: true, coordinates: { lat: 27.7154, lng: 85.3124 } },
  { slug: "himalayan-java-lazimpat", name: "Himalayan Java Lazimpat", categories: ["Cafe", "Coffee", "Breakfast", "Bakery"], area: "Lazimpat", neighborhood: "Lazimpat", address: "Lazimpat Road, Kathmandu", phone: "(01) 4411604", website: "https://example.com/himalayan-java-lazimpat", rating: 4.5, reviews: 980, price: 2, status: "open", hoursToday: "Today: 7:00 am - 9:00 pm", image: image("photo-1495474472287-4d71bcdd2085"), amenities: ["Wi-Fi", "Specialty coffee", "Outdoor seating"], services: ["Breakfast", "Coffee", "Workspace", "Delivery"], claimed: true, verified: true, coordinates: { lat: 27.7201, lng: 85.3186 } },
  { slug: "annapurna-thakali", name: "Annapurna Thakali Bhansa Ghar", categories: ["Thakali", "Nepali Thali", "Restaurants"], area: "Lazimpat", neighborhood: "Lazimpat", address: "Lazimpat Marg, Kathmandu", phone: "(01) 4419807", website: "https://example.com/annapurna-thakali", rating: 4.7, reviews: 734, price: 3, status: "closed", hoursToday: "Today: 12:00 pm - 10:00 pm", image: image("photo-1565557623262-b51c2513a641"), amenities: ["Traditional seating", "Halal", "Group friendly"], services: ["Dine-in", "Takeout", "Group lunch"], verified: true, coordinates: { lat: 27.7184, lng: 85.3181 } },
  { slug: "kathmandu-plumbing-services", name: "Kathmandu Plumbing Services", categories: ["Plumbers", "Home Services", "Emergency Repair"], area: "Kathmandu", neighborhood: "Putalisadak", address: "Putalisadak, Kathmandu 44600", phone: "(01) 5321188", website: "https://example.com/kathmandu-plumbing", email: "service@kathmanduplumbing.example", rating: 4.8, reviews: 312, price: 2, status: "24h", hoursToday: "Open 24 hours", image: image("photo-1621905251189-08b45d6a269e"), amenities: ["Emergency visits", "Warranty on parts", "Online booking"], services: ["Leak repair", "Bathroom fitting", "Water tank lines", "Drain cleaning", "Emergency repair"], claimed: true, verified: true, coordinates: { lat: 27.7051, lng: 85.3252 } },
  { slug: "patan-electric-solar", name: "Patan Electric & Solar", categories: ["Electricians", "Solar Installers", "Home Services"], area: "Lalitpur", neighborhood: "Pulchowk", address: "Pulchowk Road, Lalitpur", phone: "(01) 5534091", website: "https://example.com/patan-electric-solar", rating: 4.6, reviews: 208, price: 2, status: "open", hoursToday: "Today: 8:00 am - 7:00 pm", image: image("photo-1621905252507-b35492cc74b4"), amenities: ["Licensed team", "Solar audit", "Same-day repair"], services: ["Wiring", "Inverter setup", "Solar maintenance", "Safety audit"], claimed: true, verified: true, coordinates: { lat: 27.6785, lng: 85.3162 } },
  { slug: "citycare-dental-clinic", name: "CityCare Dental Clinic", categories: ["Doctors", "Dentists", "Healthcare"], area: "New Baneshwor", neighborhood: "New Baneshwor", address: "New Baneshwor, Kathmandu", phone: "(01) 4476200", website: "https://example.com/citycare-dental", email: "appointments@citycare.example", rating: 4.7, reviews: 456, price: 3, status: "open", hoursToday: "Today: 9:00 am - 6:00 pm", image: image("photo-1606811971618-4486d14f3f99"), amenities: ["Appointment booking", "Digital x-ray", "Family friendly"], services: ["Dental checkup", "Cleaning", "Root canal", "Digital x-ray", "Family dentistry"], claimed: true, verified: true, coordinates: { lat: 27.6905, lng: 85.342 } },
  { slug: "lakefront-inn-pokhara", name: "Lakefront Inn Pokhara", categories: ["Hotels", "Travel", "Lakeside"], area: "Pokhara", neighborhood: "Lakeside", address: "Lakeside Road, Pokhara", phone: "(061) 462884", website: "https://example.com/lakefront-inn-pokhara", rating: 4.5, reviews: 680, price: 3, status: "open", hoursToday: "Open for check-in", image: image("photo-1566073771259-6a8506099945"), amenities: ["Airport pickup", "Lake view", "Trekking desk"], services: ["Room booking", "Airport pickup", "Trekking desk", "Laundry"], claimed: true, verified: true, coordinates: { lat: 28.2096, lng: 83.9594 } },
  { slug: "legal-line-nepal", name: "Legal Line Nepal", categories: ["Lawyers", "Professional Services", "Business Registration"], area: "Tripureshwor", neighborhood: "Tripureshwor", address: "Tripureshwor, Kathmandu", phone: "(01) 5367721", website: "https://example.com/legal-line-nepal", rating: 4.4, reviews: 144, price: 3, status: "closed", hoursToday: "Today: 10:00 am - 5:00 pm", image: image("photo-1589829545856-d10d557cf95f"), amenities: ["Business registration", "Contract review", "Online consultation"], services: ["Company registration", "Contract review", "Civil documentation", "Online consultation"], claimed: false, verified: true, coordinates: { lat: 27.6948, lng: 85.3159 } }
];

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function sqlStr(v: string | undefined | null): string {
  if (v === undefined || v === null) return "NULL";
  return `'${v.replace(/'/g, "''")}'`;
}

function sqlArray(items: string[] | undefined): string {
  if (!items || items.length === 0) return "'{}'";
  const escaped = items.map((s) => s.replace(/'/g, "''").replace(/"/g, '\\"'));
  return `'{${escaped.map((s) => `"${s}"`).join(",")}}'`;
}

const rows = businesses.map((b) => {
  const categories = b.categories.map(slugify);
  return `  (${sqlStr(b.slug)}, ${sqlStr(b.name)}, ${sqlArray(categories)}, ${sqlStr(b.area)}, ` +
    `${sqlStr(b.neighborhood)}, ${sqlStr(b.address)}, ${sqlStr(b.phone)}, ${sqlStr(b.website)}, ` +
    `${sqlStr(b.email)}, ${b.rating}, ${b.reviews}, ${b.price}, ${sqlStr(b.status)}, ` +
    `${sqlStr(b.hoursToday)}, ${sqlStr(b.image)}, ${b.image ? 1 : 0}, ` +
    `${b.coordinates ? b.coordinates.lat : "NULL"}, ${b.coordinates ? b.coordinates.lng : "NULL"}, ` +
    `${sqlArray(b.amenities)}, ${sqlArray(b.services)}, ${Boolean(b.claimed)}, ${Boolean(b.verified)}, true)`;
});

const sql = `-- Generated by scripts/gen-listings-seed.mts from the lib/data.ts demo dataset. Do not edit by hand.
-- ${businesses.length} rows — the bundled demo dataset, seeded into Supabase \`listings\`.
INSERT INTO listings
  (slug, name, categories, area, neighborhood, address, phone, website, email, rating, reviews,
   price, status, hours_today, image, photos_count, lat, lng, amenities, services, claimed,
   verified, active)
VALUES
${rows.join(",\n")}
ON CONFLICT (slug) DO NOTHING;
`;

mkdirSync(join(root, "db", "seeds"), { recursive: true });
writeFileSync(join(root, "db", "seeds", "listings_demo.sql"), sql);
console.log(`wrote db/seeds/listings_demo.sql (${businesses.length} rows)`);
