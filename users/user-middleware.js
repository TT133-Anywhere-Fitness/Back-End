const jwt = require("jsonwebtoken");

function restrict(role) {
  const roles = ["client", "instructor"];
  return async (req, res, next) => {
    const authError = {
      Message: "Invalid Credentials",
    };

    try {
      // const token = req.cookies.token;
      const token = req.headers.authorization;

      // console.log(req.headers);
      if (!token) {
        return res.status(401).json({ Error: "You are missing a token" });
      }

      /*  decode the token, resign the payload, check if signature is valid  */
      jwt.verify(token, "this is our secret", (err, decoded) => {
        console.log(decoded);
        if (err) {
          return res
            .status(401)
            .json({ Error: "Please check decoded token payoad and signature" });
        }
        /*  check userrole should =  role  */

        if (role && roles.indexOf(decoded.userRole) < roles.indexOf(role)) {
          return res.status(403).json({
            Forbidden: "You are not allowed here",
          });
        }

        /*   we know the user is authorized at this point  */
        /*  make the tokens payload avail to other middleware functions  */
        req.token = decoded;
        next();
      });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = restrict;