import type { BlogPost } from "./blog";

const image = (id: string, width = "1200", height = "675") =>
  "https://images.unsplash.com/" + id + "?w=" + width + "&h=" + height + "&fit=crop&auto=format";

const publication = {
  date: "23 Sep 2026",
  publishedAt: "2026-09-23",
  modifiedAt: "2026-09-23",
} as const;

/**
 * Authority guides fill intent gaps the earlier clusters left open: how people search for
 * businesses in Nepal (directories, spellings, AI assistants), how owners become findable, and
 * consumer-protection tasks that no category page answers. Each guide owns one task so it does
 * not compete with an existing post, and each links back to the hub that completes the task.
 */
export const authorityGuidePosts: BlogPost[] = [
  {
    ...publication,
    title: "Nepal Yellow Pages Online: From Phone Books to Searchable Local Directories",
    seoTitle: "Nepal Yellow Pages Online: How to Find Businesses Today",
    slug: "nepal-yellow-pages-online-directory-guide",
    href: "/blog/nepal-yellow-pages-online-directory-guide",
    category: "Business Directory",
    excerpt:
      "Why printed business phone books faded in Nepal, what replaced them, and how to use an online directory the way people once used the yellow pages.",
    description:
      "Looking for Nepal Yellow Pages online? Learn what replaced printed phone books, how online directories differ, and how to find and verify a Nepal business today.",
    image: image("photo-1481627834876-b7833e8f5570"),
    imageAlt: "Long shelves of printed books and reference volumes in a library",
    readTime: "8 min read",
    author: "Nepali Directory Editorial Team",
    keywords: [
      "Nepal Yellow Pages",
      "Nepal Yellow Pages online",
      "yellow pages Kathmandu",
      "Nepal phone directory",
      "online business directory Nepal",
      "business phone numbers Nepal",
      "Nepal company contact list",
      "find business contact Nepal",
    ],
    tags: ["Nepal Directory", "Yellow Pages", "Local Search", "Business Discovery"],
    categorySlugs: ["shops", "restaurants"],
    citySlugs: ["kathmandu"],
    sections: [
      {
        heading: "What people mean by Nepal Yellow Pages",
        paragraphs: [
          "For a generation of households and offices, finding a business meant opening a thick printed directory or calling a telephone enquiry service. Categories were alphabetical, entries were short, and a paid box advert was the only way to stand out. When people search for Nepal Yellow Pages today, they usually want the same outcome with less friction: a phone number, an address and some confidence that the business still exists.",
          "The name survives because the job survives. A resident needs a plumber tonight, a trader needs a supplier in Birgunj, and a visitor needs a pharmacy near Thamel. What has changed is the medium. Printed books could not show a map, opening hours, photographs or recent reviews, and they were out of date almost as soon as they were distributed.",
        ],
      },
      {
        heading: "Why printed directories stopped working",
        paragraphs: [
          "Nepal's business landscape changes quickly. New shops open along ring roads, restaurants move within Thamel and Jhamsikhel, and landline numbers were replaced by mobile numbers that change when a SIM is replaced. A yearly printed edition simply could not keep up, and customers learned that calling an old number was often a wasted effort.",
          "Search behaviour also moved to the phone. People now type a need and a place, such as dentist in Lalitpur or hardware shop in Butwal, into a search engine, map app or AI assistant. Any modern replacement for the yellow pages must therefore be crawlable, current, organized by city, and readable on a small screen with weak mobile data.",
        ],
      },
      {
        heading: "How an online directory improves on the yellow pages",
        paragraphs: [
          "A good online directory keeps the category-and-city logic that made the yellow pages useful, then adds what print could not. On [Nepali Directory](/best-directory-in-nepal), each category hub explains what to compare, each city hub adds neighbourhood context, and business profiles show location, contact routes and the date details were checked.",
          "The most important improvement is accountability. A printed directory rarely explained where an entry came from. A trustworthy online directory publishes its method, labels paid placement, separates advertising from ratings and gives owners and users a way to correct errors. Those signals matter more than the number of listings a site claims to hold.",
        ],
      },
      {
        heading: "How to search like an expert",
        paragraphs: [
          "Start with the service rather than a business name, and add the city or neighbourhood. If you need a restaurant for a family event, begin at the [restaurant hub](/category/restaurants); if you need hardware, electrical fittings or everyday goods, start with [shops in Nepal](/category/shops). Then narrow to profiles that mention the exact service, area and hours you need.",
          "Open two or three profiles and compare the same facts: location, contact method, opening hours, services and any photographs or reviews. If a business also appears on a map app or social page, check that the name, phone number and address agree. Consistent details across sources are a good sign that you have the right business.",
        ],
      },
      {
        heading: "Verify before you travel or pay",
        paragraphs: [
          "Directory information is a starting point, not a contract. Call or message the business to confirm it is open, that the item or service is available and that the price still applies. This matters most for festival periods, rural trips and specialist work, where hours and stock can change without notice.",
          "For regulated services such as healthcare, legal advice, construction or financial products, a directory listing is not proof of a licence. Check the relevant official register or regulator, and ask the provider for documents that relate to your transaction. Keep receipts and written terms for any significant payment.",
        ],
      },
      {
        heading: "What owners should take from the yellow pages era",
        paragraphs: [
          "Businesses once paid for a bold advert and hoped the book stayed on the shelf. Today, visibility comes from accurate, consistent information in the places people actually search. Owners should claim their profile, keep one primary phone number, write a clear service description and update hours before holidays.",
          "The old lesson still applies in a new form: customers choose the business they can reach with confidence. The owner's checklist in [keeping a Nepal business listing accurate](/blog/nepal-business-listing-accuracy-owner-checklist) covers the fields that most often go wrong and how to fix them before they cost a customer.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is there an online version of the Nepal Yellow Pages?",
        answer:
          "Printed yellow pages have largely been replaced by online business directories and map apps. Nepali Directory lets you search Nepal businesses by category and city and open profiles with contact and location details that you can then confirm directly.",
      },
      {
        question: "How do I find a business phone number in Nepal?",
        answer:
          "Search the service and city in an online directory, open the business profile and compare the number with the business's own website or social page. Call to confirm before visiting, because mobile numbers change more often than addresses.",
      },
      {
        question: "Are online directory listings always up to date?",
        answer:
          "No directory can guarantee that. Check the date a profile was reviewed, compare details across sources, and confirm hours, prices and availability directly with the business before relying on them.",
      },
    ],
    contextLinks: [
      { href: "/best-directory-in-nepal", label: "How to choose the best directory in Nepal" },
      { href: "/categories", label: "Browse every business category" },
      { href: "/city/kathmandu", label: "Find businesses in Kathmandu" },
      { href: "/blog/nepal-business-directory-find-local-services-guide", label: "How to use a Nepal business directory" },
    ],
    disclaimer:
      "Directory profiles are for discovery and may change. Confirm current contact details, hours and terms directly with the business before relying on them.",
  },
  {
    ...publication,
    title: "How to Search for Businesses in Nepal Using Nepali and English Terms",
    seoTitle: "Search Nepal Businesses in Nepali and English: Spelling Tips",
    slug: "search-nepal-businesses-nepali-english-spellings",
    href: "/blog/search-nepal-businesses-nepali-english-spellings",
    category: "Business Directory",
    excerpt:
      "Pasal or shop, Patan or Lalitpur, Baneshwor or Baneshwar: how local names and spellings change search results, and how to search so nothing is missed.",
    description:
      "Search Nepal businesses in Nepali and English: handle spelling variants, local place names and Nepali words like pasal, so directories, maps and AI tools find them.",
    image: image("photo-1512941937669-90a1b58e7e9c"),
    imageAlt: "Smartphone home screen with search, map and messaging apps",
    readTime: "8 min read",
    author: "Nepali Directory Editorial Team",
    keywords: [
      "search businesses in Nepali",
      "Nepali business names English spelling",
      "Nepal place name spellings",
      "pasal meaning",
      "Lalitpur Patan search",
      "Nepal local search tips",
      "Romanized Nepali search",
      "find shop in Nepal",
    ],
    tags: ["Local Search", "Nepali Language", "Search Tips", "Nepal Directory"],
    categorySlugs: ["shops"],
    citySlugs: ["kathmandu", "lalitpur", "bhaktapur"],
    sections: [
      {
        heading: "Why the same business appears under different names",
        paragraphs: [
          "Nepal businesses are named and written in Devanagari, Romanized Nepali and English, often by different people. A family shop might be registered under one name, painted on a signboard in Devanagari, listed on a map app in English and saved in customers' phones by the owner's name. Each version can appear in a different search tool, and none of them is wrong.",
          "Place names add another layer. Lalitpur and Patan describe overlapping areas, Bhaktapur is also known as Bhadgaon or Khwopa, and neighbourhoods such as Baneshwor, Koteshwor and Maharajgunj are spelled several ways in English. If you search only one spelling, you can miss the business you need even when it is listed.",
        ],
      },
      {
        heading: "Common Nepali business words worth knowing",
        paragraphs: [
          "A handful of everyday Nepali words appear constantly in business names. Pasal means shop, kirana pasal is a grocery or general store, mithai pasal sells sweets, bhojanalaya or khaja ghar serves meals and snacks, and sahakari refers to a cooperative. Aspatal is a hospital, and bidyalaya or school names often include Madhyamik for secondary level.",
          "When a search in English returns little, try the Romanized Nepali term with the area, for example kirana pasal Kirtipur or khaja ghar Dharan. Many small businesses describe themselves in these words rather than in the English category a directory uses, so combining both vocabularies widens your shortlist.",
        ],
      },
      {
        heading: "Handle spelling variants deliberately",
        paragraphs: [
          "Romanization of Nepali has no single enforced standard. The endings -wor and -war, -gunj and -ganj, and doubled vowels such as aa and ee vary between signboards, registrations and websites. Try the two most common spellings of a place name before deciding a business is not listed.",
          "The same applies to personal names inside business names. Shrestha, Maharjan, Tamang or Gurung may be abbreviated, and Shree or Shri is often added at the start of a shop name. Search engines usually handle small differences, but a directory or map search can be stricter, so it helps to drop prefixes and search the distinctive part of the name.",
        ],
      },
      {
        heading: "Use categories and city hubs when names fail",
        paragraphs: [
          "If you do not know the exact name, stop guessing spellings and browse instead. Open the relevant [category hub](/categories), then the city, and scan profiles for the service and area you need. Category-first browsing works regardless of how an owner chose to write the business name.",
          "City hubs are especially useful in the Kathmandu Valley, where Kathmandu, Lalitpur and Bhaktapur meet. A business in Kupondole or Sanepa may be described as Kathmandu by some sources and Lalitpur by others. Checking both [Kathmandu](/city/kathmandu) and [Lalitpur](/city/lalitpur) avoids missing a provider that sits near the boundary.",
        ],
      },
      {
        heading: "Searching with AI assistants in mixed language",
        paragraphs: [
          "AI assistants such as ChatGPT, Gemini and Claude can understand questions that mix English and Romanized Nepali, like best momo pasal near Jhamsikhel. They are useful for building a first shortlist and explaining unfamiliar terms. However, they may merge similarly named businesses or rely on outdated sources.",
          "Treat an AI answer as a lead, not a confirmation. Ask for the source page, open it, and verify the business in a directory profile or its own channel. If an assistant gives a phone number, compare it with the listing before calling, and never send a payment based only on an AI-generated contact.",
        ],
      },
      {
        heading: "Advice for owners: make every version findable",
        paragraphs: [
          "Owners can reduce confusion by choosing one primary English spelling for the business name and using it everywhere, while mentioning the Nepali name and common alternatives in the business description. A line such as also known locally as the owner's name plus pasal helps customers recognise the business.",
          "Include the neighbourhood and a landmark in the address, because many Nepal streets lack formal names. Consistent spelling across the directory profile, signboard, social pages and receipts helps search engines and AI tools connect all mentions to one business instead of splitting them into weaker, conflicting records.",
        ],
      },
    ],
    faqs: [
      {
        question: "What does pasal mean in a Nepal business name?",
        answer:
          "Pasal is the Nepali word for shop. Kirana pasal is a grocery or general store, and many small businesses use pasal in their name, so searching the word with an area name can surface shops that an English category search misses.",
      },
      {
        question: "Should I search Lalitpur or Patan?",
        answer:
          "Try both. Patan is the historic city at the core of Lalitpur, and sources use the names differently. Businesses near the Kathmandu and Lalitpur boundary may also be listed under either city.",
      },
      {
        question: "Why can't I find a business I know exists?",
        answer:
          "It may be listed under a different spelling, a Romanized Nepali name, or a neighbouring city. Search the distinctive part of the name, try alternative spellings, or browse the category and city hub instead.",
      },
      {
        question: "Can I ask ChatGPT or Gemini to find a Nepal business in Nepali?",
        answer:
          "Yes. AI assistants understand Romanized Nepali and mixed-language questions. Use the answer as a lead, open the cited source and confirm the business in a directory profile or its official channel before calling or paying.",
      },
    ],
    contextLinks: [
      { href: "/categories", label: "Browse businesses by category" },
      { href: "/city/lalitpur", label: "Find businesses in Lalitpur" },
      { href: "/city/bhaktapur", label: "Find businesses in Bhaktapur" },
      { href: "/blog/kathmandu-valley-neighbourhoods-find-services-guide", label: "Kathmandu Valley neighbourhood guide" },
    ],
  },
  {
    ...publication,
    title: "How Nepali Businesses Can Appear in ChatGPT, Gemini and AI Search Answers",
    seoTitle: "Get Your Nepal Business Recommended by ChatGPT and AI Search",
    slug: "get-business-recommended-ai-search-nepal",
    href: "/blog/get-business-recommended-ai-search-nepal",
    category: "SEO",
    excerpt:
      "AI assistants now answer questions like best dentist in Pokhara. Here is how they choose sources, and what a Nepal business can do to be cited accurately.",
    description:
      "How Nepal businesses can appear in ChatGPT, Gemini, Claude, Perplexity and Google AI Overviews: consistent listings, citable facts, reviews and crawlable pages.",
    image: image("photo-1677442136019-21780ecad995"),
    imageAlt: "Three-dimensional letters AI above a network of connecting lines",
    readTime: "11 min read",
    author: "Nepali Directory SEO Desk",
    keywords: [
      "AI search optimization Nepal",
      "generative engine optimization Nepal",
      "ChatGPT business recommendations Nepal",
      "appear in Google AI Overviews",
      "answer engine optimization",
      "GEO for local business",
      "Gemini local business Nepal",
      "AI visibility small business Nepal",
    ],
    tags: ["AI Search", "GEO", "Local SEO", "Business Growth"],
    sections: [
      {
        heading: "How AI assistants decide which businesses to mention",
        paragraphs: [
          "When someone asks an AI assistant for the best hotel in Chitwan or a reliable IT company in Kathmandu, the assistant usually runs a web search, reads a handful of pages and summarizes them. ChatGPT search, Microsoft Copilot and several other tools draw heavily on the Bing index, while Gemini and Google AI Overviews rely on Google's index. Perplexity and Claude use their own crawlers and search partners.",
          "The practical consequence is simple: an assistant can only recommend what it can find, read and trust. Businesses that appear consistently across crawlable directories, their own website, map platforms and credible local articles are far more likely to be named than businesses that exist only on a social page or a messaging app.",
        ],
      },
      {
        heading: "Be the same business everywhere",
        paragraphs: [
          "AI systems try to connect mentions into one entity. If your business name, phone number, address and category differ between Google, Bing, Facebook and directories, the system may split you into several weak records or skip you. Pick one official name, one primary phone number and one address format, and use them everywhere.",
          "Start with the platforms that feed AI answers: Google Business Profile, Bing Places for Business, Apple Business Connect and reputable Nepal directories such as [Nepali Directory](/claim-listing). Then fix older listings that show a previous number or location. The [listing accuracy checklist](/blog/nepal-business-listing-accuracy-owner-checklist) explains which fields matter most.",
        ],
      },
      {
        heading: "Publish facts that are easy to quote",
        paragraphs: [
          "Language models favour clear, specific statements they can quote. Instead of we provide the best service, write facts: which services you offer, the areas you serve, opening hours, languages spoken, price approach, years of operation and any genuine qualifications. A sentence such as a dental clinic in Lakeside, Pokhara offering check-ups, fillings and orthodontic consultations, open Sunday to Friday, is far easier to cite than a slogan.",
          "Put these facts on your own website in plain HTML text, not only inside images or PDFs. Add a short frequently asked questions section that answers what customers actually ask, such as parking, booking, payment methods and emergency availability. Each answer should make sense on its own, because AI tools often lift a single passage.",
        ],
      },
      {
        heading: "Make your website readable by AI crawlers",
        paragraphs: [
          "Check that your robots.txt file does not block the crawlers you want to be found by, such as Googlebot, Bingbot, OAI-SearchBot, ChatGPT-User, PerplexityBot and ClaudeBot. Many Nepal websites built on cheap templates block bots accidentally or load all their text through JavaScript that some crawlers do not render.",
          "Add LocalBusiness structured data with your name, address, phone, opening hours and geo-coordinates, and keep it consistent with your listings. An llms.txt file that summarizes your key pages is a low-cost addition. Submit your sitemap to Google Search Console and Bing Webmaster Tools, and use IndexNow so Bing-based assistants notice updates quickly.",
        ],
      },
      {
        heading: "Earn mentions and reviews that AI systems trust",
        paragraphs: [
          "Assistants lean on third-party evidence: reviews, local news, association memberships, tourism board pages and comparison guides. Ask satisfied customers for honest, specific reviews that mention the service and area, such as root canal treatment in Baneshwor. Specific reviews help both human readers and AI summaries understand what you are good at.",
          "Never buy reviews, create fake profiles or post keyword-stuffed content. Search engines and AI providers actively filter manipulation, and a single exposed fake review campaign can remove a business from recommendations entirely. Real customer evidence accumulated steadily is the only durable approach.",
        ],
      },
      {
        heading: "Measure and correct what AI says about you",
        paragraphs: [
          "Every few weeks, ask ChatGPT, Gemini, Claude, Perplexity and Copilot the questions your customers ask, such as best bakery in Dharan or where to repair a laptop in New Road. Note whether you appear, which sources are cited and whether the details are correct. Save the results so you can see change over time.",
          "When an answer is wrong, fix the source rather than the assistant. Update the outdated listing, correct your website, or ask the directory to fix its profile. Most assistants give feedback buttons, but corrected public sources are what change future answers. The [local SEO checklist](/blog/nepal-local-seo-checklist-small-businesses) covers the search engine side of the same work.",
        ],
      },
    ],
    faqs: [
      {
        question: "How do I get my business recommended by ChatGPT in Nepal?",
        answer:
          "Keep your name, phone and address identical across Google, Bing Places, your website and reputable Nepal directories; publish specific, quotable facts on crawlable pages; allow AI crawlers in robots.txt; and earn genuine, specific customer reviews.",
      },
      {
        question: "Can I pay to appear in AI search answers?",
        answer:
          "Organic AI answers cannot be bought directly. They draw on web sources the assistant finds and trusts, so the reliable route is accurate listings, a clear website, genuine reviews and credible third-party mentions.",
      },
      {
        question: "Does a directory listing help with AI search visibility?",
        answer:
          "Yes, when the directory is crawlable and consistent. AI assistants often cite directory and comparison pages, and a complete profile gives them another trustworthy source that confirms your business details.",
      },
      {
        question: "What is GEO or AEO?",
        answer:
          "Generative engine optimization and answer engine optimization describe making content easy for AI systems and answer boxes to find, understand and cite. For local businesses, it overlaps heavily with good local SEO and consistent listings.",
      },
    ],
    contextLinks: [
      { href: "/claim-listing", label: "Add or claim your business profile" },
      { href: "/blog/nepal-local-seo-checklist-small-businesses", label: "Local SEO checklist for Nepal businesses" },
      { href: "/blog/google-business-profile-nepal-setup-verification", label: "Set up a Google Business Profile in Nepal" },
      { href: "/best-directory-in-nepal", label: "What makes a directory trustworthy" },
    ],
    sources: [
      {
        label: "Google Search Central: AI features and your website",
        url: "https://developers.google.com/search/docs/appearance/ai-features",
      },
      {
        label: "OpenAI: overview of OpenAI crawlers",
        url: "https://platform.openai.com/docs/bots",
      },
      {
        label: "IndexNow protocol documentation",
        url: "https://www.indexnow.org/documentation",
      },
    ],
  },
  {
    ...publication,
    title: "Google Business Profile for Nepal Businesses: Setup, Verification and Upkeep",
    seoTitle: "Google Business Profile Nepal: Setup and Verification Guide",
    slug: "google-business-profile-nepal-setup-verification",
    href: "/blog/google-business-profile-nepal-setup-verification",
    category: "SEO",
    excerpt:
      "A Nepal-specific walkthrough for creating, verifying and maintaining a Google Business Profile when your street has no name and your number changes.",
    description:
      "Set up and verify a Google Business Profile in Nepal: pin locations without street names, pass video verification, choose categories and keep hours and photos current.",
    image: image("photo-1586953208448-b95a79798f07"),
    imageAlt: "Smartphone on a desk displaying a business profile page",
    readTime: "10 min read",
    author: "Nepali Directory SEO Desk",
    keywords: [
      "Google Business Profile Nepal",
      "Google My Business Nepal",
      "verify business on Google Nepal",
      "Google Maps listing Nepal",
      "add business to Google Maps Nepal",
      "Google business video verification",
      "Plus Code address Nepal",
      "Google Business Profile categories",
    ],
    tags: ["Google Business Profile", "Local SEO", "Google Maps", "Business Growth"],
    citySlugs: ["kathmandu", "pokhara"],
    sections: [
      {
        heading: "Why a Google Business Profile matters in Nepal",
        paragraphs: [
          "When someone in Nepal searches for a pharmacy near me or a hotel in Lakeside, Google often shows a map pack before any website. Those results come from Google Business Profiles. The same profile data also feeds Google Maps directions, Gemini answers and AI Overviews, so a missing or incorrect profile can make a real business invisible at the moment a customer is ready to act.",
          "A profile is free to create and manage. It does not replace your website or directory listings, but it is usually the single highest-impact local listing for walk-in and phone-call businesses such as restaurants, clinics, repair shops, schools and hotels.",
        ],
      },
      {
        heading: "Before you start: decide your official details",
        paragraphs: [
          "Choose the exact business name used on your signboard and documents, without adding keywords such as best or cheap, which violates Google's guidelines and can lead to suspension. Pick the primary phone number customers should call and a website or social page you control.",
          "Decide whether you serve customers at your premises, at their location, or both. A cafe or clinic shows its address. A plumber or tutor who visits homes can hide the address and define a service area instead, such as Kathmandu, Lalitpur and Bhaktapur. Choosing correctly avoids verification problems later.",
        ],
      },
      {
        heading: "Pinning a location when streets have no names",
        paragraphs: [
          "Many Nepal addresses rely on ward numbers, tole names and landmarks rather than street names and house numbers. Write the address the way customers understand it, for example the tole, ward, municipality and district, then drag the map pin to the exact entrance of your premises rather than accepting the default position.",
          "Google Plus Codes, the short codes shown when you drop a pin in Google Maps, give a precise location even without a formal address. Add the Plus Code to your website and directory profiles, and include a landmark in the description, such as opposite the ward office or beside a well-known temple. Customers arriving by bike or taxi will thank you.",
        ],
      },
      {
        heading: "Getting through verification",
        paragraphs: [
          "Google decides which verification methods to offer, and in Nepal video verification is common. You record a short continuous video showing the street or landmark, the business exterior with signage, and proof you manage the business, such as opening the shop, showing equipment or documents with a business name. Plan the route before recording, because the video must be unbroken.",
          "Postcards are unreliable where addresses are informal, and phone or email options appear only for some businesses. If verification fails, check that your name matches your signage, your pin is precise and your category fits what the video shows. Avoid creating a second profile, which usually triggers duplicate problems rather than solving them.",
        ],
      },
      {
        heading: "Categories, hours, photos and services",
        paragraphs: [
          "Your primary category has the largest effect on which searches you appear for, so choose the most specific accurate option, such as dental clinic rather than medical clinic. Add a few secondary categories only when you genuinely offer those services. List services and products with plain descriptions that match what customers search for.",
          "Set regular hours and add special hours for Dashain, Tihar and other public holidays, when customers most often find a closed door. Upload real photographs of the exterior, interior, team and work, and add new photos every month or two. Real, recent photos build trust far more than stock images.",
        ],
      },
      {
        heading: "Ongoing upkeep: reviews, questions and consistency",
        paragraphs: [
          "Reply politely to reviews, both positive and negative, and focus replies on the facts and the fix. Answer questions customers post on the profile, because those answers are public and are sometimes summarized by AI tools. Never offer discounts or gifts in exchange for reviews.",
          "Finally, keep the profile consistent with every other listing. When your number or hours change, update Google, Bing Places, your website and your [Nepali Directory profile](/claim-listing) on the same day. The guide to [appearing in AI search answers](/blog/get-business-recommended-ai-search-nepal) explains why consistency across platforms now matters more than ever.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is Google Business Profile free in Nepal?",
        answer:
          "Yes. Creating, verifying and managing a Google Business Profile is free. Be cautious of anyone charging to guarantee top Google Maps rankings, because nobody can promise a position.",
      },
      {
        question: "How do I verify my business on Google in Nepal?",
        answer:
          "Google chooses the method, and video verification is common in Nepal. Record one continuous video showing the nearby street or landmark, your signage and proof that you manage the business, such as tools, stock or business documents.",
      },
      {
        question: "What address should I use if my street has no name?",
        answer:
          "Use the tole, ward, municipality and district, place the map pin at your exact entrance, and add a nearby landmark and Plus Code in your description and on other listings.",
      },
    ],
    contextLinks: [
      { href: "/blog/nepal-local-seo-checklist-small-businesses", label: "Local SEO checklist for small businesses" },
      { href: "/blog/get-business-recommended-ai-search-nepal", label: "Appear in ChatGPT and AI search answers" },
      { href: "/claim-listing", label: "Claim your Nepali Directory profile" },
    ],
    sources: [
      {
        label: "Google Business Profile Help: guidelines for representing your business",
        url: "https://support.google.com/business/answer/3038177",
      },
    ],
  },
  {
    ...publication,
    title: "Accepting QR and Wallet Payments in Nepal: A Small Business Checklist",
    seoTitle: "Accept QR and Digital Wallet Payments in Nepal: Business Guide",
    slug: "accept-digital-payments-nepal-small-business-qr",
    href: "/blog/accept-digital-payments-nepal-small-business-qr",
    category: "Business Growth",
    excerpt:
      "How Nepal shops, cafes and service providers can accept QR, wallet and bank transfers safely, reconcile payments and avoid fake-screenshot fraud.",
    description:
      "Accept QR, wallet and mobile banking payments in Nepal: choose a merchant setup, display QR codes safely, stop fake payment screenshots and reconcile daily.",
    image: image("photo-1556742049-0cfed4f6a45d"),
    imageAlt: "Customer paying with a phone at a shop counter",
    readTime: "9 min read",
    author: "Nepali Directory Business Desk",
    keywords: [
      "accept QR payment Nepal",
      "merchant QR Nepal",
      "digital payment small business Nepal",
      "eSewa Khalti merchant",
      "Fonepay QR business",
      "NepalPay QR",
      "fake payment screenshot Nepal",
      "cashless payments Nepal shop",
    ],
    tags: ["Digital Payments", "Small Business", "QR Payments", "Business Growth"],
    categorySlugs: ["shops", "restaurants"],
    sections: [
      {
        heading: "Why QR payments are now expected",
        paragraphs: [
          "Scanning a QR code has become a normal way to pay in Nepal, from tea shops and grocery stores to clinics and schools. Customers increasingly carry less cash and expect to pay from a mobile banking app or wallet. A business that accepts only cash can lose sales, especially from younger customers and visitors from other cities.",
          "Digital payments also help the business. They reduce cash handling and change shortages, create an automatic record for accounting, and make it easier to show turnover when applying for a loan. The key is to set them up in a way that is secure and easy to reconcile.",
        ],
      },
      {
        heading: "Choose the right merchant setup",
        paragraphs: [
          "There are two broad routes. You can obtain a merchant QR through your bank, which typically connects to national QR networks such as Fonepay or NepalPay and can be scanned by many banking and wallet apps. Or you can open a merchant account with a licensed payment service provider such as eSewa or Khalti. Many businesses use both.",
          "Ask each provider which apps can pay your QR, what fees apply to merchant receipts or settlement, how quickly money reaches your bank account, what daily limits apply, and how disputes are handled. Payment providers in Nepal are licensed by Nepal Rastra Bank, so confirm you are dealing with the provider's official branch, app or agent.",
        ],
      },
      {
        heading: "Use a merchant QR, not a personal account",
        paragraphs: [
          "Many small shops display the owner's personal wallet QR. It works, but it mixes household and business money, may hit personal transaction limits and makes bookkeeping harder. A registered merchant QR shows the business name to the payer, which also reassures customers that they are paying the right party.",
          "Merchant registration usually requires business registration documents, PAN details and a bank account in the business name. If your business is not yet registered, speak to a tax adviser about the correct steps, because digital receipts create a clear turnover record that should match what you declare.",
        ],
      },
      {
        heading: "Stop fake payment screenshots",
        paragraphs: [
          "The most common digital payment fraud at small shops is a fake or edited success screenshot. A customer shows a screen that looks like a completed payment, but no money arrives. Never accept a screenshot as proof. Always confirm the payment on your own device through the merchant app, the sound box notification or a bank SMS before handing over goods.",
          "Also protect the QR itself. Laminate and fix the printed code where staff can see it, and check regularly that nobody has pasted a different code on top. Never share your PIN, OTP or login with anyone claiming to be from the bank or wallet, and treat urgent requests to verify your account as a scam.",
        ],
      },
      {
        heading: "Reconcile every day",
        paragraphs: [
          "At closing time, compare the day's digital receipts in the merchant app with your sales record and your cash drawer. Small differences caught daily are easy to explain; differences found at the end of the month rarely are. Export or screenshot the daily statement and keep it with your records.",
          "If you have staff, give them view-only notification access rather than your full login. Decide who can issue refunds and how, because a refund sent to the wrong number is hard to recover. Record refunds in writing with the transaction ID.",
        ],
      },
      {
        heading: "Tell customers how they can pay",
        paragraphs: [
          "Customers often choose a business partly on payment options, especially tourists and people paying for larger services. Display accepted methods at the entrance and counter, and include them in your website and directory profile. On [Nepali Directory](/claim-listing), mention payment methods in the business description so people know before they visit.",
          "If you do not accept a method, such as international cards, say so clearly. Avoiding a surprise at the till protects your reviews. For wider guidance on keeping business details consistent, see the [owner's listing accuracy checklist](/blog/nepal-business-listing-accuracy-owner-checklist).",
        ],
      },
    ],
    faqs: [
      {
        question: "How can a small shop in Nepal accept QR payments?",
        answer:
          "Apply for a merchant QR through your bank or a licensed payment provider such as eSewa or Khalti, usually with business registration, PAN and bank details. Display the code at the counter and confirm each payment in your own merchant app.",
      },
      {
        question: "Is a payment screenshot enough proof that I was paid?",
        answer:
          "No. Screenshots can be faked or edited. Confirm every payment on your own merchant app, sound box notification or bank SMS before releasing goods or services.",
      },
      {
        question: "Can I use my personal wallet QR for business?",
        answer:
          "It is possible but not ideal. A merchant QR shows your business name, keeps business money separate, avoids personal limits and makes accounting and tax records clearer.",
      },
    ],
    contextLinks: [
      { href: "/claim-listing", label: "Add payment details to your business profile" },
      { href: "/blog/nepal-chartered-accountant-tax-consultant-guide", label: "Find an accountant or tax consultant" },
      { href: "/category/shops", label: "Browse shops in Nepal" },
    ],
    disclaimer:
      "Fees, limits and merchant requirements are set by banks and payment providers and change over time. Confirm current terms with the provider before signing up.",
  },
  {
    ...publication,
    title: "How to Avoid Online Scams When Hiring Services in Nepal",
    seoTitle: "Avoid Online Scams When Hiring Services in Nepal: Checklist",
    slug: "avoid-online-scams-hiring-services-nepal",
    href: "/blog/avoid-online-scams-hiring-services-nepal",
    category: "Consumer Guides",
    excerpt:
      "Fake pages, advance-payment traps, cloned numbers and too-good offers: how to spot service scams in Nepal before you pay, and what to do if it happens.",
    description:
      "Avoid online scams when hiring services in Nepal: spot fake pages and cloned numbers, verify providers, pay safely and report fraud to the Nepal Police Cyber Bureau.",
    image: image("photo-1563013544-824ae1b704d3"),
    imageAlt: "Person holding a payment card while using a laptop",
    readTime: "9 min read",
    author: "Nepali Directory Services Desk",
    keywords: [
      "online scams Nepal",
      "online fraud Nepal",
      "fake Facebook page Nepal",
      "advance payment scam Nepal",
      "verify service provider Nepal",
      "Nepal Police Cyber Bureau",
      "report online fraud Nepal",
      "safe online payment Nepal",
    ],
    tags: ["Consumer Safety", "Scams", "Verification", "Online Payments"],
    categorySlugs: ["construction"],
    sections: [
      {
        heading: "The scams that target service customers",
        paragraphs: [
          "Most service scams in Nepal follow a few patterns. A fake social media page copies a real business's name and photos, then asks for an advance for a booking, visa service, rental or product that never arrives. A cloned phone number or messaging account pretends to be a known provider. An offer is far cheaper than the market and demands payment today to hold the price.",
          "Other schemes target specific moments: fake overseas job and study agents, fake trekking or tour packages, bogus rental flats advertised with borrowed photographs, and fake delivery or customs fees for parcels. The common thread is pressure to pay before you can check who you are dealing with.",
        ],
      },
      {
        heading: "Check the business behind the page",
        paragraphs: [
          "Before paying, confirm the business exists outside the chat. Look for a consistent name, address and phone number across a directory profile, map listing, website and social page. A page created last month with many followers but few genuine comments is a warning sign. Search the phone number and business name together with the word scam or fraud.",
          "For regulated services, check the official register. Manpower and foreign employment agencies, educational consultancies, travel and trekking agencies, banks and insurers are licensed by government bodies, and many publish lists of approved operators. The guide to [verifying companies in Nepal before hiring](/blog/verify-companies-in-nepal-before-hiring) explains which records to look for.",
        ],
      },
      {
        heading: "Payment habits that protect you",
        paragraphs: [
          "Pay to an account in the business's registered name, not to a personal wallet of someone you have never met. Prefer staged payments tied to delivered work over large advances. Ask for a receipt or invoice with the business name and PAN, and keep all messages and transaction IDs.",
          "Be very cautious when someone changes the account number mid-conversation or asks you to pay a different person. Confirm through a second channel you already trust, such as the phone number printed on the business's official website or a directory profile you found independently. Never share an OTP, PIN or password with anyone.",
        ],
      },
      {
        heading: "Red flags to walk away from",
        paragraphs: [
          "Walk away if the provider refuses a video call or office visit, will not give a written quotation, insists on payment through an unusual method, or threatens that the offer will vanish in minutes. Prices far below comparable providers are rarely a bargain; they are usually bait.",
          "Also be wary of anyone who contacts you first after you posted a need in a public group, and of sites or pages that copy a known brand but use a slightly different spelling. Scammers rely on speed and embarrassment, so give yourself time and ask a friend or family member to look before you pay.",
        ],
      },
      {
        heading: "What to do if you have been scammed",
        paragraphs: [
          "Act quickly. Contact your bank or wallet provider immediately with the transaction ID and ask whether the payment can be held or reversed. Take screenshots of the page, profile, messages and payment before the scammer deletes them. Report the fake page to the platform so others are protected.",
          "File a complaint with the Nepal Police Cyber Bureau or your nearest police office, bringing your evidence and identity documents. For disputes with a genuine business that failed to deliver, the guide on [filing a consumer complaint in Nepal](/blog/consumer-complaint-nepal-how-to-file) explains the complaint routes available.",
        ],
      },
      {
        heading: "How directories help, and where they cannot",
        paragraphs: [
          "A directory with a published review method helps you find providers whose identity and location have some supporting evidence, and it gives you a reference point to compare against a suspicious page. On Nepali Directory, profiles publish only after identity, category and source checks described in the [directory methodology](/directory-methodology).",
          "No directory can guarantee a future transaction. Use a listing to confirm who a business is and how to reach it independently, then apply the same payment discipline every time. If you find a fake page impersonating a listed business, report it so both the owner and other customers can be warned.",
        ],
      },
    ],
    faqs: [
      {
        question: "How can I check if a Nepal business page is fake?",
        answer:
          "Compare the name, address and phone number with an independent directory profile, map listing and official website. Search the number with the word scam, check page age and genuine comments, and ask for a video call or office visit before paying.",
      },
      {
        question: "Where do I report online fraud in Nepal?",
        answer:
          "Contact your bank or wallet provider immediately, then report to the Nepal Police Cyber Bureau or the nearest police office with screenshots, transaction IDs and identity documents.",
      },
      {
        question: "Is it safe to pay an advance for a service in Nepal?",
        answer:
          "A reasonable advance to a verified business with a written quotation can be normal. Pay to an account in the business name, keep receipts, and avoid large advances to people you cannot verify independently.",
      },
    ],
    contextLinks: [
      { href: "/blog/verify-companies-in-nepal-before-hiring", label: "Verify a company in Nepal before hiring" },
      { href: "/blog/consumer-complaint-nepal-how-to-file", label: "File a consumer complaint in Nepal" },
      { href: "/directory-methodology", label: "How Nepali Directory reviews listings" },
    ],
    disclaimer:
      "This guide is general consumer information, not legal advice. For losses or disputes, contact your bank, the police or a qualified lawyer promptly.",
  },
  {
    ...publication,
    title: "How to File a Consumer Complaint in Nepal: Routes, Evidence and Timelines",
    seoTitle: "How to File a Consumer Complaint in Nepal: Step-by-Step",
    slug: "consumer-complaint-nepal-how-to-file",
    href: "/blog/consumer-complaint-nepal-how-to-file",
    category: "Consumer Guides",
    excerpt:
      "Overcharged, sold a defective product or left with unfinished work? The order of steps, the offices that handle complaints and the evidence you need.",
    description:
      "File a consumer complaint in Nepal: resolve it with the business first, gather evidence, then use the consumer protection department, Hello Sarkar or a regulator.",
    image: image("photo-1589829545856-d10d557cf95f"),
    imageAlt: "Bronze statue of Lady Justice holding scales",
    readTime: "9 min read",
    author: "Nepali Directory Editorial Team",
    keywords: [
      "consumer complaint Nepal",
      "consumer rights Nepal",
      "Consumer Protection Act Nepal",
      "Department of Commerce Supplies and Consumer Protection",
      "Hello Sarkar complaint",
      "overcharging complaint Nepal",
      "defective product refund Nepal",
      "file complaint against business Nepal",
    ],
    tags: ["Consumer Rights", "Consumer Safety", "Complaints", "Nepal Law"],
    sections: [
      {
        heading: "Know your basic consumer rights",
        paragraphs: [
          "Nepal's Consumer Protection Act, 2075 sets out consumer rights, including the right to information about goods and services, protection from unfair trade practices and the right to seek compensation for harm. Businesses are expected to display prices, issue bills and avoid misleading claims about quality, quantity or origin.",
          "Knowing these principles helps you frame a complaint calmly and specifically. Instead of saying you were cheated, you can say that the price charged was higher than the displayed price, that the product failed within the promised warranty, or that the service was not delivered as described in the written quotation.",
        ],
      },
      {
        heading: "Step one: raise it with the business in writing",
        paragraphs: [
          "Most disputes are resolved fastest by the business itself. Contact the owner or manager, explain the problem, state what you want, such as a repair, replacement or refund, and give a reasonable deadline. Put the complaint in writing by message or email so there is a dated record.",
          "Stay factual and polite. Attach photos of the defect, the bill and any warranty card. Many businesses care about their reviews and reputation and will prefer to settle a clear, reasonable request rather than face a formal complaint.",
        ],
      },
      {
        heading: "Gather the evidence that decides complaints",
        paragraphs: [
          "Keep the bill or invoice with the business name and PAN, the warranty card, the written quotation or agreement, payment records and transaction IDs, and photographs or video of the defect. Save messages that show what was promised and your attempts to resolve the problem.",
          "Write a short timeline with dates: when you bought or booked, when the problem appeared, when you contacted the business and how they responded. Complaint officers and regulators can act much faster on a clear, documented case than on a general account.",
        ],
      },
      {
        heading: "Where to file if the business does not respond",
        paragraphs: [
          "For market issues such as overcharging, missing price tags, adulterated or expired goods and false weights, you can complain to the Department of Commerce, Supplies and Consumer Protection, which runs market monitoring, or to the local administration office. The government's Hello Sarkar grievance service also accepts complaints and forwards them to the responsible agency.",
          "Sector regulators often handle their own complaints. Banking and wallet issues go first to the institution and then to Nepal Rastra Bank's grievance channel, telecom and internet complaints to the service provider and then the Nepal Telecommunications Authority, and insurance complaints to the Nepal Insurance Authority. Health and education complaints may involve the relevant council or local government.",
        ],
      },
      {
        heading: "Formal claims and compensation",
        paragraphs: [
          "The Consumer Protection Act provides for complaints and compensation claims through designated bodies, and serious cases can proceed to legal action. Time limits can apply, so do not wait months to act. For a large claim or where the business denies responsibility, consult a lawyer about the right forum and deadline.",
          "If the problem involves fraud, such as payment for goods that never existed, report it to the police in addition to a consumer complaint. The guide to [avoiding online scams in Nepal](/blog/avoid-online-scams-hiring-services-nepal) covers the immediate steps after a fraudulent payment.",
        ],
      },
      {
        heading: "Share your experience responsibly",
        paragraphs: [
          "A factual review helps other customers and gives the business a public reason to respond. Describe what happened, the dates and how the business handled it, without insults or personal information. The guide to [writing a helpful business review](/blog/write-helpful-business-review-nepal) explains how to keep a review fair and useful.",
          "If a Nepali Directory profile shows wrong details, or the business has closed, report the exact field and evidence so the listing can be corrected. Accurate public information prevents the next customer from facing the same problem.",
        ],
      },
    ],
    faqs: [
      {
        question: "Where can I file a consumer complaint in Nepal?",
        answer:
          "Start with the business in writing. If unresolved, complain to the Department of Commerce, Supplies and Consumer Protection or the local administration office, use the Hello Sarkar grievance service, or approach the relevant sector regulator.",
      },
      {
        question: "What evidence do I need for a consumer complaint?",
        answer:
          "Keep the bill with PAN, warranty card, written quotation, payment records, photos of the defect, saved messages and a dated timeline of what happened and how the business responded.",
      },
      {
        question: "Which law protects consumers in Nepal?",
        answer:
          "The Consumer Protection Act, 2075 sets out consumer rights, business obligations and complaint and compensation mechanisms. Check the current text and procedures with the responsible authority or a lawyer for your case.",
      },
      {
        question: "Can I get a refund for a defective product in Nepal?",
        answer:
          "Often, yes. Contact the seller in writing with the bill and warranty card and ask for repair, replacement or refund within the warranty terms. If the seller refuses without a valid reason, escalate to the consumer protection authority with your evidence.",
      },
    ],
    contextLinks: [
      { href: "/blog/avoid-online-scams-hiring-services-nepal", label: "Avoid online scams when hiring services" },
      { href: "/blog/write-helpful-business-review-nepal", label: "Write a fair, helpful business review" },
      { href: "/editorial-policy", label: "How Nepali Directory handles corrections" },
    ],
    disclaimer:
      "This guide is general information, not legal advice. Procedures, offices and time limits can change; confirm them with the responsible authority or a qualified lawyer.",
  },
  {
    ...publication,
    title: "How to Write a Helpful Business Review in Nepal",
    seoTitle: "How to Write a Helpful, Fair Business Review in Nepal",
    slug: "write-helpful-business-review-nepal",
    href: "/blog/write-helpful-business-review-nepal",
    category: "Consumer Guides",
    excerpt:
      "What makes a review genuinely useful to the next customer, how to stay fair when things went wrong, and what never belongs in a public review.",
    description:
      "Write a helpful business review in Nepal: describe the service, date, price and outcome, stay fair and factual, protect privacy, and know what reviews are removed.",
    image: image("photo-1434030216411-0b793f4b4173"),
    imageAlt: "Person writing notes by hand at a desk beside a laptop",
    readTime: "7 min read",
    author: "Nepali Directory Editorial Team",
    keywords: [
      "write a business review",
      "how to write a good review",
      "customer review Nepal",
      "fair restaurant review",
      "review guidelines",
      "honest business feedback",
      "fake reviews Nepal",
      "rate local business Nepal",
    ],
    tags: ["Reviews", "Consumer Safety", "Community", "Local Search"],
    categorySlugs: ["restaurants", "hotels"],
    sections: [
      {
        heading: "Why specific reviews matter more than stars",
        paragraphs: [
          "A five-star rating tells the next customer very little on its own. A review that says the dentist explained the treatment options, gave a written estimate and finished the filling on time tells them exactly what to expect. Specific reviews help people choose, help good businesses stand out and give owners useful feedback.",
          "Specific reviews are also what search engines and AI assistants summarize when someone asks which clinic or restaurant to choose. A clear, factual account of your experience can influence many future decisions, which is a good reason to write it carefully.",
        ],
      },
      {
        heading: "What to include",
        paragraphs: [
          "Mention what you bought or booked, roughly when, and at which branch or area. Describe the parts that mattered: waiting time, cleanliness, communication, price compared with what was quoted, and whether the result met the promise. If you paid for a service such as a repair or a hotel stay, the outcome a few days later is especially useful.",
          "Balance helps credibility. If the food was excellent but service was slow, say both. Readers trust reviews that acknowledge strengths and weaknesses more than reviews that are only praise or only anger.",
        ],
      },
      {
        heading: "When things went wrong",
        paragraphs: [
          "If you had a bad experience, first give the business a chance to fix it. Many problems are solved with a message to the owner. If you still write a negative review, describe what happened and how the business responded, and stick to facts you witnessed.",
          "Avoid insults, threats, speculation about motives and claims you cannot support, such as accusing staff of crimes. Those reviews are more likely to be removed and can expose the writer to legal complaints. A calm, factual review is more persuasive and more durable.",
        ],
      },
      {
        heading: "Protect privacy",
        paragraphs: [
          "Do not post staff members' personal phone numbers, home addresses or photographs without consent, and do not include your own sensitive information such as medical details beyond what is necessary. You can describe a clinic visit without revealing your diagnosis.",
          "For healthcare, legal and education reviews, focus on the service experience, communication and cost transparency rather than private details. If you need to report professional misconduct, use the relevant council or regulator rather than a public review.",
        ],
      },
      {
        heading: "What makes a review ineligible",
        paragraphs: [
          "Reviews written by owners, staff, relatives or competitors, reviews exchanged for discounts or gifts, and copied or bulk-posted reviews are manipulation. Reputable platforms remove them, and search engines treat them as spam. If a business offers you a reward for a five-star review, you can decline and mention the offer in your honest review.",
          "Nepali Directory publishes rating data only when it is eligible and visible on the profile, and payment never buys ratings or reviews, as described in the [editorial policy](/editorial-policy). Reviews should describe a genuine experience with the business being reviewed.",
        ],
      },
      {
        heading: "Advice for businesses receiving reviews",
        paragraphs: [
          "Respond to reviews promptly and professionally. Thank people for positive reviews by mentioning something specific, and reply to negative reviews with the facts and what you have done to fix the problem. Future customers read the reply as much as the complaint.",
          "Never argue publicly or reveal a customer's private details in a reply. Invite them to continue the conversation directly. Consistent, honest responses build trust with customers and the AI systems that increasingly summarize reputation.",
        ],
      },
    ],
    faqs: [
      {
        question: "What should a good business review include?",
        answer:
          "Include what you bought or booked, when, which branch, and specifics such as waiting time, communication, price compared with the quote and the final outcome. Mention both strengths and weaknesses.",
      },
      {
        question: "Can a business pay for reviews on Nepali Directory?",
        answer:
          "No. Payment can buy clearly labelled placement only; it never creates reviews, ratings or verified status. Reviews should describe genuine experiences.",
      },
      {
        question: "Can I write a negative review without trouble?",
        answer:
          "Yes, if it is honest and factual. Describe what happened and how the business responded, avoid insults and unsupported accusations, and keep personal information out of the review.",
      },
      {
        question: "How long should a business review be?",
        answer:
          "A few specific sentences are enough: what you bought or booked, when, what went well or badly, and whether you would return. Detail matters more than length, and one clear example is more useful than a long general opinion.",
      },
    ],
    contextLinks: [
      { href: "/editorial-policy", label: "Read the Nepali Directory editorial policy" },
      { href: "/blog/consumer-complaint-nepal-how-to-file", label: "File a consumer complaint in Nepal" },
      { href: "/category/restaurants", label: "Browse restaurants in Nepal" },
    ],
  },
  {
    ...publication,
    title: "Kathmandu Valley Neighbourhoods: Where to Find Which Businesses and Services",
    seoTitle: "Kathmandu Valley Neighbourhood Guide: Where to Find Services",
    slug: "kathmandu-valley-neighbourhoods-find-services-guide",
    href: "/blog/kathmandu-valley-neighbourhoods-find-services-guide",
    category: "City Guide",
    excerpt:
      "New Road for electronics, Putalisadak for consultancies, Thamel for trekking gear: a practical map of which Valley areas are known for which services.",
    description:
      "Find services faster in the Kathmandu Valley: which neighbourhoods are known for electronics, education, hospitals, trekking gear, cafes and wholesale markets.",
    image: image("photo-1605640840605-14ac1855827b"),
    imageAlt: "Aerial view of Boudhanath Stupa surrounded by Kathmandu neighbourhoods",
    readTime: "10 min read",
    author: "Nepali Directory Editorial Team",
    keywords: [
      "Kathmandu neighbourhoods guide",
      "Kathmandu Valley areas",
      "where to shop in Kathmandu",
      "New Road electronics market",
      "Putalisadak consultancies",
      "Thamel shops",
      "Jhamsikhel cafes",
      "Kathmandu local areas services",
    ],
    tags: ["Kathmandu", "Lalitpur", "Bhaktapur", "Local Guide"],
    citySlugs: ["kathmandu", "lalitpur", "bhaktapur"],
    categorySlugs: ["shops", "hospitals", "restaurants"],
    sections: [
      {
        heading: "Why neighbourhood knowledge saves hours",
        paragraphs: [
          "The Kathmandu Valley works as a collection of specialised neighbourhoods. Businesses of the same type tend to cluster, so knowing where a trade concentrates lets you compare several providers on one trip instead of crossing the Valley in traffic. This is still true in an age of search, because walking between five phone repair shops is often faster than calling each one.",
          "The notes below describe areas commonly associated with particular services. They are patterns, not rules: good providers exist everywhere, businesses move, and clusters change as rents and roads change. Use them to plan a search, then confirm specific businesses in the [Kathmandu directory](/city/kathmandu).",
        ],
      },
      {
        heading: "Central Kathmandu: New Road, Ason and Indrachowk",
        paragraphs: [
          "New Road is long associated with electronics, mobile phones, cameras and gold and jewellery shops, and the lanes around it hold many repair counters. Ason and Indrachowk form one of the Valley's oldest bazaars, known for spices, dry goods, household items, fabric and festival supplies, with narrow streets that are easiest on foot.",
          "Nearby Mahaboudha and Bishal Bazaar also hold electronics and clothing sellers. Compare prices across several shops, ask for a bill and warranty on electronics, and check the [mobile and laptop repair guide](/blog/kathmandu-mobile-laptop-repair-guide) before leaving a device for repair.",
        ],
      },
      {
        heading: "Education and offices: Putalisadak, Bagbazar and Baneshwor",
        paragraphs: [
          "Putalisadak and Bagbazar are known for educational consultancies, language institutes, computer training centres, bridge course and entrance preparation classes, and Lok Sewa preparation centres. The density makes it easy to compare several institutes in a day, but also means you should verify each one carefully before paying fees.",
          "New Baneshwor and Old Baneshwor hold many offices, colleges, banks and restaurants serving office workers, and the area around Maitighar and Singha Durbar concentrates government offices. The [study abroad consultancy guide](/blog/nepal-study-abroad-visa-consultancy-guide) explains what to check before choosing an education agent.",
        ],
      },
      {
        heading: "Visitors and trekkers: Thamel, Lazimpat and Boudha",
        paragraphs: [
          "Thamel is the Valley's main tourist district, dense with guesthouses, hotels, travel agencies, trekking gear shops, money changers, bookshops and restaurants. It is convenient for renting or buying trekking equipment and arranging permits through agencies, though prices and quality vary widely between neighbouring shops.",
          "Lazimpat and Maharajgunj hold several embassies, hotels and offices, and Maharajgunj is also home to major hospitals. Boudha, around the great stupa, has a large Tibetan Buddhist community with monasteries, guesthouses, cafes and shops selling ritual and craft items. See the [trekking gear rental guide](/blog/kathmandu-pokhara-trekking-gear-rental-guide) before hiring kit in Thamel.",
        ],
      },
      {
        heading: "Lalitpur: Jhamsikhel, Pulchowk and Patan",
        paragraphs: [
          "Jhamsikhel, Sanepa and Kupondole are known for cafes, international restaurants, NGOs and development organisations, and they suit work meetings. Pulchowk and Lagankhel have hospitals, colleges and busy shopping streets, while Patan Durbar Square and the surrounding lanes are known for metalwork, handicrafts and Newari restaurants.",
          "Because Lalitpur and Kathmandu meet along the Bagmati, businesses near the boundary appear under either city. Check both hubs, and use the [Lalitpur directory](/city/lalitpur) and the [guide to Lalitpur work cafes](/blog/lalitpur-cafes-work-meetings) when planning meetings on that side of the river.",
        ],
      },
      {
        heading: "Bhaktapur, ring road hubs and practical tips",
        paragraphs: [
          "Bhaktapur's old town is known for pottery, woodcarving, traditional Newari food and heritage guesthouses. Along and beyond the Ring Road, junctions such as Kalanki, Koteshwor, Chabahil and Gongabu are transport hubs with bus parks, hardware and building supply shops, furniture showrooms and vehicle workshops.",
          "Plan trips around traffic peaks and festival crowds, and confirm opening days before travelling, because some markets close or slow on specific days and holidays. Save a landmark and Plus Code for each shop you plan to visit, since many Valley addresses rely on landmarks rather than street numbers. Browse the [Bhaktapur directory](/city/bhaktapur) to start a shortlist.",
        ],
      },
    ],
    faqs: [
      {
        question: "Where is the best area in Kathmandu for electronics?",
        answer:
          "New Road and nearby Mahaboudha are long-established areas for mobile phones, electronics, cameras and repair counters. Compare several shops and ask for a bill and warranty.",
      },
      {
        question: "Which Kathmandu area has the most educational consultancies?",
        answer:
          "Putalisadak and Bagbazar are known for educational consultancies, language institutes, bridge courses and entrance and Lok Sewa preparation centres. Verify each institute before paying fees.",
      },
      {
        question: "Where should tourists shop for trekking gear in Kathmandu?",
        answer:
          "Thamel has the highest concentration of trekking gear shops and rental counters. Quality and prices vary, so inspect items carefully and compare a few shops.",
      },
      {
        question: "Where are the Newari restaurants and handicraft shops in the Valley?",
        answer:
          "Patan, Bhaktapur and Kirtipur are known for Newari restaurants, while Patan's lanes are associated with metalwork and Bhaktapur with pottery and woodcarving. Confirm opening days before travelling, especially around festivals.",
      },
    ],
    contextLinks: [
      { href: "/city/kathmandu", label: "Browse businesses in Kathmandu" },
      { href: "/city/lalitpur", label: "Browse businesses in Lalitpur" },
      { href: "/city/bhaktapur", label: "Browse businesses in Bhaktapur" },
      { href: "/blog/search-nepal-businesses-nepali-english-spellings", label: "Search tips for Nepali place names" },
    ],
  },
  {
    ...publication,
    title: "Dashain and Tihar Planning: Tickets, Bookings, Shopping and Service Closures",
    seoTitle: "Dashain and Tihar Planning Guide: Travel, Shopping and Services",
    slug: "dashain-tihar-festival-season-planning-services",
    href: "/blog/dashain-tihar-festival-season-planning-services",
    category: "Travel",
    excerpt:
      "How Nepal's biggest festival season affects bus tickets, flights, hotels, banks, repairs and deliveries, and how to plan so nothing important is left undone.",
    description:
      "Plan for Dashain and Tihar in Nepal: book bus and flight tickets early, finish repairs and banking before holidays, shop safely and know which services close.",
    image: image("photo-1519741497674-611481863552"),
    imageAlt: "Venue decorated with warm lights for a festive gathering",
    readTime: "9 min read",
    author: "Nepali Directory Travel Desk",
    keywords: [
      "Dashain travel tips",
      "Dashain bus ticket booking",
      "Tihar shopping Nepal",
      "Nepal festival season planning",
      "Dashain holidays services closed",
      "Dashain flight booking",
      "festival offers Nepal",
      "Kathmandu during Dashain",
    ],
    tags: ["Dashain", "Tihar", "Festivals", "Travel Planning"],
    citySlugs: ["kathmandu", "pokhara"],
    categorySlugs: ["shops", "hotels"],
    sections: [
      {
        heading: "Why festival season changes everything",
        paragraphs: [
          "Dashain and Tihar, usually falling between late September and November according to the lunar calendar, are the longest and busiest holiday period in Nepal. Millions of people travel from cities to home districts, offices and schools close for extended holidays, and many small businesses shut for days while owners join family celebrations.",
          "For anyone who needs to travel, shop, repair something or get official work done, the season rewards early planning. Check the government's published holiday list for the current year, and assume that anything left until the last working day will be harder, slower or more expensive.",
        ],
      },
      {
        heading: "Book bus and flight tickets early",
        paragraphs: [
          "Long-distance bus seats out of Kathmandu sell out quickly in the days before Ghatasthapana and the main days of Dashain. Book through the operator's counter or a reputable online ticketing platform as soon as sales open, keep the ticket and receipt, and confirm the departure point, because some buses leave from temporary locations during peak days.",
          "Domestic flights also fill and fares rise, especially on routes to Nepalgunj, Biratnagar, Bhairahawa and Pokhara. Buy from the airline or an established agent, and allow time for weather delays. The [domestic flight booking guide](/blog/nepal-domestic-flight-booking-guide) covers baggage rules and what to check before paying.",
        ],
      },
      {
        heading: "Finish repairs, banking and paperwork first",
        paragraphs: [
          "Mechanics, electricians, tailors and repair shops are busiest just before the holidays and often close during them. Service your vehicle, fix leaking pipes and collect tailoring orders at least a week before the main days. Tailors in particular take many festival orders, so agree a firm delivery date in writing.",
          "Banks and government offices close for several days. Withdraw cash in advance, top up wallets, pay bills and finish any document work before the holiday list begins. Keep a small reserve of cash, because ATMs in busy areas can run low when everyone withdraws at once.",
        ],
      },
      {
        heading: "Shop safely during festival offers",
        paragraphs: [
          "Festival discounts on clothing, electronics, vehicles and home appliances are a major part of the season. Compare the final price, including tax, delivery and installation, rather than the percentage off. Ask for a bill with the shop's PAN and keep the warranty card, especially for electronics and appliances.",
          "Online festival deals attract scams, including fake pages copying known brands and demands for advance payment. Buy from shops you can verify, pay to accounts in the business's name and follow the checks in the [online scam avoidance guide](/blog/avoid-online-scams-hiring-services-nepal). Crowded markets such as Ason and New Road are also a good place to watch your phone and wallet.",
        ],
      },
      {
        heading: "Hotels, restaurants and staying in the city",
        paragraphs: [
          "Hotels in Pokhara, Chitwan and other destinations can fill with domestic travellers during the holidays, while Kathmandu itself becomes noticeably quieter. Book accommodation early if travelling, and confirm whether the restaurant and transport services you rely on will operate on the main festival days.",
          "If you are staying in the Valley, the empty roads are a rare chance to visit heritage sites and neighbourhoods without traffic. Many restaurants and shops reopen in stages, so call ahead. The [hotels in Nepal guide](/blog/hotels-in-nepal-destination-trip-type-guide) helps match accommodation to the trip.",
        ],
      },
      {
        heading: "Advice for business owners",
        paragraphs: [
          "Customers repeatedly arrive at closed shops during festival weeks because online hours were never updated. Before the holidays, set special hours on your Google Business Profile, your social pages and your [Nepali Directory profile](/claim-listing), and post a clear notice on the door with reopening dates.",
          "If you offer festival deals, state the full terms: dates, eligible items, whether the price includes tax and delivery, and the returns policy. Clear terms reduce disputes and bad reviews after the season, and consistent special hours help search engines and AI assistants give customers accurate answers.",
        ],
      },
    ],
    faqs: [
      {
        question: "When should I book Dashain bus tickets?",
        answer:
          "As soon as operators open sales for the festival period, which is often a couple of weeks before Ghatasthapana. Seats on popular routes can sell out days before departure.",
      },
      {
        question: "Are shops and banks open during Dashain?",
        answer:
          "Many small shops, offices and banks close for several days around the main festival days. Check the official holiday list, finish banking and repairs early and call businesses before visiting.",
      },
      {
        question: "How can I avoid scams during festival sales?",
        answer:
          "Buy from verifiable shops, compare the final price including tax and delivery, get a bill with PAN and a warranty card, and never pay advances to unverified online sellers.",
      },
      {
        question: "What should businesses update before Dashain and Tihar?",
        answer:
          "Set special holiday hours on Google Business Profile, social pages and directory profiles, post reopening dates on the door, and publish clear terms for festival offers, including tax, delivery and returns.",
      },
    ],
    contextLinks: [
      { href: "/blog/nepal-domestic-flight-booking-guide", label: "Book domestic flights in Nepal" },
      { href: "/category/hotels", label: "Browse hotels in Nepal" },
      { href: "/blog/avoid-online-scams-hiring-services-nepal", label: "Avoid online scams" },
      { href: "/city/pokhara", label: "Find businesses in Pokhara" },
    ],
    disclaimer:
      "Festival dates follow the lunar calendar and official holiday lists change each year. Confirm dates, schedules and operating hours with the relevant authority or business.",
  },
  {
    ...publication,
    title: "Arriving in Kathmandu: A First 48 Hours Checklist for Visitors",
    seoTitle: "Arriving in Kathmandu: First 48 Hours Checklist for Visitors",
    slug: "kathmandu-arrival-first-48-hours-checklist",
    href: "/blog/kathmandu-arrival-first-48-hours-checklist",
    category: "Travel",
    excerpt:
      "SIM card, cash, transport from the airport, where to stay, pharmacies and permits: the essential services to sort out in your first two days in Kathmandu.",
    description:
      "Arriving in Kathmandu? A first 48 hours checklist: airport transport, SIM and data, cash and exchange, where to stay, pharmacies, permits and emergency contacts.",
    image: image("photo-1544735716-392fe2489ffa"),
    imageAlt: "Himalayan peaks rising above a hillside monastery in Nepal",
    readTime: "9 min read",
    author: "Nepali Directory Travel Desk",
    keywords: [
      "arriving in Kathmandu",
      "Kathmandu airport to Thamel",
      "first time in Nepal checklist",
      "Nepal travel essentials",
      "Kathmandu tourist tips",
      "Nepal SIM card at airport",
      "Kathmandu tourist police",
      "things to do after arriving in Nepal",
    ],
    tags: ["Kathmandu", "Travel Planning", "First Visit", "Essential Services"],
    citySlugs: ["kathmandu"],
    categorySlugs: ["hotels", "hospitals"],
    sections: [
      {
        heading: "At the airport: entry, cash and connectivity",
        paragraphs: [
          "Tribhuvan International Airport is small and can be crowded when several international flights land together. Keep your passport, visa documents, return ticket and accommodation address ready, and check the Department of Immigration's current visa rules before you fly, because fees and eligible nationalities can change.",
          "After arrival you will want local cash and a working phone. Airport counters offer currency exchange and SIM cards, but rates are often better in the city, so exchange only what you need for the first day. The [SIM card guide](/blog/nepal-sim-card-mobile-network-guide) and the [money exchange guide](/blog/nepal-money-exchange-remittance-guide) explain documents, data packs and rate checks.",
        ],
      },
      {
        heading: "Getting from the airport to your stay",
        paragraphs: [
          "Options include prepaid airport taxis, hotel pickups arranged in advance and ride-hailing apps that are widely used in the Valley. A hotel pickup is the simplest choice for a late-night arrival. If you take a taxi, agree the fare before departure and have your accommodation's address and a landmark written down.",
          "Traffic between the airport, Thamel, Boudha and Patan can be slow at peak hours. Allow extra time, keep valuables in a zipped bag and avoid placing a phone on the seat beside an open window. If your driver cannot find your guesthouse, calling the property directly usually resolves it quickly.",
        ],
      },
      {
        heading: "Choosing where to stay in the first nights",
        paragraphs: [
          "Thamel is convenient for first-time visitors because agencies, gear shops, money changers and restaurants are close together. Boudha offers a calmer atmosphere around the stupa, while Patan and Jhamsikhel suit visitors who prefer quieter streets and cafes. The [Kathmandu Valley neighbourhood guide](/blog/kathmandu-valley-neighbourhoods-find-services-guide) summarises what each area is known for.",
          "Before paying, confirm the room, hot water, heating or fans, Wi-Fi, backup power and cancellation terms. Photos can be old, so recent reviews that mention the same details are useful. Browse [hotels in Nepal](/category/hotels) to compare options with location details.",
        ],
      },
      {
        heading: "Health, pharmacies and emergencies",
        paragraphs: [
          "Pharmacies are common across Kathmandu and many can advise on minor ailments, but ask for medicines by generic name and check expiry dates. For anything serious, go to an established hospital. Keep your travel insurance policy number and the insurer's emergency line saved on your phone and on paper.",
          "Save the numbers for the police, Tourist Police and ambulance services, plus your embassy and accommodation. The [hospitals and clinics checklist](/blog/kathmandu-hospitals-clinics-checklist) explains what to ask when choosing where to seek care, and the [pharmacy guide](/blog/nepal-pharmacy-medicine-delivery-guide) covers buying medicines safely.",
        ],
      },
      {
        heading: "Permits, treks and onward travel",
        paragraphs: [
          "If you plan to trek, confirm current permit and guide requirements for your region early, because rules for many areas require registered agencies and licensed guides. Agencies in Thamel can arrange permits, but compare several, check their registration and get the itinerary and inclusions in writing.",
          "Onward travel to Pokhara, Chitwan or Lumbini is possible by tourist bus, domestic flight or private vehicle. Book at least a day ahead in busy seasons. The [Pokhara travel agencies guide](/blog/pokhara-travel-agencies-trekking-desks-guide) and [trekking gear rental guide](/blog/kathmandu-pokhara-trekking-gear-rental-guide) help with the next steps.",
        ],
      },
      {
        heading: "Local etiquette that makes the first days easier",
        paragraphs: [
          "Dress modestly at temples and remove shoes where asked, walk clockwise around stupas, and ask before photographing people, especially at cremation sites and religious ceremonies. Carry small notes, because many shops and taxis struggle to change large ones.",
          "Bargaining is normal in markets and for some taxi fares but not in fixed-price shops or restaurants. A friendly greeting of namaste helps everywhere. When in doubt about a service, compare two or three providers in the [Kathmandu directory](/city/kathmandu) before committing.",
        ],
      },
    ],
    faqs: [
      {
        question: "How do I get from Kathmandu airport to Thamel?",
        answer:
          "Use a prepaid airport taxi, a hotel pickup arranged in advance or a ride-hailing app. Agree taxi fares before departure and keep your accommodation address and a landmark handy.",
      },
      {
        question: "Should I buy a SIM card at Kathmandu airport?",
        answer:
          "You can buy one at the airport with your passport for immediate connectivity, though city outlets may offer more choice. Bring a passport photo or copy in case the outlet requests it.",
      },
      {
        question: "What should I do in my first day in Kathmandu?",
        answer:
          "Secure local cash and a SIM, reach your accommodation safely, confirm permits if trekking, save emergency and embassy numbers, and rest before exploring areas such as Thamel, Boudha or Patan.",
      },
      {
        question: "Is Thamel the best place to stay on a first visit to Kathmandu?",
        answer:
          "Thamel is the most convenient for first-time visitors because agencies, gear shops, exchange counters and restaurants are close together. Boudha and Patan suit travellers who prefer a quieter base.",
      },
    ],
    contextLinks: [
      { href: "/city/kathmandu", label: "Browse businesses in Kathmandu" },
      { href: "/blog/nepal-sim-card-mobile-network-guide", label: "Nepal SIM card and mobile data guide" },
      { href: "/blog/nepal-money-exchange-remittance-guide", label: "Money exchange in Nepal" },
      { href: "/blog/nepal-travel-trekking-insurance-guide", label: "Travel and trekking insurance" },
    ],
    disclaimer:
      "Visa, permit and entry requirements change. Confirm current rules with the Department of Immigration, Nepal Tourism Board or your embassy before travelling.",
  },
  {
    ...publication,
    title: "Choosing an Internet Service Provider in Nepal: Fibre Plan Checklist",
    seoTitle: "Best Internet Provider in Nepal? Fibre Plan Comparison Checklist",
    slug: "nepal-internet-service-provider-fibre-comparison",
    href: "/blog/nepal-internet-service-provider-fibre-comparison",
    category: "Telecom",
    excerpt:
      "How to compare fibre internet plans in Nepal on real speed, coverage, installation, router, support and contract terms instead of the headline Mbps.",
    description:
      "Compare internet service providers in Nepal: check fibre coverage, real speeds, installation and router costs, support response and contract terms before you sign.",
    image: image("photo-1621905252507-b35492cc74b4"),
    imageAlt: "Technician in a hard hat beside a building's utility connection box",
    readTime: "9 min read",
    author: "Nepali Directory Services Desk",
    keywords: [
      "internet service provider Nepal",
      "best ISP in Nepal",
      "fibre internet Nepal",
      "home internet Kathmandu",
      "compare internet plans Nepal",
      "FTTH Nepal",
      "internet installation Kathmandu",
      "office internet Nepal",
    ],
    tags: ["Internet", "Telecom", "Home Services", "Comparison"],
    citySlugs: ["kathmandu", "pokhara"],
    categorySlugs: ["it-companies"],
    sections: [
      {
        heading: "Start with coverage at your exact address",
        paragraphs: [
          "Nepal has several fibre internet providers, including Nepal Telecom and private operators such as WorldLink, Vianet, Subisu, ClassicTech and DishHome. Availability, however, is street by street. The best plan on paper is useless if the provider has no fibre in your lane or cannot install within a reasonable time.",
          "Ask neighbours, your landlord or building manager which providers already serve the building. Contact two or three providers with your exact location and a landmark, and ask whether installation is possible, how long it will take and whether poles or cabling work are needed.",
        ],
      },
      {
        heading: "Look past the headline speed",
        paragraphs: [
          "Advertised speeds describe the maximum on the provider's network, not what you will see on every device. Wi-Fi range, router quality, the number of users and evening congestion all affect real performance. For video calls, online classes and gaming, stable latency and upload speed matter as much as download speed.",
          "Ask what speed is guaranteed, whether upload and download are the same, and whether international traffic is treated differently. If possible, run speed tests at a neighbour's home at different times of day. A slightly slower but stable plan is usually better than a fast one that collapses every evening.",
        ],
      },
      {
        heading: "Count the full cost",
        paragraphs: [
          "Compare the total for a year, including installation charges, router or ONT deposit or rental, taxes, and any television or add-on bundle you do not need. Long-term prepaid plans often include discounts or extra months, but they also lock you in if service is poor.",
          "Ask what happens if you move house, whether the connection can be transferred, and whether any deposit is refundable. Get the plan name, price, validity and inclusions in writing or in the provider's official app before paying.",
        ],
      },
      {
        heading: "Support and fault repair matter most",
        paragraphs: [
          "Every provider has outages. What separates them is how quickly problems are fixed. Ask how faults are reported, whether support is available late in the evening and on public holidays, and the usual time for a technician visit. Local reviews from your neighbourhood are more useful than national reputation.",
          "Keep your customer ID and support numbers saved. When reporting a fault, note the ticket number and time, and restart the router before calling. Repeated unresolved faults should be escalated in writing, and unresolved complaints can go to the Nepal Telecommunications Authority after the provider's own process.",
        ],
      },
      {
        heading: "Router placement and home network basics",
        paragraphs: [
          "Many complaints about slow internet are really Wi-Fi problems. Place the router centrally and high, away from thick concrete walls and water tanks, and use a mesh system or access point for multi-storey Nepali homes. Connect a work computer or television by cable where possible.",
          "Change the default Wi-Fi and admin passwords, keep router firmware updated and do not share the password widely. If a technician needs remote access, confirm their identity through the provider's official number. For power cuts, a small UPS for the router and ONT keeps you online.",
        ],
      },
      {
        heading: "Choosing internet for an office or shop",
        paragraphs: [
          "Businesses should ask about business plans with service level commitments, static IP addresses if needed, and faster fault response. A second connection from a different provider, even a mobile data backup, prevents a single outage from stopping card payments, bookings and online work.",
          "If your office needs network cabling, firewalls or managed Wi-Fi, an IT services company can design and support the setup. Browse [IT companies in Nepal](/category/it-companies) and read the [IT project hiring checklist](/blog/it-companies-in-nepal-project-hiring-checklist) before signing a support contract.",
        ],
      },
    ],
    faqs: [
      {
        question: "Which is the best internet service provider in Nepal?",
        answer:
          "It depends on your address. The best provider is the one with fibre in your lane, stable evening performance and fast local fault repair. Compare two or three providers that already serve your building.",
      },
      {
        question: "What should I ask before getting fibre internet?",
        answer:
          "Ask about coverage at your exact address, installation time and charges, router or ONT costs, guaranteed speed, upload speed, contract length, support hours and fault response time.",
      },
      {
        question: "Where can I complain about my internet provider in Nepal?",
        answer:
          "Report the fault to the provider first and keep the ticket number. If it remains unresolved, escalate in writing and then approach the Nepal Telecommunications Authority.",
      },
      {
        question: "Why is my Wi-Fi slow even on a fast fibre plan?",
        answer:
          "Slow Wi-Fi is often caused by router placement, thick walls, too many devices or evening congestion rather than the plan itself. Move the router centrally, use a mesh system for multi-storey homes and cable key devices.",
      },
    ],
    contextLinks: [
      { href: "/blog/nepal-sim-card-mobile-network-guide", label: "Mobile networks and SIM cards in Nepal" },
      { href: "/category/it-companies", label: "Browse IT companies in Nepal" },
      { href: "/blog/kathmandu-coworking-space-guide", label: "Choose a coworking space in Kathmandu" },
    ],
    disclaimer:
      "Plans, prices and coverage change frequently. Confirm current terms directly with the internet provider before paying.",
  },
  {
    ...publication,
    title: "How to Choose a Coworking Space in Kathmandu",
    seoTitle: "Coworking Space in Kathmandu: How to Choose the Right One",
    slug: "kathmandu-coworking-space-guide",
    href: "/blog/kathmandu-coworking-space-guide",
    category: "Business Services",
    excerpt:
      "Internet backup, power, location, meeting rooms, contracts and registered addresses: what freelancers, remote workers and startups should compare.",
    description:
      "Choose a coworking space in Kathmandu: compare internet and power backup, location and commute, meeting rooms, contracts, registered address use and total cost.",
    image: image("photo-1521737711867-e3b97375f902"),
    imageAlt: "People working on laptops around a shared coworking table",
    readTime: "8 min read",
    author: "Nepali Directory Business Desk",
    keywords: [
      "coworking space Kathmandu",
      "coworking Lalitpur",
      "shared office Kathmandu",
      "office space for startups Nepal",
      "remote work Kathmandu",
      "hot desk Kathmandu",
      "virtual office Nepal",
      "meeting room rental Kathmandu",
    ],
    tags: ["Coworking", "Startups", "Remote Work", "Kathmandu"],
    citySlugs: ["kathmandu", "lalitpur"],
    categorySlugs: ["it-companies"],
    sections: [
      {
        heading: "Decide what you actually need",
        paragraphs: [
          "Coworking spaces in the Kathmandu Valley range from a few desks above a cafe to managed offices with private cabins and event halls. Start by listing your real needs: how many days a week you will come, whether you need a fixed desk or any free seat, private calls, meeting rooms, storage, or a team room.",
          "Freelancers and remote workers often need little more than reliable internet, power and a quiet seat. Startups may need private rooms, a mailing address, meeting space for clients and room to grow. Matching the plan to your pattern avoids paying for features you will not use.",
        ],
      },
      {
        heading: "Internet and power are non-negotiable",
        paragraphs: [
          "Ask which internet providers the space uses, whether it has a second connection as backup, and what speed each desk can expect at busy times. Test it yourself during a trial day with a video call and an upload. A space with one connection and no backup will eventually cost you a client call.",
          "Check the power backup: inverter or generator capacity, whether it covers air conditioning or heating, and how long it lasts. Ask about power outlets per desk and whether printing, scanning and locker charges are included or extra.",
        ],
      },
      {
        heading: "Location and commute",
        paragraphs: [
          "Commute time in Valley traffic can outweigh any price difference. Choose a space you can reach reliably at your usual hours, with parking for your bike or car if needed. Areas such as Jhamsikhel, Pulchowk, Baneshwor, Lazimpat and Thamel have several options, each with a different atmosphere and clientele.",
          "Consider what surrounds the space: food options, banks, printers and client offices. If you often meet clients, a central location with easy directions is worth more than a cheaper desk that visitors struggle to find. The [Kathmandu Valley neighbourhood guide](/blog/kathmandu-valley-neighbourhoods-find-services-guide) helps compare areas.",
        ],
      },
      {
        heading: "Meeting rooms, quiet and community",
        paragraphs: [
          "Ask how meeting rooms are booked, how many free hours your plan includes and the hourly rate after that. Check phone booths or quiet areas for calls, noise levels during a busy afternoon and whether events regularly take over the space.",
          "Community can be a real benefit, bringing introductions, collaborators and events. But it matters only if it suits your work. Visit at the time you would normally work, talk to current members and see whether the atmosphere helps or distracts you.",
        ],
      },
      {
        heading: "Contracts, addresses and business registration",
        paragraphs: [
          "Read the membership terms: notice period, deposit, price increases, guest rules, access hours and what happens to your belongings if you leave. Get the total monthly cost including tax and any service charges in writing.",
          "Some spaces offer a registered business address or virtual office. If you plan to register a company or change your registered office, confirm with the relevant authority and your lawyer or accountant whether a coworking address is acceptable and what documents the space will provide. The [business registration guide](/blog/kathmandu-business-registration-lawyer-guide) explains the professional help available.",
        ],
      },
      {
        heading: "Compare three spaces before committing",
        paragraphs: [
          "Shortlist three spaces, book a free or paid trial day at each, and compare the same checklist: internet backup, power, commute, meeting rooms, noise, contract terms and total cost. Most spaces offer daily or weekly passes, which are a low-risk way to test before a monthly commitment.",
          "Remember that a cafe can also serve occasional meetings. The [guide to Lalitpur cafes for work meetings](/blog/lalitpur-cafes-work-meetings) is useful if you only need a desk a few times a month, and the [internet provider checklist](/blog/nepal-internet-service-provider-fibre-comparison) helps if you decide to work from home instead.",
        ],
      },
    ],
    faqs: [
      {
        question: "What should I check before joining a coworking space in Kathmandu?",
        answer:
          "Check backup internet and power, desk availability at busy times, commute and parking, meeting room hours and rates, noise, contract notice period and the total monthly cost including tax.",
      },
      {
        question: "Can I register a company at a coworking space address in Nepal?",
        answer:
          "Some spaces offer registered address services. Confirm with the registration authority and your lawyer or accountant whether it is acceptable and what documents the space provides.",
      },
      {
        question: "Are day passes available at Kathmandu coworking spaces?",
        answer:
          "Many spaces offer daily or weekly passes. A trial day during your normal working hours is the best way to test internet, noise and atmosphere before a monthly plan.",
      },
      {
        question: "How much does a coworking space in Kathmandu cost?",
        answer:
          "Prices vary widely by location, desk type and facilities, from day passes to monthly private cabins. Compare the total monthly cost including tax, meeting room hours and printing, and confirm current rates directly with each space.",
      },
    ],
    contextLinks: [
      { href: "/blog/kathmandu-business-registration-lawyer-guide", label: "Business registration help in Kathmandu" },
      { href: "/blog/lalitpur-cafes-work-meetings", label: "Lalitpur cafes for work meetings" },
      { href: "/city/lalitpur", label: "Browse businesses in Lalitpur" },
    ],
  },
  {
    ...publication,
    title: "Buying a Used Car or Motorbike in Nepal: Bluebook, Transfer and Inspection Checklist",
    seoTitle: "Buying a Used Car or Bike in Nepal: Bluebook and Transfer Guide",
    slug: "buy-used-car-bike-nepal-ownership-transfer",
    href: "/blog/buy-used-car-bike-nepal-ownership-transfer",
    category: "Auto Services",
    excerpt:
      "Check the bluebook, tax status and loan history, inspect the vehicle with a mechanic and complete ownership transfer correctly before handing over the money.",
    description:
      "Buy a used car or motorbike in Nepal safely: check the bluebook, tax and loan status, inspect with a mechanic, complete ownership transfer and insure it properly.",
    image: image("photo-1486006920555-c77dcf18193c"),
    imageAlt: "Car parked inside a garage workshop for inspection",
    readTime: "10 min read",
    author: "Nepali Directory Services Desk",
    keywords: [
      "buy used car Nepal",
      "second hand bike Nepal",
      "bluebook transfer Nepal",
      "vehicle ownership transfer Nepal",
      "naamsari vehicle",
      "used car inspection Kathmandu",
      "vehicle tax Nepal",
      "second hand car checklist",
    ],
    tags: ["Vehicles", "Used Cars", "Motorbikes", "Auto Services"],
    citySlugs: ["kathmandu", "butwal"],
    sections: [
      {
        heading: "Set a budget that includes the hidden costs",
        paragraphs: [
          "The price agreed with the seller is only part of the cost of a used vehicle in Nepal. Add ownership transfer fees, any unpaid annual vehicle tax, insurance, a mechanic's inspection, immediate servicing, tyres or battery if worn, and the cost of your time at the transport office.",
          "Decide the vehicle type from how you will use it: daily city commuting, highway trips, hill roads or business deliveries. Parts availability and service networks matter in Nepal, so popular models are usually cheaper to keep running than rare imports, even if the purchase price is similar.",
        ],
      },
      {
        heading: "Check the bluebook and seller identity",
        paragraphs: [
          "The bluebook, the vehicle registration certificate, is the most important document. Confirm the owner's name matches the seller's citizenship certificate, and that the registration number, chassis number and engine number in the bluebook match the numbers on the vehicle itself. Mismatched numbers are a reason to walk away.",
          "Check the tax renewal record in the bluebook and ask whether any tax or fines are outstanding. If the seller is not the registered owner, insist on meeting the owner or seeing proper legal authority. Be very cautious with deals where the seller is in a hurry or cannot produce original documents.",
        ],
      },
      {
        heading: "Check for loans and legal problems",
        paragraphs: [
          "Many vehicles in Nepal are bought on loan from a bank or finance company, and the lender's interest is recorded until the loan is cleared. Ask the seller for a loan clearance letter if the vehicle was financed, and confirm with the lender if anything is unclear. A vehicle under an active loan cannot be transferred cleanly.",
          "Ask about accident history and any police cases. For extra assurance, the transport management office can confirm the record during the transfer process. Paying before these checks risks losing both the money and the vehicle.",
        ],
      },
      {
        heading: "Inspect with an independent mechanic",
        paragraphs: [
          "Take the vehicle to a mechanic you choose, not one suggested by the seller. Ask them to check the engine, gearbox or clutch, suspension, brakes, steering, tyres, battery, electrical system, rust and signs of accident repair. For motorbikes, check the chain, sprockets, forks and whether the odometer reading is believable.",
          "Test drive in traffic and on a slope, which reveals clutch and brake problems common on Valley roads. A good inspection costs little compared with the repairs it can reveal. The [auto repair service checklist](/blog/butwal-auto-repair-service-checklist) explains how to choose a reliable workshop.",
        ],
      },
      {
        heading: "Complete the ownership transfer correctly",
        paragraphs: [
          "Ownership transfer, commonly called naamsari, is done at the Transport Management Office where the vehicle is registered. Both buyer and seller usually need to attend with the bluebook, citizenship certificates, photographs and any loan clearance, and pay the applicable transfer fee and outstanding tax. Requirements change, so confirm the current list with the office before going.",
          "Do not hand over the full payment until the transfer is complete or both parties have signed the required transfer documents in the office. Get a written sale agreement with the price, date, vehicle numbers and both parties' signatures, and keep copies of every document.",
        ],
      },
      {
        heading: "Insurance, pollution test and first service",
        paragraphs: [
          "Third-party insurance is mandatory in Nepal, and comprehensive cover is worth considering for a car or a newer bike. Transfer or buy insurance in your name immediately, because a policy in the old owner's name may not protect you. The [insurance agent guide](/blog/nepal-insurance-agent-guide) explains what to compare.",
          "Check that the vehicle has a valid pollution test certificate, and book a full service soon after purchase: oil, filters, brake pads and a check of every fluid. Keep receipts in a folder with the bluebook, which also helps when you eventually sell the vehicle yourself.",
        ],
      },
    ],
    faqs: [
      {
        question: "What documents do I need to buy a used vehicle in Nepal?",
        answer:
          "The original bluebook, the seller's citizenship certificate, your citizenship certificate, photographs, a loan clearance letter if the vehicle was financed, and a written sale agreement. Confirm the current list with the Transport Management Office.",
      },
      {
        question: "What is naamsari for a vehicle?",
        answer:
          "Naamsari is the ownership transfer of a vehicle at the Transport Management Office, which updates the bluebook to the new owner's name after fees and outstanding tax are paid.",
      },
      {
        question: "How do I check if a used car has a bank loan?",
        answer:
          "Look for financing records in the bluebook and ask the seller for a loan clearance letter. If unsure, confirm with the lender. An active loan prevents a clean ownership transfer.",
      },
      {
        question: "Should I pay the seller before the ownership transfer?",
        answer:
          "Avoid paying in full until the transfer is complete or both parties have signed the transfer documents at the Transport Management Office. Use a written sale agreement and keep copies of every document and payment record.",
      },
    ],
    contextLinks: [
      { href: "/blog/butwal-auto-repair-service-checklist", label: "Choose an auto repair workshop" },
      { href: "/blog/nepal-insurance-agent-guide", label: "Compare insurance agents in Nepal" },
      { href: "/blog/nepal-car-bike-rental-guide", label: "Car and bike rental in Nepal" },
    ],
    disclaimer:
      "Transfer procedures, fees and tax rules are set by the Department of Transport Management and provincial authorities and can change. Confirm current requirements before buying.",
  },
  {
    ...publication,
    title: "Choosing a Tuition Centre or Home Tutor in Kathmandu",
    seoTitle: "Tuition Centre or Home Tutor in Kathmandu: How to Choose",
    slug: "kathmandu-tuition-center-home-tutor-guide",
    href: "/blog/kathmandu-tuition-center-home-tutor-guide",
    category: "Education",
    excerpt:
      "How parents and students can compare tuition centres, bridge courses, entrance preparation and home tutors on results, teaching, safety and fees.",
    description:
      "Choose a tuition centre or home tutor in Kathmandu: compare teaching quality, class size, SEE and entrance preparation, safety checks, trial classes and fees.",
    image: image("photo-1606326608606-aa0b62935f2b"),
    imageAlt: "Student filling in answers on an exam answer sheet",
    readTime: "9 min read",
    author: "Nepali Directory Education Desk",
    keywords: [
      "tuition centre Kathmandu",
      "home tutor Kathmandu",
      "bridge course Kathmandu",
      "entrance preparation Nepal",
      "SEE tuition classes",
      "Lok Sewa preparation Kathmandu",
      "private tutor Nepal",
      "coaching centre Kathmandu",
    ],
    tags: ["Tuition", "Education", "Kathmandu", "Parents"],
    citySlugs: ["kathmandu", "lalitpur"],
    categorySlugs: ["schools"],
    sections: [
      {
        heading: "Define the goal before choosing",
        paragraphs: [
          "Tuition in Kathmandu covers very different goals: help with school subjects, SEE exam preparation, bridge courses before plus-two, entrance preparation for engineering, medical or nursing programmes, language tests and Lok Sewa preparation for public service exams. A centre that is excellent for one goal may be weak for another.",
          "Write down the specific goal, the subjects, the exam date and how many hours a week the student can realistically study. That brief makes it much easier to compare offers and to judge whether a tutor's promises are realistic.",
        ],
      },
      {
        heading: "Tuition centre, group class or home tutor",
        paragraphs: [
          "Centres in areas such as Putalisadak, Bagbazar and Baneshwor offer structured syllabi, mock tests and peer competition, often at lower cost per hour. Large batches, however, can leave a struggling student behind. Ask the maximum class size and whether doubt-clearing sessions are available.",
          "A home tutor provides individual attention and flexible timing, which suits students with specific gaps or confidence problems. The trade-off is higher cost per hour and more responsibility for the family to check the tutor's quality and safety.",
        ],
      },
      {
        heading: "Judge teaching quality, not advertising",
        paragraphs: [
          "Topper photographs and percentage claims on banners are marketing, and a centre with many students will always have some toppers. Ask instead who will actually teach, their subject background and experience, how progress is tested, and how parents are informed.",
          "A trial class is the best test. Sit in if possible, or ask the student whether the explanation was clear, questions were welcomed and the pace suited them. Speak to current students or parents about consistency, because some centres rely on a star teacher who is not always present.",
        ],
      },
      {
        heading: "Safety checks for home tutors",
        paragraphs: [
          "For a home tutor, especially for younger children, confirm identity, education and references before the first session. Prefer tutors recommended by people you know or placed through an established agency that verifies tutors. Agree lesson times and keep a parent or adult at home during sessions.",
          "Set clear boundaries: lessons in a common area of the house, communication with the student through parents for young children, and no private social media contact. These rules protect both the student and a genuine tutor.",
        ],
      },
      {
        heading: "Fees, schedules and refund terms",
        paragraphs: [
          "Ask for the full fee structure: admission, monthly or course fees, materials, mock tests and any charges for extra classes. Many entrance courses are paid upfront, so ask about refund rules if the student leaves, the course is cancelled or a teacher changes.",
          "Get the schedule, syllabus and fee in writing, and keep receipts. Be careful of guaranteed-result promises, and compare at least two or three providers before paying. The [school comparison guide for Kathmandu](/blog/compare-schools-kathmandu-admissions) uses a similar approach for school admissions.",
        ],
      },
      {
        heading: "Language tests and study abroad preparation",
        paragraphs: [
          "If the goal is IELTS, PTE or another language test, look for official test preparation materials, regular full mock tests under timed conditions and teachers who give written feedback on writing and speaking. The [IELTS and English institute guide](/blog/kathmandu-ielts-english-institute-guide) covers these checks in detail.",
          "Some tuition centres also sell study abroad consultancy services. Keep the two decisions separate: choose the best teaching for the test, and choose a consultancy only after the checks in the [study abroad consultancy guide](/blog/nepal-study-abroad-visa-consultancy-guide). Browse [schools in Nepal](/category/schools) for broader education options.",
        ],
      },
    ],
    faqs: [
      {
        question: "How do I choose a good tuition centre in Kathmandu?",
        answer:
          "Define the goal, then compare who will teach, class size, testing and parent updates, a trial class, the full fee structure and refund terms. Do not rely on topper banners alone.",
      },
      {
        question: "Is a home tutor better than a tuition centre?",
        answer:
          "A home tutor gives individual attention and flexible timing, while a centre offers structure, mock tests and lower cost per hour. Choose based on the student's gaps, confidence and budget.",
      },
      {
        question: "Where are tuition and entrance preparation centres in Kathmandu?",
        answer:
          "Putalisadak, Bagbazar and Baneshwor are known for concentrations of tuition, bridge course, entrance and Lok Sewa preparation centres, though good options exist across the Valley.",
      },
      {
        question: "How can I check a home tutor is safe?",
        answer:
          "Confirm identity, qualifications and references before the first session, prefer recommended tutors or verified agencies, keep lessons in a common area with an adult at home, and route communication with young students through parents.",
      },
    ],
    contextLinks: [
      { href: "/category/schools", label: "Browse schools in Nepal" },
      { href: "/blog/kathmandu-ielts-english-institute-guide", label: "IELTS and English institutes in Kathmandu" },
      { href: "/blog/compare-schools-kathmandu-admissions", label: "Compare schools in Kathmandu" },
    ],
  },
];
