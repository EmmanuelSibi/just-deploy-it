clickhouse_user="${CLICKHOUSE_USER:-default}" 
clickhouse_password="${CLICKHOUSE_PASSWORD:-}" 
clickhouse_database="${CLICKHOUSE_DATABASE:-default}"

clickhouse server ping


clickhouse-client -h localhost --port 9001 -u "$clickhouse_user" -d "$clickhouse_database" --password "$clickhouse_password" --query "CREATE TABLE log_events (
  event_id UUID,
  timestamp DateTime MATERIALIZED now(),
  deployment_id Nullable(String),
  log String,
  metadata Nullable(String)
)
ENGINE=MergeTree PARTITION BY toYYYYMM(timestamp)
ORDER BY (timestamp);"