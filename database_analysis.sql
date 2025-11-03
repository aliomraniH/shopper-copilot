-- Create tables and insert data (truncated INSERT shown, full data provided)
-- Note: This is a SQLite database script

-- Question 1: Which card has the most spend?
SELECT
    card_id,
    SUM(amount) as total_spend,
    COUNT(*) as transaction_count
FROM transactions
GROUP BY card_id
ORDER BY total_spend DESC
LIMIT 10;

-- Question 2: Which card program has the most number of individual transactions?
SELECT
    cp.id as card_program_id,
    cp.display_name,
    COUNT(t.id) as transaction_count
FROM card_programs cp
INNER JOIN cards c ON cp.id = c.card_program_id
INNER JOIN transactions t ON c.id = t.card_id
GROUP BY cp.id, cp.display_name
ORDER BY transaction_count DESC;

-- Question 3: Which card program had the most transactions in October?
SELECT
    cp.id as card_program_id,
    cp.display_name,
    COUNT(t.id) as october_transaction_count
FROM card_programs cp
INNER JOIN cards c ON cp.id = c.card_program_id
INNER JOIN transactions t ON c.id = t.card_id
WHERE strftime('%m', t.user_transaction_time) = '10'
GROUP BY cp.id, cp.display_name
ORDER BY october_transaction_count DESC;
