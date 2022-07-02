#!/bin/bash

API_KEY="braintechsolution_default_secret"
# BRAINTECHSOLUTION_URL="http://localhost:3000/api/v1/meeting"
# BRAINTECHSOLUTION_URL="https://p2p.braintechsolution.com/api/v1/meeting"
# BRAINTECHSOLUTION_URL="https://braintechsolution.up.railway.app/api/v1/meeting"
BRAINTECHSOLUTION_URL="https://braintechsolution.herokuapp.com/api/v1/meeting"

curl $BRAINTECHSOLUTION_URL \
    --header "authorization: $API_KEY" \
    --header "Content-Type: application/json" \
    --request POST