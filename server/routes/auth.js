import express from "express";

const router = express.Router();

const DEMO_USERS = [
  {
    id: "usr_qa_01",
    name: "Alex Mercer",
    email: "alex.qa@traveltest.com",
    role: "Lead QA Automation Engineer",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
  },
  {
    id: "usr_dev_02",
    name: "Priya Sharma",
    email: "priya.s@traveltest.com",
    role: "Full-Stack Test Engineer",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80"
  }
];

let currentUser = DEMO_USERS[0];

router.get("/me", (req, res) => {
  res.json({ success: true, user: currentUser });
});

router.post("/login", (req, res) => {
  const { email } = req.body;
  const found = DEMO_USERS.find(u => u.email.toLowerCase() === (email || "").toLowerCase());
  currentUser = found || {
    id: "usr_" + Date.now(),
    name: req.body.name || (email ? email.split("@")[0] : "Demo Tester"),
    email: email || "tester@traveltest.com",
    role: req.body.role || "QA Automation Engineer",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80"
  };
  res.json({ success: true, user: currentUser });
});

router.post("/logout", (req, res) => {
  res.json({ success: true, message: "Logged out successfully" });
});

export default router;
