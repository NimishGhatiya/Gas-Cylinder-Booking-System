const jwt = require("jsonwebtoken");

module.exports.verifyToken = function (req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) res.status(400).json("Token Not Provided");
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).json("Invalid Token");
  }
};

module.exports.authRole_Super_Admin = (req, res, next) => {
  this.verifyToken(req, res, () => {
    if (req.user.Role === "super_admin") {
      next();
    } else {
      res
        .status(401)
        .json("you are not allow to auth <<<<>>>>>> only allow to super_admin");
    }
  });
};

module.exports.authRole_Company_Admin = (req, res, next) => {
  this.verifyToken(req, res, () => {
    if (req.user.Role == "company_admin" || req.user.Role == "super_admin") {
      next();
    } else {
      res
        .status(401)
        .json(
          "you are not allow to auth <<<<<<>>>>>>> only allow to company Admin"
        );
    }
  });
};

module.exports.authRole_distributor_Admin = (req, res, next) => {
  this.verifyToken(req, res, () => {
    if (req.user.Role == "distributor_admin") {
      next();
    } else {
      res
        .status(401)
        .json(
          "you are not allow to auth <<<<<<>>>>>>> only allow to distributor admin"
        );
    }
  });
};

module.exports.authRole_customer_Admin = (req, res, next) => {
  this.verifyToken(req, res, () => {
    if (req.user.Role == "customer") {
      next();
    } else {
      res
        .status(401)
        .json("you are not allow to auth <<<<<<>>>>>>> only allow to customer");
    }
  });
};
