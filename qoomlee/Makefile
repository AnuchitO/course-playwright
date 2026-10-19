.PHONY: help up down reset web install test-ui test-e2e status

help: ## Show targets
	@grep -E '^[a-z0-9-]+:.*##' $(MAKEFILE_LIST) | awk -F':.*## ' '{printf "  make %-10s %s\n", $$1, $$2}'

up: ## Start postgres + backend services (9988, 9984) and wait until healthy
	docker compose up -d --build --wait

down: ## Stop backend services (keeps data)
	docker compose down

reset: ## Wipe DBs and restart with fresh seed data (flight dates are seeded relative to now)
	docker compose down -v
	docker compose up -d --build --wait

install: ## Install web dependencies
	cd app/web && bun install

web: ## Run the web app on http://localhost:3000
	cd app/web && bun run dev

test-ui: ## Mocked UI tests (no backend needed)
	cd app/web && bun run test:ui

test-e2e: ## Playwright tests in app/web/e2e (start `make up` and `make web` first)
	cd app/web && bun run test:e2e

status: ## Check service health
	@curl -s localhost:9988/health/ready; echo
	@curl -s localhost:9984/health/ready; echo
