import type { BlogPost } from "./blog";

const image = (id: string, width = "1200", height = "675") =>
  `https://images.unsplash.com/${id}?w=${width}&h=${height}&fit=crop&auto=format`;

const publication = {
  date: "3 Aug 2026",
  publishedAt: "2026-08-03",
  modifiedAt: "2026-08-03",
} as const;

/**
 * Research-backed owner education for one focused topical cluster: local search visibility.
 * These guides use official Google documentation for product-specific claims and avoid promises
 * about rankings. They are intentionally deeper than the automated blog-engine fallback drafts.
 */
export const ownerSeoGuidePosts: BlogPost[] = [
  {
    ...publication,
    title: "Google Business Profile in Nepal: Setup and Verification Guide",
    seoTitle: "Google Business Profile Nepal: Setup and Verification Guide",
    slug: "google-business-profile-nepal-setup-guide",
    href: "/blog/google-business-profile-nepal-setup-guide",
    category: "SEO",
    excerpt:
      "Set up or claim a Google Business Profile with an accurate name, category, location, verification plan, photos and maintenance routine.",
    description:
      "Set up a Google Business Profile in Nepal: check eligibility, avoid duplicates, choose accurate categories, enter a real location or service area and verify ownership.",
    image: image("photo-1556157382-97eda2d62296"),
    imageAlt: "Business owner checking a local company profile on a laptop and phone",
    readTime: "11 min read",
    author: "Nepali Directory SEO Desk",
    keywords: [
      "Google Business Profile Nepal",
      "Google Maps business Nepal",
      "add business to Google Nepal",
      "claim Google business Nepal",
      "Google business verification Nepal",
      "local SEO Nepal",
    ],
    tags: ["Google Business Profile", "Local SEO", "Business Listing", "Nepal Business Owners"],
    sections: [
      {
        heading: "Check eligibility and existing ownership before creating anything",
        paragraphs: [
          "Begin by searching Google Search and Maps for the exact business name, phone number and address. A customer, former employee or data provider may already have created a profile. If the correct business exists, use Google's claim or access process instead of opening another version. A second profile can divide updates, reviews and customer actions while creating uncertainty about which record is official.",
          "A Business Profile is designed for an eligible business that meets customers in person at a location or travels to them in a real service area. An online-only project, lead-generation page, rented mailbox or address where the business has no customer-facing presence should not be presented as a storefront. Read the current eligibility and representation rules before collecting verification material because Google can change the methods available to a particular business.",
        ],
      },
      {
        heading: "Use the real-world business name and the closest primary category",
        paragraphs: [
          "Enter the name used consistently on the storefront, website, invoices and business documents. Do not attach a list of services, neighborhoods or promotional phrases to the name unless those words are genuinely part of the public brand. A clean identity is easier for customers to recognize and easier for staff to maintain across the website, Google profile and directory listings.",
          "Choose one primary category that best describes the main customer-facing activity, then add only honest secondary categories. A dental clinic should not select hospital, pharmacy and medical laboratory merely to appear for more searches. Categories should describe what the business is, while services and the description explain what it offers. Revisit the choice when the core business changes, not whenever a new keyword appears in a report.",
        ],
      },
      {
        heading: "Represent the address or service area precisely",
        paragraphs: [
          "For a location customers can visit during the stated hours, enter a precise physical address and place the map marker at the real entrance. In Nepal, a usable address may combine municipality, ward, road or tole, district and a stable landmark. Keep the formal address consistent, then add access instructions where the product permits them. A landmark helps a visitor; it should not replace the actual location.",
          "If the business travels to customers and does not receive visitors at its address, configure it as a service-area business and hide the private address as required. Select only the places the team can genuinely serve. Do not create a separate profile for every target city, use a virtual office to imply coverage or display a home address as a shop when customers cannot visit it. The website and directory profile should describe the same operating model.",
        ],
      },
      {
        heading: "Prepare for verification without guessing the method",
        paragraphs: [
          "Google decides which verification options a profile receives, so a guide cannot promise video, phone, email or postal verification for every Nepal business. Before starting, make sure the account owner can access the premises or service equipment, the public name is visible where appropriate, the phone and website work, and any documents you may lawfully show connect the business identity to the location. Follow only the instructions shown inside the profile.",
          "Record who controls the primary Google account and add trusted managers through the supported access controls instead of sharing one password. Keep recovery details current. If verification fails, correct the underlying identity or location issue before repeatedly changing the name, category or address. Opening another profile usually makes the record set harder to resolve and can leave customers with conflicting contact details.",
        ],
      },
      {
        heading: "Complete the fields that help relevance and customer decisions",
        paragraphs: [
          "Add a monitored local phone number, canonical website URL, current regular and special hours, services, attributes and a plain-language description. Link to the page that best represents the location or business rather than an unrelated homepage, tracking redirect or social profile. On that page, make the business name, service, location and contact path visible to people instead of hiding the essential information only in structured data.",
          "Google explains local results through relevance, distance and prominence or popularity. Complete, accurate information can improve the chance of matching relevant searches, but neither profile completion nor any single keyword guarantees a position. Distance depends on the searcher's context, and prominence is shaped by broader signals. Treat the profile as a reliable customer record first, then measure how people find and use it.",
        ],
      },
      {
        heading: "Publish truthful photos that answer arrival and service questions",
        paragraphs: [
          "Use recent, well-lit photographs that represent reality without heavy filters or misleading alteration. A practical set includes the exterior from the directions customers approach, the entrance and signage, interior or reception area, team members performing real work with permission, and representative products or services. Restaurants can show actual dishes; service businesses can show equipment and completed work where customer privacy allows.",
          "Name and store the original files, note when they were taken and replace images after a relocation or major renovation. Avoid stock images that imply facilities, staff or results the business does not have. The same evidence can strengthen the business website and a reviewed directory profile, but resize each copy appropriately and write descriptive alternative text for the page rather than stuffing location keywords into every image.",
        ],
      },
      {
        heading: "Connect Google, the website and directory profile to one source of truth",
        paragraphs: [
          "Create a small internal record containing the approved business name, primary category, address or service-area statement, main phone, website, hours and owner. Use it whenever a team member updates Google, Nepali Directory, social accounts or the business website. Consistency does not mean forcing every platform into identical formatting; it means the underlying identity and customer facts agree.",
          "Claim the relevant directory profile and provide evidence for material corrections. Link the profile to the canonical website and keep the directory category specific. If the business moves, changes phone number or closes, update the owned website and high-visibility profiles together. A customer who reaches an old number or travels to a former address experiences a real failure even when the outdated listing once ranked well.",
        ],
      },
      {
        heading: "Follow a 30-day launch and maintenance routine",
        paragraphs: [
          "During the first week, confirm ownership, core identity, category, location, phone, website and hours. In the second week, add real photos and complete services and access details. In the third week, test the profile as a customer: call the number, open directions, visit the landing page and check the mobile presentation. In the fourth week, record baseline profile and website performance without changing several fields at once.",
          "After launch, review customer-facing fields monthly and special hours before holidays or closures. Respond to genuine feedback according to platform policy, document significant edits and compare longer-term trends instead of one day's position. If visibility remains weak, examine query relevance, website content, location, competition and real-world prominence. Do not rename the business or create duplicate locations as a shortcut to a ranking promise.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is a Google Business Profile free for a Nepal business?",
        answer:
          "Google offers Business Profiles without a listing fee. The business must still meet the current eligibility rules and complete whichever verification process Google provides.",
      },
      {
        question: "Should I create a new profile if my business already appears on Maps?",
        answer:
          "Usually no. Search for the existing record and use the claim or access process. Creating a duplicate can split customer information and make ownership harder to resolve.",
      },
      {
        question: "Can I add service keywords to the business name to rank higher?",
        answer:
          "Use the real-world business name. Put genuine services in the category, services and description fields instead of altering the name for search terms.",
      },
      {
        question: "How long does verification take in Nepal?",
        answer:
          "There is no universal time or method. Follow the options shown in the profile, submit accurate evidence and allow for Google's review process without creating duplicate profiles.",
      },
    ],
    contextLinks: [
      { href: "/claim-listing", label: "Add or claim a Nepali Directory business profile" },
      {
        href: "/blog/nepal-business-listing-accuracy-owner-checklist",
        label: "Use the Nepal business listing accuracy checklist",
      },
      {
        href: "/blog/nepal-local-seo-checklist-small-businesses",
        label: "Open the Nepal local SEO checklist",
      },
      { href: "/directory-methodology", label: "Read the directory publication method" },
    ],
    sources: [
      {
        label: "Google Business Profile: add or claim a Business Profile",
        url: "https://support.google.com/business/answer/2911778?hl=en",
      },
      {
        label: "Google: guidelines for representing your business",
        url: "https://support.google.com/business/answer/3038177?hl=en",
      },
      {
        label: "Google: tips to improve local ranking",
        url: "https://support.google.com/business/answer/7091?hl=en",
      },
      {
        label: "Google: manage Business Profile photos and videos",
        url: "https://support.google.com/business/answer/6103862?hl=en",
      },
    ],
    disclaimer:
      "Google controls Business Profile eligibility, verification and local results. Product options and policies can change, and no setup step guarantees a particular ranking.",
  },
  {
    ...publication,
    title: "Nepal Local Citation Audit: Fix Business Listings Without Duplicates",
    seoTitle: "Nepal Local Citation Audit: Fix Business Listing Details",
    slug: "nepal-local-citation-business-listing-audit",
    href: "/blog/nepal-local-citation-business-listing-audit",
    category: "SEO",
    excerpt:
      "Build one approved business record, find inconsistent listings, prioritize corrections and maintain an evidence log without mass-producing profiles.",
    description:
      "Run a Nepal local citation and business listing audit: find duplicates, correct names, addresses, phone numbers, categories, hours and URLs, and track each update.",
    image: image("photo-1450101499163-c8848c66ca85"),
    imageAlt: "Printed business records beside a laptop during a listing accuracy audit",
    readTime: "10 min read",
    author: "Nepali Directory SEO Desk",
    keywords: [
      "local citations Nepal",
      "business listing audit Nepal",
      "NAP consistency Nepal",
      "Nepal business directory listing",
      "fix Google business details",
      "duplicate business listings",
    ],
    tags: ["Local Citations", "Business Listing", "Data Accuracy", "Local SEO"],
    sections: [
      {
        heading: "Create one approved business record before auditing websites",
        paragraphs: [
          "Write a canonical record for the real business: public trading name, legal name where relevant, primary category, physical address or service-area statement, main phone, canonical website, public email, regular hours and owner contact. Add branch identifiers only for genuine locations. Get the responsible owner or manager to approve the record before asking staff or agencies to change listings.",
          "Keep the source for each fact. An invoice, official website, current sign, owner confirmation or registration document can support different fields, but sensitive documents should not be published merely to complete an audit. Record the date checked and who approved it. This source sheet prevents one person from copying an old directory record into another and multiplying the original mistake.",
        ],
      },
      {
        heading: "Find existing citations with repeatable searches",
        paragraphs: [
          "Search the exact business name, important former names, phone numbers in local and international formats, address fragments and website domain. Combine two identifiers, such as the name and phone or domain and city, to surface profiles that a broad brand search misses. Check Search, Maps, major Nepal directories, relevant industry associations, social profiles and the business's own website.",
          "Enter every result in a worksheet with the page URL, platform, login owner, displayed name, phone, address, category, website, status and date checked. Label each record as accurate, incorrect, duplicate, former location, unauthorized or unresolved. A finite inventory is more useful than a purchased promise to submit the business to hundreds of unknown sites.",
        ],
      },
      {
        heading: "Prioritize corrections by customer and identity impact",
        paragraphs: [
          "Fix properties the business controls first: the official website, Google Business Profile and claimed directory pages. Then address profiles that appear for the brand name, send meaningful referral traffic or serve the relevant city and category. Name, location, phone and website errors deserve priority because they can misdirect a customer or obscure which record represents the business.",
          "A punctuation or abbreviation difference is not automatically a problem. Kathmandu and KMC, Road and Rd, or a phone with and without the +977 country code may represent the same underlying fact. Correct contradictions, dead numbers, former domains, wrong map pins and invented locations before spending time forcing every site into character-for-character formatting.",
        ],
      },
      {
        heading: "Separate branches, departments and service areas honestly",
        paragraphs: [
          "A real customer-facing branch can have its own address, local phone, hours and landing page. Give it a stable branch label in the audit so updates do not leak into another location. A department should be listed separately only when the platform permits it and the department functions as a distinct customer destination. Do not turn desks, mailboxes or occasional meeting spaces into branches.",
          "For a business that travels to customers, describe the genuine service area and keep the private address handled according to each platform's rules. One profile can often represent several served places. Creating a page for every city without staff or an eligible location produces duplicates, fragments maintenance and can send users to an address where no service is available.",
        ],
      },
      {
        heading: "Request corrections with evidence and preserve the trail",
        paragraphs: [
          "Use the platform's claim, edit, merge or removal process and submit only the evidence needed for the field in dispute. Take a before screenshot, save the request date and reference number, and note the account used. Do not expose private owner documents in a public comment or send credentials to an unverified person offering to fix the listing.",
          "After a correction is accepted, open the public page in a signed-out browser and test the phone, website and directions. Some platforms update fields at different times or restore data from another source. Schedule one follow-up rather than sending conflicting edits from multiple accounts. Escalate through the platform's documented support route when the wrong record creates a material customer or safety problem.",
        ],
      },
      {
        heading: "Handle duplicates and former locations without losing useful history",
        paragraphs: [
          "First determine whether two results are truly the same business. Similar names can belong to unrelated companies, and a branch is not necessarily a duplicate. Compare phone, domain, address, owner and operating history. If both records describe one current location, use the platform's supported merge or duplicate workflow rather than changing one into a different business.",
          "For a move, update the official channels and mark or close the former location according to platform rules. Do not rewrite an old profile to represent a new, unrelated company just to inherit visibility or reviews. Keep a redirect from an owned old location page when appropriate, update important citations and retain the move date in the audit log so future staff understand why two addresses appear in historical searches.",
        ],
      },
      {
        heading: "Use categories and descriptions to clarify, not repeat keywords",
        paragraphs: [
          "Assign the most specific honest primary category and a small set of genuine secondary categories. Categories should follow the services customers can actually obtain. The description can state the audience, service area, important services, access information and a differentiator that can be checked. Avoid claims such as number one, guaranteed or officially verified unless the evidence and meaning are clear.",
          "Do not paste the same block of city names and service phrases into every directory. Write a concise source description and adapt it to the fields available while preserving facts. Search systems can understand related language, and customers benefit from specifics such as appointment requirements, delivery limits, accessibility, payment options or the next step for a quotation.",
        ],
      },
      {
        heading: "Measure the audit as an accuracy program, not a ranking trick",
        paragraphs: [
          "Track the percentage of priority profiles reviewed, material errors corrected, duplicates resolved, owner access recovered and links tested. Record calls or referral visits where the platform reports them, but do not assign every change in rankings to a citation edit. Local results also depend on relevance, distance and prominence, and competitors and search presentation change over time.",
          "Review the canonical record quarterly and immediately after a move, rebrand, phone change, closure or major service change. Set one named owner for updates and remove access for former agencies or employees. A small set of accurate, maintained profiles is safer and more useful than a large footprint that no one can log into when the next change occurs.",
        ],
      },
    ],
    faqs: [
      {
        question: "What is a local citation for a Nepal business?",
        answer:
          "It is a public mention or profile containing business identity information such as the name, location, phone number or website. The practical goal is accurate customer information, not maximum submission volume.",
      },
      {
        question: "Does every address abbreviation need to match exactly?",
        answer:
          "No. Focus on whether the underlying business, location and contact facts agree. Correct contradictions and unusable information before harmless formatting differences.",
      },
      {
        question: "Should one service business create a listing for every Nepal city it covers?",
        answer:
          "Not unless each profile represents a genuine, eligible location under that platform's rules. Use an accurate service area instead of inventing branches for search visibility.",
      },
      {
        question: "Will correcting citations guarantee a top Google ranking?",
        answer:
          "No. Accurate profiles help customers and can support relevance, but Google describes local results through relevance, distance and prominence. No citation count guarantees a position.",
      },
    ],
    contextLinks: [
      { href: "/claim-listing", label: "Claim or correct a Nepali Directory profile" },
      {
        href: "/blog/nepal-business-listing-accuracy-owner-checklist",
        label: "Review the complete listing accuracy checklist",
      },
      {
        href: "/blog/google-business-profile-nepal-setup-guide",
        label: "Set up a Google Business Profile cleanly",
      },
      { href: "/categories", label: "Browse Nepal business categories" },
    ],
    sources: [
      {
        label: "Google: guidelines for representing your business",
        url: "https://support.google.com/business/answer/3038177?hl=en",
      },
      {
        label: "Google: tips to improve local ranking",
        url: "https://support.google.com/business/answer/7091?hl=en",
      },
      {
        label: "Google Search Essentials",
        url: "https://developers.google.com/search/docs/essentials",
      },
    ],
    disclaimer:
      "Directory and map-platform correction processes vary. Accurate citations do not guarantee ranking, and owners should follow each platform's current eligibility, privacy and evidence rules.",
  },
  {
    ...publication,
    title: "Google Search Console for Nepal Small Businesses: A 90-Day Plan",
    seoTitle: "Google Search Console for Nepal Small Businesses",
    slug: "google-search-console-nepal-small-business-guide",
    href: "/blog/google-search-console-nepal-small-business-guide",
    category: "SEO",
    excerpt:
      "Verify ownership, submit the correct sitemap, inspect important pages and turn query and page data into a measured 90-day SEO plan.",
    description:
      "Use Google Search Console for a Nepal small business: verify the website, submit a sitemap, inspect key URLs, track branded and local queries and measure 90-day changes.",
    image: image("photo-1460925895917-afdab827c52f"),
    imageAlt: "Search performance charts displayed on a laptop used by a small business owner",
    readTime: "12 min read",
    author: "Nepali Directory SEO Desk",
    keywords: [
      "Google Search Console Nepal",
      "small business SEO Nepal",
      "submit sitemap Google",
      "track Google ranking Nepal",
      "Google indexing Nepal website",
      "local search performance",
    ],
    tags: ["Google Search Console", "SEO Measurement", "Indexing", "Local SEO"],
    sections: [
      {
        heading: "Verify the property the business will keep controlling",
        paragraphs: [
          "Use an account owned by the business, then add and verify the website in Search Console through a method the team can maintain. Keep the verification record, recovery contact and list of authorized users in the website operations file. An agency can be granted appropriate access, but the business should not lose its only view of search data when a contract ends.",
          "Confirm that the property covers the canonical version of the live website. Protocols, subdomains and old domains can create separate views depending on the property type. If the business recently migrated, retain access to the old property while redirects and indexing settle. Search Console reports on a verified property; it does not change the public business name or create a Google Business Profile.",
        ],
      },
      {
        heading: "Submit the sitemap index and test whether Google can fetch it",
        paragraphs: [
          "Open the sitemap URL in a signed-out browser and confirm it returns XML without a login, error or redirect loop. Submit the site's canonical sitemap or sitemap index in the Sitemaps report. For Nepali Directory, the public index is /sitemap.xml and it should contain only canonical pages that are eligible for indexing, not internal search combinations or preview profiles.",
          "A successful sitemap submission tells Google where important URLs can be found; it does not guarantee that every URL will be crawled, indexed or ranked. Recheck the report after deployment for fetch errors and investigate the affected child sitemap. Do not resubmit repeatedly as a substitute for fixing a noindex tag, server error, weak page or inconsistent canonical.",
        ],
      },
      {
        heading: "Inspect the homepage and a small set of representative pages",
        paragraphs: [
          "Use URL Inspection for the homepage, one core category, one strong city page, one eligible business profile and one new guide. Compare Google's indexed information with a live test. Check fetch status, declared and selected canonical, indexing permission and the last crawl. A directory should also inspect a deliberately excluded preview page to confirm the noindex policy behaves as designed.",
          "Request indexing after publishing or materially fixing a small number of important URLs, not every filtered or paginated variant. Google still decides when and whether to index a page. If the live test works but the indexed result is old, note the last crawl date and give the system time. If it cannot fetch the live page, solve the access, server, robots or rendering problem before requesting again.",
        ],
      },
      {
        heading: "Build separate branded, generic and local query views",
        paragraphs: [
          "In the Performance report, create a branded view for variations such as Nepali Directory, NepaliDirectory and the domain name. Create a generic directory view for phrases such as Nepal business directory and Nepali directory, then separate commercial discovery queries by city and category. Save the exact filter rules and date range so the next comparison uses the same definition.",
          "Branded and generic intent answer different questions. Weak branded visibility can indicate that Google has not yet connected the entity, domain and mentions strongly enough. Generic directory visibility reflects competition, topical relevance, inventory and authority. A restaurant-in-Pokhara article should be evaluated against its own page and query cluster rather than used to explain the homepage's brand ranking.",
        ],
      },
      {
        heading: "Read clicks, impressions, CTR and position together",
        paragraphs: [
          "An impression means a result was shown under Google's reporting rules; a click records a visit from that result; click-through rate is clicks divided by impressions. Average position represents the topmost position for the property across recorded impressions and can combine devices, locations, dates and result types. It is not a fixed daily rank that every person in Kathmandu will see.",
          "Google recommends paying close attention to trends in impressions and clicks rather than treating average position alone as the outcome. Rising impressions with stable clicks may mean the site appears for broader or lower-position queries. A page with modest volume and strong qualified enquiries can be more valuable than a high-impression article with no relationship to the directory product.",
        ],
      },
      {
        heading: "Diagnose pages before rewriting them",
        paragraphs: [
          "Filter the report by page, then inspect the queries producing impressions. If the page serves the intended topic but receives few clicks, compare the title and description with the visible search results and make the value clearer without adding unsupported superlatives. If the queries reveal a different intent, decide whether the page should be reframed, consolidated or supported by a separate genuinely useful resource.",
          "Check the Page indexing report and URL Inspection before assuming content is the problem. A canonical mismatch, noindex directive, server error or orphaned page can prevent the expected URL from appearing. Conversely, a technically indexable page can remain unselected when it duplicates another page or offers little unique value. Technical eligibility is necessary but not a promise of ranking.",
        ],
      },
      {
        heading: "Run one controlled 90-day improvement cycle",
        paragraphs: [
          "During days 1 to 14, export a baseline for branded queries, directory terms, priority categories and cities. Record indexed status for the representative URLs and log major site releases. During days 15 to 45, make a small set of related improvements: strengthen one topical cluster, add reviewed inventory, improve internal links and correct titles where the query data shows a genuine mismatch.",
          "During days 46 to 90, avoid resetting the test with constant broad edits. Compare equivalent periods and annotate unusual events, outages or major search changes. Review page and query results, not only the sitewide total. Keep improvements that help users and produce durable discovery; reverse changes that create misleading titles, duplicate pages or irrelevant impressions.",
        ],
      },
      {
        heading: "Know what Search Console cannot do",
        paragraphs: [
          "Search Console cannot purchase a ranking, force Google to index a page, reveal a competitor's private query data or guarantee that a requested crawl will happen immediately. It also does not replace analytics for on-site behavior, call tracking for leads, Business Profile performance for Maps actions or an inventory quality audit for a directory.",
          "Use it as the first-party record of how the verified site appears in Google Search. Combine those observations with server monitoring, conversion data, listing publication checks and customer feedback. For a young directory, the most important measurement is whether qualified pages and real profiles gain relevant impressions and useful visits over time, not whether hundreds of new URLs were submitted in one week.",
        ],
      },
    ],
    faqs: [
      {
        question: "Does submitting a sitemap guarantee Google indexing?",
        answer:
          "No. A sitemap helps Google discover URLs, but Google still decides which pages to crawl and index based on technical access, canonicalization and page quality.",
      },
      {
        question: "Why is Search Console position different from my manual search?",
        answer:
          "The report shows an average across recorded impressions and contexts. Location, device, date, personalization and result type can make an individual search look different.",
      },
      {
        question: "How often should a Nepal small business check Search Console?",
        answer:
          "A monthly review is enough for many small sites, with additional checks after a major release, migration, alert or unexpected traffic change.",
      },
      {
        question: "Should I request indexing for every new directory filter page?",
        answer:
          "No. Request indexing only for a small number of important, canonical and genuinely indexable pages. Internal search and thin filter combinations should not be treated as landing pages.",
      },
    ],
    contextLinks: [
      { href: "/sitemap.xml", label: "Open the Nepali Directory XML sitemap index" },
      {
        href: "/blog/google-business-profile-nepal-setup-guide",
        label: "Set up a Google Business Profile for local discovery",
      },
      {
        href: "/blog/nepal-local-seo-checklist-small-businesses",
        label: "Use the Nepal local SEO checklist",
      },
      { href: "/", label: "Review the Nepali Directory homepage" },
    ],
    sources: [
      {
        label: "Google: getting started with Search Console",
        url: "https://support.google.com/webmasters/answer/10267942?hl=en",
      },
      {
        label: "Google Search Console Sitemaps report",
        url: "https://support.google.com/webmasters/answer/7451001?hl=en",
      },
      {
        label: "Google Search Console URL Inspection tool",
        url: "https://support.google.com/webmasters/answer/9012289?hl=en",
      },
      {
        label: "Google Search Console Performance report",
        url: "https://support.google.com/webmasters/answer/7576553?hl=en",
      },
      {
        label: "Google: impressions, position and clicks",
        url: "https://support.google.com/webmasters/answer/7042828?hl=en",
      },
    ],
    disclaimer:
      "Search Console reports sampled and aggregated search performance under Google's definitions. It does not guarantee crawling, indexing or ranking, and individual searches can differ from reported averages.",
  },
  {
    ...publication,
    title: "Business Profile Descriptions and Photos: A Nepal Owner Playbook",
    seoTitle: "Business Profile Description and Photo Guide for Nepal",
    slug: "nepal-business-profile-description-photo-guide",
    href: "/blog/nepal-business-profile-description-photo-guide",
    category: "SEO",
    excerpt:
      "Turn verified business facts into a clear description and a truthful photo set that helps customers understand services, access and next steps.",
    description:
      "Write a useful Nepal business profile description and plan truthful listing photos with templates, evidence checks, alt-text guidance and an update schedule.",
    image: image("photo-1522202176988-66273c2fd55f"),
    imageAlt: "Small business team preparing profile copy and photographs together",
    readTime: "10 min read",
    author: "Nepali Directory SEO Desk",
    keywords: [
      "business description Nepal",
      "Google Business Profile description",
      "business listing photos Nepal",
      "Nepal directory profile",
      "local business description example",
      "business photo checklist",
    ],
    tags: ["Business Description", "Business Photos", "Profile Quality", "Local SEO"],
    sections: [
      {
        heading: "Collect facts before writing promotional copy",
        paragraphs: [
          "Interview the owner or responsible manager and record the public business name, main category, real services, customer types, location or service area, years or dates that can be supported, languages, access details and preferred contact action. Check the current website, storefront, menu or service documents. Mark any claim that still needs evidence instead of turning it into confident copy.",
          "Separate durable facts from fast-changing information. The business purpose, core services and operating model may belong in the main description. Temporary offers, seasonal prices, stock, staff schedules and holiday hours need fields or updates that can be changed quickly. A profile becomes unreliable when a permanent paragraph contains last year's discount or a service the business no longer provides.",
        ],
      },
      {
        heading: "Use a four-part description built for customer decisions",
        paragraphs: [
          "Start with one sentence that identifies the business, primary category and genuine place or service area. Follow with the most important products or services, then a verifiable point of difference such as appointment model, specialization, accessibility or operating history. Finish with the practical next step: visit, call, request a quotation, book or confirm availability.",
          "A working draft might read: '[Business name] is a [specific category] serving [real area]. We provide [three core services] for [customer type or use case]. Customers can [verifiable access or process detail]. Contact the team to [next action].' Replace every bracket with evidence. The template creates clarity; it is not permission to add a city where the business has no presence.",
        ],
      },
      {
        heading: "Keep names, categories and descriptions in their proper fields",
        paragraphs: [
          "The name field should hold the real-world name, not a compressed advertisement. Put the primary business type in the category field and specific offerings in services where available. Use the description for readable context. Repeating the category, city and 'best' in every sentence makes the profile harder to trust and does not create a guarantee of relevance or ranking.",
          "Avoid phone numbers, URLs, offers or prohibited content where a platform's description policy disallows them. Google provides a dedicated description feature and product-specific rules, while other directories may permit different fields. Maintain one source draft, then adapt it to the destination without changing the underlying facts or sneaking restricted claims into another field.",
        ],
      },
      {
        heading: "Replace unsupported superlatives with useful evidence",
        paragraphs: [
          "Statements such as Nepal's number one, cheapest, most trusted, official or guaranteed require a clear basis and can mislead when no reliable comparison exists. Replace them with decision information a customer can check: the type of work, service boundary, booking process, equipment, published credential, accessibility, warranty terms or response channel.",
          "If an award, certification, licence or association matters, record the exact name, holder, issuer, scope and current status before mentioning it. A qualification held by one employee should not be presented as if every team member holds it. For healthcare, legal, financial and safety-related services, link customers to the responsible authority where verification is appropriate and avoid outcome promises.",
        ],
      },
      {
        heading: "Plan a photo set around recognition, proof and access",
        paragraphs: [
          "Create a shot list before taking photographs. For a storefront, capture the exterior from common approaches, entrance and sign, reception or interior, representative products and the team at work with permission. A service-area business can show branded equipment, staff performing genuine tasks, work stages and completed results where privacy and client agreements allow. A restaurant can show actual dishes, menu context, seating and the entrance.",
          "Google's guidance emphasizes focused, well-lit images that represent reality and suggests multiple exterior, interior, product or at-work views depending on the business. Use that as a practical baseline rather than uploading dozens of nearly identical files. Do not use excessive filters, misleading composites or stock photos that imply a premises, employee, product or outcome the customer will not encounter.",
        ],
      },
      {
        heading: "Write captions and alternative text for the page they appear on",
        paragraphs: [
          "A caption can explain what the customer is seeing and why it matters: the wheelchair-accessible entrance, private consultation room, group dining area or equipment used for a particular service. Alternative text should describe the image's meaningful content for someone who cannot see it. If the nearby heading already supplies context, the alt text can stay concise.",
          "Do not turn every filename, caption and alt attribute into the same list of Nepal cities and services. Use natural, specific descriptions and leave decorative images with the treatment required by the website's accessibility implementation. The goal is a usable page whose visible words and images agree, not a hidden block of variations created for crawlers.",
        ],
      },
      {
        heading: "Reuse evidence carefully across Google, directories and the website",
        paragraphs: [
          "Keep approved copy, original images, usage permission, source notes and dates in one content folder. Publish the clearest description on the business website, adapt it for Google and the directory's available fields, and link each profile to the canonical page. Use the same core identity while giving each page enough context for its own audience and function.",
          "On Nepali Directory, an owner submission is reviewed before a profile becomes eligible for public indexation and business structured data. Supply real contact and location information, choose the closest category, and upload current images that belong to the business. A complete submission can be evaluated; placeholder contacts, unsupported ratings and copied descriptions cannot become trustworthy merely because they fill every field.",
        ],
      },
      {
        heading: "Review the profile when reality changes",
        paragraphs: [
          "Set a quarterly review for the description, services and photo set, plus an immediate update after a move, rebrand, major renovation, ownership change or discontinued core service. Test the phone, directions, website and booking path as a customer. Remove images that show former premises, expired branding or products that are no longer representative.",
          "Keep a short change log with the date, editor, fields changed and evidence. This makes future reviews faster and helps resolve disagreements between the website and external profiles. Freshness means reflecting a real change, not altering the date or swapping adjectives to make an old page appear new. Useful profiles stay current because the business maintains them, not because they promise constant novelty.",
        ],
      },
    ],
    faqs: [
      {
        question: "Should a business description repeat the city and category many times?",
        answer:
          "No. State the category and genuine location clearly, then use the space for services, customer fit, access and the next step. Repetition is less useful than specific facts.",
      },
      {
        question: "Can I use stock photos on a local business profile?",
        answer:
          "Use current photographs of the real business whenever the image is meant to show premises, staff, products or work. Stock imagery should never imply evidence that does not exist.",
      },
      {
        question: "What photos should a service-area business take?",
        answer:
          "Show real staff, equipment, work stages and representative completed work where permission and privacy allow. Do not invent a storefront for a business that visits customers.",
      },
      {
        question: "How often should business profile copy and photos be updated?",
        answer:
          "Review them at least quarterly and immediately after material changes such as a move, rebrand, new core service or renovation. Update because reality changed, not merely to alter the date.",
      },
    ],
    contextLinks: [
      { href: "/claim-listing", label: "Submit or claim a Nepali Directory profile" },
      {
        href: "/blog/nepal-business-listing-accuracy-owner-checklist",
        label: "Check every business listing field",
      },
      {
        href: "/blog/google-business-profile-nepal-setup-guide",
        label: "Follow the Google Business Profile setup guide",
      },
      { href: "/editorial-policy", label: "Read the Nepali Directory editorial policy" },
    ],
    sources: [
      {
        label: "Google: manage your Business Profile description",
        url: "https://support.google.com/business/answer/13682007?hl=en",
      },
      {
        label: "Google: manage Business Profile photos and videos",
        url: "https://support.google.com/business/answer/6103862?hl=en",
      },
      {
        label: "Google: business-specific photo tips",
        url: "https://support.google.com/business/answer/6123536?hl=en",
      },
      {
        label: "Google: guidelines for representing your business",
        url: "https://support.google.com/business/answer/3038177?hl=en",
      },
      {
        label: "Google Search Central: helpful, reliable, people-first content",
        url: "https://developers.google.com/search/docs/fundamentals/creating-helpful-content",
      },
    ],
    disclaimer:
      "Business information, platform fields and content policies change. Use current, permissioned evidence and follow each destination's rules; descriptions and photos do not guarantee ranking.",
  },
];
