.PHONY:	clean prune prototype build start

KIT_VERSION=6.3.0
KIT_NAME=govuk_prototype_kit
KIT_ZIP=cache/$(KIT_NAME).zip
KIT_URL='https://github.com/alphagov/$(KIT_NAME)/archive/v$(KIT_VERSION).zip'
KIT_UNZIPPED=prototype/node_modules

VIEWS_DIR=prototype/app/views

EXAMPLES=\
	$(VIEWS_DIR)/simplest\
	$(VIEWS_DIR)/simple

SRC_TEMPLATES=\
	templates/*.ntk\
	templates/*.html

SRC_PROTOTYPE_MACROS=\
	templates/frontend_macros.ntk

PROTOTYPE_MACROS=\
	$(subst templates/,$(VIEWS_DIR)/,$(SRC_PROTOTYPE_MACROS))

all:	$(EXAMPLES)

$(VIEWS_DIR)/%:	prototype bin/submit.js $(SRC_TEMPLATES) examples/%.json
	bin/submit.js -o $@ $(patsubst $(VIEWS_DIR)/%,examples/%.json,$(@))

start:
	cd prototype; npm start

prototype:	$(PROTOTYPE_MACROS)

# copy in the macros used by the generated templates
$(PROTOTYPE_MACROS):	$(SRC_PROTOTYPE_MACROS) $(KIT_UNZIPPED)
	cp $(SRC_PROTOTYPE_MACROS) $(VIEWS_DIR)

$(KIT_UNZIPPED):	$(KIT_ZIP)
	unzip -o '$(KIT_ZIP)'
	mv '$(KIT_NAME)-$(KIT_VERSION)' prototype
	cd prototype && npm install && npm install session-file-store

$(KIT_ZIP):
	@mkdir -p cache
	curl -sL '$(KIT_URL)' > '$@'

# Beware! This removes the generated prototype
clean::;	rm -rf prototype
