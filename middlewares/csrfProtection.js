const csrf = require('csurf');

const csrfProtection = csrf(
  {
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Cookies seguros em produção
    sameSite: 'Strict'  // Impede o envio do cookie em requisições cross-site
  }
}
);

module.exports = csrfProtection;

