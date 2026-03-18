// If we are on the server, it uses the Cloud IP. 
// If we are on your laptop, it stays as localhost.
export const API_BASE_URL = 
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";