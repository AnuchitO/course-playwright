package middleware_test

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"

	"github.com/AnuchitO/qoomlee-payment/middleware"
)

const (
	webOrigin  = "https://app.qoomlee.com"
	evilOrigin = "https://evil.example.com"
)

func serveCORS(origins []string, method, origin string, extra map[string]string) *httptest.ResponseRecorder {
	gin.SetMode(gin.TestMode)
	r := gin.New()
	r.Use(middleware.CORS(origins))
	r.GET("/ping", func(c *gin.Context) { c.Status(http.StatusOK) })

	req := httptest.NewRequest(method, "/ping", nil)
	if origin != "" {
		req.Header.Set("Origin", origin)
	}
	for k, v := range extra {
		req.Header.Set(k, v)
	}
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)
	return w
}

func TestParseOrigins(t *testing.T) {
	tests := []struct {
		name string
		raw  string
		want []string
	}{
		{"empty yields none", "", nil},
		{"single", "https://app.qoomlee.com", []string{"https://app.qoomlee.com"}},
		{"trims spaces and drops blanks", " http://localhost:3000 , ,https://app.qoomlee.com/ ", []string{"http://localhost:3000", "https://app.qoomlee.com"}},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			assert.Equal(t, tt.want, middleware.ParseOrigins(tt.raw))
		})
	}
}

func TestCORS_AllowedOrigin_IsReflected(t *testing.T) {
	// Arrange / Act
	w := serveCORS([]string{webOrigin}, http.MethodGet, webOrigin, nil)

	// Assert
	assert.Equal(t, http.StatusOK, w.Code)
	assert.Equal(t, webOrigin, w.Header().Get("Access-Control-Allow-Origin"))
	assert.Contains(t, w.Header().Get("Vary"), "Origin")
	assert.Contains(t, w.Header().Get("Access-Control-Expose-Headers"), "X-Correlation-Id")
	assert.Empty(t, w.Header().Get("Access-Control-Allow-Credentials"), "bearer-token API must not enable credentialed CORS")
}

func TestCORS_DisallowedOrigin_GetsNoCORSHeaders(t *testing.T) {
	w := serveCORS([]string{webOrigin}, http.MethodGet, evilOrigin, nil)

	assert.Equal(t, http.StatusOK, w.Code, "request still served; the browser enforces the block")
	assert.Empty(t, w.Header().Get("Access-Control-Allow-Origin"))
	assert.Contains(t, w.Header().Get("Vary"), "Origin", "caches must not reuse one origin's answer for another")
}

func TestCORS_NoOriginHeader_IsUntouched(t *testing.T) {
	w := serveCORS([]string{webOrigin}, http.MethodGet, "", nil)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.Empty(t, w.Header().Get("Access-Control-Allow-Origin"))
}

func TestCORS_EmptyAllowlist_AllowsNothing(t *testing.T) {
	w := serveCORS(nil, http.MethodGet, webOrigin, nil)

	assert.Empty(t, w.Header().Get("Access-Control-Allow-Origin"))
}

func TestCORS_NeverAllowsWildcard(t *testing.T) {
	w := serveCORS([]string{"*"}, http.MethodGet, evilOrigin, nil)

	assert.Empty(t, w.Header().Get("Access-Control-Allow-Origin"), `"*" in config must not be honoured`)
}

func TestCORS_Preflight_AllowedOrigin(t *testing.T) {
	w := serveCORS([]string{webOrigin}, http.MethodOptions, webOrigin, map[string]string{
		"Access-Control-Request-Method":  "POST",
		"Access-Control-Request-Headers": "authorization,content-type",
	})

	assert.Equal(t, http.StatusNoContent, w.Code)
	assert.Equal(t, webOrigin, w.Header().Get("Access-Control-Allow-Origin"))
	assert.Contains(t, w.Header().Get("Access-Control-Allow-Methods"), "POST")
	assert.Contains(t, w.Header().Get("Access-Control-Allow-Headers"), "Authorization")
	assert.Contains(t, w.Header().Get("Access-Control-Allow-Headers"), "Content-Type")
	assert.Equal(t, "600", w.Header().Get("Access-Control-Max-Age"))
}

func TestCORS_Preflight_DisallowedOrigin_IsForbidden(t *testing.T) {
	w := serveCORS([]string{webOrigin}, http.MethodOptions, evilOrigin, map[string]string{
		"Access-Control-Request-Method": "POST",
	})

	assert.Equal(t, http.StatusForbidden, w.Code)
	assert.Empty(t, w.Header().Get("Access-Control-Allow-Origin"))
}

func TestCORS_PlainOptionsWithoutOrigin_IsNotAPreflight(t *testing.T) {
	w := serveCORS([]string{webOrigin}, http.MethodOptions, "", nil)

	assert.NotEqual(t, http.StatusNoContent, w.Code)
}
