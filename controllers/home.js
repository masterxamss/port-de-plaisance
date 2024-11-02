exports.getHome = (req, res) => {
  res.render('catways/index',{
    pageTitle: 'Accueil',
    path: '/'
  });
};