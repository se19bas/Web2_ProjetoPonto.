ALTER TABLE area_permitida
DROP COLUMN latitude,
    DROP COLUMN longitude,
    DROP COLUMN raio,
    ADD COLUMN ponto GEOGRAPHY(POINT, 4326) NOT NULL;

CREATE INDEX idx_area_permitida_ponto
    ON area_permitida
    USING GIST (ponto);