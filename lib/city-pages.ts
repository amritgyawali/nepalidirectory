export type CityDirectoryPage = {
  name: string;
  slug: string;
  href: string;
  province: string;
  title: string;
  seoTitle: string;
  description: string;
  image: string;
  imageAlt: string;
  listings: string;
  neighborhoods: string;
  rating: string;
  highlight: string;
  keywords: string[];
  popularSearches: string[];
};

const image = (id: string, width = "1800", height = "780") =>
  `https://images.unsplash.com/${id}?w=${width}&h=${height}&fit=crop&auto=format`;

export const cityDirectoryPages: CityDirectoryPage[] = [
  {
    name: "Kathmandu",
    slug: "kathmandu",
    href: "/city/kathmandu",
    province: "Bagmati Province",
    title: "Kathmandu local business directory",
    seoTitle: "Kathmandu Business Directory: Restaurants, Hotels, Doctors and Services",
    description:
      "Find verified restaurants, hotels, doctors, salons, contractors and home services across Kathmandu Valley.",
    image: image("photo-1605640840605-14ac1855827b"),
    imageAlt: "Kathmandu city and heritage skyline",
    listings: "12,840",
    neighborhoods: "28",
    rating: "4.6",
    highlight: "Best for dense local search across restaurants, clinics, hotels and home services.",
    keywords: ["Kathmandu business directory", "businesses in Kathmandu", "Kathmandu restaurants", "Kathmandu hotels"],
    popularSearches: ["Restaurants", "Doctors", "Hotels", "Plumbers", "Electricians", "Beauty Salons"]
  },
  {
    name: "Pokhara",
    slug: "pokhara",
    href: "/city/pokhara",
    province: "Gandaki Province",
    title: "Pokhara local business directory",
    seoTitle: "Pokhara Business Directory: Hotels, Travel Agencies, Restaurants and Services",
    description:
      "Find Pokhara hotels, travel agencies, restaurants, cafes, adventure desks and local services around Lakeside and nearby areas.",
    image: image("photo-1626621341517-bbf3d9990a23"),
    imageAlt: "Phewa Lake and mountain views in Pokhara",
    listings: "4,210",
    neighborhoods: "14",
    rating: "4.5",
    highlight: "Best for hotels, travel agencies, adventure services and lake-area dining.",
    keywords: ["Pokhara business directory", "Pokhara hotels", "Pokhara travel agencies", "Pokhara restaurants"],
    popularSearches: ["Hotels", "Travel Agencies", "Restaurants", "Cafes", "Adventure Tours", "Resorts"]
  },
  {
    name: "Lalitpur",
    slug: "lalitpur",
    href: "/city/lalitpur",
    province: "Bagmati Province",
    title: "Lalitpur local business directory",
    seoTitle: "Lalitpur Business Directory: Clinics, Schools, Restaurants and Services",
    description:
      "Browse Lalitpur businesses including Patan restaurants, clinics, schools, salons, repair services and professional providers.",
    image: image("photo-1561361513-2d000a50f0dc"),
    imageAlt: "Patan Durbar Square in Lalitpur",
    listings: "6,580",
    neighborhoods: "21",
    rating: "4.6",
    highlight: "Best for Patan dining, schools, clinics, salons and professional services.",
    keywords: ["Lalitpur business directory", "Patan restaurants", "Lalitpur clinics", "Lalitpur schools"],
    popularSearches: ["Restaurants", "Clinics", "Schools", "Beauty Salons", "Contractors", "Cafes"]
  },
  {
    name: "Bhaktapur",
    slug: "bhaktapur",
    href: "/city/bhaktapur",
    province: "Bagmati Province",
    title: "Bhaktapur local business directory",
    seoTitle: "Bhaktapur Business Directory: Newari Restaurants, Hotels and Local Services",
    description:
      "Find Bhaktapur restaurants, hotels, heritage dining rooms, shops, repair providers and local services.",
    image: image("photo-1614107707379-283a65774553"),
    imageAlt: "Historic square in Bhaktapur",
    listings: "2,940",
    neighborhoods: "12",
    rating: "4.5",
    highlight: "Best for heritage dining, local shops, hotels and neighborhood service providers.",
    keywords: ["Bhaktapur business directory", "Bhaktapur restaurants", "Newari restaurant Bhaktapur", "Bhaktapur hotels"],
    popularSearches: ["Newari Restaurants", "Hotels", "Shops", "Contractors", "Plumbers", "Cafes"]
  },
  {
    name: "Chitwan",
    slug: "chitwan",
    href: "/city/chitwan",
    province: "Bagmati Province",
    title: "Chitwan local business directory",
    seoTitle: "Chitwan Business Directory: Hotels, Safari Tours, Restaurants and Services",
    description:
      "Explore Chitwan hotels, safari operators, restaurants, transport providers, clinics and local services.",
    image: image("photo-1571401835393-8c5f35328320"),
    imageAlt: "River and forest landscape in Chitwan",
    listings: "1,820",
    neighborhoods: "9",
    rating: "4.4",
    highlight: "Best for safari tours, hotels, family travel and regional service searches.",
    keywords: ["Chitwan business directory", "Chitwan hotels", "Chitwan safari", "Sauraha restaurants"],
    popularSearches: ["Hotels", "Safari Tours", "Restaurants", "Travel Agencies", "Clinics", "Transport"]
  },
  {
    name: "Biratnagar",
    slug: "biratnagar",
    href: "/city/biratnagar",
    province: "Koshi Province",
    title: "Biratnagar local business directory",
    seoTitle: "Biratnagar Business Directory: Doctors, Schools, Hotels and Services",
    description:
      "Find Biratnagar doctors, schools, hotels, restaurants, shops, repair providers and professional services.",
    image: image("photo-1544735716-392fe2489ffa"),
    imageAlt: "Busy Nepal city street and businesses",
    listings: "2,260",
    neighborhoods: "11",
    rating: "4.4",
    highlight: "Best for eastern Nepal business search across healthcare, education and services.",
    keywords: ["Biratnagar business directory", "Biratnagar doctors", "Biratnagar schools", "Biratnagar hotels"],
    popularSearches: ["Doctors", "Schools", "Hotels", "Restaurants", "Repair Services", "Shops"]
  },
  {
    name: "Butwal",
    slug: "butwal",
    href: "/city/butwal",
    province: "Lumbini Province",
    title: "Butwal local business directory",
    seoTitle: "Butwal Business Directory: Hotels, Restaurants, Clinics and Services",
    description:
      "Browse Butwal hotels, restaurants, clinics, schools, auto repair shops, contractors and local services.",
    image: image("photo-1518002054494-3a6f94352e9d"),
    imageAlt: "Nepal road and city travel scene",
    listings: "1,940",
    neighborhoods: "10",
    rating: "4.3",
    highlight: "Best for Lumbini corridor hotels, restaurants, clinics and service providers.",
    keywords: ["Butwal business directory", "Butwal hotels", "Butwal restaurants", "Butwal clinics"],
    popularSearches: ["Hotels", "Restaurants", "Clinics", "Auto Repair", "Contractors", "Schools"]
  },
  {
    name: "Dharan",
    slug: "dharan",
    href: "/city/dharan",
    province: "Koshi Province",
    title: "Dharan local business directory",
    seoTitle: "Dharan Business Directory: Restaurants, Clinics, Hotels and Services",
    description:
      "Find Dharan restaurants, clinics, hotels, schools, repair providers, salons and local business services.",
    image: image("photo-1500534314209-a25ddb2bd429"),
    imageAlt: "Green hill road and eastern Nepal travel landscape",
    listings: "1,420",
    neighborhoods: "8",
    rating: "4.3",
    highlight: "Best for eastern hill-city dining, clinics, hotels and neighborhood services.",
    keywords: ["Dharan business directory", "Dharan restaurants", "Dharan clinics", "Dharan hotels"],
    popularSearches: ["Restaurants", "Clinics", "Hotels", "Schools", "Beauty Salons", "Repair Services"]
  }
];

export function getCityDirectoryPage(slug: string) {
  return cityDirectoryPages.find((city) => city.slug === slug);
}

export function slugifyCityName(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function getCityHref(name: string) {
  const slug = slugifyCityName(name);
  return getCityDirectoryPage(slug)?.href ?? `/search?location=${encodeURIComponent(name)}`;
}
