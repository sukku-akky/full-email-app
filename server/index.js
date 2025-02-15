const express = require("express");
const signupModel = require("./models/Signup");
const emailModel = require("./models/Email");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const app = express();
const jwt = require("jsonwebtoken");
const SECRET_KEY = "yourSecretKey";
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods:["POST","GET","PUT","DELETE"],
    credentials:true,
  })
);
const DB =
  "mongodb+srv://sukku:sukku%2Aakky1@cluster0.clet2.mongodb.net/mernMailBox?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connection successfull");
  })
  .catch((err) => {
    console.log("no connection", err.message);
  });

app.listen(8000, () => {
  console.log("listening on 8000");
});

app.get("/", (req, res) => {
  res.send("hy");
});

app.post("/signup", async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existingUser = await signupModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Account already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await signupModel.create({
      email,
      password: hashedPassword,
      confirmPassword: hashedPassword,
    });

    res.json({ message: "User created successfully", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await signupModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check if the password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id, email: user.email }, SECRET_KEY, {
      expiresIn: "1h",
    });

    // If credentials are correct, respond with success message or token
    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/sendEmail", async (req, res) => {
  console.log("Request body:", req.body);
  try {
    const { sender, recipient, subject, message } = req.body;

    // Create a new email document using the emailModel
    const newEmail = await emailModel.create({
      sender,
      recipient,
      subject,
      message,
    });

    res
      .status(200)
      .json({ message: "Email sent successfully", email: newEmail });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET endpoint to retrieve inbox emails for a recipient
app.get("/inbox/:recipientEmail", async (req, res) => {
  const { recipientEmail } = req.params;

  try {
    const inboxEmails = await emailModel
      .find({ recipient: recipientEmail })
      .sort({ timestamp: -1 });
    res.json(inboxEmails);
  } catch (error) {
    res.status(500).json({ error: `Error retrieving inbox:${error.message} ` });
  }
});

// API endpoint to retrieve sent emails
app.get("/sent/:senderEmail", async (req, res) => {
  const { senderEmail } = req.params;
  console.log("Sender Email:", senderEmail);
  try {
    const sentEmails = await emailModel
      .find({ sender: senderEmail })
      .sort({ sentAt: -1 });
    res.json(sentEmails);
  } catch (error) {
    console.error("Error retrieving sent emails:", error);
    res
      .status(500)
      .json({ error: `Error retrieving sent emails:${error.message}` });
  }
});

app.put("/email/read/:emailId", async (req, res) => {
  try {
    const { emailId } = req.params;
    const { isSender } = req.body;

    const email = await emailModel.findById(emailId);

    if (!email) {
      return res.status(404).json({ error: "Email not found" });
    }

    if (isSender) {
      email.isReadSender = true;
    } else {
      email.isReadReceiver = true;
    }
    await email.save();
    res.json(email);
  } catch (e) {
    console.error("Error marking email as read:", error);
    res.status(500).json({ error: "Failed to mark email as read" });
  }
});

// Delete email conditionally based on sender or receiver
app.delete("/email/delete/:emailId/:isSender", async (req, res) => {
  try {
    const { emailId, isSender } = req.params;

    
    const email = await emailModel.findById(emailId);

    if (!email) {
      return res.status(404).json({ error: "Email not found" });
    }

    
    const isSenderFlag = isSender === "true"; // Convert to boolean

    if (isSenderFlag) {
      email.deletedBySender = true;
    } else {
      email.deletedByRecipient = true;
    }

    
    if (email.deletedBySender && email.deletedByRecipient) {
      await email.deleteOne(); // Permanently delete from database
      res.json({ message: "Email fully deleted" });
    } else {
      await email.save(); // Save the deletion status update
      res.json({ message: "Email marked as deleted for user" });
    }
  } catch (error) {
    console.error("Error deleting email:", error);
    res.status(500).json({ error:error.message ||  "Failed to delete email" });
  }
});
