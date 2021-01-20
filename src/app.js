const express = require("express");
const path = require("path")
const app = express();


app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")))

const PORT = 3000
const server = app.listen(PORT, () => {
    console.log(`Server listening on ${PORT} `)
})

const io = require("socket.io")(server);

let clientsConnected = new Set()
io.on("connection", onConnected)

function onConnected(socket) {
    console.log(socket.id)
    clientsConnected.add(socket.id)
    io.emit("client-total", clientsConnected.size)

    socket.on("disconnect", () => {
        console.log("Disconnected", socket.id)
        clientsConnected.delete(socket.id);
        io.emit("client-total", clientsConnected.size)
    })


    socket.on("message-sent", (data) => {
        socket.broadcast.emit("chat-message", data)
    })

    socket.on("feedback", (data) => {
        socket.broadcast.emit("typed", data)
    })
}