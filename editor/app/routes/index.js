const index = {

	bind: function (router, formsData) {

    router.get('/', function (req, res) {
      res.render('index', {
        'forms': formsData.getAll(),
        'currentFormPage': '/'
      })
    })

 }

};

module.exports = index;
