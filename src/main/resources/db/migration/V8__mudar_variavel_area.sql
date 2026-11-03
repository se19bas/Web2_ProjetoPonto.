CREATE EXTENSION IF NOT EXISTS postgis;

ALTER TABLE areapermitida
    DROP COLUMN latitude,
    DROP COLUMN longitude,
    DROP COLUMN raio,
    ADD COLUMN ponto geometry(Point, 4326) NOT NULL;

CREATE INDEX idx_areapermitida_ponto
    ON areapermitida
    USING GIST (ponto);
