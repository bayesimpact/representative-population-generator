models-lint:
	flake8 models models/tests
	pep257 models

# Run test suite locally.
models-test: FORCE
	py.test -s models/tests

# Run coverage.
models-coverage:
	pytest --cov=models --cov-config .coveragerc --cov-fail-under=80 --cov-report term-missing

# [Dummy dependency to force a make command to always run.]
FORCE:

# Backend tests
backend-lint:
	docker-compose run --no-deps backend bash -c "flake8 ."
	docker-compose run --no-deps backend bash -c "pep257 ."

backend-test:
	docker-compose run --no-deps backend pytest -s tests

# Frontend tests
frontend-lint:
	echo "Missing frontend-lint"

frontend-test:
	docker-compose run -e CI=true --no-deps webapp yarn test

# Webapp tests
webapp-lint:
	$(MAKE) backend-lint
	$(MAKE) frontend-lint

webapp-test:
	$(MAKE) backend-test
	$(MAKE) frontend-test
