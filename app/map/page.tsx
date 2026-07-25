import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { BusinessMap, type MapBusiness } from "@/components/map/BusinessMap";
import { getIndexableListings, listingToBusiness } from "@/lib/public-listings";

export const dynamic = "force-dynamic";

export default async function MapPage() {
  const listings = await getIndexableListings();
  const businesses: MapBusiness[] = listings.flatMap((listing) => {
    const coordinates = listing.coordinates;
    if (
      !coordinates ||
      !Number.isFinite(coordinates.lat) ||
      !Number.isFinite(coordinates.lng) ||
      coordinates.lat < -90 ||
      coordinates.lat > 90 ||
      coordinates.lng < -180 ||
      coordinates.lng > 180
    ) {
      return [];
    }

    const business = listingToBusiness(listing);
    return [
      {
        slug: business.slug,
        name: business.name,
        categories: business.categories,
        area: business.area,
        neighborhood: business.neighborhood,
        address: business.address,
        phone: business.phone,
        rating: business.rating,
        reviews: business.reviews,
        status: business.status,
        verified: Boolean(business.verified),
        lat: coordinates.lat,
        lng: coordinates.lng,
      },
    ];
  });

  return (
    <main>
      <Breadcrumbs items={[{ label: "Business map" }]} />
      <BusinessMap businesses={businesses} />
    </main>
  );
}
