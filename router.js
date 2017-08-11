const passport = require("passport"); 

const Authentication = require("./controllers/authentication");
const passportService = require("./services/passport"); // we don't import anything from passport, we just want the code in passport.js to run

const requireAuth = passport.authenticate("jwt", { session: false });
const requireSignin = passport.authenticate("local", { session: false });

module.exports = function(app) {

    app.get("/", requireAuth, function(req, res) {

        res.send({ hi: "there" });
    });

    app.post("/signin", requireSignin, Authentication.signin);

    app.post("/signup", Authentication.signup);

};