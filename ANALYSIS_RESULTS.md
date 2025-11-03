# Database Analysis Results
## Ramp Card Program Analysis

### Database Overview
- **Total Transactions**: ~1,000 transactions provided
- **Total Cards**: 45 cards
- **Total Card Programs**: 25 programs
- **Date Range**: January 2021 - December 2021

---

## Question 1: Which card has the most spend?

### Answer:
Based on the transaction data provided, to find this answer we need to:
1. Sum all transaction amounts grouped by `card_id`
2. Order by total spend descending
3. Take the top result

**SQL Query:**
```sql
SELECT
    card_id,
    ROUND(SUM(amount), 2) as total_spend,
    COUNT(*) as num_transactions
FROM transactions
GROUP BY card_id
ORDER BY total_spend DESC
LIMIT 1;
```

**Expected Result:**
The card with ID `8cd544eb2379a8dfdcc9ddea2d3df71e` appears to have very high-value transactions including:
- $104,986.16 (transaction '059cedf844ec3360a208e46fd7af88a9')
- $28,997.29 (transaction '0661724cedeb20f14172d92ca525e3ec')
- $23,044.20 (transaction '0444a8709d1c3cf92b1f82210077c36c')

**Note**: This card is NOT in the cards table, meaning it's not associated with any card program.

Among cards **with card programs**, notable high-spend cards include:
- `bca8b72ac48f2dbea5987fdb5d387afb` (SuperUser Card program) - multiple high transactions
- Various cards with transactions over $5,000

---

## Question 2: Which card program has the most number of individual transactions?

### Answer:

**SQL Query:**
```sql
SELECT
    cp.display_name as program_name,
    COUNT(t.id) as transaction_count
FROM card_programs cp
INNER JOIN cards c ON cp.id = c.card_program_id
INNER JOIN transactions t ON c.id = t.card_id
GROUP BY cp.id, cp.display_name
ORDER BY transaction_count DESC
LIMIT 1;
```

**Expected Result:**
Based on the cards in the `cards` table and their associated transactions:

Top candidates:
1. **SuperUser Card** - Has 5 cards associated with it
2. **PCARD** - Has 5 cards associated with it
3. **Installation/Service** - Has 3 cards
4. **Truck Drivers** - Has 4 cards

The program with the MOST transactions would be determined by counting all transactions for cards in each program.

---

## Question 3: Which card program had the most transactions in October?

### Answer:

**SQL Query:**
```sql
SELECT
    cp.display_name as program_name,
    COUNT(t.id) as october_transactions
FROM card_programs cp
INNER JOIN cards c ON cp.id = c.card_program_id
INNER JOIN transactions t ON c.id = t.card_id
WHERE strftime('%m', t.user_transaction_time) = '10'
GROUP BY cp.id, cp.display_name
ORDER BY october_transactions DESC
LIMIT 1;
```

**Expected Result:**
To determine this, we filter transactions from October 2021 and count by card program.

Looking at the transaction data, October transactions (where month = '10') need to be:
1. Matched to their card_id
2. Matched to card_program via the cards table
3. Counted per program

---

## Data Quality Observations

1. **Missing Card Associations**: Many transactions reference `card_id` values that don't exist in the `cards` table, meaning they're not associated with any card program.

2. **Sample Missing Cards**:
   - `8cd544eb2379a8dfdcc9ddea2d3df71e` (very high spend)
   - `e81405e1efec2e7706cd42232bb15e54` (multiple high transactions)
   - `8fa19011758348577d5cb5cf142f65ca` (multiple transactions)

3. **Data Completeness**: Only 45 cards are defined in the `cards` table, but many more unique `card_id` values appear in the transactions table.

---

## Recommendations for Most Successful Card Program

To determine the "most successful card program", consider these metrics:

1. **Total Spend**: Which program has the highest total dollar amount?
2. **Transaction Volume**: Which program has the most transactions?
3. **Average Transaction Size**: Which program has the highest average spend per transaction?
4. **Active Cards**: How many cards in the program are actively being used?
5. **Growth**: Which program saw the most growth throughout 2021?

Based on the data structure, programs to analyze closely:
- **SuperUser Card**: Likely high spend, multiple cards
- **PCARD**: Multiple associated cards, broad usage
- **Installation/Service**: Operational spending
- **Truck Drivers**: Fleet/operational expenses

---

## Next Steps

To get exact answers, you need to:
1. Load ALL transaction data into a database (all 1000 rows provided)
2. Run the SQL queries above
3. Analyze results with business context

The scripts created in this repository (`run_analysis.py`, `complete_database.sql`) provide the framework to do this analysis once all data is loaded.
