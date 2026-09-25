import type { BlogSection } from "./blog";

/**
 * City lists of wedding photographers, rendered as the `best-wedding-photographers-in-*` pages.
 *
 * Every entry was compiled from the studio's own website or social page, or from the public
 * directory listing it appears on, and carries that page as `sourceUrl` so readers can check it.
 * Notes restate what the studio or its listing publishes; they are not NepaliDirectory findings.
 * These studios are always rendered alphabetically and never scored or rated — see the guards in
 * `photography-guides.test.ts`. The paid partner is not stored here: the list pages insert it at
 * the disclosed position from `partnerPosition`, so its placement never reads as earned.
 */
export type ShortlistedStudio = {
  name: string;
  /** Neighbourhood or base as the studio or its listing states it. */
  area: string;
  /** What the studio or its listing publishes about itself, stated as its own claim. */
  note: string;
  /** Where a reader can verify the entry. */
  sourceUrl: string;
};

export type CityShortlist = {
  city: string;
  studios: ShortlistedStudio[];
};

/** When the shortlists were last checked against their sources. Update on every refresh. */
export const SHORTLIST_CHECKED = "September 2026";

const directories = {
  biheBazaar: (slug: string) => `https://www.bihebazaar.com/${slug}`,
  purbeliBazar: "https://purbelibazar.com/top-5-wedding-photographers-in-biratnagar/",
  theNimto: "https://thenimto.com/best-photography-in-kathmandu",
  turantCallLalitpur: "https://www.turantcall.com/Lalitpur/wedding/photographers",
  wedTayari: "https://wedtayari.com/service/photography-videography/",
  poudelButwalRoundup:
    "https://poudeldigital.com/best-wedding-photographer-in-butwal-nepal-top-photography-studios-2026",
};

export const cityShortlists = {
  kathmandu: {
    city: "Kathmandu",
    studios: [
      {
        name: "Dream Wedding Photography",
        area: "Old Baneshwor",
        note: "Founded by photographer Kiran Shrestha, who also runs the Bump To Babies maternity and newborn studio; covers weddings alongside maternity and newborn work.",
        sourceUrl: "https://www.facebook.com/dreamweddingphotographynp/",
      },
      {
        name: "Golden Light",
        area: "Nayabazar",
        note: "Listed on the WedTayari wedding marketplace for photography and videography, with day rates published there from about NPR 35,000.",
        sourceUrl: directories.wedTayari,
      },
      {
        name: "Photo Choice Nepal",
        area: "Jadibuti, Koteshwor",
        note: "Trading since 2009 as New Unique Digital Photo Studio; offers wedding photo and video, pre- and post-wedding shoots, rice-feeding and maternity coverage, and advertises pre-wedding sessions from NPR 15,000.",
        sourceUrl: "https://photochoicenepal.com/",
      },
      {
        name: "Photo Life Nepal",
        area: "Tinkune",
        note: "Led by photographer Sushil Gyawali, who reports working in Dubai, India and South Africa; covers weddings, pre- and post-wedding shoots, mehendi, bratabandha and gunyo cholo ceremonies.",
        sourceUrl: "https://photolifenepal.com/wedding-photography/",
      },
      {
        name: "Photoshoot Nepal",
        area: "Anamnagar",
        note: "Publishes packages from NPR 30,000 and pre-wedding shoots from NPR 15,000, and says it charges no travel fee within the Kathmandu Valley.",
        sourceUrl: "https://photoshootnepal.com/",
      },
      {
        name: "Picture Point",
        area: "Koteshwor Mahadevsthan",
        note: "Listed on the TheNimto booking platform, where its wedding quotes range from about NPR 30,000 to NPR 160,000 depending on coverage.",
        sourceUrl: directories.theNimto,
      },
      {
        name: "Wedding Cinema Nepal",
        area: "Kathmandu",
        note: "A film-led studio founded by cinematographer Rupesh Thapa, a graduate of Oscar International College of Film Studies; worth a look if the wedding film matters as much as the photographs.",
        sourceUrl: "https://www.facebook.com/weddingcinemanepal/",
      },
      {
        name: "Wedding Kathmandu",
        area: "Dhapasi, with branches in Baneshwor, Balaju and Bhaisepati",
        note: "Operated by Kathmandu Wedding Pvt. Ltd., which also runs Photo Studio Kathmandu; says it has worked in wedding photography since 1996 and publishes photo-only packages from NPR 30,000.",
        sourceUrl: "https://www.weddingkathmandu.com/",
      },
      {
        name: "Wedding Maze Studio",
        area: "Gyaneshwor",
        note: "Listed on TheNimto with wedding quotes from about NPR 20,000 to NPR 65,000.",
        sourceUrl: directories.theNimto,
      },
      {
        name: "Wedding Thapas",
        area: "Kadaghari",
        note: "A photography and cinematography studio with tiered Basic, Deluxe and Premium wedding packages; also shoots maternity, newborn and product work.",
        sourceUrl: "https://www.weddingthapas.com/",
      },
    ],
  },
  pokhara: {
    city: "Pokhara",
    studios: [
      {
        name: "BG Production",
        area: "New Road, with a branch in Dulegauda, Tanahun",
        note: "A wedding photography and videography studio operating since 2010, with packages covering mehendi, engagement, wedding, reception and post-wedding events.",
        sourceUrl: "https://www.bgproduction.com.np/",
      },
      {
        name: "Green Photo Studio",
        area: "Srijana Chowk",
        note: "A local photo and video studio that publishes its wedding work on Facebook.",
        sourceUrl:
          "https://www.facebook.com/p/Green-Photo-Studio-Srijana-Chowk-Pokhara-Mob-9856048818-100064818005106/",
      },
      {
        name: "Lenscall",
        area: "Pokhara",
        note: "Offers wedding photography and videography and arranges locations for pre- and post-wedding shoots around Pokhara.",
        sourceUrl: "https://www.lenscall.com/",
      },
      {
        name: "The Dreams Production",
        area: "Pokhara",
        note: "Listed on WedTayari for wedding photography and videography, with day rates published there from about NPR 40,000.",
        sourceUrl: directories.wedTayari,
      },
      {
        name: "Vivah Nepal",
        area: "Pokhara, also working in Kathmandu",
        note: "Focuses on cinematic wedding films, pre-wedding shoots and destination weddings across Nepal.",
        sourceUrl: "https://vivahnp.com/",
      },
      {
        name: "Wedding Creation Pokhara",
        area: "Pokhara",
        note: "Shoots at Phewa Lake, Sarangkot, the Peace Pagoda and garden resorts, offers drone coverage and teaser reels, and lists packages from NPR 40,000 on Mero Event.",
        sourceUrl:
          "https://meroevent.com/talents/1-photography-and-videography/173-wedding-creation-pokhara",
      },
      {
        name: "Wedding Gallery Nepal",
        area: "Srijana Chowk",
        note: "Offers wedding photography, videography and event coverage in Pokhara.",
        sourceUrl: "https://www.facebook.com/weddinggallerynp/",
      },
      {
        name: "Wedding Pokhara",
        area: "Pokhara",
        note: "Presents itself as a luxury wedding studio focused on destination weddings around the lake and mountains.",
        sourceUrl: "https://www.facebook.com/weddingpokhara/",
      },
      {
        name: "Wedding Waves",
        area: "Gairapatan",
        note: "A wedding photography and videography studio serving Pokhara and nearby areas.",
        sourceUrl: "https://www.facebook.com/weddingwaves/",
      },
      {
        name: "WhiteFOX Ent.",
        area: "Prithvi Chowk",
        note: "A production company that lists creative wedding videography among its services.",
        sourceUrl: "https://www.nepalyp.com/category/Photography/city:Pokhara",
      },
    ],
  },
  lalitpur: {
    city: "Lalitpur",
    studios: [
      {
        name: "Fotopasal",
        area: "Patan Dhoka",
        note: "Founded in 2011 by Sampurna Manandhar as a wedding photography business; now also covers fashion, product and event work and operates in the United States.",
        sourceUrl: directories.biheBazaar("fotopasal"),
      },
      {
        name: "Glamour Clicks",
        area: "Chakupat",
        note: "Listed as a wedding photographer on the TurantCall directory.",
        sourceUrl: directories.turantCallLalitpur,
      },
      {
        name: "Image: The Wedding Photography",
        area: "Lalitpur",
        note: "A Lalitpur team of photographers and videographers that publishes its wedding work on Facebook.",
        sourceUrl: "https://www.facebook.com/Imageweddingphotography/",
      },
      {
        name: "Machhindra Studio",
        area: "Jhamsikhel",
        note: "Offers wedding photography and videography, with packages listed from NPR 20,000 on Bihe Bazaar.",
        sourceUrl: directories.biheBazaar("machhindra-studio"),
      },
      {
        name: "Nepal Wedding Photography",
        area: "Bhaisepati",
        note: "Covers ceremonies, receptions and pre-wedding events with photography and cinematography, and publishes Lalitpur packages that include heritage locations.",
        sourceUrl: "https://nepalweddingphotography.com/location/lalitpur/",
      },
      {
        name: "Niranjan's Photography",
        area: "Sanepa",
        note: "Listed as a wedding photographer on the TurantCall directory.",
        sourceUrl: directories.turantCallLalitpur,
      },
      {
        name: "PixNepal",
        area: "Lalitpur",
        note: "A team of photographers and cinematographers that also travels to Kathmandu, Bhaktapur, Pokhara, Bharatpur and Butwal; prices on request.",
        sourceUrl: directories.biheBazaar("wedding-photo-videography-service"),
      },
      {
        name: "Sabizz Wedding",
        area: "Lalitpur",
        note: "A wedding photography studio that publishes its work on Facebook.",
        sourceUrl: "https://www.facebook.com/number.one.wedding.photography.studio/",
      },
      {
        name: "Studio Kusal",
        area: "Chyasal, Patan",
        note: "A Patan studio publishing Nepali wedding photography through its Facebook page.",
        sourceUrl: "https://www.facebook.com/Weddingphotographynepal/",
      },
      {
        name: "Wedding Vision Nepal",
        area: "Lalitpur",
        note: "A photography and film team covering weddings.",
        sourceUrl: "https://www.facebook.com/weddingvisionnepal/",
      },
    ],
  },
  bhaktapur: {
    city: "Bhaktapur",
    studios: [
      {
        name: "Balkot Photo Studio",
        area: "Balkot",
        note: "Operating since 2061 BS (around 2004), offering wedding photography and videography.",
        sourceUrl: "https://balkotphotostudio.com.np/photography.html",
      },
      {
        name: "Geetanjali Photo Studio",
        area: "Thimi",
        note: "A Thimi studio listed for wedding photography on Bihe Bazaar.",
        sourceUrl: directories.biheBazaar("geetanjali-photo-studio"),
      },
      {
        name: "Kabita Studio",
        area: "Radhe Radhe",
        note: "Founded in 2015; covers Newari and Nepali weddings and pre-wedding shoots, and rents cultural dress and jewellery for sessions.",
        sourceUrl: "https://kabitastudioandstore.com.np/",
      },
      {
        name: "Manakamana Studio",
        area: "Sano Thimi",
        note: "A Sano Thimi studio listed for wedding photography on Bihe Bazaar.",
        sourceUrl: directories.biheBazaar("manakamana-studio"),
      },
      {
        name: "New Quality Photo Studio",
        area: "Bhaktapur",
        note: "Photographs and films weddings, pre-wedding sessions, bratabandha and other ceremonies across Bhaktapur, Lalitpur and Kathmandu.",
        sourceUrl: "https://www.newqualityphotography.com/",
      },
      {
        name: "Phopal Studios",
        area: "Chundevi, Suryabinayak",
        note: "A photography and videography studio covering weddings.",
        sourceUrl: "https://www.facebook.com/phopalstudios/",
      },
      {
        name: "RK Shots Photography",
        area: "Sanothimi",
        note: "Listed for wedding photography on Bihe Bazaar.",
        sourceUrl: directories.biheBazaar("rk-shots-photography"),
      },
      {
        name: "Theeta Weddings",
        area: "Madhyapur Thimi",
        note: "The wedding arm of Theeta Productions, based on the Araniko Highway service road.",
        sourceUrl: "https://www.facebook.com/theetaweddings/",
      },
      {
        name: "Wedding Tasveer Nepal",
        area: "Gattaghar",
        note: "A photography and videography studio covering weddings in the eastern valley.",
        sourceUrl: "https://www.facebook.com/weddingtasveernepal/",
      },
      {
        name: "Zero One Studio",
        area: "Pandubazar, Suryabinayak",
        note: "A content studio covering weddings, pasni, newborn and family shoots, with a separate wedding brand, Mystic Weddings.",
        sourceUrl: "https://zeroonestudio.com.np/",
      },
    ],
  },
  chitwan: {
    city: "Chitwan",
    studios: [
      {
        name: "Chitwan Wedding Photo & Videography",
        area: "Bharatpur",
        note: "A Bharatpur wedding photo and video team that publishes its work on Facebook.",
        sourceUrl: "https://www.facebook.com/p/Chitwan-Wedding-Photo-Videography-100066246953545/",
      },
      {
        name: "D Multi Studio",
        area: "Lanku, Bharatpur-4",
        note: "Offers wedding photography and videography across Bharatpur, Narayangarh, Ratnanagar, Tandi, Sauraha and Gaindakot.",
        sourceUrl: "https://dmultistudio.com/best-wedding-videography-in-chitwan-by-d-multi-studio/",
      },
      {
        name: "Deep Photography & Videography",
        area: "Shahid Chowk, Narayangarh",
        note: "Covers weddings, events and portfolio shoots.",
        sourceUrl: "https://www.facebook.com/deepphotographyngt/",
      },
      {
        name: "Fotohouse",
        area: "Chitwan",
        note: "Founded by Bishwa Sharma, with a team of about 11 photographers, cinematographers and editors covering weddings, pre-wedding, engagement and elopement shoots.",
        sourceUrl: "https://fotohousenepal.com/",
      },
      {
        name: "Jayalaxmi Photography",
        area: "Bharatpur-10",
        note: "Says it has more than 25 years of experience across weddings, pre- and post-wedding shoots and films.",
        sourceUrl: "https://www.facebook.com/jayalaxmiphotography/",
      },
      {
        name: "Kriti Photo Studio",
        area: "Bharatpur",
        note: "Publishes wedding highlight films and post-wedding sessions on Facebook.",
        sourceUrl: "https://www.facebook.com/kritiphotostudio/",
      },
      {
        name: "Milan Digital Photo Studio",
        area: "Hakimchowk, Bharatpur-9",
        note: "Trades as Milan Photography Chitwan and covers weddings and events.",
        sourceUrl: "https://www.facebook.com/milanphotographychitwan/",
      },
      {
        name: "Photo Gallery & Wedding House Chitwan",
        area: "Bharatpur",
        note: "Offers 4K videography and drone coverage alongside wedding photography.",
        sourceUrl: "https://www.facebook.com/weddinghousechitwan/",
      },
      {
        name: "Vision Films Studio",
        area: "Bharatpur",
        note: "A photography and videography studio focused on wedding films.",
        sourceUrl: "https://www.facebook.com/VisionfilmsstudioChitwan",
      },
      {
        name: "Wedding Chitwan City",
        area: "Bharatpur",
        note: "A Bharatpur wedding photography page that publishes recent work on Facebook.",
        sourceUrl: "https://www.facebook.com/p/Wedding-Chitwan-City-100063637224840/",
      },
    ],
  },
  butwal: {
    city: "Butwal",
    studios: [
      {
        name: "Aadhya Digital Photography",
        area: "Golpark",
        note: "Known locally for cinematic wedding videos, according to a published round-up of Butwal studios.",
        sourceUrl: directories.poudelButwalRoundup,
      },
      {
        name: "Ajay Photography Butwal",
        area: "Butwal",
        note: "Covers wedding photography and videography.",
        sourceUrl: "https://www.facebook.com/ajayphotographybutwal/",
      },
      {
        name: "New Moonlight Photography",
        area: "Sukhanagar",
        note: "A Sukhanagar studio covering weddings and events.",
        sourceUrl: "https://www.facebook.com/Studionewmoonlight7/",
      },
      {
        name: "Pixel Wave Studio",
        area: "Milanchowk, beside the sky bridge",
        note: "Offers complete photo and video packages for weddings.",
        sourceUrl: "https://www.facebook.com/studiopixelwave4/",
      },
      {
        name: "Poudel Digital Photography",
        area: "Sukhanagar",
        note: "Says it has more than 15 years of experience and offers wedding photography, cinematic films and pre-wedding shoots across Nepal.",
        sourceUrl: "https://poudeldigital.com/portfolio",
      },
      {
        name: "Prem Digital Photo Studio",
        area: "Butwal-3",
        note: "A long-established studio known for traditional wedding coverage, group portraits and printing.",
        sourceUrl: directories.poudelButwalRoundup,
      },
      {
        name: "Royal Photo Studio",
        area: "Manigram, Tilottama-5",
        note: "Publishes wedding photography from NPR 18,000 and event videography from NPR 12,000.",
        sourceUrl: "https://royalphotostudio.com.np/",
      },
      {
        name: "SP Photography",
        area: "Milanchowk",
        note: "Covers weddings, pre-wedding shoots and family functions such as pasni in Butwal and Gulmi.",
        sourceUrl: directories.poudelButwalRoundup,
      },
      {
        name: "Wed Films",
        area: "Butwal",
        note: "A wedding photography and film production house.",
        sourceUrl: "https://www.facebook.com/wedfilms.np/",
      },
      {
        name: "Wedding Butwal",
        area: "Butwal",
        note: "Also known as Shrinagar Photo Studio; says it has worked since 2008 across wedding photography and HD video.",
        sourceUrl: "https://weddingbutwal.com/",
      },
    ],
  },
  biratnagar: {
    city: "Biratnagar",
    studios: [
      {
        name: "Aashish Digital Photo Studio",
        area: "Tinpaini, Biratnagar-2",
        note: "Listed for wedding photography and videography on Bihe Bazaar.",
        sourceUrl: directories.biheBazaar("aashish-digital-photo-studio"),
      },
      {
        name: "Arms Studio",
        area: "Rani (Mills Area)",
        note: "Run by Anil Dangol and listed among Biratnagar wedding studios by the Purbeli Bazar directory.",
        sourceUrl: directories.purbeliBazar,
      },
      {
        name: "As You Like Studio",
        area: "Mahendra Chowk",
        note: "Offers photography, cinematography, theme videos and promotional films.",
        sourceUrl: "https://www.facebook.com/asyoulikestudiobiratnagar/",
      },
      {
        name: "Avi Studio",
        area: "Saraswati Tole",
        note: "Run by Abishek Shrestha and covers wedding photography.",
        sourceUrl: directories.purbeliBazar,
      },
      {
        name: "Bandhu Photo Studio",
        area: "Main Road, Neelsadan-10",
        note: "Says it has offered photography and videography since 2004.",
        sourceUrl: "https://www.facebook.com/bandhuphotostudio/",
      },
      {
        name: "ImgStock",
        area: "Mahendra Chowk",
        note: "Run by Niraj Shrestha; covers weddings and events across Morang, Sunsari and Jhapa, including Dharan, Itahari and Damak.",
        sourceUrl: "https://imgstock.net/",
      },
      {
        name: "Kamkazi Productions",
        area: "Tintoliya",
        note: "Run by Ayush Shrestha, focusing on wedding and event photography.",
        sourceUrl: directories.purbeliBazar,
      },
      {
        name: "Moonlight Photo Studio",
        area: "near Birat Nursing Home",
        note: "Offers photography and videography, including pre- and post-wedding shoots.",
        sourceUrl: "https://www.facebook.com/moonlightphotostudiobrt/",
      },
      {
        name: "Narayan Digital Photo Studio",
        area: "Tinpaini, Biratnagar-2",
        note: "Run by Sulav Shrestha and covers wedding photography.",
        sourceUrl: directories.purbeliBazar,
      },
      {
        name: "Wedding Biratnagar Nepal",
        area: "Gaumukhi Marg, Chandani Chowk, Biratnagar-5",
        note: "Covers weddings, pre- and post-wedding shoots, rice-feeding ceremonies and fashion work.",
        sourceUrl: "https://www.facebook.com/Brtwedding/",
      },
    ],
  },
  dharan: {
    city: "Dharan",
    studios: [
      {
        name: "Anamika Video & Photo Service",
        area: "Shiva Prakash Path, Dharan-9",
        note: "A general photo and video service listed in the Yopoho business directory; ask to see full wedding galleries before booking.",
        sourceUrl: "https://yopoho.com/business/list_search.php?txtarea=Dharan&txtcate=photo-studio",
      },
      {
        name: "Buzz Studio Dharan",
        area: "Dharan",
        note: "A Dharan photography studio that publishes its work on Instagram.",
        sourceUrl: "https://www.instagram.com/buzzstudio.np/",
      },
      {
        name: "Great Studio",
        area: "Acharya Line",
        note: "Listed for wedding photography and videography on Bihe Bazaar.",
        sourceUrl: directories.biheBazaar("great-studio"),
      },
      {
        name: "JMD Eventography",
        area: "Dharan",
        note: "A wedding and event photography team that also designs albums and takes bookings online.",
        sourceUrl: "https://jmdeventography.blogspot.com/",
      },
      {
        name: "Photoberry Studio",
        area: "Sadan Chowk",
        note: "Listed for wedding photography on Bihe Bazaar, with prices from about NPR 35,000.",
        sourceUrl: directories.biheBazaar("photoberry-studio"),
      },
      {
        name: "Pics Studio",
        area: "Dharan",
        note: "Listed for wedding photography and videography on Bihe Bazaar.",
        sourceUrl: directories.biheBazaar("pics-studio"),
      },
      {
        name: "Rojesh Shakya's Photography",
        area: "Dharan",
        note: "A Dharan photographer covering weddings with photography and video.",
        sourceUrl: "https://www.facebook.com/RojeshShakyaPhotography/",
      },
      {
        name: "Shutter Katha",
        area: "Itahari, covering Dharan",
        note: "Based in Itahari, about half an hour south, and says its lead photographer has more than 13 years of experience.",
        sourceUrl: "https://shutterkatha.com/capturing-the-magic-your-nepali-wedding-photography-guide",
      },
      {
        name: "Snap Dharan Photoshoot and Videography",
        area: "Dharan",
        note: "Specialises in wedding photography and videography.",
        sourceUrl: "https://www.facebook.com/snapdharan/",
      },
      {
        name: "Wedding Dharan",
        area: "Dharan",
        note: "A Dharan wedding photography and videography team.",
        sourceUrl: "https://www.facebook.com/weddingdharan",
      },
    ],
  },
  birgunj: {
    city: "Birgunj",
    studios: [
      {
        name: "Bhushan's Digital Studio",
        area: "Adarsh Marg, Timla",
        note: "A digital photo studio listed in the Nepal Yellow Pages directory.",
        sourceUrl: "https://www.nepalyp.com/category/Studios/city:Birgunj",
      },
      {
        name: "Birgunj Wedding And Event",
        area: "Birgunj",
        note: "A wedding and event videography team that publishes its work on Facebook.",
        sourceUrl: "https://www.facebook.com/birgunjvideographer/",
      },
      {
        name: "Cinematic Nepal",
        area: "Birgunj",
        note: "A Birgunj-based team covering weddings, family events, portraits and business shoots.",
        sourceUrl: "https://cinematicnepal.com/services/best-photography-service-in-birgunj/",
      },
      {
        name: "Hatiya Photo Studio",
        area: "Phaparbari Road, Hetauda",
        note: "Based in Hetauda, a couple of hours north, and says it works throughout Nepal; publishes cinematic wedding films and pre- and post-wedding work.",
        sourceUrl: "https://www.facebook.com/hatiyaphotostudio/",
      },
      {
        name: "Photo Max",
        area: "Adarshnagar",
        note: "A long-running studio established in 1996, according to its directory listing.",
        sourceUrl: "https://www.nepalyp.com/category/Studios/city:Birgunj",
      },
      {
        name: "Raj Shree Digital Studio & Videography",
        area: "Birgunj",
        note: "Publishes wedding photography and videography from Birgunj and Parsa on Facebook and Instagram.",
        sourceUrl: "https://www.facebook.com/p/Raj-Shree-Digital-Studio-Videography-100064164876259/",
      },
      {
        name: "Sajal Digital Studio",
        area: "Maisthan",
        note: "A digital photo studio in central Birgunj.",
        sourceUrl: "https://www.facebook.com/565863753432228/",
      },
      {
        name: "Vishal Photography",
        area: "Ghantaghar",
        note: "Offers photography and videography services.",
        sourceUrl: "https://www.facebook.com/vishalgupta9501/",
      },
    ],
  },
  nepalgunj: {
    city: "Nepalgunj",
    studios: [
      {
        name: "Acharya Digital Studio",
        area: "Puspalal Chowk, Nepalgunj-4",
        note: "Established in 2018, offering photo and video services for weddings and other occasions.",
        sourceUrl: "https://www.nepalyp.com/category/Photography/city:Nepalgunj",
      },
      {
        name: "AD Studio",
        area: "Bus Park Road",
        note: "A Nepalgunj photo and video studio active on Facebook and Instagram.",
        sourceUrl: "https://www.facebook.com/Adstudionpl/",
      },
      {
        name: "Bishal Photo Studio",
        area: "Nepalgunj",
        note: "Offers photography and videography for all types of events in Nepalgunj and Banke.",
        sourceUrl: "https://www.facebook.com/BishalPhotoStudio/",
      },
      {
        name: "LensCraft Studio",
        area: "Puspalal Chowk, Nepalgunj-2",
        note: "Listed for wedding photography and videography on Bihe Bazaar, with prices from about NPR 40,000.",
        sourceUrl: directories.biheBazaar("lenscraft-studio"),
      },
      {
        name: "Mega Mixing Lab",
        area: "Nepalgunj",
        note: "Founded in 2012 by Nilraj Adhikari; covers wedding photography and cinematic videography in Nepalgunj and travels to Bardiya, Dang, Kailali and Surkhet.",
        sourceUrl: "https://megamixinglab.com/",
      },
      {
        name: "New Gautam Films",
        area: "Saderlin, Nepalgunj-11",
        note: "A Nepalgunj wedding photography and film studio.",
        sourceUrl: "https://newgautamfilms.com/",
      },
      {
        name: "Portraits by Pawan",
        area: "Tribhuvan Chowk, Rani Talau",
        note: "A Nepalgunj photographer covering weddings, fashion and portraits, who has published wedding films from local party palaces.",
        sourceUrl: "https://www.facebook.com/portraitsbypawan/",
      },
      {
        name: "Prajwal Photography",
        area: "Nepalgunj",
        note: "Listed for wedding photography and videography on Bihe Bazaar.",
        sourceUrl: directories.biheBazaar("prajwal-photography"),
      },
      {
        name: "Ramji Studio",
        area: "Nepalgunj",
        note: "A wedding photography and videography studio run by Ramji Gupta, active on Instagram.",
        sourceUrl: "https://www.instagram.com/ramji_studio/",
      },
      {
        name: "Yatra Studio",
        area: "Nepalgunj",
        note: "Covers photography, videography, documentaries and pre- and post-wedding shoots.",
        sourceUrl: "https://www.facebook.com/yatraphotography/",
      },
    ],
  },
} satisfies Record<string, CityShortlist>;

export type ShortlistCitySlug = keyof typeof cityShortlists;

const byName = (a: ShortlistedStudio, b: ShortlistedStudio) =>
  a.name.localeCompare(b.name, "en", { sensitivity: "base" });

export function sortedShortlist(slug: ShortlistCitySlug): ShortlistedStudio[] {
  return [...cityShortlists[slug].studios].sort(byName);
}

/** The paid partner's disclosed position: first in its two studio cities, second elsewhere. */
export function partnerPosition(slug: ShortlistCitySlug): 1 | 2 {
  return slug === "kathmandu" || slug === "butwal" ? 1 : 2;
}

/** Entries on a city list page, partner included. */
export function cityListEntryCount(slug: ShortlistCitySlug): number {
  return cityShortlists[slug].studios.length + 1;
}

export function cityListSlug(slug: ShortlistCitySlug): string {
  return `best-wedding-photographers-in-${slug}`;
}

export function cityListHref(slug: ShortlistCitySlug): string {
  return `/blog/${cityListSlug(slug)}`;
}

/** Points a city guide at its list page, so the guide keeps the how-to intent and the list page owns "who to hire". */
export function cityListPointerSection(slug: ShortlistCitySlug, localNote = ""): BlogSection {
  const { city } = cityShortlists[slug];
  return {
    heading: `Who to shortlist in ${city}`,
    paragraphs: [
      `We keep a separate list of ${cityListEntryCount(slug)} wedding photographers in ${city}, each with what the studio publishes about itself and a link to check it: [best wedding photographers in ${city}](${cityListHref(slug)}). Use this guide to brief and compare whoever you contact from it.${localNote ? ` ${localNote}` : ""}`,
    ],
  };
}

/** One source per distinct URL, so directory listings shared by several studios appear once. */
export function studioShortlistSources(slug: ShortlistCitySlug): Array<{ label: string; url: string }> {
  const namesByUrl = new Map<string, string[]>();
  for (const listed of sortedShortlist(slug)) {
    namesByUrl.set(listed.sourceUrl, [...(namesByUrl.get(listed.sourceUrl) ?? []), listed.name]);
  }
  return [...namesByUrl].map(([url, names]) => ({
    label: `${cityShortlists[slug].city} list: ${names.join(", ")}`,
    url,
  }));
}
