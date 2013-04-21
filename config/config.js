
module.exports = {
    development: {
      root: require('path').normalize(__dirname + '/..'),
      app: {
        name: 'Nodejs Express Cream Chat'
      },
      db: 'mongodb://localhost/chat',
      /*facebook: {
          clientID: "APP_ID"
        , clientSecret: "APP_SECRET"
        , callbackURL: "http://localhost:1337/auth/facebook/callback"
      },
      */
      twitter: {
          clientID: "ftvKCf4CpHKaSaq8LwvUA"
        , clientSecret: "njr792dNmewENzoYe98Xef4WiXxaHMJe6duhkVESFpc"
        , callbackURL: "http://node.localhost.vb/auth/twitter/callback"
      },
      /*github: {
          clientID: 'APP_ID'
        , clientSecret: 'APP_SECRET'
        , callbackURL: 'http://localhost:1337/auth/github/callback'
      },
      google: {
          clientID: "APP_ID"
        , clientSecret: "APP_SECRET"
        , callbackURL: "http://localhost:1337/auth/google/callback"
      }
      */
    }
  , production: {

    }
}
