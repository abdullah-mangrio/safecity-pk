const BASE_URL = "http://127.0.0.1:8000"

export async function loginUser(email, password) {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      username: email,
      password: password,
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.detail || "Login failed")
  }

  return data
}

