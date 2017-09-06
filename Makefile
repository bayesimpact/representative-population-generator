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
