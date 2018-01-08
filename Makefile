GOVUK_KIT_VERSION=6.3.0
GOVUK_KIT=govuk_prototype_kit-$(GOVUK_KIT_VERSION)
GOVUK_KIT_ZIP=$(GOVUK_KIT).zip
GOVUK_KIT_URL='https://github.com/alphagov/govuk_prototype_kit/archive/v$(GOVUK_KIT_VERSION).zip'


$(GOVUK_KIT)/README.md:	$(GOVUK_KIT_ZIP)
	unzip -o '$(GOVUK_KIT_ZIP)'
	@touch $@

$(GOVUK_KIT_ZIP):
	curl -sL '$(GOVUK_KIT_URL)' > '$@'
