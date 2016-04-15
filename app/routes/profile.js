var ProfileDAO = require("../data/profile-dao").ProfileDAO;

/* The ProfileHandler must be constructed with a connected db */
function ProfileHandler(db) {
    "use strict";

    var profile = new ProfileDAO(db);

    this.displayProfile = function(req, res, next) {
        var userId = req.session.userId;
        var userIdClean = sanitize(userId);

        profile.getByUserId(parseInt(userIdClean), function(err, doc) {
            if (err) return next(err);
            doc.userIdClean = userIdClean;

            return res.render("profile", doc);
        });
    };

    this.handleProfileUpdate = function(req, res, next) {

        var firstName = req.body.firstName;
        var lastName = req.body.lastName;
        var ssn = req.body.ssn;
        var dob = req.body.dob;
        var address = req.body.address;
        var bankAcc = req.body.bankAcc;
        var bankRouting = req.body.bankRouting;

        var userId = req.session.userId;
        var userIdClean = sanitize(userId);
        var lastName = sanitize(lastName);
        var ssn = sanitize(ssn);
        var dob = sanitize(dob);
        var address = sanitize(address);
        var bankAcc = sanitize(bankAcc);
        var bankRouting = sanitize(bankRouting);

        profile.updateUser(
            parseInt(userIdClean),
            firstName,
            lastName,
            ssn,
            dob,
            address,
            bankAcc,
            bankRouting,
            function(err, user) {

                if (err) return next(err);

                // WARN: Applying any sting specific methods here w/o checking type of inputs could lead to DoS by HPP
                //firstName = firstName.trim();
                user.updateSuccess = true;
                user.userIdClean = userIdClean;

                return res.render("profile", user);
            }
        );

    };

}

module.exports = ProfileHandler;
