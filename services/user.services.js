// const { default: mongoose } = require("mongoose");
// const tokenService = require("../jwt/token.service");
// const User = require("../models/user.model");
// const bcrypt = require('bcrypt');
// const UserProfile = require("../models/user.profile.model")

// class UserService {
//     async signup(name, email, password)
//     {
//        const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             throw new Error("User already exists");
//         }
//         const hashedPassword = await bcrypt.hash(password,10);
//         const user = await User.create({name, email, password:hashedPassword});
//         return user;
//     }
//      async loginUser(email,password)
//      {
//         const user =await User.findOne({email}).select("+password");
//         if (!user)
//         {
//             throw new Error("User not found");
//         }
//         if(!user.isActive)
//         {
//             throw new Error('Account is inactive');

//         }
//         const isMatch = await bcrypt.compare(password, user.password);
//         if(!isMatch)
//         {
//             throw new Error("Invalid credentials");
//         }

//         const payload = 
//         {
//             id: user._id,
//             email: user.email,
//             isActive: user.isActive,
//         };

//         const token = tokenService.generateToken(payload);
//         const userWithoutPassword = user.toObject();
//         delete userWithoutPassword.password;
//         return { user: userWithoutPassword, token};
//      }

//         async getAllUser() {
//         const users = await User.find({
//             isDeleted: { $ne: true }
//         }).select("-password");

//         return users;
//     }
//      async updateUser(userId, updates) {
//         const user = await User.findOne({
//             _id: userId,
//             isDeleted: { $ne: true }
//         });

//         if (!user) {
//             throw new Error("User not found");
//         }

//         const allowedFields = ["name", "email", "password"];
//         const keys = Object.keys(updates);

//         if (keys.length === 0) {
//             throw new Error("Provide at least one field to update");
//         }

//         const invalidFields = keys.filter(
//             key => !allowedFields.includes(key)
//         );

//         if (invalidFields.length > 0) {
//             throw new Error("Only name, email, and password can be updated");
//         }

//         if (updates.name !== undefined) {
//             if (typeof updates.name !== "string" || !updates.name.trim()) {
//                 throw new Error("Name cannot be empty");
//             }
//             user.name = updates.name.trim();
//         }

//         if (updates.email !== undefined) {
//             if (typeof updates.email !== "string" || !updates.email.trim()) {
//                 throw new Error("Email cannot be empty");
//             }

//             const existingUser = await User.findOne({
//                 email: updates.email.trim(),
//                 _id: { $ne: userId }
//             });

//             if (existingUser) {
//                 throw new Error("Email already exists");
//             }

//             user.email = updates.email.trim();
//         }

//         if (updates.password !== undefined) {
//             if (
//                 typeof updates.password !== "string" ||
//                 updates.password.length < 6
//             ) {
//                 throw new Error("Password must be at least 6 characters");
//             }

//             user.password = await bcrypt.hash(updates.password, 10);
//         }

//         await user.save();

//         const result = user.toObject();
//         delete result.password;

//         return result;
//     }

//     async deleteUser(userId) {
//         const user = await User.findByIdAndDelete(userId);

//         if (!user) {
//             throw new Error("User not found");
//         }

//         return { message: "User permanently deleted successfully" };
//     }
//     async softDeleteUser(userId) {
//         const user = await User.findOne({
//             _id: userId,
//             isDeleted: { $ne: true }
//         });

//         if (!user) {
//             throw new Error("User not found or already deleted");
//         }

//         user.isDeleted = true;
//         await user.save();

//         return { message: "User soft deleted successfully" };
//     }
    

//     async addUserProfile(UserId, profileData)
//     {
//         if(!mongoose.isValidObjectId(UserId))
//         {
//             throw new Error("Invalid user ID");
//         }
//         const user = await User.findById(UserId);
//         if(!user)
//         {
//             throw new Error("User not found");
//         }

//         const userProfile = await UserProfile.create
//         ({
//             user: userId,
//             age: profileData.age,
//             dob: profileData.dob,
//             bio: profileData.blo, 
//         });
        
//         user.profile = userProfile._id;
//         await user.save();

//         return userProfile;
        
//     }
// }


// module.exports = new UserService();

const tokenService = require("../jwt/token.service");
const User = require("../models/user.model");
const UserProfile = require ('../models/user.profile.model')
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');


class UserService {
    async signup(name, email, password)
    {
       const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error("User already exists");
        }
        const hashedPassword = await bcrypt.hash(password,10);
        const user = await User.create({name, email, password:hashedPassword});
        return user;
    }
     async loginUser(email,password)
     {
        const user =await User.findOne({email}).select("+password");
        if (!user)
        {
            throw new Error("User not found");
        }

        if(!user.isActive){
            throw new Error('Account is inactive');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch)
        {
            throw new Error("Invalid credentials");
        }
        const payload = 
        {
            id: user._id,
            email: user.email,
            isActive: user.isActive,
        };

        const token = tokenService.generateToken(payload);
        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;
        return { user: userWithoutPassword, token};
     }

   async getAllUser() { 
    const users = await User.find({ isActive: true });
     console.log(users, "user data list");
      const userIds = users.map((user) => user._id); 
      const userProfiles = await UserProfile.find({
         user: { $in: userIds },
         }); 
      const usersWithProfiles = users.map((user) => { 
        const profile = userProfiles.find( 
            (profile) => profile.user.toString() === user._id.toString() ); 
        return {
             ...user.toObject(), 
             profile: profile || null, 
            };
         }); 
        return usersWithProfiles;
     }
     async updateUser(userId, updates) {
        const user = await User.findOne({
            _id: userId,
            isDeleted: { $ne: true }
        });

        if (!user) {
            throw new Error("User not found");
        }

        const allowedFields = ["name", "email", "password"];
        const keys = Object.keys(updates);

        if (keys.length === 0) {
            throw new Error("Provide at least one field to update");
        }

        const invalidFields = keys.filter(
            key => !allowedFields.includes(key)
        );

        if (invalidFields.length > 0) {
            throw new Error("Only name, email, and password can be updated");
        }

        if (updates.name !== undefined) {
            if (typeof updates.name !== "string" || !updates.name.trim()) {
                throw new Error("Name cannot be empty");
            }
            user.name = updates.name.trim();
        }

        if (updates.email !== undefined) {
            if (typeof updates.email !== "string" || !updates.email.trim()) {
                throw new Error("Email cannot be empty");
            }

            const existingUser = await User.findOne({
                email: updates.email.trim(),
                _id: { $ne: userId }
            });

            if (existingUser) {
                throw new Error("Email already exists");
            }

            user.email = updates.email.trim();
        }

        if (updates.password !== undefined) {
            if (
                typeof updates.password !== "string" ||
                updates.password.length < 6
            ) {
                throw new Error("Password must be at least 6 characters");
            }

            user.password = await bcrypt.hash(updates.password, 10);
        }

        await user.save();

        const result = user.toObject();
        delete result.password;

        return result;
    }

    async deleteUser(userId) {
        const user = await User.findByIdAndDelete(userId);

        if (!user) {
            throw new Error("User not found");
        }

        return { message: "User permanently deleted successfully" };
    }
    async softDeleteUser(userId) {
        const user = await User.findOne({
            _id: userId,
            isDeleted: { $ne: true }
        });

        if (!user) {
            throw new Error("User not found or already deleted");
        }

        user.isDeleted = true;
        await user.save();

        return { message: "User soft deleted successfully" };
    }
        async addUserProfile(UserId, profileData)
        {
            if(!mongoose.isValidObjectId(UserId))
            {
                throw new Error('Invalid User ID');
            }

            const user = await User.findById(UserId);

            if(!user) {
                throw new Error('User not found');
            }

            const userProfile = await UserProfile.create({
                user: UserId,
                age: profileData.age,
                dob: profileData.dob,
                bio: profileData.bio,
            });

            user.profile = userProfile._id;
            await user.save();

            return userProfile;
        }
}


module.exports = new UserService();