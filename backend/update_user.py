import sqlite3

# Connect to database
conn = sqlite3.connect("erp.db")

# Show current users
print("\nBEFORE UPDATE:")
users = conn.execute(
    "SELECT id, first_name, last_name, email, username FROM users"
).fetchall()

for user in users:
    print(user)

# Update Sagnik
conn.execute(
    "UPDATE users SET username = ? WHERE id = ?",
    ("sagnik", 2)
)

# Save changes
conn.commit()

# Show users after update
print("\nAFTER UPDATE:")
users = conn.execute(
    "SELECT id, first_name, last_name, email, username FROM users"
).fetchall()

for user in users:
    print(user)

# Close database
conn.close()

print("\nDatabase update completed.")