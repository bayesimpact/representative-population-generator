lint:
	flake8 network_adequacy tests
	pep257 network_adequacy

# Run test suite locally.
test: FORCE
	py.test -s tests

# Run coverage.
coverage:
	pytest --cov=network_adequacy --cov-config .coveragerc --cov-fail-under=80 --cov-report term-missing

# [Dummy dependency to force a make command to always run.]
FORCE:
