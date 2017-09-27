lint:
	flake8 models models/tests
	pep257 models

# Run test suite locally.
test: FORCE
	py.test -s models/tests

# Run coverage.
coverage:
	pytest --cov=models --cov-config .coveragerc --cov-fail-under=80 --cov-report term-missing

# [Dummy dependency to force a make command to always run.]
FORCE:

# Webapp tests
webapp-lint:
	docker-compose run --no-deps backend bash -c "flake8 ."
	docker-compose run --no-deps backend bash -c "pep257 ."
	docker-compose run --no-deps webapp echo "I want lint"

webapp-test:
	docker-compose run --no-deps backend pytest -s tests
	docker-compose run -e CI=true --no-deps webapp yarn test
