import jwt from 'jsonwebtoken'


const isAuth = async(req ,res,next)=>{
      try {
            console.log('Cookies:', req.cookies)

            let token = req.cookies.token

            console.log('token',token)
            if(!token)
            {
                  return res.send({message:'token not found !!'})
            }

            let verifyToken = await jwt.verify(token,process.env.JWT_SECRET)

            if(!verifyToken)
            {
                  return res.status(401).json({message : "Invalid Token"})
            }
            // console.log('verifyToken',verifyToken)

            req.userId = verifyToken.userId

            next()
      } 
      catch (error) {
            console.log("is Auth error")
            return res.status(500).json({message : `is Auth error ${error.message}`})
      }
}


export default isAuth