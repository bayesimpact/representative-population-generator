local:
	docker-compose up frontend

rebuild:
	docker-compose build --no-cache frontend

models-lint:
	docker-compose run --no-deps explorer bash -c "flake8 ./models"
	docker-compose run --no-deps explorer bash -c "pep257 ./models"

# Run test suite locally.
models-test: FORCE
	docker-compose run --no-deps explorer pytest -s models/tests


# Run coverage.
models-coverage:
	docker-compose run --no-deps explorer pytest --cov=models --cov-config .coveragerc --cov-fail-under=90 --cov-report term-missing

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
	docker-compose run -e CI=true --no-deps frontend yarn test

# Webapp tests
webapp-lint:
	$(MAKE) backend-lint
	$(MAKE) frontend-lint

webapp-test:
	$(MAKE) backend-test
	$(MAKE) frontend-test
