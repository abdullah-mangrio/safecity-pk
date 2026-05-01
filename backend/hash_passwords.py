from app.db import get_connection
from app.core.security import hash_password

conn = get_connection()
cur = conn.cursor()

cur.execute("SELECT user_id, password_hash FROM app_user")

users = cur.fetchall()

for user_id, plain_password in users:
    hashed = hash_password(plain_password)

    cur.execute(
        "UPDATE app_user SET password_hash = %s WHERE user_id = %s",
        (hashed, user_id)
    )

conn.commit()
cur.close()
conn.close()

print("Passwords hashed successfully.")
