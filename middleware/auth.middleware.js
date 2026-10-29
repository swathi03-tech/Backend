const jwt = require('jsonwebtoken');

function authMiddleware(req,res,next)
{
  const authorization = req.headers.authorization;
  const [schema, token] = authorization ? authorization.split(" ") : [];
  if(schema !== "Bearer" || !token)
  {
    return res
    .status(401)
    .json({message : "Authorization token is required"});

  }
  const secretKey = process.env.JWT_SECRET

  if(!secretKey)
  {
    return next(new Error('Jwt secret is not defined'));
  }
  try 
    {
        req.user= jwt.verify(token,secretKey);
        return  next();
    }
    
       catch (error) {
    console.log("JWT ERROR:", error.name, error.message);

    return res.status(401).json({
        message: "token is either expired or invalid"
    });
}
}
module.exports = authMiddleware;
