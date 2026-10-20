.PHONY: replay

replay: ## Walk the workshop commit by commit (n next, p prev, d diff, q quit)
	replay $$(git merge-base main demo)
