package http_test

import (
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/stretchr/testify/require"
	"ultrathreads/internal/config"
	handler "ultrathreads/internal/delivery/http"
	"ultrathreads/internal/service"
	"ultrathreads/pkg/auth"
)

func TestNewHandler(t *testing.T) {
	h := handler.NewHandler(&service.Services{}, &auth.Manager{})

	require.IsType(t, &handler.Handler{}, h)
}

func TestNewHandler_Init(t *testing.T) {
	h := handler.NewHandler(&service.Services{}, &auth.Manager{})

	router := h.Init(&config.Config{
		Limiter: config.LimiterConfig{
			RPS:   2,
			Burst: 4,
			TTL:   10 * time.Minute,
		},
	})

	ts := httptest.NewServer(router)
	defer ts.Close()

	res, err := http.Get(ts.URL + "/ping")
	if err != nil {
		t.Error(err)
	}

	require.Equal(t, http.StatusOK, res.StatusCode)
}
