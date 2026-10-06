ALTER TABLE registroponto
DROP COLUMN latitude,
DROP COLUMN longitude,
ADD COLUMN ponto POINT NOT NULL SRID 4326,
ADD SPATIAL INDEX idx_ponto (ponto);