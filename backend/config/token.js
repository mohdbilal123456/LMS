import jwt from 'jsonwebtoken'

const genToken = (userId)=>{
      try {
            const token = jwt.sign({userId},process.env.JWT_SECRET,{expiresIn:'5d'})
            // console.log("Token file",token)
            
            return token
      } 
      catch (error) {
            console.log("Token Error" ,error)
      }
}

export default genToken