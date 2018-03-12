# Editor

## Overview

The editor is an [ExpressJS](https://expressjs.com/) app.

It's built from a copy of the [GOVUK Prototype kit](https://github.com/alphagov/govuk_prototype_kit)
so gives you these features out-of-the-box:
- static asset compilation
- nunjucks templating (used by [GOVUK Frontend](https://github.com/alphagov/govuk-frontend))
- a sensible folder structure
- [GOVUK Elements](https://govuk-elements.herokuapp.com/) Sass files included
- base GOVUK layout page built on [GOVUK Template](https://github.com/alphagov/govuk_template)
  included
- app is reloaded and assets re-compiled automatically when files change

## App structure

The overall app structure follows the GOVUK Prototype kit. This section deals with code specific to
the editor app.

```
- editor/
  - lib/
    - forms_data.js
    - graph_data.js
    - iframe-controller-client-script-tag.html
    - iframe-controller-client.js
  - app/
    - models.js
    - routes/
      - responses.js
      - pages.js
      - forms.js
      - index.js
      - graphs.js
      - all.js
    - assets/
      - sass/
        - editor.scss
        - railroad-diagrams.scss
      - javascripts/
        - templates.js
        - dagre-3d.js
        - flowchart.js
        - railroad-diagrams.js
        - nunjucks.js
        - editor/
          - head.js
          - utils.js
          - status.js
          - iframe-controller.js
          - onready.js
     - views/
       - flowchart.html
       - railroad.html
       - form.html
       - page.html
       - create-page.html
```
