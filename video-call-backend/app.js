const express = require("express");
const UserModel = require("./models/UserModel")

const app = express();

const socket = require("socket.io");
const userRoute = require("./routes/userRoute")

const cors = require("cors")

app.use(express.json())
app.use(cors())

const mongoose = require("mongoose");
const User = require("./models/UserModel");
app.use("/user", userRoute)

mongoose.connect("mongodb://localhost/videoCall", { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true }).then(() => console.log("Mongo Database Connected"))



let server = app.listen(8000, () => console.log('server is running on port 8000'))
const io = socket(server);


//Socket Configuration


io.sockets.on("connect", (socket) => {

    socket.on("newUser", async email => {
        await UserModel.updateOne({ email }, { socketId: socket.id, online: true })
    })

    console.log("socket connected to frontend")
    socket.on("outgoingCall", async detail => {
        const user = await UserModel.findOne({ email: detail.receiver.email })
        console.log("working...")
        if (!user.socketId)
            socket.emit("outgoingCallActionFromServer", { online: false })
        else {

            io.to(socket.id).emit("outgoingCallActionFromServer", { online: true, socketId: user.socketId })
            io.to(user.socketId).emit("incomingCall", { ...detail.sender, socketId: socket.id })
        }



    })

    socket.on("outgoingCallActionFromReceiver", actionDetails => {
        io.to(actionDetails.user.socketId).emit("outgoingCallAction", actionDetails.accept)

    })


    //Simple Peer Events

    socket.on("signalReceiver", detail => {
        console.log(1)
        console.log(detail.senderId)
        io.to(detail.senderId).emit("signalReceiverBackend", detail.signal)
    })

    socket.on("senderSignal", detail => {
        console.log(2)
        io.to(detail.receiverId).emit("signalSenderBackend", detail.signal)
    })

    socket.on("disconnect", async () => {
        await UserModel.updateOne({ socketId: socket.id }, { socketId: "", online: false })

    })
})
