ALTER TABLE registroponto
    DROP COLUMN latitude,
    DROP COLUMN longitude,
    ADD COLUMN ponto geometry(Point, 4326) NOT NULL;

CREATE INDEX idx_registroponto_ponto
    ON registroponto
    USING GIST (ponto);
