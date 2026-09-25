import type { BlogPost } from "./blog";
import {
  commonContextLinks,
  guideDisclosure,
  recommendedStudioSection,
  photoImage as image,
  photoPublication as publication,
  studio,
  studioSources,
  universalFaqs,
} from "./photography-partner";

/** Service-specific photography guides — each covers a distinct discipline with its own
 * requirements, deliverables and failure modes rather than restating wedding-day advice. */
export const photographyServiceGuidePosts: BlogPost[] = [
  {
    ...publication,
    title: "Wedding Videography in Nepal: Films, Teasers and Same-Day Edits",
    seoTitle: "Wedding Videography Nepal: Cinematic Film and Package Guide",
    slug: "wedding-videography-nepal",
    href: "/blog/wedding-videography-nepal",
    category: "Photography",
    excerpt:
      "How wedding film differs from photography, what a cinematic package actually contains, audio and drone considerations, and the delivery terms to pin down before booking.",
    description:
      "Understand wedding videography in Nepal: cinematic films versus documentary edits, teasers and same-day edits, audio capture, drone rules and realistic delivery timelines.",
    image: image("photo-1485846234645-a62644f84728"),
    imageAlt: "Videographer filming with a cinema camera on a gimbal",
    readTime: "10 min read",
    author: "Nepali Directory Events Desk",
    keywords: [
      "wedding videography Nepal",
      "wedding video Nepal",
      "cinematic wedding film Nepal",
      "wedding videographer Nepal",
      "same day edit Nepal",
    ],
    tags: ["Photography", "Videography", "Weddings", "Nepal"],
    sections: [
      {
        heading: "Film is a separate production, not an add-on to photography",
        paragraphs: [
          "A wedding film needs its own crew, its own equipment and, most significantly, its own post-production. A photographer culls and edits stills; a film editor assembles footage, syncs and cleans audio, colour-grades and cuts to music. That editing effort is why film pricing looks high relative to the shooting time involved.",
          "It is also why a studio offering film as a cheap bolt-on deserves scrutiny. Ask who edits, how long the edit takes and to see a complete finished film from a recent wedding — not a thirty-second social clip, which hides pacing and audio problems entirely.",
        ],
      },
      {
        heading: "The deliverable types and what each is for",
        paragraphs: [
          "A highlight film, typically a few minutes cut to music, is the piece most couples share and rewatch. A documentary or full-length edit runs much longer and preserves ceremony and speeches largely intact — less shareable, but the version families value years later. A teaser is a very short cut released quickly, and a same-day edit is a teaser screened at the reception itself, which requires an editor working on site during the event.",
          "Decide which of these you actually want before comparing quotes, because packages bundle them differently. A same-day edit in particular is a substantial extra ask that requires additional crew and should be priced explicitly.",
        ],
      },
      {
        heading: "Audio is where amateur wedding films fail",
        paragraphs: [
          "Wedding video lives or dies on sound. Vows recorded from a camera at the back of a hall are unusable, and no edit rescues them. Competent teams use lapel microphones on the officiant or groom, a recorder near the ceremony, and a feed from the venue's system for speeches, then sync in post.",
          "Ask directly what audio equipment the team brings and how they capture vows and speeches. If the answer is vague or the sample films rely entirely on music with no usable dialogue, that tells you what your film will sound like.",
        ],
      },
      {
        heading: "Drones, delivery and rights",
        paragraphs: [
          "Aerial footage is popular, but drone use in Nepal is regulated and restricted around airports, certain heritage and security-sensitive sites, and protected areas, with permissions required in many cases. Treat any studio that promises drone coverage without mentioning permissions as a risk, and confirm the position for your specific venue in advance.",
          "On delivery, agree the timeline in writing and expect film to take longer than photographs because editing is heavier. Confirm the resolution and format you receive, whether raw footage is available and at what cost, how long the studio retains the material, and whether music licensing is handled — an unlicensed commercial track can get a film removed from social platforms.",
        ],
      },
      recommendedStudioSection(
        "The studio lists cinematic wedding films alongside photography with an in-house team, which avoids the coordination problems that arise when two separate vendors work the same ceremony; ask to see one complete finished film rather than a social clip.",
      ),
    ],
    faqs: [
      {
        question: "What is included in a cinematic wedding film package in Nepal?",
        answer:
          "Typically a highlight film of a few minutes cut to music, sometimes with a longer documentary edit preserving the ceremony and speeches, and optionally a short teaser or a same-day edit screened at the reception. Packages bundle these differently, so decide which you want before comparing quotes.",
      },
      {
        question: "Why is wedding videography more expensive than photography?",
        answer:
          "Because the post-production is far heavier. A film editor assembles footage, syncs and cleans audio, colour-grades and cuts to music, which takes considerably longer than culling and editing stills. Film also usually needs its own crew and equipment on the day.",
      },
      {
        question: "Can I use a drone at my wedding venue in Nepal?",
        answer:
          "Not everywhere. Drone use is regulated and restricted around airports, certain heritage and security-sensitive sites and protected areas, with permissions required in many cases. Confirm the position for your specific venue well in advance rather than assuming the studio has arranged it.",
      },
      {
        question: "How should wedding film audio be captured?",
        answer:
          "Through lapel microphones on the officiant or groom, a recorder placed near the ceremony, and a feed from the venue's sound system for speeches, all synced in post. Audio recorded only from a camera at the back of a hall is generally unusable and cannot be fixed in editing.",
      },
      ...universalFaqs,
    ],
    contextLinks: commonContextLinks,
    citySlugs: ["kathmandu", "pokhara", "butwal"],
    sources: studioSources,
    disclaimer: guideDisclosure,
  },
  {
    ...publication,
    title: "Engagement and Ring Ceremony Photography in Nepal",
    seoTitle: "Engagement Photography Nepal: Ring Ceremony Coverage Guide",
    slug: "engagement-photography-nepal",
    href: "/blog/engagement-photography-nepal",
    category: "Photography",
    excerpt:
      "Coverage for engagement and ring ceremonies in Nepal: how these events differ from weddings, realistic crew and hours, and what to prioritise in a shorter shoot.",
    description:
      "Plan engagement and ring ceremony photography in Nepal: typical event structure, crew and hours needed, indoor lighting, family portraits and delivery expectations.",
    image: image("photo-1522673607200-164d1b6ce486"),
    imageAlt: "Engagement ring exchange photographed at a family ceremony",
    readTime: "8 min read",
    author: "Nepali Directory Events Desk",
    keywords: [
      "engagement photography Nepal",
      "ring ceremony photographer Nepal",
      "engagement photographer Kathmandu",
      "engagement shoot Nepal",
      "sagai photography Nepal",
    ],
    tags: ["Photography", "Engagement", "Nepal"],
    sections: [
      {
        heading: "An engagement is a short, dense, family-centred event",
        paragraphs: [
          "Where a wedding spreads across days, an engagement or ring ceremony is usually a single gathering of a few hours, often at a home, a small hall or a restaurant. The density is the challenge: the ring exchange itself may last under a minute, and there is no second take.",
          "That argues for a photographer arriving early enough to understand the room and the family before the moment arrives, rather than one who turns up as guests are seated. Build that into the booked hours.",
        ],
      },
      {
        heading: "What actually needs to be covered",
        paragraphs: [
          "The essentials are the ring exchange itself, the couple together, and organised portraits with both families — which are frequently the images the parents care most about and the ones most often rushed. Beyond that, candid coverage of guests, food and decor gives the gallery context.",
          "Agree a short list of must-have family groupings in advance and nominate a relative who knows everyone to help assemble them quickly. Twenty minutes of organised portraits with a helper is worth more than an hour of the photographer trying to identify family members alone.",
        ],
      },
      {
        heading: "Indoor light is the usual technical constraint",
        paragraphs: [
          "Home and small-hall engagements are often lit by whatever fixtures the room has, frequently warm or mixed and rarely flattering. This is the single most common reason engagement galleries disappoint. A photographer who brings and knows how to bounce off-camera light will produce visibly better results in the same room.",
          "Ask to see engagement or small indoor event work specifically. A portfolio of outdoor pre-wedding sessions demonstrates nothing about handling a dim living room full of relatives.",
        ],
      },
      {
        heading: "Right-sizing the booking",
        paragraphs: [
          "One competent photographer is usually enough for a typical engagement, with a second worth considering only if two families are preparing separately or the guest count is large. Three to four hours of coverage is a common realistic bracket.",
          "Because the event is small, delivery expectations should be proportionate: a smaller edited set delivered quickly is generally more useful than a large one months later. Confirm the edited image count and turnaround in writing as you would for a wedding.",
        ],
      },
      recommendedStudioSection(
        "Engagement shoots are among the studio's listed services alongside pre-wedding work, so the same team can carry a consistent visual style from engagement through to the wedding if you book both.",
      ),
    ],
    faqs: [
      {
        question: "How many hours of coverage does an engagement ceremony need?",
        answer:
          "Three to four hours is a common realistic bracket for a typical engagement or ring ceremony, with the photographer arriving early enough to understand the room and family before the ring exchange. One competent photographer usually suffices unless two families prepare separately or the guest list is large.",
      },
      {
        question: "What should be prioritised at a ring ceremony shoot?",
        answer:
          "The ring exchange itself, the couple together, and organised portraits with both families — the family groupings matter most to parents and are the most commonly rushed. Agree a must-have list in advance and nominate a relative to help assemble groups quickly.",
      },
      {
        question: "Why do indoor engagement photographs often disappoint?",
        answer:
          "Because home and small-hall lighting is usually warm, mixed and unflattering, and many photographers rely on it. A photographer who brings off-camera lighting and knows how to bounce it produces visibly better results in the same room, so ask to see indoor engagement work specifically.",
      },
      ...universalFaqs,
    ],
    contextLinks: commonContextLinks,
    citySlugs: ["kathmandu", "lalitpur", "butwal"],
    sources: studioSources,
    disclaimer: guideDisclosure,
  },
  {
    ...publication,
    title: "Maternity and Newborn Photography in Nepal",
    seoTitle: "Maternity Photography Nepal: Sessions, Timing and Safety",
    slug: "maternity-photography-nepal",
    href: "/blog/maternity-photography-nepal",
    category: "Photography",
    excerpt:
      "When to book a maternity session, what newborn photography safely involves, studio versus home settings, and the questions to ask about handling and hygiene.",
    description:
      "Plan maternity and newborn photography in Nepal: ideal timing, safe newborn posing, studio versus home sessions, hygiene questions and realistic session expectations.",
    image: image("photo-1555252333-9f8e92e65df9"),
    imageAlt: "Maternity portrait session in a softly lit studio",
    readTime: "8 min read",
    author: "Nepali Directory Events Desk",
    keywords: [
      "maternity photography Nepal",
      "newborn photography Nepal",
      "maternity shoot Kathmandu",
      "baby photoshoot Nepal",
      "pregnancy photoshoot Nepal",
    ],
    tags: ["Photography", "Maternity", "Nepal"],
    sections: [
      {
        heading: "Timing matters more here than in any other genre",
        paragraphs: [
          "Maternity sessions are commonly photographed in the third trimester, when the bump is clearly defined but before late-pregnancy discomfort makes a session tiring. Book the date well ahead but discuss flexibility, because comfort on the day matters more than hitting an exact week.",
          "Newborn sessions are conventionally done in the first two weeks, while babies sleep deeply and curl naturally. That window is short and unpredictable, so studios that do this work regularly usually take a provisional booking around the due date rather than a fixed appointment.",
        ],
      },
      {
        heading: "Newborn safety is a real question, not a formality",
        paragraphs: [
          "Some widely copied newborn poses are genuinely unsafe when attempted by someone untrained — particularly any pose where the baby appears unsupported or propped up. Experienced newborn photographers achieve these through composite images and a spotter whose hands are on the baby at all times, then removed in editing.",
          "Ask directly how they handle those poses, whether a parent or assistant spots throughout, and how they keep the room warm and props clean between babies. A photographer who answers precisely has been trained. One who is vague should be declined for newborn work regardless of how good their portfolio looks.",
        ],
      },
      {
        heading: "Studio or home, and what changes",
        paragraphs: [
          "A studio gives controlled light, backdrops, warmth and props, which produces consistent results and is generally easier for newborn work. A home session gives context and familiarity, is more comfortable for the mother, and often produces warmer, more personal images — but depends heavily on the natural light available in your rooms.",
          "If you prefer a home session, ask the photographer to check your space and the light at the time of day proposed. A room that feels bright to the eye can be far dimmer than it seems, and knowing that in advance allows them to bring lighting rather than improvise.",
        ],
      },
      {
        heading: "Setting realistic expectations for the session",
        paragraphs: [
          "Newborn sessions run on the baby's schedule and can take several hours with pauses for feeding, changing and settling. Plan nothing else that day. Maternity sessions are shorter but still benefit from unhurried pacing and one or two outfit changes rather than a rushed list.",
          "Confirm the usual practicalities in writing: how many edited images you receive, turnaround, whether prints or an album are included, and how the images may be used — many families want these kept private, so ask explicitly whether the studio intends to publish them and say no if you prefer they do not.",
        ],
      },
      recommendedStudioSection(
        "Maternity and couple portraits are among the studio's listed services; for newborn work specifically, ask about training, spotting practice and hygiene as you would with any studio, since newborn posing is a distinct skill from maternity portraiture.",
      ),
    ],
    faqs: [
      {
        question: "When is the best time for a maternity photoshoot?",
        answer:
          "Commonly during the third trimester, when the bump is clearly defined but before late-pregnancy discomfort makes a session tiring. Book ahead but keep the date flexible, since comfort on the day matters more than hitting a precise week.",
      },
      {
        question: "When should a newborn session happen?",
        answer:
          "Conventionally within the first two weeks, while babies sleep deeply and curl naturally. Because that window is short and unpredictable, experienced studios usually take a provisional booking around the due date rather than a fixed appointment.",
      },
      {
        question: "Are newborn photography poses safe?",
        answer:
          "Some widely copied poses are unsafe if attempted by someone untrained, particularly any where the baby appears unsupported. Experienced photographers create these as composite images with a spotter's hands on the baby throughout, edited out afterwards. Ask how they handle it, and decline vague answers.",
      },
      {
        question: "Can I ask a photographer not to publish my family's images?",
        answer:
          "Yes, and you should ask explicitly rather than assume. Many studios publish selected client work by default. Usage and publishing rights belong in the written agreement, and a straightforward request to keep images private is normal and should be accepted.",
      },
      ...universalFaqs,
    ],
    contextLinks: commonContextLinks,
    citySlugs: ["kathmandu", "lalitpur", "butwal"],
    sources: studioSources,
    disclaimer: guideDisclosure,
  },
  {
    ...publication,
    title: "Destination Wedding Photography in Nepal and Abroad",
    seoTitle: "Destination Wedding Photographer Nepal: Planning and Costs",
    slug: "destination-wedding-photographer-nepal",
    href: "/blog/destination-wedding-photographer-nepal",
    category: "Photography",
    excerpt:
      "Taking a photographer to a destination wedding: travel and accommodation terms, equipment redundancy far from a repair shop, permits abroad, and contingency planning.",
    description:
      "Plan destination wedding photography from Nepal: travel and accommodation terms, equipment redundancy, permits and visas, contingency planning and fair cost comparison.",
    image: image("photo-1469371670807-013ccf25f16a"),
    imageAlt: "Destination wedding ceremony photographed outdoors",
    readTime: "9 min read",
    author: "Nepali Directory Events Desk",
    keywords: [
      "destination wedding photographer Nepal",
      "destination wedding photography",
      "Nepal wedding photographer abroad",
      "travel wedding photographer Nepal",
      "destination wedding cost Nepal",
    ],
    tags: ["Photography", "Weddings", "Destination", "Nepal"],
    sections: [
      {
        heading: "Bringing your own photographer usually beats hiring locally",
        paragraphs: [
          "For a destination wedding, couples often assume hiring a photographer at the destination is cheaper. Sometimes it is, but you lose the two things that matter most: a team that knows your families and traditions, and work you have actually seen in full. A photographer who has shot your community's ceremonies will anticipate moments a local stranger cannot.",
          "The exception is a genuinely local requirement — a venue with restrictive vendor rules, or a location where a resident photographer's site knowledge is decisive. Otherwise, travelling your own team is usually the safer choice.",
        ],
      },
      {
        heading: "Travel terms are the main cost variable, so pin them down",
        paragraphs: [
          "Establish exactly what the quote includes: how many crew travel, flights or ground transport, accommodation and for how many nights, meals, local transfers at the destination, and whether travel days are billed. These add up quickly for a multi-day event with a film crew, and vagueness here is where destination budgets break.",
          "Also confirm who books and pays what. Some studios prefer to arrange their own travel and invoice it; others ask you to book. Either works, but it should be written down along with the cancellation position if the wedding moves.",
        ],
      },
      {
        heading: "Equipment redundancy matters far more away from home",
        paragraphs: [
          "In Kathmandu, a failed camera body can be replaced or repaired within hours. In a remote mountain venue or another country, it cannot. Ask what backup bodies, lenses, batteries and storage the team carries, and how they charge and back up in a location that may have unreliable power.",
          "For mountain or trekking-adjacent weddings, ask specifically about altitude, cold and battery management, and about how much the team is carrying and who carries it. These are practical constraints that materially affect what coverage is possible.",
        ],
      },
      {
        heading: "Permits, visas and contingency",
        paragraphs: [
          "Photographing commercially abroad can require appropriate visas or permissions, and carrying professional equipment across borders sometimes attracts customs attention or requires documentation. For destinations within Nepal, protected areas and heritage sites have their own permit regimes. Establish early who is responsible for researching and arranging each.",
          "Then plan for failure: what happens if a crew member cannot travel, if flights are cancelled, or if weather closes a mountain route. A studio with genuine destination experience will already have answers, and their answers are a reasonable proxy for how much of it they have really done.",
        ],
      },
      recommendedStudioSection(
        "The studio lists destination coverage including work outside Nepal alongside its domestic locations; for any destination booking ask precisely how many crew travel, what travel and accommodation the quote includes, and what equipment redundancy they carry.",
      ),
    ],
    faqs: [
      {
        question: "Should I bring my own photographer to a destination wedding?",
        answer:
          "Usually yes. You keep a team that knows your families and traditions and whose full work you have seen, which a local stranger cannot match for anticipating culturally significant moments. Hire locally only where venue vendor rules require it or a resident's site knowledge is genuinely decisive.",
      },
      {
        question: "What travel costs apply to a destination wedding photographer?",
        answer:
          "Typically flights or ground transport, accommodation for the nights required, meals, local transfers and sometimes billed travel days, multiplied by the number of crew. Establish exactly what the quote includes and who books and pays each item, along with the position if the wedding date moves.",
      },
      {
        question: "What should I ask about equipment for a remote wedding?",
        answer:
          "What backup camera bodies, lenses, batteries and storage the team carries, and how they charge and back up files where power is unreliable. Away from a city a failed body cannot be replaced within hours, so redundancy matters far more than at a venue near home.",
      },
      ...universalFaqs,
    ],
    contextLinks: commonContextLinks,
    citySlugs: ["kathmandu", "pokhara", "chitwan"],
    sources: studioSources,
    disclaimer: guideDisclosure,
  },
  {
    ...publication,
    title: "Wedding Albums, Files and Delivery: What You Actually Receive",
    seoTitle: "Wedding Album and Photo Delivery Nepal: Deliverables Guide",
    slug: "wedding-album-deliverables-nepal",
    href: "/blog/wedding-album-deliverables-nepal",
    category: "Photography",
    excerpt:
      "Edited image counts, album construction, raw files, resolution, delivery timelines and archiving — the deliverables that decide what you are left holding afterwards.",
    description:
      "Understand wedding photography deliverables in Nepal: edited image counts, album types and printing, raw files, resolution, delivery timelines and long-term archiving.",
    image: image("photo-1522775417749-29284fb89f43"),
    imageAlt: "Printed wedding album open on a table",
    readTime: "9 min read",
    author: "Nepali Directory Events Desk",
    keywords: [
      "wedding album Nepal",
      "wedding photo delivery Nepal",
      "wedding photography deliverables",
      "wedding raw files Nepal",
      "wedding album printing Nepal",
    ],
    tags: ["Photography", "Weddings", "Albums", "Nepal"],
    sections: [
      {
        heading: "Deliverables are what you keep, so they deserve equal attention to the shooting",
        paragraphs: [
          "Couples negotiate hard on coverage and crew, then accept whatever deliverables are offered. That is backwards. Once the wedding is over, the deliverables are the entire product: what arrives, in what form, how quickly and how long it survives.",
          "Every item below should be written into the contract with a number or a date attached. Vague phrasing such as all the good photos or an album is where disputes begin.",
        ],
      },
      {
        heading: "Edited image counts and what editing means",
        paragraphs: [
          "Packages state an edited image count, but studios mean different things by edited. Basic culling and colour correction across a few hundred images is standard. Detailed retouching — skin work, object removal, composite group fixes — is labour-intensive and usually applies only to a selected subset.",
          "Ask what level of editing applies to the full delivered set, how many images receive detailed retouching, and whether you may choose which. Also ask whether you receive anything for the frames that did not make the edit, since some studios provide lightly processed extras and others discard them.",
        ],
      },
      {
        heading: "Albums: construction matters more than page count",
        paragraphs: [
          "Album quality is determined by printing method, paper, binding and cover material, not by the number of pages. Flush-mount or lay-flat albums, where pages open completely without a gutter splitting the image, are more durable and display spreads far better than conventional bound prints, and they cost more for good reason.",
          "Ask to physically handle a sample album before agreeing, confirm the size, page and spread count, and establish the cost of additional copies for parents at the time of the original order, since reordering later is usually more expensive.",
        ],
      },
      {
        heading: "Files, resolution, rights and archiving",
        paragraphs: [
          "Confirm you receive full-resolution files suitable for printing, not just web-sized versions, and check the format. Raw files are a separate question: many studios decline to release them because raw is an unfinished product carrying their name, which is a defensible position — but you should know the answer before booking rather than after.",
          "Then archiving, which almost nobody asks about and everybody eventually needs. Establish how long the studio retains your files and whether they guarantee availability for re-orders. Regardless of the answer, take your own backups on delivery: at least two copies in different physical locations, plus cloud storage. A studio's hard drive is not your archive.",
        ],
      },
      recommendedStudioSection(
        "The studio lists premium albums and private online galleries among its deliverables; ask to handle a sample album, confirm the edited image count and retouching level for your package, and confirm how long files are retained.",
      ),
    ],
    faqs: [
      {
        question: "How many edited photos should I get from a wedding in Nepal?",
        answer:
          "It varies by package and coverage length, so the number matters less than what edited means. Ask what level of editing applies across the whole delivered set, how many images receive detailed retouching, and whether you choose which — basic colour correction and detailed retouching are very different amounts of work.",
      },
      {
        question: "What makes one wedding album better than another?",
        answer:
          "Printing method, paper, binding and cover material rather than page count. Flush-mount or lay-flat albums open completely without a gutter splitting the image, display spreads far better and last longer. Handle a physical sample before agreeing, and price extra parent copies at the time of the original order.",
      },
      {
        question: "Will I get the raw files from my wedding photographer?",
        answer:
          "Often not. Many studios decline to release raw files because raw is an unfinished product carrying their name, which is a defensible position. If raw access matters to you, establish it before booking rather than after delivery, and expect it to be priced separately if offered.",
      },
      {
        question: "How should I back up my wedding photographs?",
        answer:
          "Take your own backups as soon as you receive the files: at least two copies on separate physical drives kept in different locations, plus a cloud copy. Ask how long the studio retains files, but never rely on their storage as your archive.",
      },
      ...universalFaqs,
    ],
    contextLinks: commonContextLinks,
    citySlugs: ["kathmandu", "butwal"],
    sources: studioSources,
    disclaimer: guideDisclosure,
  },
  {
    ...publication,
    title: "Wedding Photography Planning Checklist for Nepali Weddings",
    seoTitle: "Wedding Photography Checklist Nepal: Timeline and Shot List",
    slug: "wedding-photography-checklist-nepal",
    href: "/blog/wedding-photography-checklist-nepal",
    category: "Photography",
    excerpt:
      "A booking timeline from twelve months out to delivery, plus shot-list planning, day-of coordination and the checks to run before, during and after the wedding.",
    description:
      "A practical wedding photography checklist for Nepal: booking timeline, shot list planning, contract checks, day-of coordination and what to confirm after delivery.",
    image: image("photo-1511285560929-80b456fea0bc"),
    imageAlt: "Wedding planning checklist and photographs on a desk",
    readTime: "9 min read",
    author: "Nepali Directory Events Desk",
    keywords: [
      "wedding photography checklist Nepal",
      "wedding photo shot list Nepal",
      "wedding photography planning Nepal",
      "when to book wedding photographer Nepal",
      "wedding photography timeline",
    ],
    tags: ["Photography", "Weddings", "Planning", "Nepal"],
    sections: [
      {
        heading: "Booking timeline: what to do and when",
        paragraphs: [
          "As soon as the date is fixed, particularly an auspicious one, start shortlisting — this is the single highest-leverage moment, because availability, not budget, is what removes the strongest studios from your options. Aim to have three studios shortlisted and quoted against an identical written brief within a few weeks, and to book once you are satisfied on portfolio, crew and contract.",
          "Roughly two months out, share the confirmed event schedule and venue list. Two to three weeks out, hold a final call to confirm timings, the named crew, the family shot list and any venue restrictions. In the final week, exchange day-of contact numbers for someone other than the couple, who will be unreachable.",
        ],
      },
      {
        heading: "Building a shot list that helps rather than hinders",
        paragraphs: [
          "A shot list should not attempt to script the day. Its job is to capture what a photographer cannot guess: specific family groupings, a grandparent who tires early and should be photographed first, a relative travelling from abroad, an heirloom or ritual object that matters, and any sensitive family dynamics best handled discreetly.",
          "Keep it to a page. An exhaustive list of generic moments crowds out the candid work you are actually paying for, while a focused list of genuinely unguessable specifics measurably improves the gallery.",
        ],
      },
      {
        heading: "Before you sign: the contract checklist",
        paragraphs: [
          "Confirm in writing: the named lead photographer and total crew; exact events, dates and hours covered; whether cinematography is included and by whom; number of edited images and the level of editing; album specification if included; delivery timeline; file resolution and format; backup and retention policy; and usage and publishing rights, including whether you may withhold consent to publication.",
          "Then the risk terms: overtime rate, substitute-photographer policy if the lead is unwell, postponement terms, cancellation and refund positions for both sides, and travel and accommodation for out-of-city coverage. Every one of these is routine — a studio that resists writing them down is telling you something.",
        ],
      },
      {
        heading: "On the day, and afterwards",
        paragraphs: [
          "Nominate a family member who knows everyone to work with the photographer on group portraits, and tell them in advance. This single step saves more time and produces better formals than any other intervention. Feed the crew if coverage runs long — it is standard, and a tired crew shoots worse in the final hours when the reception peaks.",
          "After the wedding, check delivery against the contract: image count, resolution, album specification and date. Raise any shortfall promptly and in writing while it is fresh. Then take your own backups immediately — two physical copies in different locations plus cloud storage — rather than relying on the studio's retention.",
        ],
      },
      recommendedStudioSection(
        `Whichever studio you book, run this checklist on them. If you are considering the partner studio, its published contact points are ${studio.phone} and ${studio.email}, and the same contract and deliverable questions above should be asked and answered in writing.`,
      ),
    ],
    faqs: [
      {
        question: "When should I book a wedding photographer in Nepal?",
        answer:
          "As soon as your date is fixed, especially for auspicious dates, because availability rather than budget is what removes the strongest studios from your options. Aim to shortlist and quote three studios against one identical written brief within a few weeks of setting the date.",
      },
      {
        question: "What should be on a wedding photography shot list?",
        answer:
          "Only what the photographer cannot guess: specific family groupings, a grandparent who tires early, relatives travelling from abroad, heirlooms or ritual objects that matter, and sensitive family dynamics. Keep it to one page — exhaustive generic lists crowd out the candid coverage you are paying for.",
      },
      {
        question: "What is the single most useful thing to arrange for the day?",
        answer:
          "Nominate a family member who knows everyone to help the photographer assemble group portraits, and brief them in advance. This saves more time and produces better formal photographs than any other single intervention, because the photographer does not have to identify relatives alone.",
      },
      {
        question: "What should I check when the photographs are delivered?",
        answer:
          "Check delivery against the contract: image count, file resolution and format, album specification and the promised date. Raise any shortfall promptly in writing. Then immediately take your own backups — two physical copies in separate locations plus cloud storage.",
      },
      ...universalFaqs,
    ],
    contextLinks: commonContextLinks,
    citySlugs: ["kathmandu", "pokhara", "butwal", "chitwan"],
    sources: studioSources,
    disclaimer: guideDisclosure,
  },
];
