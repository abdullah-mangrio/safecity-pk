-- SafeCity PK - Schema v1 (DB-first)
-- Naming: snake_case, all timestamps in UTC

CREATE TABLE city (
  city_id       BIGSERIAL PRIMARY KEY,
  name          VARCHAR(100) NOT NULL UNIQUE,
  province      VARCHAR(50)  NOT NULL,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE area (
  area_id       BIGSERIAL PRIMARY KEY,
  city_id       BIGINT       NOT NULL REFERENCES city(city_id) ON DELETE RESTRICT,
  name          VARCHAR(120) NOT NULL,
  lat           DOUBLE PRECISION,
  lng           DOUBLE PRECISION,
  is_active     BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  UNIQUE(city_id, name)
);

CREATE TABLE app_user (
  user_id       BIGSERIAL PRIMARY KEY,
  full_name     VARCHAR(120) NOT NULL,
  email         VARCHAR(255) NOT NULL UNIQUE,
  role          VARCHAR(20)  NOT NULL CHECK (role IN ('admin','analyst','operator')),
  password_hash TEXT         NOT NULL,
  is_active     BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE incident_type (
  incident_type_id BIGSERIAL PRIMARY KEY,
  name             VARCHAR(80) NOT NULL UNIQUE,
  category         VARCHAR(60),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE incident (
  incident_id      BIGSERIAL PRIMARY KEY,
  city_id          BIGINT       NOT NULL REFERENCES city(city_id) ON DELETE RESTRICT,
  area_id          BIGINT       NOT NULL REFERENCES area(area_id) ON DELETE RESTRICT,
  incident_type_id BIGINT       NOT NULL REFERENCES incident_type(incident_type_id) ON DELETE RESTRICT,

  occurred_at      TIMESTAMPTZ  NOT NULL,
  severity         SMALLINT     NOT NULL CHECK (severity BETWEEN 1 AND 5),
  status           VARCHAR(20)  NOT NULL CHECK (status IN ('reported','verified','rejected','resolved')),

  title            VARCHAR(200),
  description      TEXT,
  source           VARCHAR(30)  NOT NULL DEFAULT 'manual' CHECK (source IN ('manual','import','api')),
  reported_by      BIGINT       REFERENCES app_user(user_id) ON DELETE SET NULL,

  is_deleted       BOOLEAN      NOT NULL DEFAULT FALSE,
  created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Change / audit history (strong for DB course)
CREATE TABLE verification_log (
  log_id       BIGSERIAL PRIMARY KEY,
  incident_id  BIGINT      NOT NULL REFERENCES incident(incident_id) ON DELETE CASCADE,
  actor_user_id BIGINT     REFERENCES app_user(user_id) ON DELETE SET NULL,
  action       VARCHAR(30) NOT NULL CHECK (action IN ('create','update','verify','reject','resolve','delete')),
  notes        TEXT,
  old_values   JSONB,
  new_values   JSONB,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Aggregated stats for analytics (can be filled by job)
CREATE TABLE area_daily_stats (
  stat_date     DATE        NOT NULL,
  city_id       BIGINT      NOT NULL REFERENCES city(city_id) ON DELETE RESTRICT,
  area_id       BIGINT      NOT NULL REFERENCES area(area_id) ON DELETE RESTRICT,
  total_incidents INTEGER   NOT NULL DEFAULT 0,
  avg_severity  NUMERIC(4,2),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (stat_date, area_id)
);

CREATE TABLE alerts (
  alert_id     BIGSERIAL PRIMARY KEY,
  city_id      BIGINT      NOT NULL REFERENCES city(city_id) ON DELETE RESTRICT,
  area_id      BIGINT      REFERENCES area(area_id) ON DELETE SET NULL,
  alert_type   VARCHAR(30) NOT NULL CHECK (alert_type IN ('spike','anomaly','threshold','system')),
  message      TEXT        NOT NULL,
  severity     SMALLINT    NOT NULL CHECK (severity BETWEEN 1 AND 5),
  detected_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_resolved  BOOLEAN     NOT NULL DEFAULT FALSE,
  resolved_at  TIMESTAMPTZ
);

CREATE TABLE risk_predictions (
  prediction_id BIGSERIAL PRIMARY KEY,
  city_id       BIGINT      NOT NULL REFERENCES city(city_id) ON DELETE RESTRICT,
  area_id       BIGINT      NOT NULL REFERENCES area(area_id) ON DELETE RESTRICT,
  predicted_for DATE        NOT NULL,
  risk_score    NUMERIC(5,4) NOT NULL CHECK (risk_score BETWEEN 0 AND 1),
  confidence    NUMERIC(5,4) NOT NULL CHECK (confidence BETWEEN 0 AND 1),
  model_version VARCHAR(50) NOT NULL,
  top_factors   JSONB,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(area_id, predicted_for, model_version)
);

-- AI support tables (later phase but schema reserved)
CREATE TABLE clusters (
  cluster_id    BIGSERIAL PRIMARY KEY,
  city_id       BIGINT      NOT NULL REFERENCES city(city_id) ON DELETE RESTRICT,
  algorithm     VARCHAR(30) NOT NULL DEFAULT 'dbscan',
  params        JSONB,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE incident_cluster_map (
  cluster_id   BIGINT NOT NULL REFERENCES clusters(cluster_id) ON DELETE CASCADE,
  incident_id  BIGINT NOT NULL REFERENCES incident(incident_id) ON DELETE CASCADE,
  PRIMARY KEY (cluster_id, incident_id)
);

CREATE TABLE duplicate_suspects (
  suspect_id   BIGSERIAL PRIMARY KEY,
  incident_id_1 BIGINT NOT NULL REFERENCES incident(incident_id) ON DELETE CASCADE,
  incident_id_2 BIGINT NOT NULL REFERENCES incident(incident_id) ON DELETE CASCADE,
  similarity   NUMERIC(5,4) NOT NULL CHECK (similarity BETWEEN 0 AND 1),
  reason       JSONB,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (incident_id_1 <> incident_id_2),
  UNIQUE(incident_id_1, incident_id_2)
);

-- Indexes (performance + recruiter signal)
CREATE INDEX idx_area_city_id ON area(city_id);
CREATE INDEX idx_incident_city_area_time ON incident(city_id, area_id, occurred_at DESC);
CREATE INDEX idx_incident_type_time ON incident(incident_type_id, occurred_at DESC);
CREATE INDEX idx_incident_status ON incident(status);
CREATE INDEX idx_verification_incident_id ON verification_log(incident_id);
CREATE INDEX idx_risk_area_date ON risk_predictions(area_id, predicted_for);
