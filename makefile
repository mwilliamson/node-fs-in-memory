.PHONY: test 

test:
	node_modules/.bin/nodeunit `find test -type d`
