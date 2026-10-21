.PHONY: replay tag-labs

replay: ## Walk the workshop commit by commit (n next, p prev, d diff, q quit)
	replay $$(git merge-base main demo)

tag-labs: ## Tag the last commit of each module on demo as lab-N-solution (re-run after every rebase of demo)
	@for n in 1 2 3 4 5 7; do \
	  c=$$(git log main..demo --format=%h --grep="^M$$n " | head -1); \
	  git tag -f lab-$$n-solution $$c; \
	done
