import type { BlogSection } from "./blog";

/**
 * City lists of wedding photographers, rendered as the `best-wedding-photographers-in-*` pages.
 *
 * Wedding Story Nepal is not stored here: the list pages insert it as entry 1 on every city.
 * The studios below follow in the stored order. Each description restates what the studio or its
 * listing publishes about itself, written up by the Events Desk; phone numbers and pages are the
 * studios' own public contacts. Every entry carries a phone number, a public page, or both.
 */
export type ShortlistedStudio = {
  name: string;
  /** Neighbourhood or base as the studio or its listing states it. */
  area: string;
  /** What the studio offers and who it suits, stated from its own published claims. */
  description: string;
  /** Public contact number, when the studio publishes one. */
  phone?: string;
  /** Where a reader can check the studio's work. */
  sourceUrl?: string;
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
        name: "Alpha Pictures Nepal",
        area: "Kathmandu",
        phone: "+977-9749721726",
        description:
          "Alpha Pictures Nepal is the team to call when the wedding film matters as much as the album. Its approach is documentary at heart: instead of staging moments, the crew follows the families through the rituals and lets real emotion carry the edit. Careful music choices and warm, filmic colour grading give its highlight films a lasting, heirloom quality. Ask to watch one complete ceremony edit, not only the trailer, to see how the team handles the quieter stretches of the day.",
      },
      {
        name: "Fotomoon Lavish Studio",
        area: "Kathmandu",
        phone: "+977-9851143412",
        description:
          "Fotomoon Lavish Studio has built its reputation on polished, editorial wedding imagery — bridal portraits and couple sessions that would sit comfortably on the pages of a bridal magazine. Expect confident direction, close attention to styling and jewellery, and retouching that keeps skin natural while every frame looks finished. It suits couples who want a luxury, fashion-led portrait set alongside their ceremony coverage.",
      },
      {
        name: "Wedding Kathmandu",
        area: "Dhapasi, with branches in Baneshwor, Balaju and Bhaisepati",
        phone: "+977-9851241773",
        sourceUrl: "https://www.weddingkathmandu.com/",
        description:
          "Run by the registered company Kathmandu Wedding Pvt. Ltd., Wedding Kathmandu says it has worked in wedding photography since 1996, one of the longest track records in the valley. Its strength is range: multi-day traditional coverage, newborn and family sessions, framing and album design, all from one company with branches across the city. Photo-only packages are published from about NPR 30,000, making it a sensible one-stop choice for families who want everything handled in one place.",
      },
      {
        name: "Wedding Diary Nepal",
        area: "Kathmandu",
        phone: "+977-9851178169",
        description:
          "Wedding Diary Nepal brings a modern, high-energy style to Kathmandu weddings. Its 4K videography favours rich contrast, vivid colour and quick, rhythmic cutting that captures the celebration mood of sangeet nights, baraat processions and receptions. Couples who want a film that feels lively rather than slow and sentimental will find the team a natural fit; confirm how many cinematographers attend each event.",
      },
      {
        name: "Vivah Nepal",
        area: "Kathmandu and Pokhara",
        phone: "+977-9712026005",
        sourceUrl: "https://vivahnp.com/",
        description:
          "Vivah Nepal specialises in destination and large-scale weddings, working between Kathmandu, Pokhara and resort venues across the country. Its cinematic films and pre-wedding productions lean towards grand landscapes, and the team is comfortable with the logistics that come with them, including helicopter-assisted mountain shoots. For a wedding with guests travelling in, its planning experience is as valuable as its camera work.",
      },
      {
        name: "Photo Choice Nepal",
        area: "Jadibuti, Koteshwor",
        phone: "+977-9841509591",
        sourceUrl: "https://photochoicenepal.com/",
        description:
          "Trading since 2009, first as New Unique Digital Photo Studio, Photo Choice Nepal has more than fifteen years of valley weddings behind it. Couples tend to mention two things: calm, clear posing guidance that puts camera-shy couples at ease, and a quick, well-organised delivery once the celebrations are over. It also covers pre- and post-wedding shoots, pasni and maternity sessions, with pre-wedding shoots advertised from NPR 15,000.",
      },
      {
        name: "Studio Thapas",
        area: "Kathmandu",
        phone: "+977-9841419161",
        description:
          "Studio Thapas is one of the most familiar names among Kathmandu couples, with a long record of weddings behind it. Its creative strength is honest emotion — the bidaai, a parent's quiet pride, the laughter between rituals — caught without heavy staging. It is also a strong choice when printed keepsakes matter, offering custom albums and large-format framing; ask to handle a finished album in person before you decide.",
      },
      {
        name: "Photoshoot Nepal",
        area: "Anamnagar",
        phone: "+977-9851232672",
        sourceUrl: "https://photoshootnepal.com/",
        description:
          "Photoshoot Nepal is one of the more transparent studios in the city. It publishes packages from NPR 30,000 and pre-wedding shoots from NPR 15,000, and says it charges no travel fee anywhere inside the Kathmandu Valley. That clarity makes budgeting easier when your events are spread between Kathmandu, Lalitpur and Bhaktapur, and it suits couples who want dependable, well-rounded coverage without surprises on the final bill.",
      },
      {
        name: "Wedding Cinema Nepal",
        area: "Kathmandu",
        phone: "+977-9849876872",
        sourceUrl: "https://www.facebook.com/weddingcinemanepal/",
        description:
          "Founded by cinematographer Rupesh Thapa, a graduate of Oscar International College of Film Studies, Wedding Cinema Nepal approaches weddings as filmmakers first. Framing, camera movement and sound are handled with the discipline of narrative cinema, and it shows in edits that feel told rather than simply recorded. Book it when the wedding film is the centrepiece of your memories.",
      },
    ],
  },
  pokhara: {
    city: "Pokhara",
    studios: [
      {
        name: "Vivah Nepal",
        area: "Pokhara, also working in Kathmandu",
        phone: "+977-9712026005",
        sourceUrl: "https://vivahnp.com/",
        description:
          "Few teams know Pokhara's destination-wedding circuit as well as Vivah Nepal. Its cinematic films make the most of the lake, the Annapurna skyline and the resort venues, and it regularly works with couples and guests flying in from abroad. For mountain pre-wedding shoots, including helicopter-assisted sessions, its planning experience takes much of the stress out of the logistics.",
      },
      {
        name: "BG Production",
        area: "New Road, with a branch in Dulegauda, Tanahun",
        phone: "+977-9806633323",
        sourceUrl: "https://www.bgproduction.com.np/",
        description:
          "Operating since 2010, BG Production is one of Pokhara's established local studios, with a second branch in Dulegauda, Tanahun. Its packages follow the full Nepali wedding sequence — mehendi, engagement, wedding day, reception and a post-wedding shoot — so one team can cover the whole celebration with a consistent look from start to finish.",
      },
      {
        name: "Wedding Creation Pokhara",
        area: "Pokhara",
        phone: "+977-9806601817",
        sourceUrl: "https://meroevent.com/talents/1-photography-and-videography/173-wedding-creation-pokhara",
        description:
          "Wedding Creation Pokhara knows the city's signature backdrops well: Phewa Lake at golden hour, Sarangkot at sunrise, the World Peace Pagoda and the garden resorts along the lakeside. It offers drone coverage and short teaser reels for social media, with packages listed from about NPR 40,000 on Mero Event — a good fit when you want the location to feature as strongly as the ceremony.",
      },
      {
        name: "The Dreams Production",
        area: "Pokhara",
        phone: "+977-9817183961",
        sourceUrl: directories.wedTayari,
        description:
          "Listed on the WedTayari marketplace with day rates from about NPR 40,000, The Dreams Production covers both photography and videography for Pokhara weddings. Its published pricing also gives you a useful benchmark for what full-day photo and video coverage costs in the city while you compare quotes.",
      },
      {
        name: "Lenscall",
        area: "Pokhara",
        sourceUrl: "https://www.lenscall.com/",
        description:
          "Lenscall pairs wedding photography and videography with something many visiting couples find genuinely useful: help choosing and arranging locations for pre- and post-wedding shoots around Pokhara. If you cannot decide between the lake, the hills or a resort garden, its local scouting saves a lot of guesswork.",
      },
      {
        name: "Wedding Pokhara",
        area: "Pokhara",
        phone: "+977-9801414954",
        sourceUrl: "https://www.facebook.com/weddingpokhara/",
        description:
          "Wedding Pokhara positions itself at the luxury end of the market, focusing on destination weddings that use the lake and the mountains as the main stage. Its refined, elegant look suits boutique resort celebrations; as with any luxury team, ask for a complete wedding gallery to see consistency beyond the hero shots.",
      },
      {
        name: "Wedding Gallery Nepal",
        area: "Srijana Chowk",
        phone: "+977-9802935170",
        sourceUrl: "https://www.facebook.com/weddinggallerynp/",
        description:
          "From its base at Srijana Chowk in the heart of the city, Wedding Gallery Nepal covers weddings with photography, videography and general event coverage. The central location is convenient for families marrying in city party palaces and homes, and its all-round service suits couples who want one team for several family functions.",
      },
      {
        name: "Wedding Waves",
        area: "Gairapatan",
        phone: "+977-9856062972",
        sourceUrl: "https://www.facebook.com/weddingwaves/",
        description:
          "Wedding Waves, based in Gairapatan, serves Pokhara and the surrounding areas with wedding photography and videography. It is a practical choice for weddings held away from the lakeside tourist strip — in family homes and nearby villages — where a local team that travels easily is worth a great deal.",
      },
      {
        name: "Green Photo Studio",
        area: "Srijana Chowk",
        phone: "+977-9856048818",
        sourceUrl:
          "https://www.facebook.com/p/Green-Photo-Studio-Srijana-Chowk-Pokhara-Mob-9856048818-100064818005106/",
        description:
          "A long-running neighbourhood studio at Srijana Chowk, Green Photo Studio covers wedding photo and video work and shares recent results on Facebook. It suits families who want straightforward, traditional coverage from a familiar local team; ask to see a complete recent album when you call.",
      },
    ],
  },
  lalitpur: {
    city: "Lalitpur",
    studios: [
      {
        name: "Fotopasal",
        area: "Patan Dhoka",
        phone: "+977-9818682189",
        sourceUrl: directories.biheBazaar("fotopasal"),
        description:
          "Founded in 2011 by Sampurna Manandhar, Fotopasal began as a wedding photography business near Patan Dhoka and has grown into a studio that also shoots fashion, product and events, and now works in the United States too. That range shows in its wedding work: clean composition, strong portraiture and a contemporary edit that still respects tradition.",
      },
      {
        name: "Nepal Wedding Photography",
        area: "Bhaisepati",
        phone: "+977-9765024066",
        sourceUrl: "https://nepalweddingphotography.com/location/lalitpur/",
        description:
          "Working from Bhaisepati, Nepal Wedding Photography covers ceremonies, receptions and pre-wedding events with both photography and cinematography. It publishes Lalitpur-specific packages that include heritage locations, which helps if you want Patan Durbar Square or an old courtyard woven into your coverage.",
      },
      {
        name: "Machhindra Studio",
        area: "Jhamsikhel",
        phone: "+977-9841236940",
        sourceUrl: directories.biheBazaar("machhindra-studio"),
        description:
          "Machhindra Studio in Jhamsikhel offers wedding photography and videography with packages listed from about NPR 20,000 on Bihe Bazaar, one of the more accessible starting points in the valley. It is a sensible choice for couples on a careful budget who still want a proper photo and video team rather than a single freelancer.",
      },
      {
        name: "PixNepal",
        area: "Lalitpur",
        phone: "+977-9851084900",
        sourceUrl: directories.biheBazaar("wedding-photo-videography-service"),
        description:
          "PixNepal is a Lalitpur team of photographers and cinematographers that also travels to Kathmandu, Bhaktapur, Pokhara, Bharatpur and Butwal. That mobility suits families holding events in more than one city. Prices are shared on request, so send a clear written brief to get a quote you can compare.",
      },
      {
        name: "Studio Kusal",
        area: "Chyasal, Patan",
        phone: "+977-9808775780",
        sourceUrl: "https://www.facebook.com/Weddingphotographynepal/",
        description:
          "Rooted in Chyasal in old Patan, Studio Kusal is well placed for Newar weddings in family homes and courtyards. Its work centres on Nepali wedding photography with a traditional sensibility; if your ceremony follows Newar custom, ask for a full gallery from a similar wedding.",
      },
      {
        name: "Image: The Wedding Photography",
        area: "Lalitpur",
        phone: "+977-9862222340",
        sourceUrl: "https://www.facebook.com/Imageweddingphotography/",
        description:
          "Image: The Wedding Photography is a Lalitpur team of photographers and videographers that shares its wedding work regularly on Facebook. Browsing several complete albums there is the best way to judge its style, as it is with any team that works mainly through social media.",
      },
      {
        name: "Wedding Vision Nepal",
        area: "Lalitpur",
        phone: "+977-9808235882",
        sourceUrl: "https://www.facebook.com/weddingvisionnepal/",
        description:
          "Wedding Vision Nepal combines photography and film for weddings in Lalitpur and across the valley. Couples who want the album and the film to feel like one story will appreciate a single team handling both; confirm the crew size for each event before you sign.",
      },
      {
        name: "Sabizz Wedding",
        area: "Lalitpur",
        sourceUrl: "https://www.facebook.com/number.one.wedding.photography.studio/",
        description:
          "Sabizz Wedding is a Lalitpur wedding photography studio that publishes its work on Facebook. It suits couples looking for a smaller, more personal team; ask to meet the photographer who will actually shoot your day.",
      },
      {
        name: "Niranjan's Photography",
        area: "Sanepa",
        phone: "+977-9851110245",
        sourceUrl: directories.turantCallLalitpur,
        description:
          "Niranjan's Photography, based in Sanepa, is listed as a wedding photographer on the TurantCall directory. A photographer-led operation can offer very personal service; ask for a complete recent gallery and written deliverables before you commit.",
      },
    ],
  },
  bhaktapur: {
    city: "Bhaktapur",
    studios: [
      {
        name: "Kabita Studio",
        area: "Radhe Radhe",
        phone: "+977-9851364127",
        sourceUrl: "https://kabitastudioandstore.com.np/",
        description:
          "Founded in 2015, Kabita Studio covers Newari and Nepali weddings and pre-wedding shoots across the eastern valley. What sets it apart is the service around the camera: it rents traditional cultural dress and jewellery for sessions, which makes a heritage pre-wedding shoot in Bhaktapur's old town far simpler to organise.",
      },
      {
        name: "New Quality Photo Studio",
        area: "Bhaktapur",
        phone: "+977-9851158950",
        sourceUrl: "https://www.newqualityphotography.com/",
        description:
          "New Quality Photo Studio photographs and films weddings, pre-wedding sessions, bratabandha and other family ceremonies across Bhaktapur, Lalitpur and Kathmandu. Its familiarity with the full cycle of family rites makes it a good studio to build a long relationship with.",
      },
      {
        name: "Zero One Studio",
        area: "Pandubazar, Suryabinayak",
        phone: "+977-9851351846",
        sourceUrl: "https://zeroonestudio.com.np/",
        description:
          "Zero One Studio is a modern content studio covering weddings, pasni, newborn and family shoots, and it runs a separate wedding brand, Mystic Weddings. Its contemporary editing suits couples who want a fresh, social-media-ready look alongside traditional coverage.",
      },
      {
        name: "Balkot Photo Studio",
        area: "Balkot",
        sourceUrl: "https://balkotphotostudio.com.np/photography.html",
        description:
          "Operating since 2061 BS (around 2004), Balkot Photo Studio brings two decades of local experience to wedding photography and videography. A long-standing neighbourhood studio knows local families, venues and customs well, which counts for a lot when your wedding is rooted in community tradition.",
      },
      {
        name: "Theeta Weddings",
        area: "Madhyapur Thimi",
        phone: "+977-9761657875",
        sourceUrl: "https://www.facebook.com/theetaweddings/",
        description:
          "The wedding arm of Theeta Productions, Theeta Weddings works from the Araniko Highway service road in Madhyapur Thimi, close to many of the area's party palaces. Its production background shows in carefully planned coverage; ask to see a complete wedding film as well as the photographs.",
      },
      {
        name: "Wedding Tasveer Nepal",
        area: "Gattaghar",
        phone: "+977-9808138727",
        sourceUrl: "https://www.facebook.com/weddingtasveernepal/",
        description:
          "Wedding Tasveer Nepal, based in Gattaghar, covers weddings with photography and videography across the eastern valley. Its position on the Bhaktapur–Kathmandu corridor is convenient for families with events in both cities.",
      },
      {
        name: "Phopal Studios",
        area: "Chundevi, Suryabinayak",
        phone: "+977-9860018315",
        sourceUrl: "https://www.facebook.com/phopalstudios/",
        description:
          "Phopal Studios in Chundevi, Suryabinayak offers photography and videography for weddings. It is a handy local option for venues on the eastern side of Bhaktapur; request a full gallery from a recent wedding at a similar venue.",
      },
      {
        name: "Geetanjali Photo Studio",
        area: "Thimi",
        phone: "+977-9843019242",
        sourceUrl: directories.biheBazaar("geetanjali-photo-studio"),
        description:
          "Geetanjali Photo Studio is a Thimi studio listed for wedding photography on Bihe Bazaar. It is well placed for weddings in the Thimi area; confirm crew size and delivery dates in writing when you ask for a quote.",
      },
      {
        name: "Manakamana Studio",
        area: "Sano Thimi",
        phone: "+977-9860675362",
        sourceUrl: directories.biheBazaar("manakamana-studio"),
        description:
          "Manakamana Studio in Sano Thimi is listed for wedding photography on Bihe Bazaar. A neighbourhood studio suits smaller, family-focused weddings in the Thimi area; ask whether video is included or offered as an add-on, and how albums are printed.",
      },
    ],
  },
  chitwan: {
    city: "Chitwan",
    studios: [
      {
        name: "Fotohouse",
        area: "Chitwan",
        phone: "+977-9855017577",
        sourceUrl: "https://fotohousenepal.com/",
        description:
          "Founded by Bishwa Sharma, Fotohouse has grown into a team of about eleven photographers, cinematographers and editors, a size that lets it cover large, multi-event Chitwan weddings properly. It handles weddings, pre-wedding, engagement and elopement shoots, and a dedicated editing team helps keep delivery on schedule.",
      },
      {
        name: "D Multi Studio",
        area: "Lanku, Bharatpur-4",
        phone: "+977-9866117095",
        sourceUrl: "https://dmultistudio.com/best-wedding-videography-in-chitwan-by-d-multi-studio/",
        description:
          "D Multi Studio covers wedding photography and videography across Bharatpur, Narayangarh, Ratnanagar, Tandi, Sauraha and Gaindakot. That wide service area makes it a strong choice for resort weddings near the national park as well as banquet weddings in town.",
      },
      {
        name: "Jayalaxmi Photography",
        area: "Bharatpur-10",
        phone: "+977-9855064038",
        sourceUrl: "https://www.facebook.com/jayalaxmiphotography/",
        description:
          "With more than 25 years of experience by its own account, Jayalaxmi Photography is one of Chitwan's most established names. It covers weddings, pre- and post-wedding shoots and films, and its long history with local families means it knows the customs and expectations of Chitwan weddings.",
      },
      {
        name: "Photo Gallery & Wedding House Chitwan",
        area: "Bharatpur",
        sourceUrl: "https://www.facebook.com/weddinghousechitwan/",
        description:
          "Photo Gallery & Wedding House Chitwan offers 4K videography and drone coverage alongside wedding photography. That is especially useful for open-air venues and resort weddings, where aerial footage adds real scale to the story.",
      },
      {
        name: "Vision Films Studio",
        area: "Bharatpur",
        sourceUrl: "https://www.facebook.com/VisionfilmsstudioChitwan",
        description:
          "Vision Films Studio focuses on wedding films, with photography alongside. Choose it if the cinematic edit is your priority, and ask how long the full-length film and the highlight reel take to deliver.",
      },
      {
        name: "Deep Photography & Videography",
        area: "Shahid Chowk, Narayangarh",
        phone: "+977-9845053596",
        sourceUrl: "https://www.facebook.com/deepphotographyngt/",
        description:
          "Deep Photography & Videography in Narayangarh covers weddings, events and portfolio shoots. Its central Shahid Chowk base is convenient for Narayangarh and Bharatpur venues, and its portfolio work means it is used to directing people who are not natural in front of a camera.",
      },
      {
        name: "Kriti Photo Studio",
        area: "Bharatpur",
        phone: "+977-9855083563",
        sourceUrl: "https://www.facebook.com/kritiphotostudio/",
        description:
          "Kriti Photo Studio in Bharatpur regularly publishes wedding highlight films and post-wedding sessions on Facebook, so it is easy to review recent work before you call. Ask for full-length films, not only the highlights.",
      },
      {
        name: "Milan Digital Photo Studio",
        area: "Hakimchowk, Bharatpur-9",
        phone: "+977-9845026982",
        sourceUrl: "https://www.facebook.com/milanphotographychitwan/",
        description:
          "Trading as Milan Photography Chitwan, Milan Digital Photo Studio in Hakimchowk covers weddings and events. It is a practical local studio for families who want straightforward, complete coverage close to home.",
      },
      {
        name: "Chitwan Wedding Photo & Videography",
        area: "Bharatpur",
        phone: "+977-9855081174",
        sourceUrl: "https://www.facebook.com/p/Chitwan-Wedding-Photo-Videography-100066246953545/",
        description:
          "A Bharatpur wedding photo and video team that shares its work on Facebook, Chitwan Wedding Photo & Videography is worth adding when you want a wider set of quotes. Ask for one complete wedding album to judge consistency.",
      },
    ],
  },
  butwal: {
    city: "Butwal",
    studios: [
      {
        name: "Wedding Butwal",
        area: "Butwal",
        phone: "+977-9847255011",
        sourceUrl: "https://weddingbutwal.com/",
        description:
          "Also known as Shrinagar Photo Studio, Wedding Butwal says it has worked since 2008 in wedding photography and HD video. Its long local track record makes it a steady, experienced option for traditional multi-event Terai weddings.",
      },
      {
        name: "Aadhya Digital Photography",
        area: "Golpark",
        phone: "+977-9847108623",
        sourceUrl: directories.poudelButwalRoundup,
        description:
          "Aadhya Digital Photography in Golpark is known locally for cinematic wedding videos, according to a published round-up of Butwal studios. If a stylish film is high on your list, include it in your shortlist and ask to see a complete wedding edit.",
      },
      {
        name: "Royal Photo Studio",
        area: "Manigram, Tilottama-5",
        phone: "+977-9847265885",
        sourceUrl: "https://royalphotostudio.com.np/",
        description:
          "Royal Photo Studio in Manigram is one of the few studios in the Butwal area that publishes its prices: wedding photography from about NPR 18,000 and event videography from about NPR 12,000. That openness makes it a useful benchmark for budget-conscious couples.",
      },
      {
        name: "Pixel Wave Studio",
        area: "Milanchowk, beside the sky bridge",
        phone: "+977-9851232922",
        sourceUrl: "https://www.facebook.com/studiopixelwave4/",
        description:
          "Located at Milanchowk beside the sky bridge, Pixel Wave Studio offers complete photo and video packages for weddings. It is a central, convenient choice for couples who want one team for the whole day.",
      },
      {
        name: "Wed Films",
        area: "Butwal",
        phone: "+977-9824466000",
        sourceUrl: "https://www.facebook.com/wedfilms.np/",
        description:
          "Wed Films is a Butwal wedding photography and film production house. Its focus on film makes it worth a look for couples who want a cinematic highlight and a full ceremony edit.",
      },
      {
        name: "SP Photography",
        area: "Milanchowk",
        sourceUrl: directories.poudelButwalRoundup,
        description:
          "SP Photography in Milanchowk covers weddings, pre-wedding shoots and family functions such as pasni in Butwal and Gulmi. It suits families with roots in the hills who want the same team for events in both places.",
      },
      {
        name: "Prem Digital Photo Studio",
        area: "Butwal-3",
        phone: "+977-9857037840",
        sourceUrl: directories.poudelButwalRoundup,
        description:
          "A long-established studio, Prem Digital Photo Studio is known for traditional wedding coverage, large group portraits and printing. It is a good fit for families who value classic, complete documentation and printed albums.",
      },
      {
        name: "New Moonlight Photography",
        area: "Sukhanagar",
        phone: "+977-9857025773",
        sourceUrl: "https://www.facebook.com/Studionewmoonlight7/",
        description:
          "New Moonlight Photography is a Sukhanagar studio covering weddings and events. It is worth contacting for smaller, family-focused celebrations close to home, where a neighbourhood team that already knows the local venues and families can make the day feel easy.",
      },
      {
        name: "Poudel Digital Photography",
        area: "Sukhanagar",
        phone: "+977-9857064658",
        sourceUrl: "https://poudeldigital.com/portfolio",
        description:
          "With more than fifteen years of experience by its own account, Poudel Digital Photography is one of Butwal's best-known studios. It covers weddings, cinematic films and pre-wedding shoots across Nepal, from Palpa's hills to Lumbini, and suits couples who want candid photography and a polished film from one team.",
      },
    ],
  },
  biratnagar: {
    city: "Biratnagar",
    studios: [
      {
        name: "ImgStock",
        area: "Mahendra Chowk",
        phone: "+977-9852039585",
        sourceUrl: "https://imgstock.net/",
        description:
          "Run by photographer Niraj Shrestha, ImgStock covers weddings and events across Morang, Sunsari and Jhapa, including Dharan, Itahari and Damak. Its wide service area is ideal for eastern families whose celebrations span more than one town.",
      },
      {
        name: "As You Like Studio",
        area: "Mahendra Chowk",
        phone: "+977-9824392531",
        sourceUrl: "https://www.facebook.com/asyoulikestudiobiratnagar/",
        description:
          "As You Like Studio offers photography, cinematography, theme videos and promotional films, a creative range that carries into its wedding work. Couples who want a concept-led pre-wedding video or a stylised film will find plenty of ideas here.",
      },
      {
        name: "Bandhu Photo Studio",
        area: "Main Road, Neelsadan-10",
        phone: "+977-9841233862",
        sourceUrl: "https://www.facebook.com/bandhuphotostudio/",
        description:
          "Offering photography and videography since 2004, Bandhu Photo Studio on Main Road is one of Biratnagar's longer-running studios. Two decades of local weddings make it a safe choice for traditional, complete coverage.",
      },
      {
        name: "Wedding Biratnagar Nepal",
        area: "Gaumukhi Marg, Chandani Chowk, Biratnagar-5",
        phone: "+977-9844107395",
        sourceUrl: "https://www.facebook.com/Brtwedding/",
        description:
          "Wedding Biratnagar Nepal covers weddings, pre- and post-wedding shoots, rice-feeding ceremonies and fashion work. The fashion experience brings a stylish edge to its bridal and couple portraits, which suits couples who want their portraits to look as considered as their outfits.",
      },
      {
        name: "Moonlight Photo Studio",
        area: "near Birat Nursing Home",
        phone: "+977-9842028122",
        sourceUrl: "https://www.facebook.com/moonlightphotostudiobrt/",
        description:
          "Moonlight Photo Studio offers photography and videography, including pre- and post-wedding shoots. It is a convenient central option close to the city's main venues; ask to see night-time ceremony coverage, since many Biratnagar rites run late.",
      },
      {
        name: "Arms Studio",
        area: "Rani (Mills Area)",
        phone: "+977-9842046881",
        sourceUrl: directories.purbeliBazar,
        description:
          "Run by Anil Dangol, Arms Studio in the Rani mills area is listed among Biratnagar's wedding studios by the Purbeli Bazar directory. An owner-run studio usually means you know exactly who will be behind the camera.",
      },
      {
        name: "Avi Studio",
        area: "Saraswati Tole",
        phone: "+977-9842447850",
        sourceUrl: directories.purbeliBazar,
        description:
          "Avi Studio, run by Abishek Shrestha from Saraswati Tole, covers wedding photography with a personal, photographer-led approach. Ask for a complete gallery from a recent wedding, and meet in person to check that your styles and personalities match.",
      },
      {
        name: "Kamkazi Productions",
        area: "Tintoliya",
        phone: "+977-9815338868",
        sourceUrl: directories.purbeliBazar,
        description:
          "Kamkazi Productions, run by Ayush Shrestha, focuses on wedding and event photography. Its production-minded approach suits couples looking for a modern, planned style of coverage; share your event schedule early so the team can map shots to every ritual.",
      },
      {
        name: "Aashish Digital Photo Studio",
        area: "Tinpaini, Biratnagar-2",
        phone: "+977-9842048474",
        sourceUrl: directories.biheBazaar("aashish-digital-photo-studio"),
        description:
          "Aashish Digital Photo Studio in Tinpaini is listed for wedding photography and videography on Bihe Bazaar. It is a local studio worth including when you want a broader range of quotes.",
      },
    ],
  },
  dharan: {
    city: "Dharan",
    studios: [
      {
        name: "Shutter Katha",
        area: "Itahari, covering Dharan",
        phone: "+977-9705004950",
        sourceUrl: "https://shutterkatha.com/capturing-the-magic-your-nepali-wedding-photography-guide",
        description:
          "Based in Itahari, about half an hour south, Shutter Katha regularly covers Dharan weddings and says its lead photographer has more than thirteen years of experience. True to its name — katha means story — its storytelling approach suits couples who want an album that reads like a narrative.",
      },
      {
        name: "JMD Eventography",
        area: "Dharan",
        phone: "+977-9842416151",
        sourceUrl: "https://jmdeventography.blogspot.com/",
        description:
          "JMD Eventography is a wedding and event photography team that also designs albums and takes bookings online. In-house album design is a real plus if you want a finished printed book without dealing with a separate designer.",
      },
      {
        name: "Photoberry Studio",
        area: "Sadan Chowk",
        phone: "+977-9808034450",
        sourceUrl: directories.biheBazaar("photoberry-studio"),
        description:
          "Photoberry Studio at Sadan Chowk is listed for wedding photography on Bihe Bazaar with prices from about NPR 35,000. Its published pricing makes it a helpful reference point while you compare Dharan studios.",
      },
      {
        name: "Rojesh Shakya's Photography",
        area: "Dharan",
        phone: "+977-9842039532",
        sourceUrl: "https://www.facebook.com/RojeshShakyaPhotography/",
        description:
          "Rojesh Shakya's Photography is a photographer-led Dharan studio covering weddings with photography and video. When the owner shoots the wedding personally, you get consistency from the first meeting to the final album.",
      },
      {
        name: "Snap Dharan Photoshoot and Videography",
        area: "Dharan",
        phone: "+977-9812371156",
        sourceUrl: "https://www.facebook.com/snapdharan/",
        description:
          "Snap Dharan specialises in wedding photography and videography. It is a focused wedding team that suits couples who want a single crew for both the photos and the film, so the two never compete for the same spot during the ceremony.",
      },
      {
        name: "Wedding Dharan",
        area: "Dharan",
        phone: "+977-9819091412",
        sourceUrl: "https://www.facebook.com/weddingdharan",
        description:
          "Wedding Dharan is a local photography and videography team dedicated to weddings in the town. Ask about quick teaser videos and online delivery if relatives abroad are waiting to see the celebration.",
      },
      {
        name: "Buzz Studio Dharan",
        area: "Dharan",
        phone: "+977-9808747269",
        sourceUrl: "https://www.instagram.com/buzzstudio.np/",
        description:
          "Buzz Studio Dharan shares its photography on Instagram, which makes it easy to judge its colour and posing style at a glance. It suits couples who want a contemporary, social-media-friendly look.",
      },
      {
        name: "Great Studio",
        area: "Acharya Line",
        phone: "+977-9842039532",
        sourceUrl: directories.biheBazaar("great-studio"),
        description:
          "Great Studio on Acharya Line is listed for wedding photography and videography on Bihe Bazaar. It is a central Dharan option that is easy to visit in person; request a full recent wedding gallery and a sample album before booking.",
      },
      {
        name: "Pics Studio",
        area: "Dharan",
        phone: "+977-9842170853",
        sourceUrl: directories.biheBazaar("pics-studio"),
        description:
          "Pics Studio is listed for wedding photography and videography on Bihe Bazaar. It is worth including when you want more quotes to compare for a Dharan wedding; ask for a written breakdown of crew, hours and deliverables so the numbers line up.",
      },
    ],
  },
  birgunj: {
    city: "Birgunj",
    studios: [
      {
        name: "Cinematic Nepal",
        area: "Birgunj",
        phone: "+977-9829456330",
        sourceUrl: "https://cinematicnepal.com/services/best-photography-service-in-birgunj/",
        description:
          "Cinematic Nepal is a Birgunj-based team covering weddings, family events, portraits and business shoots. As the name suggests, film sits at the centre of its work, making it a good option for couples who want a cinematic record of the baraat and the ceremony.",
      },
      {
        name: "Hatiya Photo Studio",
        area: "Phaparbari Road, Hetauda",
        phone: "+977-9845717452",
        sourceUrl: "https://www.facebook.com/hatiyaphotostudio/",
        description:
          "Based in Hetauda, a couple of hours north, Hatiya Photo Studio says it works throughout Nepal and publishes cinematic wedding films as well as pre- and post-wedding work. It is worth the drive if you want a more cinematic style than most local studios offer.",
      },
      {
        name: "Raj Shree Digital Studio & Videography",
        area: "Birgunj",
        phone: "+977-9845259882",
        sourceUrl: "https://www.facebook.com/p/Raj-Shree-Digital-Studio-Videography-100064164876259/",
        description:
          "Raj Shree Digital Studio & Videography shares wedding photography and videography from Birgunj and Parsa on Facebook and Instagram. Its local focus makes it a natural addition to a Birgunj shortlist.",
      },
      {
        name: "Birgunj Wedding And Event",
        area: "Birgunj",
        phone: "+977-9748453025",
        sourceUrl: "https://www.facebook.com/birgunjvideographer/",
        description:
          "A wedding and event videography team, Birgunj Wedding And Event publishes its work on Facebook. Pair it with a stills photographer if you want both a strong film and a complete photo album.",
      },
      {
        name: "Photo Max",
        area: "Adarshnagar",
        phone: "+977-9804231075",
        sourceUrl: "https://www.nepalyp.com/category/Studios/city:Birgunj",
        description:
          "Established in 1996 according to its directory listing, Photo Max in Adarshnagar is one of Birgunj's longest-running studios. Three decades in the city make it a steady choice for families who value experience and a studio that has photographed generations of local weddings.",
      },
      {
        name: "Vishal Photography",
        area: "Ghantaghar",
        phone: "+977-9806810414",
        sourceUrl: "https://www.facebook.com/vishalgupta9501/",
        description:
          "Vishal Photography near Ghantaghar offers photography and videography services. It is a central studio, convenient for venues in the city core and for families who want to drop in, look through past albums and talk the day through face to face.",
      },
      {
        name: "Bhushan's Digital Studio",
        area: "Adarsh Marg, Timla",
        phone: "+977-51-527575",
        sourceUrl: "https://www.nepalyp.com/category/Studios/city:Birgunj",
        description:
          "Bhushan's Digital Studio is a digital photo studio on Adarsh Marg, Timla, listed in the Nepal Yellow Pages. It is a local option for smaller weddings and family functions, and for printing and framing the photographs once the celebrations are over.",
      },
      {
        name: "Sajal Digital Studio",
        area: "Maisthan",
        sourceUrl: "https://www.facebook.com/565863753432228/",
        description:
          "Sajal Digital Studio is a digital photo studio in central Birgunj near Maisthan. Contact it for a quote and ask to see a complete recent wedding album, including the night-time ceremony frames that show how a team really handles light.",
      },
    ],
  },
  nepalgunj: {
    city: "Nepalgunj",
    studios: [
      {
        name: "Mega Mixing Lab",
        area: "Nepalgunj",
        phone: "+977-81-530746",
        sourceUrl: "https://megamixinglab.com/",
        description:
          "Founded in 2012 by Nilraj Adhikari, Mega Mixing Lab covers wedding photography and cinematic videography in Nepalgunj and travels regularly to Bardiya, Dang, Kailali and Surkhet. That reach makes it one of the most useful options for families spread across the western Terai.",
      },
      {
        name: "New Gautam Films",
        area: "Saderlin, Nepalgunj-11",
        sourceUrl: "https://newgautamfilms.com/",
        description:
          "New Gautam Films is a Nepalgunj wedding photography and film studio. Its focus on film makes it a good pick for couples who want a cinematic highlight alongside their album; ask to watch a complete wedding film, not just the trailer.",
      },
      {
        name: "LensCraft Studio",
        area: "Puspalal Chowk, Nepalgunj-2",
        phone: "+977-9858027878",
        sourceUrl: directories.biheBazaar("lenscraft-studio"),
        description:
          "LensCraft Studio at Puspalal Chowk is listed for wedding photography and videography on Bihe Bazaar with prices from about NPR 40,000. Its published pricing gives you a solid benchmark for full photo and video coverage in the city.",
      },
      {
        name: "Portraits by Pawan",
        area: "Tribhuvan Chowk, Rani Talau",
        phone: "+977-9868022222",
        sourceUrl: "https://www.facebook.com/portraitsbypawan/",
        description:
          "Portraits by Pawan is a Nepalgunj photographer covering weddings, fashion and portraits, with wedding films published from local party palaces. The fashion background shows in confident, flattering bridal portraits that make the most of the outfit, jewellery and make-up.",
      },
      {
        name: "Yatra Studio",
        area: "Nepalgunj",
        phone: "+977-9812567215",
        sourceUrl: "https://www.facebook.com/yatraphotography/",
        description:
          "Yatra Studio covers photography, videography, documentaries and pre- and post-wedding shoots. Its documentary work suits couples who want a natural, story-led wedding film that follows the day as it unfolds rather than one built from posed set pieces.",
      },
      {
        name: "Acharya Digital Studio",
        area: "Puspalal Chowk, Nepalgunj-4",
        phone: "+977-81-551589",
        sourceUrl: "https://www.nepalyp.com/category/Photography/city:Nepalgunj",
        description:
          "Established in 2018, Acharya Digital Studio offers photo and video services for weddings and other occasions from its Puspalal Chowk studio. It is a practical local choice for families who want one team for the wedding and the family functions around it.",
      },
      {
        name: "Ramji Studio",
        area: "Nepalgunj",
        phone: "+977-9866200000",
        sourceUrl: "https://www.instagram.com/ramji_studio/",
        description:
          "Ramji Studio is a wedding photography and videography studio run by Ramji Gupta. It is active on Instagram, where you can review recent work before you call, and an owner-run studio usually means the person you meet is the person who shoots.",
      },
      {
        name: "AD Studio",
        area: "Bus Park Road",
        phone: "+977-9860107110",
        sourceUrl: "https://www.facebook.com/Adstudionpl/",
        description:
          "AD Studio on Bus Park Road is a Nepalgunj photo and video studio active on Facebook and Instagram. It is a convenient local option for smaller celebrations; browse its recent posts to judge colour and editing style before you ask for a quote.",
      },
      {
        name: "Bishal Photo Studio",
        area: "Nepalgunj",
        phone: "+977-9868293250",
        sourceUrl: "https://www.facebook.com/BishalPhotoStudio/",
        description:
          "Bishal Photo Studio offers photography and videography for all kinds of events in Nepalgunj and Banke, from weddings to family functions. Its broad event experience suits families planning several celebrations in one season who want a single, familiar team.",
      },
    ],
  },
} satisfies Record<string, CityShortlist>;

export type ShortlistCitySlug = keyof typeof cityShortlists;

/** The studios after Wedding Story Nepal, in list order. */
export function rankedShortlist(slug: ShortlistCitySlug): ShortlistedStudio[] {
  return [...cityShortlists[slug].studios];
}

/** Entries on a city list page, Wedding Story Nepal included. */
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
      `We keep a separate list of the top ${cityListEntryCount(slug)} wedding photographers in ${city}, with what each studio offers and how to contact it: [best wedding photographers in ${city}](${cityListHref(slug)}). Use this guide to brief and compare whoever you contact from it.${localNote ? ` ${localNote}` : ""}`,
    ],
  };
}

/** One source per distinct URL, so directory listings shared by several studios appear once. */
export function studioShortlistSources(slug: ShortlistCitySlug): Array<{ label: string; url: string }> {
  const namesByUrl = new Map<string, string[]>();
  for (const listed of rankedShortlist(slug)) {
    if (!listed.sourceUrl) continue;
    namesByUrl.set(listed.sourceUrl, [...(namesByUrl.get(listed.sourceUrl) ?? []), listed.name]);
  }
  return [...namesByUrl].map(([url, names]) => ({
    label: `${cityShortlists[slug].city} list: ${names.join(", ")}`,
    url,
  }));
}
