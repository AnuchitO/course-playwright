//go:build contract

package booking

import (
	"context"
	"encoding/json"
	"net/http"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

// TestBookingContract_GetByRef locks down the JSON *shape* of
// GET /api/bookings/:bookingRef — specifically the subset of fields
// documented in docs/openapi/qoomlee-service.yaml that payment-service
// depends on. services/payment/payment/booking_client.go decodes exactly
// this response into its own bookingResponse struct; if this test and
// TestBookingClient_DecodesQoomleeContract (payment-service, same field
// list) ever disagree, one of them is about to fail before a real charge
// does.
//
// Response shape under test (docs/openapi/qoomlee-service.yaml →
// booking.Booking, subset — the full object has more fields, e.g. flight/
// passenger snapshots, that payment-service doesn't touch and this test
// doesn't lock):
//
//	{
//	  "bookingId": 42,             // integer
//	  "bookingRef": "QM7X2K",      // string
//	  "status": "PENDING",         // string
//	  "totalAmountMinor": 350000,  // integer (satang) — asserted non-float below
//	  "currency": "THB"            // string, ISO 4217
//	}
//
// Like flight/contract_test.go, this is deliberately NOT a duplicate of
// get_by_ref_handler_test.go — it doesn't care about business logic, only
// that every field a consumer relies on is present with the right JSON
// type.
func TestBookingContract_GetByRef(t *testing.T) {
	svc := &mockService{
		booking: &Booking{
			ID:               42,
			BookingRef:       "QM7X2K",
			Status:           "PENDING",
			TotalAmountMinor: 350000,
			TotalAmount:      "3500.00",
			Currency:         "THB",
		},
	}

	w := doGetByRef(newTestHandler(svc), "QM7X2K")
	require.Equal(t, http.StatusOK, w.Code)
	assert.Containsf(t, w.Header().Get("Content-Type"), "application/json",
		"contract broken: Content-Type must be application/json, got %q", w.Header().Get("Content-Type"))

	var body map[string]any
	require.NoError(t, json.Unmarshal(w.Body.Bytes(), &body))

	// Type contract: every field payment-service's bookingResponse
	// (booking_client.go) decodes from this response, with the JSON type it
	// decodes it as. The same class of silent breakage flight/contract_test.go
	// guards against — a field renamed, dropped, or retyped (money drifting
	// from an integer to a float) — and the one a unit test (which only
	// checks values it already expects) would not catch.
	fieldTypes := map[string]string{
		"bookingId":        "number",
		"bookingRef":       "string",
		"status":           "string",
		"totalAmountMinor": "number",
		"currency":         "string",
	}
	for field, wantType := range fieldTypes {
		v, ok := body[field]
		if !assert.Truef(t, ok, "contract broken: response is missing %q — payment-service's booking_client.go depends on it", field) {
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
}

// contractCaptureService is a minimal Service stand-in scoped to this file:
// unlike mockService in handler_test.go, it captures the UpdateStatusRequest
// the handler actually bound, so TestBookingContract_UpdateStatus can assert
// on the parsed fields rather than just the HTTP status code.
type contractCaptureService struct {
	got UpdateStatusRequest
}

func (s *contractCaptureService) Create(_ context.Context, _ CreateRequest) (*Booking, error) {
	return nil, nil
}

func (s *contractCaptureService) GetByRef(_ context.Context, _ string) (*Booking, error) {
	return nil, nil
}

func (s *contractCaptureService) GetAll(_ context.Context, _ string) ([]Summary, error) {
	return nil, nil
}

func (s *contractCaptureService) UpdateStatus(_ context.Context, _ string, req UpdateStatusRequest) error {
	s.got = req
	return nil
}

// TestBookingContract_UpdateStatus locks down the *request* shape of
// PUT /api/bookings/:bookingRef/status from the other direction: the field
// names payment-service's confirmBody (booking_client.go) sends must be the
// ones UpdateStatusRequest (models.go) binds from. The body below is typed
// as a plain map with the exact keys confirmBody marshals — status,
// paymentId, paymentProvider, providerChargeId — deliberately not
// constructed from UpdateStatusRequest itself, so a field rename on this
// side shows up as a silently-dropped (zero-value) field here instead of
// trivially matching.
//
// Request shape under test (docs/openapi/qoomlee-service.yaml →
// booking.UpdateStatusRequest):
//
//	{
//	  "status": "CONFIRMED",             // string
//	  "paymentId": 7,                    // integer
//	  "paymentProvider": "OMISE",        // string
//	  "providerChargeId": "chrg_test_xxx" // string
//	}
func TestBookingContract_UpdateStatus(t *testing.T) {
	requestBody := map[string]any{
		"status":           "CONFIRMED",
		"paymentId":        7,
		"paymentProvider":  "OMISE",
		"providerChargeId": "chrg_test_xxx",
	}

	svc := &contractCaptureService{}
	w := doUpdateStatus(newTestHandler(svc), "QM7X2K", requestBody)
	require.Equal(t, http.StatusOK, w.Code)
	assert.Containsf(t, w.Header().Get("Content-Type"), "application/json",
		"contract broken: Content-Type must be application/json, got %q", w.Header().Get("Content-Type"))

	assert.Equal(t, "CONFIRMED", svc.got.Status, "contract broken: status field not bound — payment-service sends confirmBody.Status")
	assert.Equal(t, int64(7), svc.got.PaymentID, "contract broken: paymentId field not bound")
	assert.Equal(t, "OMISE", svc.got.PaymentProvider, "contract broken: paymentProvider field not bound")
	assert.Equal(t, "chrg_test_xxx", svc.got.ProviderChargeID, "contract broken: providerChargeId field not bound")

	// Response body contract: payment-service's ConfirmBooking (booking_client.go)
	// only checks the HTTP status code today and ignores the body, but the
	// handler still promises a fixed shape — lock it so a future change on
	// either side (the handler reshaping success responses, or payment-service
	// starting to read the body) has a test to fail against.
	var respBody map[string]any
	require.NoError(t, json.Unmarshal(w.Body.Bytes(), &respBody))
	assert.Equal(t, map[string]any{"status": "ok"}, respBody, "contract broken: success response body changed shape")
}
