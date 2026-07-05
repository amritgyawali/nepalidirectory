"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";
import { businesses } from "@/lib/data";

const DASHBOARD_STORAGE_KEY = "nd-dashboard:v1";
const BROKEN_GALLERY_IMAGE_ID = "photo-1591488050486-c98306bff859";
const REPLACEMENT_GALLERY_IMAGE_ID = "photo-1514933651103-005eec06c04b";

const gallerySeeds = [
  "photo-1547592180-85f173990554",
  "photo-1567188040759-fb8a883dc6d8",
  "photo-1565557623262-b51c2513a641",
  REPLACEMENT_GALLERY_IMAGE_ID,
  "photo-1517248135467-4c7edcad34c4",
  "photo-1559925393-8be0ec4767c8",
  "photo-1604908176997-125f25cc6f3d",
  "photo-1495474472287-4d71bcdd2085",
  "photo-1514933651103-005eec06c04b",
  "photo-1552566626-52f8b828add9"
];

export type DashboardRange = "7" | "30" | "90";

export type DashboardListing = {
  slug: string;
  name: string;
  address: string;
  category: string;
  image: string;
  operatingStatus: string;
  visibility: "Live" | "Paused" | "Pending" | "Rejected";
  approvalStatus?: "Approved" | "Pending" | "Rejected";
  verified: boolean;
  completeness: number;
  hours: string;
  ownerName?: string;
  area?: string;
  phone?: string;
  email?: string;
  website?: string;
  description?: string;
  amenities?: string[];
  seo?: DashboardListingSeo;
};

export type DashboardListingSeo = {
  metaTitle: string;
  metaDescription: string;
  primaryKeyword: string;
  keywords: string[];
  serviceAreas: string[];
  urlSlug: string;
  imageAlt: string;
  ogTitle: string;
  ogDescription: string;
  schemaType: "LocalBusiness" | "Restaurant" | "Hotel" | "MedicalBusiness" | "ProfessionalService" | "HomeAndConstructionBusiness";
};

export type NewDashboardListing = {
  name: string;
  ownerName: string;
  category: string;
  area: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  hours: string;
  image: string;
  description: string;
  amenities: string[];
  seo: DashboardListingSeo;
};

export type DashboardReview = {
  id: string;
  author: string;
  rating: number;
  text: string;
  dateLabel: string;
  reply: string;
};

export type DashboardPhoto = {
  id: string;
  src: string;
  alt: string;
  tag: string;
  isCover: boolean;
};

export type DashboardProfile = {
  fullName: string;
  email: string;
  location: string;
  phone: string;
  website: string;
  hours: string;
  notifications: {
    emailLeads: boolean;
    reviewAlerts: boolean;
    weeklyDigest: boolean;
  };
};

export type DashboardNotification = {
  id: string;
  title: string;
  detail: string;
  unread: boolean;
};

type DashboardState = {
  selectedRange: DashboardRange;
  selectedListingSlug: string;
  listings: DashboardListing[];
  reviews: DashboardReview[];
  gallery: DashboardPhoto[];
  profile: DashboardProfile;
  notifications: DashboardNotification[];
};

type DashboardContextValue = {
  state: DashboardState;
  isReady: boolean;
  unreadNotifications: number;
  setSelectedRange: (range: DashboardRange) => void;
  selectListing: (slug: string) => void;
  addListing: (listing: NewDashboardListing) => string;
  toggleListingVisibility: (slug: string) => void;
  improveListing: (slug: string) => void;
  updateListingHours: (slug: string, hours: string) => void;
  saveProfile: (profile: DashboardProfile) => void;
  saveReviewReply: (id: string, reply: string) => void;
  addGalleryPhoto: (url: string, tag: string) => void;
  removeGalleryPhoto: (id: string) => void;
  setCoverPhoto: (id: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
};

const DashboardContext = createContext<DashboardContextValue | null>(null);

function slugify(value: string) {
  return (
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || `listing-${Date.now()}`
  );
}

function toHoursLabel(status: "open" | "closed" | "24h", hoursToday: string) {
  if (status === "24h") {
    return "Open 24 hours";
  }

  return hoursToday;
}

function buildDefaultState(): DashboardState {
  return {
    selectedRange: "7",
    selectedListingSlug: businesses[0].slug,
    listings: businesses.map((business, index) => ({
      slug: business.slug,
      name: business.name,
      address: business.address,
      category: business.categories[0],
      image: business.image,
      operatingStatus: toHoursLabel(business.status, business.hoursToday),
      visibility: index === 0 ? "Live" : index < 5 ? "Live" : "Paused",
      approvalStatus: index < 5 ? "Approved" : "Pending",
      verified: index < 3,
      completeness: index === 0 ? 85 : Math.min(96, 64 + index * 4),
      hours: toHoursLabel(business.status, business.hoursToday)
    })),
    reviews: [
      {
        id: "rajan-gurung",
        author: "Rajan Gurung",
        rating: 4,
        text: "Best choila in Bhaktapur, but service was slow on a Saturday evening because they were full.",
        dateLabel: "2h ago",
        reply: ""
      },
      {
        id: "sumitra-kc",
        author: "Sumitra KC",
        rating: 5,
        text: "Proper representation of Newari heritage cuisine. Bringing visiting friends here from now on.",
        dateLabel: "5h ago",
        reply: ""
      },
      {
        id: "anuja-shrestha",
        author: "Anuja Shrestha",
        rating: 5,
        text: "Beautiful courtyard, helpful staff and excellent yomari.",
        dateLabel: "Yesterday",
        reply: "Thank you, Anuja. We appreciate the recommendation and look forward to hosting you again."
      },
      {
        id: "prakash-lama",
        author: "Prakash Lama",
        rating: 3,
        text: "Food was strong, but the menu needs clearer pricing.",
        dateLabel: "2 days ago",
        reply: ""
      }
    ],
    gallery: gallerySeeds.slice(0, 8).map((photo, index) => ({
      id: `photo-${index + 1}`,
      src: `https://images.unsplash.com/${photo}?w=800&h=640&fit=crop&auto=format`,
      alt: "Restaurant gallery",
      tag: index === 0 ? "Courtyard cover" : index < 4 ? "Dining" : "Food",
      isCover: index === 0
    })),
    profile: {
      fullName: "Amrit",
      email: "amrit@example.com",
      location: "Kathmandu, Bagmati",
      phone: "+977-9800000000",
      website: "https://nepalidirectory.example",
      hours: "Mon-Sun: 11:30 am - 9:00 pm",
      notifications: {
        emailLeads: true,
        reviewAlerts: true,
        weeklyDigest: false
      }
    },
    notifications: [
      {
        id: "lead-phone",
        title: "8 new phone leads",
        detail: "Customers called from category search and map results today.",
        unread: true
      },
      {
        id: "review-rajan",
        title: "Review needs reply",
        detail: "Rajan Gurung mentioned slow service on Saturday evening.",
        unread: true
      },
      {
        id: "photo-cover",
        title: "Gallery refreshed",
        detail: "Your courtyard cover photo is now shown first on the listing.",
        unread: false
      }
    ]
  };
}

function mergeState(stored: Partial<DashboardState> | null): DashboardState {
  const defaults = buildDefaultState();

  if (!stored) {
    return defaults;
  }

  return {
    ...defaults,
    ...stored,
    listings: Array.isArray(stored.listings) && stored.listings.length > 0 ? stored.listings : defaults.listings,
    reviews: Array.isArray(stored.reviews) && stored.reviews.length > 0 ? stored.reviews : defaults.reviews,
    gallery:
      Array.isArray(stored.gallery) && stored.gallery.length > 0
        ? stored.gallery.map((photo) => ({
            ...photo,
            src: photo.src.replace(BROKEN_GALLERY_IMAGE_ID, REPLACEMENT_GALLERY_IMAGE_ID)
          }))
        : defaults.gallery,
    profile: {
      ...defaults.profile,
      ...stored.profile,
      notifications: {
        ...defaults.profile.notifications,
        ...stored.profile?.notifications
      }
    },
    notifications:
      Array.isArray(stored.notifications) && stored.notifications.length > 0
        ? stored.notifications
        : defaults.notifications
  };
}

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DashboardState>(() => buildDefaultState());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(DASHBOARD_STORAGE_KEY);
      const parsed = raw ? (JSON.parse(raw) as Partial<DashboardState>) : null;
      setState(mergeState(parsed));
    } catch {
      setState(buildDefaultState());
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!loaded) {
      return;
    }

    try {
      localStorage.setItem(DASHBOARD_STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage failures in private mode or limited environments.
    }
  }, [loaded, state]);

  const setSelectedRange = useCallback((range: DashboardRange) => {
    setState((current) => ({ ...current, selectedRange: range }));
  }, []);

  const selectListing = useCallback((slug: string) => {
    setState((current) => ({ ...current, selectedListingSlug: slug }));
  }, []);

  const addListing = useCallback((listing: NewDashboardListing) => {
    const baseSlug = slugify(listing.seo.urlSlug || listing.name);
    const existingSlugs = new Set(state.listings.map((item) => item.slug));
    let createdSlug = baseSlug;
    let suffix = 2;

    while (existingSlugs.has(createdSlug)) {
      createdSlug = `${baseSlug}-${suffix}`;
      suffix += 1;
    }

    setState((current) => {
      const filledOptionalFields = [
        listing.website,
        listing.image,
        listing.description,
        listing.amenities.join(", ")
      ].filter((value) => value.trim()).length;
      const completeness = Math.min(96, 78 + filledOptionalFields * 4);
      const image =
        listing.image.trim() ||
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=600&fit=crop&auto=format";

      return {
        ...current,
        selectedListingSlug: createdSlug,
        listings: [
          {
            slug: createdSlug,
            name: listing.name.trim(),
            ownerName: listing.ownerName.trim(),
            address: listing.address.trim(),
            area: listing.area.trim(),
            category: listing.category.trim(),
            phone: listing.phone.trim(),
            email: listing.email.trim(),
            website: listing.website.trim(),
            description: listing.description.trim(),
            amenities: listing.amenities,
            seo: {
              ...listing.seo,
              metaTitle: listing.seo.metaTitle.trim(),
              metaDescription: listing.seo.metaDescription.trim(),
              primaryKeyword: listing.seo.primaryKeyword.trim(),
              keywords: listing.seo.keywords.map((keyword) => keyword.trim()).filter(Boolean),
              serviceAreas: listing.seo.serviceAreas.map((area) => area.trim()).filter(Boolean),
              urlSlug: createdSlug,
              imageAlt: listing.seo.imageAlt.trim(),
              ogTitle: listing.seo.ogTitle.trim(),
              ogDescription: listing.seo.ogDescription.trim()
            },
            image,
            operatingStatus: listing.hours.trim(),
            hours: listing.hours.trim(),
            visibility: "Pending",
            approvalStatus: "Pending",
            verified: false,
            completeness
          },
          ...current.listings
        ],
        notifications: [
          {
            id: `listing-${createdSlug}`,
            title: "New listing added",
            detail: `${listing.name.trim()} is submitted and awaiting super admin approval.`,
            unread: true
          },
          ...current.notifications
        ]
      };
    });

    return createdSlug;
  }, [state.listings]);

  const toggleListingVisibility = useCallback((slug: string) => {
    setState((current) => ({
      ...current,
      listings: current.listings.map((listing) =>
        listing.slug === slug
          ? {
              ...listing,
              visibility: listing.visibility === "Live" ? "Paused" : "Live"
            }
          : listing
      )
    }));
  }, []);

  const improveListing = useCallback((slug: string) => {
    setState((current) => ({
      ...current,
      listings: current.listings.map((listing) =>
        listing.slug === slug
          ? {
              ...listing,
              verified: true,
              completeness: Math.min(100, listing.completeness + 7),
              visibility: "Live"
            }
          : listing
      )
    }));
  }, []);

  const updateListingHours = useCallback((slug: string, hours: string) => {
    const trimmedHours = hours.trim();

    if (!trimmedHours) {
      return;
    }

    setState((current) => ({
      ...current,
      listings: current.listings.map((listing) =>
        listing.slug === slug
          ? {
              ...listing,
              operatingStatus: trimmedHours,
              hours: trimmedHours
            }
          : listing
      ),
      profile: {
        ...current.profile,
        hours: trimmedHours
      }
    }));
  }, []);

  const saveProfile = useCallback((profile: DashboardProfile) => {
    setState((current) => ({
      ...current,
      profile
    }));
  }, []);

  const saveReviewReply = useCallback((id: string, reply: string) => {
    const trimmedReply = reply.trim();

    if (!trimmedReply) {
      return;
    }

    setState((current) => ({
      ...current,
      reviews: current.reviews.map((review) => (review.id === id ? { ...review, reply: trimmedReply } : review))
    }));
  }, []);

  const addGalleryPhoto = useCallback((url: string, tag: string) => {
    setState((current) => {
      const nextIndex = current.gallery.length % gallerySeeds.length;
      const trimmedUrl = url.trim();
      const trimmedTag = tag.trim();
      const src =
        trimmedUrl ||
        `https://images.unsplash.com/${gallerySeeds[nextIndex]}?w=800&h=640&fit=crop&auto=format`;

      return {
        ...current,
        gallery: [
          {
            id: `photo-${Date.now()}`,
            src,
            alt: trimmedTag || "Business gallery photo",
            tag: trimmedTag || "New upload",
            isCover: current.gallery.length === 0
          },
          ...current.gallery
        ]
      };
    });
  }, []);

  const removeGalleryPhoto = useCallback((id: string) => {
    setState((current) => {
      const remaining = current.gallery.filter((photo) => photo.id !== id);

      return {
        ...current,
        gallery: remaining.map((photo, index) => ({
          ...photo,
          isCover: remaining.some((item) => item.isCover) ? photo.isCover : index === 0
        }))
      };
    });
  }, []);

  const setCoverPhoto = useCallback((id: string) => {
    setState((current) => ({
      ...current,
      gallery: current.gallery.map((photo) => ({
        ...photo,
        isCover: photo.id === id
      }))
    }));
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setState((current) => ({
      ...current,
      notifications: current.notifications.map((notification) =>
        notification.id === id ? { ...notification, unread: false } : notification
      )
    }));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setState((current) => ({
      ...current,
      notifications: current.notifications.map((notification) => ({
        ...notification,
        unread: false
      }))
    }));
  }, []);

  const unreadNotifications = state.notifications.filter((notification) => notification.unread).length;

  const value = useMemo<DashboardContextValue>(
    () => ({
      state,
      isReady: loaded,
      unreadNotifications,
      setSelectedRange,
      selectListing,
      addListing,
      toggleListingVisibility,
      improveListing,
      updateListingHours,
      saveProfile,
      saveReviewReply,
      addGalleryPhoto,
      removeGalleryPhoto,
      setCoverPhoto,
      markNotificationRead,
      markAllNotificationsRead
    }),
    [
      markAllNotificationsRead,
      markNotificationRead,
      saveProfile,
      saveReviewReply,
      setCoverPhoto,
      setSelectedRange,
      selectListing,
      state,
      toggleListingVisibility,
      unreadNotifications,
      updateListingHours,
      addGalleryPhoto,
      addListing,
      improveListing,
      loaded,
      removeGalleryPhoto
    ]
  );

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

export function useDashboardData() {
  const context = useContext(DashboardContext);

  if (!context) {
    throw new Error("useDashboardData must be used inside DashboardProvider.");
  }

  return context;
}
