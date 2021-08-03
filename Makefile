build:
	tsc
	cp lib/model built/model
	cp lib/user.dict built/user.dict
	cp locales/ built/locales

clean:
	rm -r built
