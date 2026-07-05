-- V15__phase6_moderation_entity_ref.sql
-- Follow-up for databases where V13 was applied before Phase 6 added string review refs.
-- Keeps prompt's numeric `entity_id` contract while allowing current string review IDs.

ALTER TABLE moderation_queue
  ADD COLUMN IF NOT EXISTS entity_ref TEXT;
