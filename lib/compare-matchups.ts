/**
 * Head-to-head comparison data for /compare-business/[slug].
 *
 * Every category carries at least ten contenders (photography carries twenty) and twenty
 * category-specific conditions.
 * Scores are 1-10 editorial estimates compiled from public information (official websites,
 * OpenStreetMap and directory listings, published service details). They are indicative, not
 * audits, and every page says so. Flip `reviewed` to true only after a person has checked a
 * category's scores against current evidence; that flag is what allows the page to be indexed.
 */

export type MatchupContender = {
  name: string;
  area: string;
  note: string;
  /** One score per condition, same order as `conditions`, each 1-10 where higher is better. */
  scores: number[];
};

export type CategoryMatchup = {
  slug: string;
  conditions: string[];
  contenders: MatchupContender[];
  reviewed: boolean;
};

export const MATCHUP_REVIEWED_AT = "2026-09-23";

const c = (name: string, area: string, note: string, scores: string): MatchupContender => ({
  name,
  area,
  note,
  scores: scores.trim().split(/\s+/).map(Number)
});

const matchups: CategoryMatchup[] = [
  {
    slug: "hotels",
    reviewed: false,
    conditions: [
      "Location convenience", "Room comfort", "Cleanliness", "Staff service", "Breakfast & dining",
      "Value for money", "Wi-Fi reliability", "Airport access", "Pool & leisure", "Spa & wellness",
      "Family friendliness", "Business facilities", "Parking", "Safety & security", "Views & ambience",
      "Accessibility", "Check-in experience", "Sustainability", "Event spaces", "Guest reputation"
    ],
    contenders: [
      c("Dwarika's Hotel", "Battisputali, Kathmandu", "Heritage luxury hotel built around restored Newari woodwork.", "8 10 10 10 10 6 8 9 9 9 8 8 8 10 10 7 9 9 9 10"),
      c("Hyatt Regency Kathmandu", "Boudha, Kathmandu", "Resort-style hotel with large grounds near Boudhanath Stupa.", "7 9 9 9 9 7 9 8 10 9 9 9 10 9 9 9 9 8 10 9"),
      c("The Soaltee Kathmandu", "Tahachal, Kathmandu", "Large five-star property with banquet halls and casino.", "6 8 9 9 9 7 8 6 9 9 9 9 9 9 8 8 8 7 10 8"),
      c("Hotel Yak & Yeti", "Durbar Marg, Kathmandu", "Historic five-star hotel on Durbar Marg with Rana-palace wing.", "10 8 8 9 9 7 8 7 8 8 8 9 7 9 9 7 8 7 10 8"),
      c("Kathmandu Marriott Hotel", "Naxal, Kathmandu", "International-brand business hotel in central Naxal.", "9 9 9 9 8 7 9 8 8 8 8 10 8 9 7 9 9 7 8 8"),
      c("Aloft Kathmandu Thamel", "Thamel, Kathmandu", "Design-led international-brand hotel at the edge of Thamel.", "10 8 9 8 7 8 9 7 6 5 7 8 6 8 7 8 9 7 7 8"),
      c("Radisson Hotel Kathmandu", "Lazimpat, Kathmandu", "Five-star hotel in the Lazimpat embassy area.", "9 8 8 8 8 7 8 8 8 7 8 8 7 8 7 8 8 6 8 7"),
      c("Hotel Shanker", "Lazimpat, Kathmandu", "Converted Rana palace with gardens and a pool.", "8 7 8 8 8 8 7 8 8 6 8 7 8 8 9 6 7 7 9 7"),
      c("Temple Tree Resort & Spa", "Lakeside, Pokhara", "Boutique resort with a pool and spa in Pokhara Lakeside.", "8 8 9 9 8 8 7 6 9 9 8 5 7 8 9 6 8 8 5 9"),
      c("Fish Tail Lodge", "Pokhara", "Lodge on the Phewa Lake shore reached by raft ferry.", "7 7 8 8 8 7 6 6 8 7 8 5 7 8 10 5 7 8 7 8")
    ]
  },
  {
    slug: "restaurants",
    reviewed: false,
    conditions: [
      "Food taste", "Menu variety", "Authenticity", "Service speed", "Staff friendliness",
      "Hygiene", "Ambience", "Value for money", "Portion size", "Vegetarian options",
      "Dietary accommodations", "Group seating", "Reservation ease", "Location access", "Parking",
      "Opening hours", "Drinks selection", "Family friendly", "Online presence", "Consistency"
    ],
    contenders: [
      c("Krishnarpan at Dwarika's", "Battisputali, Kathmandu", "Multi-course Nepali tasting menu in a heritage hotel.", "10 7 10 7 10 10 10 5 9 8 8 7 8 6 8 6 9 8 8 10"),
      c("Bhojan Griha", "Dillibazar, Kathmandu", "Traditional Nepali set meals with cultural shows in a restored mansion.", "9 7 10 7 9 9 10 6 9 9 7 10 8 7 7 6 8 9 7 9"),
      c("Chez Caroline", "Babar Mahal Revisited, Kathmandu", "French-style bistro in a courtyard complex.", "9 8 8 8 9 9 9 6 7 7 7 7 8 8 9 7 9 7 7 9"),
      c("Thamel House Restaurant", "Thamel, Kathmandu", "Newari and Nepali dishes served in a traditional house.", "8 7 9 7 8 8 9 7 8 8 6 8 7 9 5 7 7 7 6 8"),
      c("OR2K", "Thamel, Kathmandu", "Vegetarian Middle Eastern and fusion menu with floor seating.", "8 9 7 8 8 8 8 8 8 10 9 7 6 9 4 8 7 7 8 8"),
      c("Fire and Ice Pizzeria", "Thamel, Kathmandu", "Long-running Italian pizzeria near Thamel.", "8 7 8 7 7 8 7 8 8 8 6 8 5 9 4 8 7 9 7 9"),
      c("Yangling Tibetan Restaurant", "Thamel, Kathmandu", "Small Tibetan kitchen known for momo and thukpa.", "8 6 9 8 8 7 5 10 9 7 5 5 4 8 3 7 5 7 5 8"),
      c("Utse Restaurant", "Jyatha, Kathmandu", "Long-established Tibetan restaurant in Jyatha.", "7 7 9 8 8 7 6 9 8 7 5 7 5 8 4 8 6 7 5 8"),
      c("Gaia Restaurant & Coffee Shop", "Thamel, Kathmandu", "Garden café-restaurant with an international menu.", "7 8 6 7 8 8 8 8 7 8 7 7 5 9 4 8 8 7 6 7"),
      c("Roadhouse Cafe", "Thamel, Kathmandu", "Wood-fired pizza and café menu from a multi-branch brand.", "7 8 6 8 7 8 8 7 7 7 6 8 7 9 5 8 8 8 9 8")
    ]
  },
  {
    slug: "cafes-lalitpur",
    reviewed: false,
    conditions: [
      "Coffee quality", "Food menu", "Tea options", "Bakery & desserts", "Seating comfort",
      "Work friendliness", "Wi-Fi", "Power outlets", "Ambience", "Outdoor seating",
      "Quietness", "Service speed", "Staff friendliness", "Cleanliness", "Opening hours",
      "Value for money", "Location access", "Parking", "Meeting suitability", "Customer reputation"
    ],
    contenders: [
      c("Dhokaima Cafe", "Patan Dhoka, Lalitpur", "Garden café in a restored building beside Patan Dhoka.", "8 8 8 8 9 7 7 6 10 10 8 7 8 9 7 7 8 7 9 9"),
      c("Café Soma", "Jhamsikhel, Lalitpur", "Neighbourhood café known for breakfasts and baked goods.", "8 9 7 9 8 8 8 7 8 8 7 7 8 9 7 7 8 6 8 9"),
      c("Himalayan Java Coffee", "Pulchowk, Lalitpur", "Nepali coffee chain with work-friendly branches.", "9 7 7 8 8 9 9 8 7 6 6 8 8 8 8 7 9 6 8 8"),
      c("Vesper Café", "Jhamsikhel, Lalitpur", "Café-restaurant with a large courtyard garden.", "8 9 7 8 8 7 7 6 9 9 7 7 8 8 7 6 8 6 8 8"),
      c("Café du Temple", "Patan Durbar Square, Lalitpur", "Rooftop café overlooking Patan Durbar Square.", "7 8 7 7 7 5 6 4 10 9 6 7 8 8 7 7 8 3 6 8"),
      c("Roadhouse Cafe Jhamsikhel", "Jhamsikhel, Lalitpur", "Branch of the Roadhouse pizza and café brand.", "7 8 6 8 8 6 7 6 8 8 6 8 7 8 8 7 8 6 7 8"),
      c("Karma Coffee", "Jhamsikhel, Lalitpur", "Specialty coffee café focused on Nepali beans.", "9 6 7 7 7 8 8 7 7 7 8 8 8 8 7 8 8 6 7 8"),
      c("The Workshop Eatery", "Lalitpur", "All-day eatery with a laptop-friendly dining room.", "8 8 6 8 7 8 8 8 8 6 7 7 8 8 7 8 7 6 8 7"),
      c("Café Cheeno", "Patan Durbar Square, Lalitpur", "Small café in a heritage building near the square.", "7 7 7 7 7 6 6 5 8 7 7 7 8 7 7 8 8 3 6 7"),
      c("Honacha", "Patan Durbar Square, Lalitpur", "Tiny traditional Newari eatery known for bara and chatamari.", "4 8 6 5 4 2 2 2 7 3 4 8 8 6 6 10 8 2 3 8")
    ]
  },
  {
    slug: "healthcare-clinics",
    reviewed: false,
    conditions: [
      "Specialty range", "Doctor expertise", "Emergency care", "ICU capacity", "Diagnostics & imaging",
      "Appointment access", "Waiting time", "Nursing care", "Cleanliness", "Cost transparency",
      "Insurance acceptance", "On-site pharmacy", "Location access", "Parking", "Patient communication",
      "Follow-up care", "Ambulance service", "International patient support", "Medical technology", "Patient reputation"
    ],
    contenders: [
      c("Grande International Hospital", "Dhapasi, Kathmandu", "Private tertiary hospital with a broad specialist line-up.", "9 9 9 9 10 8 7 9 9 7 9 9 7 9 8 8 9 9 10 8"),
      c("Norvic International Hospital", "Thapathali, Kathmandu", "Central private hospital known for cardiac and general care.", "9 9 9 9 9 8 7 9 9 7 9 9 9 7 8 8 9 8 9 8"),
      c("Nepal Mediciti Hospital", "Bhaisepati, Lalitpur", "Large private hospital campus with advanced imaging.", "10 9 9 10 10 8 7 9 9 7 9 9 6 10 8 8 9 9 10 8"),
      c("Tribhuvan University Teaching Hospital", "Maharajgunj, Kathmandu", "Government teaching hospital and major referral centre.", "10 10 8 8 8 5 3 7 6 8 8 8 8 5 6 7 8 5 8 8"),
      c("Patan Hospital", "Lagankhel, Lalitpur", "Community-rooted teaching hospital run by PAHS.", "9 9 8 8 8 6 4 8 7 9 8 8 8 6 7 8 8 6 7 9"),
      c("HAMS Hospital", "Dhumbarahi, Kathmandu", "Mid-size private hospital with general and specialist OPDs.", "8 8 8 8 8 8 8 8 8 7 8 8 8 7 8 8 8 7 8 8"),
      c("B&B Hospital", "Gwarko, Lalitpur", "Private hospital recognised for orthopaedics and trauma.", "8 9 8 8 8 7 6 8 8 7 8 8 7 7 7 8 8 6 8 8"),
      c("Om Hospital & Research Centre", "Chabahil, Kathmandu", "Private general hospital in north-east Kathmandu.", "8 8 8 8 8 7 7 8 8 7 8 8 8 6 7 7 8 6 8 7"),
      c("Star Hospital", "Sanepa, Lalitpur", "Private hospital serving Lalitpur and south Kathmandu.", "7 8 8 7 8 8 8 8 8 7 8 8 8 7 8 7 7 6 7 7"),
      c("Alka Hospital", "Jawalakhel, Lalitpur", "Private hospital close to the Jawalakhel ring-road area.", "7 7 8 7 7 8 8 8 8 8 8 8 9 6 8 7 7 5 7 7")
    ]
  },
  {
    slug: "doctors",
    reviewed: false,
    conditions: [
      "Specialist availability", "Doctor credentials", "Consultation quality", "Appointment ease", "Waiting time",
      "Diagnostic support", "Consultation fee value", "Follow-up process", "Communication", "Second opinion access",
      "Tele-consultation", "Emergency referral", "Report turnaround", "Cleanliness", "Location access",
      "Opening hours", "Language support", "Patient privacy", "Record keeping", "Patient reputation"
    ],
    contenders: [
      c("Tilganga Institute of Ophthalmology", "Gaushala, Kathmandu", "Eye-care centre known for cataract and cornea services.", "9 10 9 7 5 9 9 8 8 8 6 8 8 8 8 7 8 7 8 10"),
      c("Shahid Gangalal National Heart Centre", "Bansbari, Kathmandu", "National cardiac referral centre.", "9 10 9 5 4 9 9 8 7 8 5 10 8 7 7 7 7 7 8 9"),
      c("CIWEC Hospital & Travel Medicine Center", "Lainchaur, Kathmandu", "Travel-medicine clinic widely used by visitors and expatriates.", "7 9 9 9 9 8 6 9 9 7 8 8 9 9 9 9 10 9 9 9"),
      c("Kanti Children's Hospital", "Maharajgunj, Kathmandu", "Government paediatric referral hospital.", "9 9 8 5 4 8 10 7 7 7 5 9 7 6 8 7 7 6 7 8"),
      c("Nepal International Clinic", "Lal Durbar, Kathmandu", "Outpatient and travel clinic near Durbar Marg.", "7 9 9 9 8 7 6 8 9 7 8 7 8 9 9 7 10 9 9 8"),
      c("Kathmandu Model Hospital", "Pradarshani Marg, Kathmandu", "Non-profit hospital with low-cost specialist OPDs.", "8 8 8 7 6 8 8 7 7 7 6 8 7 7 9 8 7 7 7 7"),
      c("Nepal Eye Hospital", "Tripureshwor, Kathmandu", "Long-established eye hospital in central Kathmandu.", "7 9 8 6 5 8 9 7 7 7 5 7 7 7 9 7 7 6 7 8"),
      c("Nepal Orthopaedic Hospital", "Jorpati, Kathmandu", "Community orthopaedic hospital for bone and joint care.", "7 9 8 6 5 8 9 8 7 7 5 8 7 7 6 7 7 6 7 8"),
      c("Sewa Polyclinic", "Kathmandu", "Polyclinic offering general and specialist consultations.", "6 8 7 8 8 7 8 7 8 6 6 6 8 7 8 8 7 7 7 7"),
      c("Saudi Nepal Medical Centre", "Lalitpur", "Outpatient medical centre in Lalitpur.", "6 8 7 8 8 7 8 7 7 6 6 6 7 7 7 8 7 7 7 7")
    ]
  },
  {
    slug: "dental-clinics",
    reviewed: false,
    conditions: [
      "Treatment range", "Specialist team", "Orthodontics", "Cosmetic dentistry", "Implants",
      "Diagnostics & X-ray", "Sterilization", "Pain management", "Written cost plan", "Price transparency",
      "Appointment ease", "Waiting time", "Emergency care", "Children's dentistry", "Equipment",
      "Follow-up care", "Location access", "Communication", "Value for money", "Patient reputation"
    ],
    contenders: [
      c("Ciwec Dental Clinic", "Lainchaur, Kathmandu", "Dental clinic associated with the CIWEC travel-medicine group.", "9 9 8 9 9 9 10 9 9 8 9 8 9 7 9 9 9 10 6 9"),
      c("Advanced Ortho-Dental Clinic", "Naxal, Kathmandu", "Clinic with an orthodontics focus.", "8 9 10 8 8 9 9 8 8 8 8 8 7 7 9 9 9 8 7 8"),
      c("Allure Specialized Dental & Cosmetic Clinic", "New Baneshwor, Kathmandu", "Specialised dental and cosmetic clinic.", "9 9 8 10 9 9 9 8 8 8 8 8 7 7 9 8 8 8 7 8"),
      c("Brilliant Smile Dental Clinics", "Maharajgunj, Kathmandu", "General and cosmetic dental clinic.", "8 8 8 9 8 8 9 8 8 8 8 8 7 8 8 8 8 8 8 8"),
      c("Healthy 32 Ortho-Dental Clinic", "Dillibazar, Kathmandu", "Orthodontic and general dental clinic.", "8 8 9 7 7 8 8 8 8 8 8 7 7 8 8 8 8 8 8 8"),
      c("Advanced Dental Care", "Uttar Dhoka, Kathmandu", "General dental practice near Lazimpat.", "8 8 7 8 8 8 9 8 8 8 8 7 8 7 8 8 9 8 7 8"),
      c("Dental Villa - Ortho & Speciality Dental Clinic", "Balkhu, Kathmandu", "Orthodontic and speciality dental clinic.", "8 8 9 7 7 8 8 8 8 8 8 8 7 7 8 8 7 8 8 7"),
      c("Glimmer Dental Care Center", "Sinamangal, Kathmandu", "Dental care centre near the airport corridor.", "7 7 7 8 7 8 8 8 8 8 8 8 7 8 8 8 8 8 8 7"),
      c("Care Dental Clinic", "Old Baneshwor, Kathmandu", "Neighbourhood dental clinic.", "7 7 7 7 6 8 8 8 8 8 8 8 7 8 7 8 8 8 8 7"),
      c("BBC Dental Clinic", "Maitidevi, Kathmandu", "Neighbourhood dental clinic.", "7 7 7 7 6 7 8 7 8 8 8 8 7 8 7 7 8 8 8 7")
    ]
  },
  {
    slug: "schools",
    reviewed: false,
    conditions: [
      "Academic results", "Curriculum quality", "Teacher quality", "Student-teacher ratio", "Fee transparency",
      "Value for fees", "Science labs", "Library", "Sports facilities", "Extracurriculars",
      "Arts & music", "Transport", "Campus safety", "Boarding option", "Parent communication",
      "Counselling support", "Technology in class", "English proficiency", "University placement", "Parent reputation"
    ],
    contenders: [
      c("Budhanilkantha School", "Budhanilkantha, Kathmandu", "Residential school with a large campus and scholarship intake.", "10 9 9 8 8 9 9 9 10 9 8 6 9 10 8 8 8 9 10 10"),
      c("St. Xavier's School", "Jawalakhel, Lalitpur", "Jesuit-run school with a long academic record.", "10 9 9 7 8 9 8 8 8 8 7 7 9 5 8 7 7 9 9 10"),
      c("Rato Bangala School", "Patan Dhoka, Lalitpur", "Progressive school known for child-centred teaching.", "9 10 10 9 8 7 8 9 7 9 10 7 9 2 9 9 8 9 9 9"),
      c("Lincoln School", "Rabi Bhawan, Kathmandu", "American-curriculum international school.", "9 10 9 10 8 5 9 9 9 9 9 8 9 2 9 9 10 10 9 8"),
      c("The British School", "Jhamsikhel, Lalitpur", "British-curriculum international school.", "9 9 9 10 8 5 9 8 8 9 9 7 9 2 9 9 9 10 9 8"),
      c("Little Angels' School", "Hattiban, Lalitpur", "Large private school with a hilltop campus.", "8 8 8 7 7 8 8 8 9 8 7 9 8 9 7 7 8 8 8 8"),
      c("GEMS School", "Dhapakhel, Lalitpur", "Private school with day and boarding options.", "8 8 8 8 7 7 8 8 9 9 8 9 8 9 8 8 8 8 8 8"),
      c("Galaxy Public School", "Gyaneshwor, Kathmandu", "Central Kathmandu private school.", "8 8 8 7 8 8 7 7 7 8 7 8 8 4 8 7 8 8 8 8"),
      c("DAV Sushil Kedia Vishwa Bharati School", "Jawalakhel, Lalitpur", "Private school following a DAV-affiliated model.", "8 8 8 7 8 8 7 7 7 8 7 8 8 4 7 7 7 8 7 8"),
      c("Malpi International School", "Panauti, Kavrepalanchok", "Residential school outside the valley.", "8 8 8 8 7 7 8 7 8 8 7 5 9 10 8 8 7 8 8 7")
    ]
  },
  {
    slug: "travel-agencies",
    reviewed: false,
    conditions: [
      "Government licensing", "Itinerary clarity", "Guide expertise", "Permit handling", "Safety & emergency plan",
      "Insurance guidance", "Price transparency", "Quote inclusions", "Accommodation quality", "Transport quality",
      "Group size options", "Customization", "Response time", "High-altitude experience", "Porter welfare",
      "Sustainability", "Payment security", "Cancellation terms", "Value for money", "Traveller reputation"
    ],
    contenders: [
      c("Seven Summit Treks", "Kathmandu", "Large expedition operator for 8,000 m peaks.", "10 8 10 10 9 8 7 8 8 8 9 8 8 10 8 7 8 7 7 9"),
      c("Asian Trekking", "Thamel, Kathmandu", "Veteran trekking and expedition company.", "10 9 9 10 9 8 8 8 8 8 8 8 8 10 8 9 8 8 7 9"),
      c("Thamserku Trekking", "Kathmandu", "Khumbu-focused operator with its own lodge network.", "10 9 9 10 9 8 8 9 9 8 8 8 8 9 8 8 8 8 7 9"),
      c("Himalayan Glacier", "Kathmandu", "Trekking and tour operator with international sales.", "10 9 9 9 9 9 8 9 8 8 8 9 9 8 8 7 9 8 8 9"),
      c("Nepal Hiking Team", "Kathmandu", "Trekking agency for classic and custom routes.", "10 9 9 9 8 8 9 8 7 7 9 9 9 8 8 8 8 8 9 9"),
      c("Peak Promotion", "Thamel, Kathmandu", "Trekking and peak-climbing operator.", "10 8 9 9 9 8 8 8 7 7 8 8 8 9 8 7 8 7 8 8"),
      c("Nepal Vision Treks", "Thamel, Kathmandu", "Trekking and tour agency.", "10 8 8 9 8 8 8 8 7 7 8 9 9 7 8 7 8 8 8 8"),
      c("Marco Polo Travels Nepal", "Kamalpokhari, Kathmandu", "Travel agency for cultural tours, hotels and ticketing.", "10 8 7 8 7 8 8 8 8 9 9 9 8 5 7 7 9 8 8 8"),
      c("Imagine Nepal", "Kathmandu", "Expedition and trekking operator.", "10 8 9 9 9 8 7 8 7 7 8 9 8 9 8 7 8 7 7 8"),
      c("Pioneer Adventure", "Thamel, Kathmandu", "Trekking and adventure-tour agency.", "10 8 8 9 8 7 8 7 7 7 8 8 8 7 8 7 7 7 8 8")
    ]
  },
  {
    slug: "wedding-venues",
    reviewed: false,
    conditions: [
      "Guest capacity", "Layout flexibility", "Décor quality", "In-house catering", "Menu flexibility",
      "Outside caterer policy", "Parking", "Location access", "Indoor backup", "Garden & outdoor space",
      "Guest accommodation", "Sound & lighting", "Bridal prep rooms", "Staff coordination", "Price transparency",
      "Package inclusions", "Photo spots", "Cleanliness", "Value for money", "Couple reputation"
    ],
    contenders: [
      c("Dwarika's Hotel", "Battisputali, Kathmandu", "Heritage courtyards for intimate, high-end weddings.", "7 8 10 10 9 3 7 8 9 9 10 9 10 10 7 9 10 10 6 10"),
      c("Hyatt Regency Kathmandu", "Boudha, Kathmandu", "Large lawns and ballrooms for big guest lists.", "10 9 9 9 9 3 10 7 10 10 10 9 10 9 7 9 9 9 6 9"),
      c("The Soaltee Kathmandu", "Tahachal, Kathmandu", "Multiple banquet halls and garden lawns.", "10 9 9 9 9 3 9 6 10 9 10 9 9 9 7 9 8 9 7 9"),
      c("Hotel Yak & Yeti", "Durbar Marg, Kathmandu", "Central hotel with palace halls and a garden.", "9 9 9 9 9 3 7 10 10 8 10 9 9 9 7 9 9 9 7 9"),
      c("Gokarna Forest Resort", "Gokarna, Kathmandu", "Forest resort setting for outdoor ceremonies.", "7 8 9 8 8 3 9 5 8 10 9 8 9 8 7 8 10 9 6 8"),
      c("Godavari Village Resort", "Godawari, Lalitpur", "Hillside resort with terraced lawns.", "7 8 8 8 8 4 9 5 8 10 9 7 8 8 7 8 9 8 7 8"),
      c("Heritage Garden", "Sanepa, Lalitpur", "Garden party venue popular for receptions.", "9 8 8 8 8 5 7 8 7 9 3 8 7 8 8 8 8 8 8 8"),
      c("Hotel Annapurna", "Durbar Marg, Kathmandu", "Central hotel with banquet halls.", "9 8 8 8 8 3 7 10 9 7 9 8 8 8 7 8 7 8 7 8"),
      c("Hotel Himalaya", "Kupondole, Lalitpur", "Hotel with mountain-view lawns and halls.", "8 8 8 8 8 3 8 8 8 8 8 8 8 8 7 8 8 8 7 7"),
      c("Bishranti Party Palace", "Kathmandu", "Dedicated party palace with catering service.", "8 8 7 8 8 6 7 7 8 5 2 7 6 7 8 8 6 7 9 7")
    ]
  },
  {
    slug: "wedding-planners",
    reviewed: false,
    conditions: [
      "Service scope", "Vendor network", "Décor & design", "Catering quality", "Tent & mandap setup",
      "Budget control", "Contract clarity", "Price transparency", "Package flexibility", "Event-day staffing",
      "Timeline management", "Contingency planning", "Ritual knowledge", "Guest management", "Sound & lighting",
      "Transport coordination", "Communication", "Portfolio", "Value for money", "Client reputation"
    ],
    contenders: [
      c("Wedding Nepal", "Kathmandu", "Wedding attire, décor and arrangement service.", "9 9 9 7 8 8 8 8 8 8 8 8 9 8 8 7 8 9 7 8"),
      c("Bishranti Party Palace & Catering Services", "Kathmandu", "Venue-plus-catering team that runs full wedding days.", "8 8 8 9 8 8 8 8 8 9 8 8 9 8 8 6 8 8 8 8"),
      c("Shuva Tara Tent House & Catering Service", "Kathmandu", "Tent house and caterer for home and ground weddings.", "8 8 8 8 9 8 7 8 8 8 8 7 9 8 7 6 8 7 8 8"),
      c("Aadhunik Catering & Rental Service", "Kathmandu", "Catering and event-rental service.", "8 8 7 8 9 8 7 8 8 8 8 7 9 7 7 6 8 7 8 8"),
      c("Subha Tara Catering & Rental Service", "Kathmandu", "Catering and rental service for ceremonies.", "7 7 7 8 9 8 7 8 8 8 7 7 9 7 7 6 8 7 8 7"),
      c("Bhimeshwor Catering & Tent House", "Kathmandu", "Catering and tent house for family events.", "7 7 7 8 8 8 7 8 8 8 7 7 9 7 7 6 7 7 8 7"),
      c("Aadinath Catering & Rental", "Kathmandu", "Catering and event-rental service.", "7 7 7 8 8 8 7 8 7 7 7 7 9 7 7 6 7 7 8 7"),
      c("Siddhi Ganesh Decoration", "Kathmandu", "Wedding and event decoration specialist.", "6 7 9 3 7 7 7 8 8 7 7 7 8 5 8 4 8 8 8 7"),
      c("T.M Decorating Center", "Kathmandu", "Decoration and furnishing service for events.", "6 7 8 3 6 7 7 8 8 6 7 6 8 5 7 4 7 7 8 7"),
      c("Karki Catering & Tent House", "Kathmandu", "Catering and tent house.", "7 6 6 8 8 8 6 7 7 7 7 6 9 7 6 6 7 6 8 7")
    ]
  },
  {
    slug: "photography",
    reviewed: false,
    conditions: [
      "Portfolio quality", "Wedding coverage", "Event experience", "Portrait & studio work", "Editing style",
      "Cinematic video", "Drone coverage", "Equipment", "Team size", "Delivery timeline",
      "Package clarity", "Price transparency", "Albums & prints", "Usage rights clarity", "Communication",
      "Punctuality", "Creativity", "Backup & storage", "Value for money", "Client reputation"
    ],
    contenders: [
      c("Photo Choice Nepal", "Koteshwor, Kathmandu", "Full-service studio since 2009 with in-house albums, framing and printing; pre-wedding from about NPR 15,000 and one-day photo + video from about NPR 35,000.", "9 10 10 9 8 8 7 8 8 8 9 9 10 7 9 9 8 8 9 10"),
      c("Wedding City Nepal Pvt. Ltd.", "Kathmandu", "Large cinematic production company founded in 2016, now 30+ specialists covering photo, film, drone and editing.", "9 10 10 7 9 9 9 9 10 8 8 7 8 7 9 9 9 8 8 9"),
      c("Wedding Kathmandu", "Dhapasi, Kathmandu", "Established studio with an unusually detailed online package catalogue, from one-day shoots to both-side and out-of-Valley coverage with live streaming.", "8 10 9 8 8 8 8 8 8 8 10 10 9 7 8 9 7 8 8 9"),
      c("Wedding Story Nepal", "Butwal & Kathmandu", "Cinematic, story-driven wedding brand with drone and destination coverage; Kathmandu packages from about NPR 45,000 to 150,000.", "9 10 8 7 9 10 9 8 8 8 8 8 8 7 9 8 9 8 7 9"),
      c("Dream Wedding Photography", "Kathmandu", "Photographer-led brand of Kiran Shrestha, combining weddings with specialist maternity and newborn portraiture.", "9 9 8 10 9 7 6 8 7 8 8 7 8 7 9 9 9 8 8 9"),
      c("Wedding Thapas", "Kageshwori-Manohara, Kathmandu", "Affordable full-service photo, video and printing studio with contacts in Melbourne and Sydney.", "8 9 9 9 8 8 7 8 8 8 8 8 9 7 8 8 8 7 8 9"),
      c("Rays Studio", "Kathmandu", "Production-house team with commercial and documentary work behind its wedding photography and cinematography.", "8 9 8 7 9 9 8 9 8 8 8 7 7 7 8 8 9 8 7 8"),
      c("Kantipur Studio", "Old Baneshwor, Kathmandu", "Social-media-aware studio pairing photography with 4K films, vertical reels, drone and same-day highlights; listed tiers from about NPR 15,000 to 30,000.", "8 9 8 8 8 9 7 8 7 9 9 9 7 7 8 8 8 7 8 7"),
      c("PhoPal Studios", "Bhaktapur", "Complete-documentation packages with large edited galleries, full film, short cinema, album and frame; drone priced separately.", "8 9 9 6 8 9 7 8 8 7 8 8 9 7 8 8 8 8 7 8"),
      c("Aakriti Studio Nepal", "Kathmandu", "Candid, documentary-style studio with about 18 years' experience, a second photographer as standard and a 48-hour sneak peek.", "8 9 8 8 8 8 6 8 7 9 8 8 7 7 8 8 8 7 7 7"),
      c("Wedding FotoSewa", "Koteshwor-Baneshwor, Kathmandu", "Value-focused wedding photo and video team listed since 2014, with coverage starting around NPR 45,000.", "8 9 8 7 8 8 7 7 7 8 7 7 7 7 8 8 7 7 9 8"),
      c("Foto Fusion", "Kathmandu Valley", "Art-driven team of Sujan Shakya, Medhankar Shakya and Suraj Nhasiju focused on personalised storytelling; little public package detail.", "9 9 7 7 9 7 6 8 7 8 6 6 7 6 8 8 10 7 7 8"),
      c("Jeo Foto", "Kathmandu & Lalitpur", "Founder-led, digital-first studio with clear tiers from about NPR 40,000 to 100,000, plus reels, drone and same-day teasers.", "8 8 7 7 8 8 7 7 6 8 9 9 6 7 8 8 8 7 7 6"),
      c("Wedding Creation Pokhara", "Pokhara", "Pokhara destination and pre-wedding specialist working around Phewa Lake, Sarangkot and Himalayan viewpoints.", "8 9 8 7 8 8 8 6 6 7 6 6 7 6 8 8 8 7 8 9"),
      c("Wedding Waves Nepal", "Pokhara", "Established Pokhara specialist in candid and cinematic coverage with a strong local reputation; portfolio mainly on Facebook.", "8 9 8 5 8 8 7 7 6 7 6 6 7 6 8 8 8 7 8 9"),
      c("WhiteFOX Ent. Pvt. Ltd.", "Pokhara", "Multi-service studio since 2016 covering weddings, commercial and hotel photography, editing and prints; weddings from about NPR 25,000.", "7 8 8 8 7 7 6 7 8 7 7 7 9 6 7 7 7 7 8 6"),
      c("Vivah Nepal Pokhara", "Pokhara", "Premium destination-wedding brand focused on cinematic films and pre-wedding sessions against Pokhara's lake and mountain backdrops.", "8 9 7 6 8 9 8 8 7 7 5 5 7 6 7 7 8 7 6 8"),
      c("RKRAJ Photography", "Bharatpur, Chitwan", "Boutique, owner-led candid storytelling studio run by Raj Khanal since 2015.", "7 8 7 6 8 7 5 7 4 7 6 5 6 6 8 8 8 6 7 7"),
      c("Nabin Photography", "Devinagar, Butwal", "Local Butwal studio combining wedding photography, videography and editing; check recent complete deliveries before booking.", "6 7 7 6 6 6 5 6 5 6 6 5 6 5 6 6 6 6 8 5"),
      c("Ur Moment Photography Service", "Lagan Tole, Kathmandu", "Long-running Kathmandu wedding and love-story photographer listed since 2011; little current package detail published.", "6 7 7 6 6 5 4 6 5 6 5 4 6 5 6 7 6 6 7 5")
    ]
  },
  {
    slug: "home-services",
    reviewed: false,
    conditions: [
      "Response time", "Service range", "Written estimates", "Price transparency", "Workmanship quality",
      "Materials quality", "Warranty", "Punctuality", "Clean-up after work", "Staff professionalism",
      "Safety practices", "Service area coverage", "Emergency availability", "Booking ease", "Communication",
      "Payment options", "Registered company", "Follow-up support", "Value for money", "Customer reputation"
    ],
    contenders: [
      c("Texido Painting and Decor Pvt. Ltd.", "Kathmandu", "Interior and exterior painting and décor contractor.", "7 8 9 8 9 9 8 8 8 9 8 8 5 8 8 8 10 8 7 8"),
      c("Homes Nepal Construction and Interior Pvt. Ltd.", "Kathmandu", "Renovation, construction and interior company.", "7 9 9 8 8 8 8 7 7 8 8 8 5 7 8 8 10 8 7 8"),
      c("Raj Interior Pvt. Ltd.", "Kathmandu", "Interior fit-out and furnishing company.", "7 8 8 8 8 8 8 7 8 8 7 7 5 7 8 8 10 7 7 8"),
      c("Sambriddhi Kitchen and Interior", "Kathmandu", "Modular kitchen and interior installer.", "7 7 8 8 8 9 8 7 8 8 7 7 4 8 8 8 9 8 7 8"),
      c("Easy Kitchen and Solar Pvt. Ltd.", "Kathmandu", "Modular kitchens and solar water-heater installation.", "7 8 8 8 8 8 8 7 7 8 8 8 5 8 7 8 10 8 7 7"),
      c("All In One Solar Power Solution", "Kathmandu", "Solar power and backup installation service.", "8 7 7 7 8 8 8 8 7 7 8 8 7 8 8 7 7 8 8 7"),
      c("Republic Kitchen and Solar Home", "Kathmandu", "Kitchen fittings and solar products.", "7 7 7 7 7 8 7 7 7 7 7 7 5 7 7 7 8 7 7 7"),
      c("Basement Interiors and Exteriors Pvt. Ltd.", "Tokha, Kathmandu", "Interior and exterior finishing company.", "7 8 7 7 8 7 7 7 7 7 7 7 5 7 8 7 9 7 7 7"),
      c("Snow White Dry Cleaners & Laundry", "Lalitpur", "Dry-cleaning, laundry and pressing service.", "9 6 6 8 8 7 5 8 8 7 7 7 7 9 8 7 6 7 9 8"),
      c("Band Box Dry Cleaners", "Kathmandu", "Dry-cleaning and laundry service.", "8 6 6 8 8 7 5 8 8 7 7 7 6 8 7 7 6 7 8 7")
    ]
  },
  {
    slug: "contractors",
    reviewed: false,
    conditions: [
      "Project portfolio", "Engineering team", "Written estimates", "Cost transparency", "Timeline reliability",
      "Material quality", "Structural safety", "Earthquake-resistant design", "Permits & compliance", "Site supervision",
      "Communication", "Milestone payments", "Handover warranty", "Design support", "Project scale capacity",
      "Equipment", "Worker safety", "Site cleanliness", "Value for money", "Client reputation"
    ],
    contenders: [
      c("G.A Builders (P.) Ltd.", "Kathmandu", "Housing and building company, formerly G.A. Smart Housing.", "9 9 9 8 8 9 9 9 9 9 8 8 8 9 9 8 8 8 7 8"),
      c("Pumori Engineering Services Pvt. Ltd.", "Babarmahal, Kathmandu", "Engineering services and construction firm.", "9 10 9 8 8 8 9 9 9 9 8 8 8 9 8 8 8 7 7 8"),
      c("Sutra Construction & Designers (Prefab) Pvt. Ltd.", "Tinkune, Kathmandu", "Prefab building design and construction.", "8 8 9 8 9 8 8 8 8 8 8 8 8 9 7 8 8 8 8 8"),
      c("C.A. Construction & Consultancy Pvt. Ltd.", "Lazimpat, Kathmandu", "Construction and engineering consultancy.", "8 9 8 8 8 8 9 8 8 8 8 8 7 8 8 7 8 7 7 8"),
      c("Medha Builders Pvt. Ltd.", "Sankhamul, Kathmandu", "Residential and commercial builder.", "8 8 8 8 8 8 8 8 8 8 8 8 8 7 8 7 7 7 8 8"),
      c("Sutra Construction Pvt. Ltd.", "New Baneshwor, Kathmandu", "General building contractor.", "8 8 8 8 7 8 8 8 8 8 8 8 7 8 7 7 7 7 8 7"),
      c("Mastermind Engineering Consultancy", "Bagbazar, Kathmandu", "Structural design and engineering consultancy.", "7 9 8 8 7 7 9 9 9 7 8 7 6 9 6 6 7 7 8 7"),
      c("Nepal Construction Mart", "Kupondole, Lalitpur", "Construction supplies and build services.", "7 7 8 8 7 9 7 7 7 7 8 8 7 7 6 8 7 7 8 7"),
      c("Samrakshyan Nirman Sewa Pvt. Ltd.", "Bharatpur, Chitwan", "Construction company serving Chitwan.", "7 7 7 7 7 7 8 8 8 7 7 7 7 6 7 7 7 7 8 7"),
      c("Kamalamai Construction Suppliers", "Pepsicola, Kathmandu", "Construction supply and small-works contractor.", "6 6 7 8 7 8 7 7 7 7 7 7 6 6 6 7 7 7 9 7")
    ]
  },
  {
    slug: "plumbers",
    reviewed: false,
    conditions: [
      "Response time", "Leak repair", "Pipe fitting", "Bathroom installation", "Water tank & pump work",
      "Drain unblocking", "Visit fee clarity", "Written estimate", "Parts quality", "Parts availability",
      "Warranty", "Punctuality", "Clean-up", "Emergency service", "Service area",
      "Tools & equipment", "Communication", "Payment options", "Value for money", "Customer reputation"
    ],
    contenders: [
      c("Gautam Plumbing Solution", "Kathmandu", "Plumbing repair and installation service.", "8 9 9 8 8 8 8 7 8 7 7 8 8 8 8 8 8 7 8 8"),
      c("Dhapashi Plumbing Sewa", "Dhapasi, Kathmandu", "Local plumbing service in north Kathmandu.", "8 8 8 8 9 8 8 7 7 7 7 8 7 8 7 7 8 7 8 8"),
      c("New Bhimeswor Jumper and Plumbing Sewa", "Kathmandu", "Plumbing and water-pump service.", "8 8 8 7 9 8 8 7 7 7 7 8 7 8 7 7 7 7 8 7"),
      c("Shah Plumber Center", "Kathmandu", "Local plumber for repairs and fittings.", "8 8 8 7 7 8 8 6 7 7 6 8 7 8 7 7 7 6 8 7"),
      c("Odisa Plumbing Sewa", "Kathmandu", "Local plumbing service.", "7 8 8 7 7 8 8 6 7 6 6 7 7 7 7 7 7 6 9 7"),
      c("Subash Samar Electronic & Plumbing Center", "Kathmandu", "Plumbing and electrical parts with repair service.", "7 7 7 7 8 6 7 7 8 8 7 7 7 7 7 7 7 7 7 7"),
      c("Biswo Technician", "Kathmandu", "Technician for plumbing and household repairs.", "8 7 7 6 8 7 7 6 7 6 6 8 7 8 7 7 7 6 8 7"),
      c("Mangal Hardware and Sanitaryware", "Kathmandu", "Sanitaryware supplier; ask about fitting services.", "5 5 6 8 7 4 7 8 9 10 8 6 6 4 6 6 7 8 7 7"),
      c("Kohinoor Color and Sanitary Pvt. Ltd.", "Kathmandu", "Sanitary and paint supplier; ask about fitting services.", "5 5 6 8 6 4 7 8 9 9 8 6 6 4 6 6 7 8 7 7"),
      c("J Cube Sanitary", "Kathmandu", "Sanitaryware shop; ask about fitting services.", "5 5 6 8 6 4 7 7 8 9 7 6 6 4 6 6 7 7 7 7")
    ]
  },
  {
    slug: "electricians",
    reviewed: false,
    conditions: [
      "Job scope range", "Credentials", "Safety process", "Wiring quality", "Fault diagnosis",
      "Inverter & backup setup", "Solar support", "Appliance repair", "Written estimate", "Price transparency",
      "Parts quality", "Parts availability", "Warranty", "Response time", "Emergency service",
      "Punctuality", "Service area", "Communication", "Value for money", "Customer reputation"
    ],
    contenders: [
      c("Pukar International Pvt. Ltd.", "Kathmandu", "Electrical supplies and installation company.", "9 9 9 9 8 8 8 6 9 8 9 9 8 7 6 8 8 8 7 8"),
      c("Subham Electrical Service Pvt. Ltd.", "Lalitpur", "Registered electrical service company.", "9 9 9 9 9 8 7 7 8 8 8 8 8 8 7 8 8 8 8 8"),
      c("RP Electrical and Machinery Workshop", "Kathmandu", "Electrical and machinery repair workshop.", "8 8 8 8 9 7 6 9 7 7 8 7 7 8 7 8 7 7 8 8"),
      c("Bijuli Pasal Pvt. Ltd.", "Kathmandu", "Electrical goods store with installation support.", "7 8 8 8 7 8 7 6 8 8 9 10 8 7 6 8 7 8 8 8"),
      c("Maharjan Electric Workshop", "Lalitpur", "Electrical repair workshop.", "8 7 8 8 8 7 6 8 7 8 7 7 7 8 8 8 7 8 8 8"),
      c("Jaljala Electric", "Kathmandu", "Electrical shop and wiring service.", "7 7 7 8 7 7 6 7 7 8 8 8 7 8 7 7 7 7 8 7"),
      c("Pathivara Electricals", "Kathmandu", "Electrical shop and wiring service.", "7 7 7 7 7 8 7 7 7 8 8 8 7 8 7 7 7 7 8 7"),
      c("Ruben Electric", "Kathmandu", "Local electrician and repair service.", "7 7 7 7 8 7 6 8 7 7 7 7 7 8 8 7 7 7 8 7"),
      c("Sagar Bijuli Pasal", "Kathmandu", "Electrical goods shop.", "6 7 7 7 7 7 6 6 7 8 8 9 7 7 6 7 7 7 8 7"),
      c("Bagalamukhi Electricals", "Lalitpur", "Electrical goods shop.", "6 7 7 7 7 7 6 6 7 8 7 8 7 7 6 7 6 7 8 7")
    ]
  },
  {
    slug: "beauty-salons",
    reviewed: false,
    conditions: [
      "Service range", "Hair styling", "Skin & facial care", "Bridal makeup", "Nail services",
      "Consultation", "Hygiene standards", "Product quality", "Staff skill", "Portfolio",
      "Appointment ease", "Waiting time", "Price transparency", "Package deals", "Ambience",
      "Location access", "Training programs", "Men's grooming", "Value for money", "Client reputation"
    ],
    contenders: [
      c("Aashma Beauty Parlour & Training Center", "Jorpati, Kathmandu", "Beauty parlour with a training centre.", "9 8 8 9 7 8 8 8 9 8 8 7 8 8 7 8 10 3 8 8"),
      c("Fuzion Unisex Salon", "Dhumbarahi, Kathmandu", "Unisex hair and beauty salon.", "8 9 8 7 7 8 8 8 8 8 8 7 8 7 8 8 5 9 8 8"),
      c("Spark and Shine Nail Spa", "Kathmandu", "Nail spa and beauty studio.", "6 5 7 6 10 8 9 8 8 8 9 8 8 7 9 8 5 5 7 8"),
      c("Panache Beauty Parlour", "Lalitpur", "Beauty parlour in Lalitpur.", "8 8 8 8 7 7 8 8 8 8 7 7 8 8 7 8 6 4 8 8"),
      c("Tranquility Spa", "Kathmandu", "Spa for massage and skin treatments.", "6 4 9 5 7 8 9 8 8 7 8 8 8 8 9 7 4 7 7 8"),
      c("Mile Beauty Parlour and Training Center", "Kathmandu", "Beauty parlour with a training centre.", "8 8 8 8 6 7 8 7 8 7 7 7 8 8 7 7 9 3 8 7"),
      c("Fresh Look Saloon and Beauty Home", "Kathmandu", "Salon and beauty home.", "8 8 7 7 6 7 7 7 7 7 7 7 8 7 7 8 5 8 8 7"),
      c("Priya Beauty Parlor", "Old Baneshwor, Kathmandu", "Neighbourhood beauty parlour.", "7 7 7 8 6 7 7 7 7 7 7 7 8 7 6 8 5 3 8 7"),
      c("Chahana Beauty Parlour", "Kathmandu", "Neighbourhood beauty parlour.", "7 7 7 7 6 7 7 7 7 7 7 7 8 7 6 7 5 3 8 7"),
      c("Super Hairdresser Salon", "Kathmandu", "Barber and hairdressing salon.", "5 8 4 3 3 6 7 6 8 6 8 8 9 5 6 8 3 9 9 7")
    ]
  },
  {
    slug: "gyms-fitness-centers",
    reviewed: false,
    conditions: [
      "Equipment range", "Equipment condition", "Coaching quality", "Personal training", "Group classes",
      "Yoga & mobility", "Cardio zone", "Strength zone", "Hygiene", "Changing rooms",
      "Trial terms", "Membership value", "Opening hours", "Crowd levels", "Women-friendly",
      "Nutrition guidance", "Location access", "Parking", "Safety", "Member reputation"
    ],
    contenders: [
      c("Oxygen Fitness", "Kathmandu", "Full-service gym with its own website.", "9 9 8 9 8 7 9 9 9 8 8 7 9 6 8 8 8 7 9 8"),
      c("Power House Fitness and Gym", "Kathmandu", "Strength-focused gym.", "9 8 8 8 7 6 8 10 8 8 7 8 9 6 7 8 8 7 8 8"),
      c("BodyTone Fitness Center", "Kathmandu", "Neighbourhood fitness centre.", "8 8 8 8 8 7 8 8 8 7 7 8 8 7 8 7 8 6 8 8"),
      c("Doubles Fitness Studio", "Kathmandu", "Coaching-led fitness studio.", "7 8 9 9 8 7 7 8 8 7 8 7 8 8 8 8 7 6 8 8"),
      c("Mystic Vibes Fitness Studio", "Kathmandu", "Studio for group fitness classes.", "6 8 8 7 9 8 6 6 8 7 8 8 7 8 9 7 7 6 8 8"),
      c("Pranamaya Yoga", "Thamel, Kathmandu", "Yoga studio with regular drop-in classes.", "3 8 9 6 9 10 2 2 9 7 9 7 7 9 9 7 8 5 9 9"),
      c("Lubhoo Fitness Center", "Lubhu, Lalitpur", "Local gym in the Lubhu area.", "7 7 7 7 6 5 7 8 7 6 8 9 8 8 7 6 6 8 7 7"),
      c("Beauty & The Beast Fitness Station", "Kathmandu", "Neighbourhood fitness station.", "7 7 7 7 7 6 7 8 7 6 7 8 8 7 7 6 7 6 7 7"),
      c("Charming Fitness and Dance Studio", "Lalitpur", "Fitness and dance studio.", "5 7 8 6 9 7 5 5 8 6 8 8 7 8 9 6 7 6 8 7"),
      c("Nepal Byayam Mandir", "Jyatha, Kathmandu", "Long-running traditional gym in central Kathmandu.", "7 6 7 6 5 5 6 8 6 5 7 9 8 7 6 5 8 6 7 7")
    ]
  }
];

const bySlug = new Map(matchups.map((matchup) => [matchup.slug, matchup]));

export function getCategoryMatchup(slug: string): CategoryMatchup | undefined {
  return bySlug.get(slug);
}

export function getAllMatchups(): CategoryMatchup[] {
  return matchups;
}

/** Average of a contender's twenty scores, used to order the contender list. */
export function averageScore(contender: MatchupContender): number {
  return contender.scores.reduce((sum, score) => sum + score, 0) / contender.scores.length;
}
