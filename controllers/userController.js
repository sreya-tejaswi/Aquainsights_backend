const User = require("../models/User");
const bcrypt = require("bcrypt");
const auth = require("../auth");

module.exports.checkEmailExists = (reqBody) => {
	
	return User.find({ email: reqBody.email }).then(result => {
		if(result.length > 0){
			
			return true
		} else {
			
			return false
		
		}
	})
}

module.exports.registerUser = (reqBody) => {
	console.log(reqBody);

	let newUser = new User({
		firstName: reqBody.firstName,
		lastName: reqBody.lastName,
		email: reqBody.email,
		mobileNo: reqBody.mobileNo,
		password: bcrypt.hashSync(reqBody.password, 10)
	});

	return newUser.save()
		.then(user => {
			// Successfully saved user
			return { success: true, message: 'User registered successfully' };
		})
		.catch(error => {
			// Error while saving user
			console.error(error);
			return { success: false, message: 'Registration failed', error: error.message };
		});
}

module.exports.loginUser = (reqBody) => {

	return User.findOne({ email: reqBody.email }).then(result => {

		console.log(result);

		if(result == null){

			return false;

		} else {

			const isPasswordCorrect = bcrypt.compareSync(reqBody.password, result.password);
			console.log(result);
			if(isPasswordCorrect){

				let accessData = { access: auth.createAccessToken(result) };
				console.log(accessData);

				if (result.isAdmin) {
					accessData.isAdmin = true; // Set isAdmin to true if the user is an admin
				}

				return accessData;

			} else {

				return false;

			}

		}
	});
};


module.exports.getProfile = (data) => {
  return User.findOne({ _id: data.userId }).then(result => {
    if (result == null) {
      return false;
    } else {
      result.password = "";
      return result;
    }
  });
};


module.exports.makeUserAdmin = (reqBody) => {
  return User.findById(reqBody.userId)
    .then((user) => {
      if (!user) {
        return { success: false, message: "User not found." };
      }
      user.isAdmin = true;
      return user.save().then(() => {
        return { success: true, message: "User is now an admin." };
      });
    })
    .catch((error) => {
      console.error(error);
      return { success: false, message: "An error occurred while making the user an admin." };
    });
};

