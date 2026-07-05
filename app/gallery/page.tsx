"use client";

import { Camera, ImagePlus, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { DashboardPageFrame } from "@/components/dashboard/DashboardPageFrame";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { FillImage } from "@/components/ui/FillImage";
import { useDashboardData } from "@/components/dashboard/DashboardProvider";

export default function GalleryPage() {
  return (
    <DashboardShell>
      <GalleryPageContent />
    </DashboardShell>
  );
}

function GalleryPageContent() {
  const { state, addGalleryPhoto, removeGalleryPhoto, setCoverPhoto } = useDashboardData();
  const [photoUrl, setPhotoUrl] = useState("");
  const [photoTag, setPhotoTag] = useState("");
  const [photoSearch, setPhotoSearch] = useState("");
  const filteredPhotos = state.gallery.filter((photo) => {
    const query = photoSearch.trim().toLowerCase();
    return !query || [photo.tag, photo.alt].some((value) => value.toLowerCase().includes(query));
  });

  return (
    <DashboardPageFrame>
      <section className="dashboard-heading">
        <div>
          <h1>Photos</h1>
          <p>Refresh your gallery, keep a strong cover image, and rotate fresh visuals into the listing.</p>
        </div>
        <div>
          <button
            className="button button--outline"
            onClick={() => {
              addGalleryPhoto("", "");
            }}
            type="button"
          >
            <Camera size={16} aria-hidden />
            Add sample photo
          </button>
        </div>
      </section>

      <section className="dashboard-panel dashboard-form-panel">
        <div className="dashboard-panel__head">
          <h2>Add photo by URL</h2>
          <span>{state.gallery.length} photos</span>
        </div>
        <form
          className="dashboard-inline-form"
          onSubmit={(event) => {
            event.preventDefault();
            addGalleryPhoto(photoUrl, photoTag);
            setPhotoUrl("");
            setPhotoTag("");
          }}
        >
          <label>
            <span>Image URL</span>
            <input
              onChange={(event) => setPhotoUrl(event.target.value)}
              placeholder="https://images.unsplash.com/..."
              value={photoUrl}
            />
          </label>
          <label>
            <span>Tag</span>
            <input
              onChange={(event) => setPhotoTag(event.target.value)}
              placeholder="Dining room, menu, exterior..."
              value={photoTag}
            />
          </label>
          <button className="button button--primary" type="submit">
            <ImagePlus size={16} aria-hidden />
            Add to gallery
          </button>
        </form>
      </section>

      <section className="dashboard-panel dashboard-gallery-tools">
        <div className="dashboard-search-field">
          <Search size={16} aria-hidden />
          <input
            onChange={(event) => setPhotoSearch(event.target.value)}
            placeholder="Filter by tag or alt text..."
            value={photoSearch}
          />
        </div>
        <div className="dashboard-checklist">
          <span className={state.gallery.some((photo) => photo.isCover) ? "is-done" : ""}>
            <Camera size={16} aria-hidden />
            Cover photo selected
          </span>
          <span className={state.gallery.length >= 8 ? "is-done" : ""}>
            <Camera size={16} aria-hidden />
            8+ photos uploaded
          </span>
          <span className={state.gallery.some((photo) => photo.tag.toLowerCase().includes("food")) ? "is-done" : ""}>
            <Camera size={16} aria-hidden />
            Food photos included
          </span>
        </div>
      </section>

      <section className="dashboard-gallery-grid">
        {filteredPhotos.map((photo) => (
          <article className="dashboard-gallery-card" key={photo.id}>
            <span className="gallery-frame">
              <FillImage
                src={photo.src}
                alt={photo.alt}
                sizes="(max-width: 980px) 50vw, 280px"
                priority={photo.isCover}
              />
            </span>
            <div className="dashboard-gallery-card__body">
              <div>
                <strong>{photo.tag}</strong>
                {photo.isCover ? <small>Cover image</small> : <small>Gallery photo</small>}
              </div>
              <div className="dashboard-gallery-card__actions">
                <button
                  className="button button--outline"
                  disabled={photo.isCover}
                  onClick={() => setCoverPhoto(photo.id)}
                  type="button"
                >
                  {photo.isCover ? "Current cover" : "Set as cover"}
                </button>
                <button
                  className="button button--outline"
                  onClick={() => removeGalleryPhoto(photo.id)}
                  type="button"
                >
                  <Trash2 size={16} aria-hidden />
                  Remove
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>
    </DashboardPageFrame>
  );
}
