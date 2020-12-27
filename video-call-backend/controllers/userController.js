const UserModel = require("../models/UserModel")

exports.getUser = async (req, res) => {

    let email = req.params.email;
    try {

        const User = await UserModel.findOne({ email }).populate("contacts");
        res.status(200).json({
            status: "success",
            data: User
        })
    }
    catch (err) {

        res.status(404).json({
            status: "failed",
            data: err.message
        })

    }


}

exports.createUser = async (req, res) => {
    const User = req.body;
    console.log(req.body)
    try {
        let newUser = new UserModel(User)
        let data = await newUser.save()
        console.log(data)
        res.status(200).json({
            status: "Success",
            data
        })
    }
    catch (err) {
        res.status(401).json({
            status: "Error",
            message: err.message

        })
    }

}

exports.updateUser = async (req, res) => {
    let email = req.params.email;
    console.log(req.body)

    try {
        const data = await UserModel.findOneAndUpdate(email, req.body)
        res.status(200).json({
            status: "Success",
            data

        })

    }
    catch (err) {
        res.status(401).json({
            status: "Error",
            message: err.message

        })
    }

}


exports.deleteUser = async (req, res) => {
    const id = req.params.id;

    try {
        const data = await UserModel.findByIdAndDelete(id)
        res.status(200).json({
            status: "Success",
            data

        })

    }
    catch (err) {
        res.status(401).json({
            status: "Error",
            message: err.message

        })
    }

}

