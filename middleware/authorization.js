import JWT from "jsonwebtoken"

export const authorization = (req,res,next)=>{
    try{const authHeader = req.headers.authorization
      if(!authHeader){
        return res.status(400).json({
          message:"authorization header missing"
        })
    }

      const parts = authHeader.split(" ")
      if(parts.length !== 2 || parts[0] !=="Bearer"){
        return res.status(400).json({
            message:"Invalid authorization format"
        })
      }

      const token = parts[1]
      if(!token){
        return res.status(400).json({
          message:"Token is Missing"
        })
      }
      const decoded = JWT.verify(token,process.env.JWT_SECRET)

      req.user = decoded
      next()
      }catch(error){
        return res.status(400).json({
            message:"invalid Token",
            error:error.message
        })
      }
}