-- V16__phase7_owner_reply_review_ref.sql
-- Follow-up for owner reply drafts when current review IDs are strings.

ALTER TABLE owner_reply_drafts
  ADD COLUMN IF NOT EXISTS review_ref TEXT;
