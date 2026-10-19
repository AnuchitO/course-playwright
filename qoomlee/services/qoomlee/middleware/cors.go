package middleware

import (
	"net/http"
	"slices"
	"strings"

	"github.com/gin-gonic/gin"
)

const preflightMaxAgeSeconds = "600"

// ParseOrigins turns a comma-separated ALLOWED_ORIGINS value into a clean list:
// whitespace and trailing slashes are trimmed and blank entries dropped.
func ParseOrigins(raw string) []string {
	var origins []string
	for _, o := range strings.Split(raw, ",") {
		o = strings.TrimRight(strings.TrimSpace(o), "/")
		if o != "" {
			origins = append(origins, o)
		}
	}
	return origins
}

// CORS lets browsers on the given origins call this API. It reflects the
// request's Origin only when it is in the allowlist ("*" is never honoured), and
// the API authenticates with a bearer token, so credentialed CORS is not enabled.
//
// Register it before auth and rate limiting: a preflight carries no token and
// must be answered here rather than rejected downstream.
func CORS(allowedOrigins []string) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Add("Vary", "Origin")

		origin := c.Request.Header.Get("Origin")
		allowed := origin != "" && origin != "*" && slices.Contains(allowedOrigins, origin)
		if allowed {
			c.Header("Access-Control-Allow-Origin", origin)
			c.Header("Access-Control-Expose-Headers", "X-Correlation-Id")
		}

		isPreflight := c.Request.Method == http.MethodOptions &&
			origin != "" && c.Request.Header.Get("Access-Control-Request-Method") != ""
		if !isPreflight {
			c.Next()
			return
		}

		if !allowed {
			c.AbortWithStatus(http.StatusForbidden)
			return
		}
		c.Writer.Header().Add("Vary", "Access-Control-Request-Method")
		c.Writer.Header().Add("Vary", "Access-Control-Request-Headers")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Authorization, Content-Type, X-Correlation-Id")
		c.Header("Access-Control-Max-Age", preflightMaxAgeSeconds)
		c.AbortWithStatus(http.StatusNoContent)
	}
}
