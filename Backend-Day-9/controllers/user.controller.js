const UserService = require("../services/user.services");

class UserController{
    async signup(req,res)
    {
        try{
            const {name, email, password}=req.body;
        if (!name || !email || !password)
        {
            return res.status(400).json({message : "All fields are required"});
        }
        const result = await UserService.signup(name, email, password);
        return res.status(201).json({message:"User created successfully", data: result});
        } 
        catch(error)
        {
            console.log(error.message);
            return res.status(500).json({message: error.message})
        }

        
    }
        async login(req, res)
        {
            try{
                const{ email, password}= req.body;
                if(!email || !password)
                {
                    return res
                    .status(400)
                    .json({message:`Both "email" and "password" are required`});
                }

                const loginData = await UserService.loginUser(email,password);
        return res.status(200).json(loginData);


         }
          catch (error) 
        {
            console.log(error.message);
            return res
            .status(401)
            .json({
                error: error.message
            }); 
        }
    }
    async getAllUser(req, res) {
        try {
            const users = await UserService.getAllUser();

            return res.status(200).json({
                message: "Users fetched successfully",
                data: users
            });
        } catch (error) {
            console.log(error.message);

            return res.status(500).json({
                message: "Failed to fetch users",
                error: error.message
            });
        }
    }
    
    async updateUser(req, res) {
        try {
            const updatedUser = await UserService.updateUser(
                req.params.id,
                req.body
            );

            return res.status(200).json({
                message: "User updated successfully",
                data: updatedUser
            });
        } catch (error) {
            console.log(error.message);

            const status = error.name === "CastError"
                ? 400
                : error.message === "User not found"
                    ? 404
                    : error.message === "Email already exists"
                        ? 409
                        : 400;

            return res.status(status).json({
                message: error.message
            });
        }
    }

    async deleteUser(req, res) {
        try {
            const result = await UserService.deleteUser(req.params.id);

            return res.status(200).json(result);
        } catch (error) {
            console.log(error.message);

            const status = error.name === "CastError"
                ? 400
                : error.message === "User not found"
                    ? 404
                    : 500;

            return res.status(status).json({
                message: error.message
            });
        }
    }

    async softDeleteUser(req, res) {
        try {
            const result = await UserService.softDeleteUser(
                req.params.id
            );

            return res.status(200).json(result);
        } catch (error) {
            console.log(error.message);

            const status = error.name === "CastError"
                ? 400
                : error.message.includes("User not found")
                    ? 404
                    : 500;

            return res.status(status).json({
                message: error.message
            });
        }
    }

    async addUserProfile(req,res)
    {
        try{
            const userId = req.user.id
            const {age, dob, blo} = req.body;
            if(!userId)
            {
              return res.status(400).json({ message: 'Usr Id is required'});
            }

            const newUserProfile = await UserService.addUserProfile(userId, { age, dob, blo});
            res.status(201).json(newUserProfile);

        }
        catch(err){
            if(err.code == 11000)
            {
                return res
                 .status(400)
                 .json({message: "A profile for this user already exist"});            }
            
        
        console.log(err);
        res.status(400).json({ error: err.message});
    }
}

}


module.exports = new UserController();