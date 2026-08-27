
from sqlalchemy import inspect
from database import engine


# Get information about the current database
inspector = inspect(engine)

# Get all tables
tables = inspector.get_table_names()

print("\n========================================")
print("TABLES IN CURRENT ERP DATABASE")
print("========================================")

for table in tables:
    print("-", table)


# Check specifically for users table
print("\n========================================")

if "users" in tables:
    print("SUCCESS: users table exists.")
else:
    print("ERROR: users table does NOT exist.")

print("========================================\n")

