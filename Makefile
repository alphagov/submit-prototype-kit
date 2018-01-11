.PHONY:	clean prune prototype build start

KIT_VERSION=6.3.0
KIT_NAME=govuk_prototype_kit
KIT_ZIP=cache/$(KIT_NAME).zip
KIT_URL='https://github.com/alphagov/$(KIT_NAME)/archive/v$(KIT_VERSION).zip'
KIT_UNZIPPED=prototype/node_modules

VIEWS_DIR=prototype/app/views

TEMPLATES=templates/*.html

all:	simple

# simple example form
simple: $(VIEWS_DIR)/simple

$(VIEWS_DIR)/simple:	prototype bin/submit.js $(TEMPLATES)
	bin/submit.js -o $@ examples/simple.json

start:
	cd prototype; npm start

prototype:	$(VIEWS_DIR)/form_macros.html

# copy in the macros used by the generated templates
$(VIEWS_DIR)/form_macros.html:	templates/form_macros.html $(KIT_UNZIPPED)
	cp templates/form_macros.html $@

$(KIT_UNZIPPED):	$(KIT_ZIP)
	unzip -o '$(KIT_ZIP)'
	mv '$(KIT_NAME)-$(KIT_VERSION)' prototype
	cd prototype && npm install

$(KIT_ZIP):
	@mkdir -p cache
	curl -sL '$(KIT_URL)' > '$@'

# Beware! This removes the generated prototype
clean::;	rm -rf prototype
