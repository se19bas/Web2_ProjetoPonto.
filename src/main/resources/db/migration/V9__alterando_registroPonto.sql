ALTER TABLE registro_ponto
    DROP COLUMN latitude,
    DROP COLUMN longitude,
    ADD COLUMN ponto GEOGRAPHY(POINT, 4326) NOT NULL;

CREATE INDEX idx_registro_ponto_ponto
    ON registro_ponto
    USING GIST (ponto);