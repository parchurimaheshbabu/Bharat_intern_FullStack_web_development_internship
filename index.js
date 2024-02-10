const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const dotenv = require("dotenv");
const path = require("path");

const app = express();
dotenv.config();

const PORT = process.env.PORT || 9010;
const username = process.env.DBUSER;
const password = process.env.DBPASSWORD;

mongoose
  .connect(
    `mongodb+srv://${username}:${password}@cluster0.y4ctmmh.mongodb.net/?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("DB CONNECTED");
  });

const registerschema = new mongoose.Schema({
  name: String,
  email: String,
  mobile: String,
  password: String,
  confirm: String,
});

const Registration = mongoose.model("Registration", registerschema);
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/register/form.html"));
});

app.post("/register", async (req, res) => {
  try {
    const { name, email, mobile, password, confirm } = req.body;

    const exist = await Registration.findOne({ email });
    if (exist) {
      return res.status(400).send("User Already Registered");
    }
    if (password != confirm) {
      return res.status(403).send("Passsword Invalid");
    }

    const registrationdata = new Registration({
      name,
      email,
      mobile,
      password,
      confirm,
    });
    await registrationdata.save();
    res.redirect("/success");
  } catch (err) {
    console.log(err);
    res.redirect("/error");
  }
});

app.get("/success", (req, res) => {
  res.sendFile(path.join(__dirname, "/register/success.html"));
});

app.get("/error", (req, res) => {
  res.sendFile(path.join(__dirname, "/register/error.html"));
});

app.listen(PORT, () => {
  console.log(`Server Is Running On Port ${PORT}`);
});
