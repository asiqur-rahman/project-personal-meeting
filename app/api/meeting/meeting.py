import requests
import json

API_KEY = "braintechsolution_default_secret"
# BRAINTECHSOLUTION_URL = "http://localhost:3000/api/v1/meeting"
# BRAINTECHSOLUTION_URL = "https://p2p.braintechsolution.com/api/v1/meeting";
# BRAINTECHSOLUTION_URL = "https://braintechsolution.up.railway.app/api/v1/meeting"
BRAINTECHSOLUTION_URL = "https://braintechsolution.herokuapp.com/api/v1/meeting"

headers = {
    "authorization": API_KEY,
    "Content-Type": "application/json",
}

response = requests.post(
    BRAINTECHSOLUTION_URL,
    headers=headers
)

print("Status code:", response.status_code)
data = json.loads(response.text)
print("meeting:", data["meeting"])
