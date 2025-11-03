-- Full Database Analysis Script
-- This file contains the complete database setup and analytical queries

-- Drop existing tables if they exist
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS cards;
DROP TABLE IF EXISTS card_programs;

-- Create tables
CREATE TABLE transactions (
    id VARCHAR(255),
    user_transaction_time TIMESTAMP,
    card_id VARCHAR(255),
    amount DECIMAL(19,2)
);

CREATE TABLE cards (
    id VARCHAR(255),
    card_program_id VARCHAR(255)
);

CREATE TABLE card_programs (
    id VARCHAR(255),
    display_name VARCHAR(255)
);

-- Note: The INSERT statements from the user's SQL would go here
-- For the actual analysis, we need to load all 1000 transaction records

-- ANALYTICAL QUERIES --

-- Question 1: Which card has the most spend?
-- This query sums all transaction amounts by card_id
SELECT
    card_id,
    ROUND(SUM(amount), 2) as total_spend,
    COUNT(*) as num_transactions
FROM transactions
GROUP BY card_id
ORDER BY total_spend DESC
LIMIT 1;

-- Question 2: Which card program has the most number of individual transactions?
-- This joins cards and card_programs to count transactions per program
SELECT
    cp.display_name as program_name,
    COUNT(t.id) as transaction_count
FROM card_programs cp
INNER JOIN cards c ON cp.id = c.card_program_id
INNER JOIN transactions t ON c.id = t.card_id
GROUP BY cp.id, cp.display_name
ORDER BY transaction_count DESC
LIMIT 1;

-- Question 3: Which card program had the most transactions in October (2021)?
-- Filters for October transactions only
SELECT
    cp.display_name as program_name,
    COUNT(t.id) as october_transactions
FROM card_programs cp
INNER JOIN cards c ON cp.id = c.card_program_id
INNER JOIN transactions t ON c.id = t.card_id
WHERE strftime('%m', t.user_transaction_time) = '10'
  AND strftime('%Y', t.user_transaction_time) = '2021'
GROUP BY cp.id, cp.display_name
ORDER BY october_transactions DESC
LIMIT 1;
