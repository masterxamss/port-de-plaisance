const bcrypt = require('bcryptjs');

const User = require('../models/user');

exports.getLogin = (req, res) => {
  error = req.flash('error');
  res.render('auth/login', {
    pageTitle: 'Connexion',
    path: '/login',
    error: error,
    success: req.flash('success')
  });
}

exports.postLogin = async(req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      req.flash('error', 'Les informations fournies sont invalides');
      return res.redirect('/auth/login');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      req.flash('error', 'Les informations fournies sont invalides');
      return res.redirect('/auth/login');
    } else {
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save((err) => {
        if (err) {
          console.log(err);
          res.redirect('/');
        }
        res.redirect('/dashboard');
      });
    }
  }
  catch (error) {
    console.log(error);
    return res.status(500).send('Internal Server Error'); // 500 Internal Server Error
  }
};


exports.postLogout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }
    res.redirect('/');
  });
}