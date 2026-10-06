ALTER TABLE areapermitida
DROP COLUMN latitude,
DROP COLUMN longitude,
DROP COLUMN raio,
ADD Ponto POINT NOT NULL SRID 4326,
ADD SPATIAL INDEX idx_ponto (Ponto);