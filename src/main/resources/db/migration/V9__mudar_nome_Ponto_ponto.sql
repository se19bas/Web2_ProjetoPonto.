-- No MySQL esta migration renomeava a coluna "Ponto" para "ponto".
-- No PostgreSQL identificadores sem aspas ja sao convertidos para minusculo,
-- entao a coluna ja foi criada como "ponto" na V8. Mantida apenas para
-- preservar a sequencia de versoes do Flyway.
SELECT 1;
