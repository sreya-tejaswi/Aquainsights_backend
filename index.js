const express = require("express");
const mongoose = require("mongoose");

const userRoutes = require("./routes/userRoute.js");
const cors = require("cors");

const app = express();

mongoose.connect("mongodb+srv://cs21b041:wA7CPXJeVjLY77YJ@cluster0.jimho.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
	{
		useNewUrlParser: true,
		useUnifiedTopology: true
	}
);

mongoose.connection.once("open", () => console.log("Now connected in the cloud."));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.listen(process.env.PORT || 4000, () => {
	console.log(`API is now online on port ${process.env.PORT || 4000}`)
});

app.use("/users", userRoutes);
