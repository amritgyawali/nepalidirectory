"use client";

import { ArrowRight, Building2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import {
  DashboardProvider,
  useDashboardData,
  type NewDashboardListing
} from "@/components/dashboard/DashboardProvider";
import { routes } from "@/lib/routes";
import { createClient } from "@/utils/supabase/client";

const defaultForm: NewDashboardListing = {
  name: "",
  ownerName: "",
  category: "",
  area: "",
  address: "",
  phone: "",
  email: "",
  website: "",
  hours: "Mon-Sun: 9:00 am - 6:00 pm",
  image: "",
  description: "",
  amenities: [],
  seo: {
    metaTitle: "",
    metaDescription: "",
    primaryKeyword: "",
    keywords: [],
    serviceAreas: [],
    urlSlug: "",
    imageAlt: "",
    ogTitle: "",
    ogDescription: "",
    schemaType: "LocalBusiness"
  }
};

const requiredFields: Array<keyof NewDashboardListing> = [
  "name",
  "ownerName",
  "category",
  "area",
  "address",
  "phone",
  "email",
  "hours",
  "description"
];

const requiredSeoFields: Array<keyof NewDashboardListing["seo"]> = [
  "metaTitle",
  "metaDescription",
  "primaryKeyword",
  "urlSlug",
  "imageAlt",
  "ogTitle",
  "ogDescription"
];

export default function ClaimListingPage() {
  return (
    <DashboardProvider>
      <ClaimListingForm />
    </DashboardProvider>
  );
}

function ClaimListingForm() {
  const router = useRouter();
  const { addListing, isReady } = useDashboardData();
  const [sessionState, setSessionState] = useState<"checking" | "authenticated" | "guest">("checking");
  const [form, setForm] = useState(defaultForm);
  const [amenitiesText, setAmenitiesText] = useState("");
  const [keywordsText, setKeywordsText] = useState("");
  const [serviceAreasText, setServiceAreasText] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function checkSession() {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
        if (active) setSessionState("guest");
        return;
      }
      try {
        const { data } = await createClient().auth.getUser();
        if (active) setSessionState(data.user ? "authenticated" : "guest");
      } catch {
        if (active) setSessionState("guest");
      }
    }
    void checkSession();
    return () => { active = false; };
  }, []);

  function updateField(field: keyof NewDashboardListing, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value
    }));
  }

  function updateSeoField(field: keyof NewDashboardListing["seo"], value: string) {
    setForm((current) => ({
      ...current,
      seo: {
        ...current.seo,
        [field]: value
      }
    }));
  }

  function updateSchemaType(value: NewDashboardListing["seo"]["schemaType"]) {
    setForm((current) => ({
      ...current,
      seo: {
        ...current.seo,
        schemaType: value
      }
    }));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const missingField = requiredFields.find((field) => {
      const value = form[field];
      return typeof value === "string" && !value.trim();
    });

    if (missingField) {
      setError("Fill all required listing details before publishing.");
      return;
    }

    const missingSeoField = requiredSeoFields.find((field) => {
      const value = form.seo[field];
      return typeof value === "string" && !value.trim();
    });

    if (missingSeoField) {
      setError("Fill all required SEO fields before publishing.");
      return;
    }

    const amenities = amenitiesText
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    // Real submission: writes a dataSource:"owner" row via POST /api/listings so this listing
    // can actually appear in the sitemap/schema once a super admin approves it (2026-07-16 SEO
    // audit — previously `addListing` below only ever wrote to localStorage).
    try {
      const response = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          ownerName: form.ownerName,
          category: form.category,
          area: form.area,
          address: form.address,
          phone: form.phone,
          email: form.email,
          website: form.website,
          hours: form.hours,
          image: form.image,
          description: form.description,
          amenities,
          seo: {
            metaTitle: form.seo.metaTitle,
            metaDescription: form.seo.metaDescription,
            urlSlug: form.seo.urlSlug
          }
        })
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        setError(payload?.error || "Could not submit this listing for review. Please try again.");
        return;
      }
    } catch {
      setError("Could not reach the listing service. Please try again.");
      return;
    }

    const slug = addListing({
      ...form,
      amenities,
      seo: {
        ...form.seo,
        keywords: keywordsText
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        serviceAreas: serviceAreasText
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      }
    });

    router.push(`${routes.dashboardListings}?created=${slug}`);
  }

  if (sessionState !== "authenticated") {
    return (
      <main>
        <section className="page-head">
          <div className="container">
            <span className="eyebrow">Business owners</span>
            <h1 className="page-title">Claim or add your business in Nepal</h1>
            <p className="page-copy">
              Create a secure account to submit a business profile, verify ownership and keep
              contact details, services and opening information current. New and edited profiles
              remain outside public search and sitemaps until their source and category pass review.
            </p>
            <div className="seo-hero__actions">
              <Link className="button button--primary" href={`${routes.login}?next=${encodeURIComponent(routes.claimListing)}`}>
                Sign in to continue
              </Link>
              <Link className="button button--outline" href={routes.register}>Create an account</Link>
            </div>
          </div>
        </section>
        <section className="section section--soft">
          <div className="container seo-answer-grid">
            <article className="answer-summary">
              <h2>Prepare your public details</h2>
              <p>Use the exact business name, address, phone, category, service area and current hours customers can verify.</p>
            </article>
            <article className="answer-summary">
              <h2>Complete ownership review</h2>
              <p>Ownership and provenance checks protect customers and prevent sample, duplicate or unapproved records from ranking.</p>
            </article>
          </div>
        </section>
      </main>
    );
  }

  if (!isReady) {
    return <main className="dashboard-loading"><strong>Opening your secure listing form…</strong></main>;
  }

  return (
    <main className="claim-listing-page">
      <section className="page-head">
        <div className="container claim-listing-page__head">
          <span className="eyebrow">Business owner console</span>
          <h1 className="page-title">Add a business listing manually</h1>
          <p className="page-copy">
            Fill the public details customers need, publish the listing, then manage it from your dashboard.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container claim-listing-layout">
          <form className="claim-listing-form" onSubmit={onSubmit}>
            <div className="claim-listing-form__section">
              <h2>Business details</h2>
              <div className="claim-listing-grid">
                <label>
                  <span>Business name *</span>
                  <input
                    onChange={(event) => updateField("name", event.target.value)}
                    placeholder="Everest Family Restaurant"
                    value={form.name}
                  />
                </label>
                <label>
                  <span>Owner / manager name *</span>
                  <input
                    onChange={(event) => updateField("ownerName", event.target.value)}
                    placeholder="Business owner"
                    value={form.ownerName}
                  />
                </label>
                <label>
                  <span>Category *</span>
                  <select onChange={(event) => updateField("category", event.target.value)} value={form.category}>
                    <option value="">Select category</option>
                    <option value="Restaurants">Restaurants</option>
                    <option value="Hotels">Hotels</option>
                    <option value="Doctors">Doctors</option>
                    <option value="Home Services">Home Services</option>
                    <option value="Professional Services">Professional Services</option>
                    <option value="Beauty Salons">Beauty Salons</option>
                    <option value="Education">Education</option>
                  </select>
                </label>
                <label>
                  <span>Area / city *</span>
                  <input
                    onChange={(event) => updateField("area", event.target.value)}
                    placeholder="Kathmandu, Bagmati"
                    value={form.area}
                  />
                </label>
                <label className="claim-listing-grid__wide">
                  <span>Full public address *</span>
                  <input
                    onChange={(event) => updateField("address", event.target.value)}
                    placeholder="Street, landmark, city"
                    value={form.address}
                  />
                </label>
              </div>
            </div>

            <div className="claim-listing-form__section">
              <h2>Contact and operations</h2>
              <div className="claim-listing-grid">
                <label>
                  <span>Business phone *</span>
                  <input
                    onChange={(event) => updateField("phone", event.target.value)}
                    placeholder="+977-9800000000"
                    type="tel"
                    value={form.phone}
                  />
                </label>
                <label>
                  <span>Work email *</span>
                  <input
                    onChange={(event) => updateField("email", event.target.value)}
                    placeholder="owner@business.com"
                    type="email"
                    value={form.email}
                  />
                </label>
                <label>
                  <span>Website</span>
                  <input
                    onChange={(event) => updateField("website", event.target.value)}
                    placeholder="https://business.com"
                    value={form.website}
                  />
                </label>
                <label>
                  <span>Business hours *</span>
                  <input
                    onChange={(event) => updateField("hours", event.target.value)}
                    placeholder="Mon-Sun: 9:00 am - 6:00 pm"
                    value={form.hours}
                  />
                </label>
              </div>
            </div>

            <div className="claim-listing-form__section">
              <h2>Profile content</h2>
              <div className="claim-listing-grid">
                <label className="claim-listing-grid__wide">
                  <span>Description *</span>
                  <textarea
                    onChange={(event) => updateField("description", event.target.value)}
                    placeholder="Describe services, specialties, service area, and what customers should know."
                    rows={5}
                    value={form.description}
                  />
                </label>
                <label>
                  <span>Photo URL</span>
                  <input
                    onChange={(event) => updateField("image", event.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    value={form.image}
                  />
                </label>
                <label>
                  <span>Amenities / services</span>
                  <input
                    onChange={(event) => setAmenitiesText(event.target.value)}
                    placeholder="Parking, delivery, same-day service"
                    value={amenitiesText}
                  />
                </label>
              </div>
            </div>

            <div className="claim-listing-form__section">
              <h2>Search engine metadata</h2>
              <div className="claim-listing-grid">
                <label>
                  <span>SEO URL slug *</span>
                  <input
                    onChange={(event) => updateSeoField("urlSlug", event.target.value)}
                    placeholder="everest-family-restaurant-kathmandu"
                    value={form.seo.urlSlug}
                  />
                </label>
                <label>
                  <span>Schema type *</span>
                  <select
                    onChange={(event) =>
                      updateSchemaType(event.target.value as NewDashboardListing["seo"]["schemaType"])
                    }
                    value={form.seo.schemaType}
                  >
                    <option value="LocalBusiness">Local business</option>
                    <option value="Restaurant">Restaurant</option>
                    <option value="Hotel">Hotel</option>
                    <option value="MedicalBusiness">Medical business</option>
                    <option value="ProfessionalService">Professional service</option>
                    <option value="HomeAndConstructionBusiness">Home and construction</option>
                  </select>
                </label>
                <label className="claim-listing-grid__wide">
                  <span>Meta title *</span>
                  <input
                    maxLength={70}
                    onChange={(event) => updateSeoField("metaTitle", event.target.value)}
                    placeholder="Everest Family Restaurant Kathmandu | Menu, Hours, Phone"
                    value={form.seo.metaTitle}
                  />
                  <small>{form.seo.metaTitle.length}/70 characters</small>
                </label>
                <label className="claim-listing-grid__wide">
                  <span>Meta description *</span>
                  <textarea
                    maxLength={170}
                    onChange={(event) => updateSeoField("metaDescription", event.target.value)}
                    placeholder="Find Everest Family Restaurant in Kathmandu with phone, address, hours, menu highlights, photos and verified local business details."
                    rows={3}
                    value={form.seo.metaDescription}
                  />
                  <small>{form.seo.metaDescription.length}/170 characters</small>
                </label>
                <label>
                  <span>Primary target keyword *</span>
                  <input
                    onChange={(event) => updateSeoField("primaryKeyword", event.target.value)}
                    placeholder="family restaurant in Kathmandu"
                    value={form.seo.primaryKeyword}
                  />
                </label>
                <label>
                  <span>Secondary keywords</span>
                  <input
                    onChange={(event) => setKeywordsText(event.target.value)}
                    placeholder="Kathmandu restaurant, Nepali food near me"
                    value={keywordsText}
                  />
                </label>
                <label>
                  <span>Target service areas</span>
                  <input
                    onChange={(event) => setServiceAreasText(event.target.value)}
                    placeholder="Kathmandu, Patan, Lalitpur"
                    value={serviceAreasText}
                  />
                </label>
                <label>
                  <span>Image alt text *</span>
                  <input
                    onChange={(event) => updateSeoField("imageAlt", event.target.value)}
                    placeholder="Everest Family Restaurant dining room in Kathmandu"
                    value={form.seo.imageAlt}
                  />
                </label>
                <label className="claim-listing-grid__wide">
                  <span>Social title *</span>
                  <input
                    maxLength={80}
                    onChange={(event) => updateSeoField("ogTitle", event.target.value)}
                    placeholder="Everest Family Restaurant Kathmandu"
                    value={form.seo.ogTitle}
                  />
                </label>
                <label className="claim-listing-grid__wide">
                  <span>Social description *</span>
                  <textarea
                    maxLength={200}
                    onChange={(event) => updateSeoField("ogDescription", event.target.value)}
                    placeholder="See address, hours, phone, menu highlights and photos for Everest Family Restaurant in Kathmandu."
                    rows={3}
                    value={form.seo.ogDescription}
                  />
                </label>
              </div>
              <div className="claim-seo-preview">
                <span>Search preview</span>
                <strong>{form.seo.metaTitle || "Your optimized listing title will appear here"}</strong>
                <small>
                  nepalidirectory.com/business/{form.seo.urlSlug || "your-business-slug"}
                </small>
                <p>{form.seo.metaDescription || "Your meta description preview will appear here."}</p>
              </div>
            </div>

            {error ? <p className="auth-error">{error}</p> : null}

            <div className="claim-listing-actions">
              <button className="button button--primary" type="submit">
                Publish listing
                <ArrowRight size={16} aria-hidden />
              </button>
              <Link className="button button--outline" href={routes.dashboardListings}>
                Back to listings
              </Link>
            </div>
          </form>

          <aside className="claim-listing-aside">
            <div>
              <Building2 size={22} aria-hidden />
              <h2>SEO publishing checklist</h2>
              <p>
                Strong metadata improves eligibility for search results, maps, social previews and AI summaries.
                Rankings still depend on public crawlable pages, relevance, reviews, links and competition.
              </p>
            </div>
            {[
              "Unique title with city and business category",
              "Meta description written for local search intent",
              "Primary keyword plus natural secondary keywords",
              "Schema type saved for structured data generation",
              "Image alt text ready for image search"
            ].map((item) => (
              <span key={item}>
                <CheckCircle2 size={16} aria-hidden />
                {item}
              </span>
            ))}
          </aside>
        </div>
      </section>
    </main>
  );
}
