USE storable;

-- Adding index to optimize queries that fetch recent files for a user
ALTER TABLE nodes ADD INDEX index_owner_modified (owner_id, modified_at DESC);
