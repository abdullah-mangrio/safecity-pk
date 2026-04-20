# Database Setup

This folder contains the PostgreSQL database artifacts for SafeCity PK.

## Files
- `schema.sql` → relational schema, constraints, and indexes
- `seed.sql` → initial sample data
- `queries/` → analytical SQL queries for reporting and dashboard use

## Setup Steps

Create database:

```bash
sudo -u postgres createdb safecity_pk
