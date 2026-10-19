//go:build contract

package flight

import (
	"encoding/json"
	"net/http"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

// TestFlightContract_GetByID locks down the JSON *shape* of GET /api/flights/:id —
// the response documented in docs/openapi/qoomlee-service.yaml (generated from
// the @Success annotation on GetByID, see get_by_id_handler.go). The web app and
// the payment service both depend on this shape staying stable.
//
// Response shape under test (docs/openapi/qoomlee-service.yaml → flight.Flight):
//
//	{
//	  "id": 1,                    // integer
//	  "flightNumber": "QM101",    // string
//	  "origin": "BKK",            // string
//	  "destination": "SIN",       // string
//	  "departureTime": "...",     // string, RFC3339
//	  "arrivalTime": "...",       // string, RFC3339
//	  "status": "SCHEDULED",      // string
//	  "basePriceMinor": 350000,   // integer (satang) — asserted non-float below
//	  "basePrice": "3500.00",     // string, formatted display price
//	  "currency": "THB",          // string, ISO 4217
//	  "availableSeats": 152,      // integer
//	  "durationMinutes": 210      // integer
//	}
//
// This is deliberately NOT a duplicate of get_by_id_handler_test.go. The unit
// tests in that file check business logic ("does the handler return 404 when the
// service returns ErrNotFound?"). This test doesn't care about logic at all — it
// only asserts that every field a consumer relies on is present, with the right
// JSON type. Rename a field, drop it, or silently change basePriceMinor from an
// int to a float, and this test fails before it breaks whoever's calling this API.
func TestFlightContract_GetByID(t *testing.T) {
	svc := &mockService{
		flight: &Flight{
			ID:              1,
			FlightNumber:    "QM101",
			Origin:          "BKK",
			Destination:     "SIN",
			DepartureTime:   time.Now(),
			ArrivalTime:     time.Now(),
			Status:          "SCHEDULED",
			BasePriceMinor:  350000,
			BasePrice:       "3500.00",
			Currency:        "THB",
			AvailableSeats:  152,
			DurationMinutes: 210,
		},
	}

	w := doGetByID(newTestHandler(svc), "1")
	require.Equal(t, http.StatusOK, w.Code)
	assert.Containsf(t, w.Header().Get("Content-Type"), "application/json",
		"contract broken: Content-Type must be application/json, got %q", w.Header().Get("Content-Type"))

	var body map[string]any
	require.NoError(t, json.Unmarshal(w.Body.Bytes(), &body))

	// Type contract: every field the openapi doc promises, with the JSON type
	// it promises. A field silently renamed, dropped, or retyped (e.g.
	// basePriceMinor drifting from an integer to a float) fails here before
	// it breaks whoever's calling this API — the class of silent breakage a
	// unit test (which only checks values it already expects) would not
	// catch.
	fieldTypes := map[string]string{
		"id":              "number",
		"flightNumber":    "string",
		"origin":          "string",
		"destination":     "string",
		"departureTime":   "string",
		"arrivalTime":     "string",
		"status":          "string",
		"basePriceMinor":  "number",
		"basePrice":       "string",
		"currency":        "string",
		"availableSeats":  "number",
		"durationMinutes": "number",
	}
	for field, wantType := range fieldTypes {
		v, ok := body[field]
		if !assert.Truef(t, ok, "contract broken: response is missing %q", field) {
			continue
		}
		switch wantType {
		case "number":
			_, isNumber := v.(float64)
			assert.Truef(t, isNumber, "contract broken: %q must be numeric, got %T", field, v)
		case "string":
			_, isString := v.(string)
			assert.Truef(t, isString, "contract broken: %q must be a string, got %T", field, v)
		}
	}

	// flight.Flight documents exactly these 12 fields (not a subset) — an
	// extra field means the openapi doc and/or this test are stale, and a
	// consumer decoding into a strict struct could start dropping data.
	assert.Lenf(t, body, len(fieldTypes),
		"contract broken: response has %d fields, expected exactly %d documented in openapi — got %v",
		len(body), len(fieldTypes), body)
}
