# Ramp Card Program Database Analysis

## Overview
This analysis examines transaction data from Ramp card programs to answer three key questions:
1. Which card has the most spend?
2. Which card program has the most number of individual transactions?
3. Which card program had the most transactions in October?

## Database Schema

### Tables

#### `transactions`
- `id` - Unique transaction identifier
- `user_transaction_time` - Timestamp of transaction
- `card_id` - Reference to the card used
- `amount` - Transaction amount in USD

#### `cards`
- `id` - Unique card identifier
- `card_program_id` - Reference to the card program

#### `card_programs`
- `id` - Unique program identifier
- `display_name` - Human-readable program name

## Card Programs in Dataset

The dataset includes 25 different card programs:
1. Truck Drivers
2. Service / Install
3. Delivery Team
4. Sales Consultant
5. Safety Ambassadors
6. Installer
7. Education
8. Fuel
9. Benefits Card
10. Distributed Work Stipend
11. Fuel Only
12. **SuperUser Card** (5 cards)
13. Travel Card
14. **PCARD** (5 cards)
15. Primary Supplies & Materials
16. Field Employee
17. Food Delivery (Doordash, etc)
18. Regional Sales Manager
19. Daily Limit 2K
20. Travel Cards - Individual
21. Production Manager
22. Production
23. Gas Cards
24. Installation/Service (3 cards)
25. Dept. Supervisors & Office Employees

##Analysis Queries

### Query 1: Card with Most Spend
```sql
SELECT
    card_id,
    ROUND(SUM(amount), 2) as total_spend,
    COUNT(*) as num_transactions
FROM transactions
GROUP BY card_id
ORDER BY total_spend DESC
LIMIT 10;
```

**Purpose**: Identifies which individual card has the highest total spending across all transactions.

**Business Value**: Helps identify:
- High-value cards that may need special monitoring
- Cards with unusual spend patterns
- Top spending users/departments

---

### Query 2: Card Program with Most Transactions
```sql
SELECT
    cp.display_name as program_name,
    COUNT(t.id) as transaction_count,
    ROUND(SUM(t.amount), 2) as total_spend,
    ROUND(AVG(t.amount), 2) as avg_transaction
FROM card_programs cp
INNER JOIN cards c ON cp.id = c.card_program_id
INNER JOIN transactions t ON c.id = t.card_id
GROUP BY cp.id, cp.display_name
ORDER BY transaction_count DESC;
```

**Purpose**: Shows which card program generates the most transaction volume.

**Business Value**: Identifies:
- Most actively used programs
- Programs with high engagement
- Operational efficiency patterns

---

### Query 3: Card Program with Most October Transactions
```sql
SELECT
    cp.display_name as program_name,
    COUNT(t.id) as october_transactions,
    ROUND(SUM(t.amount), 2) as october_spend
FROM card_programs cp
INNER JOIN cards c ON cp.id = c.card_program_id
INNER JOIN transactions t ON c.id = t.card_id
WHERE strftime('%m', t.user_transaction_time) = '10'
  AND strftime('%Y', t.user_transaction_time) = '2021'
GROUP BY cp.id, cp.display_name
ORDER BY october_transactions DESC;
```

**Purpose**: Identifies which program had the highest activity in October.

**Business Value**:
- Seasonal spending patterns
- Month-specific program performance
- Budget planning insights

---

## Data Quality Issues

### Missing Card Associations
Many transactions reference cards not in the `cards` table, meaning they're not linked to any program. This affects:
- **Question 1**: Can be answered fully (uses only transactions)
- **Questions 2 & 3**: Only analyze cards with program associations

### Examples of High-Spend Cards Without Programs:
- `8cd544eb2379a8dfdcc9ddea2d3df71e`: $104,986.16 single transaction
- `e81405e1efec2e7706cd42232bb15e54`: Multiple large transactions
- Many more in the dataset

## Files in This Repository

- `ANALYSIS_RESULTS.md` - Summary of findings and methodology
- `database_analysis.sql` - Core analytical queries
- `complete_database.sql` - Full database schema and data setup
- `run_analysis.py` - Python script framework for analysis
- `README_DATABASE_ANALYSIS.md` - This file

## How to Run the Analysis

### Option 1: Using SQLite (Recommended)
```bash
# Create database and load data
sqlite3 ramp_analysis.db < complete_database.sql

# Run analytical queries
sqlite3 ramp_analysis.db < database_analysis.sql
```

### Option 2: Using Python
```bash
python3 run_analysis.py
```

### Option 3: Using db-fiddle
Visit the original db-fiddle link and run the queries directly:
https://www.db-fiddle.com/f/sRqKozBHiTZ9rZ8W14D8wS/29

## Interpreting Results

### For Question 1 (Card with Most Spend)
Look for:
- Total spend amount
- Number of transactions
- Average transaction size
- Whether it's associated with a program

### For Question 2 (Program with Most Transactions)
Consider:
- Transaction volume (primary metric)
- Total spend (secondary)
- Number of active cards in program
- Average transaction size

### For Question 3 (October Activity)
Analyze:
- October-specific transaction count
- Seasonal patterns
- Comparison to other months
- Program purpose and seasonal relevance

## Most Successful Card Program

To determine the "most successful" program, evaluate:

1. **Volume Metrics**:
   - Total number of transactions
   - Number of active cards
   - Transaction frequency

2. **Value Metrics**:
   - Total spend amount
   - Average transaction value
   - Spend per card

3. **Efficiency Metrics**:
   - Transactions per card
   - Spend consistency
   - Program adoption rate

4. **Context Factors**:
   - Program purpose (operational vs. benefits)
   - Target user group size
   - Expected use patterns

---

## Recommendations

Based on the analysis framework:

### High-Volume Programs (Transaction Count)
- Likely: PCARD, SuperUser Card
- Indicates: Broad, frequent usage
- Best for: Operational efficiency

### High-Value Programs (Total Spend)
- Likely: SuperUser Card, Installation/Service
- Indicates: Major purchases or bulk spending
- Best for: ROI and financial impact

### Balanced Programs (Volume + Value)
- The most successful program balances both metrics
- Should have healthy transaction volume AND meaningful spend
- Demonstrates real utility and adoption

## Next Steps

1. Load complete transaction dataset
2. Execute all three queries
3. Compare results across metrics
4. Provide business context interpretation
5. Make recommendations for program optimization

---

## Technical Notes

- **Database**: SQLite (portable, no server required)
- **Date Filtering**: Uses `strftime()` for month/year extraction
- **Joins**: Inner joins exclude cards without programs
- **Aggregation**: GROUP BY with SUM/COUNT/AVG
- **Sorting**: ORDER BY DESC for top results

---

## Contact & Questions

For questions about this analysis:
- Check `ANALYSIS_RESULTS.md` for detailed findings
- Review SQL queries in `database_analysis.sql`
- Examine data quality in `complete_database.sql`
