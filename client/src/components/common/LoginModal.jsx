import React, { useState } from "react";
import { Modal } from "./Modal";
import { useAuth } from "../../context/AuthContext";
import { useBooking } from "../../context/BookingContext";
import { User, Mail, Lock, ShieldCheck, Sparkles } from "lucide-react";

export const LoginModal = () => {
  const { user, login, isAuthModalOpen, setIsAuthModalOpen } = useAuth();
  const { showToast } = useBooking();

  const [mode, setMode] = useState("login"); // "login" or "register"
  const [name, setName] = useState("Alex Mercer");
  const [email, setEmail] = useState("alex.mercer@traveltest.com");
  const [role, setRole] = useState("Lead QA Automation Engineer");

  const handleSubmit = (e) => {
    e.preventDefault();
    login({
      id: "usr_" + Date.now(),
      name,
      email,
      role,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
    });
    showToast(`Logged in successfully as ${name} (${role})`, "success");
  };

  const handleQuickDemoUser = (demoName, demoEmail, demoRole) => {
    setName(demoName);
    setEmail(demoEmail);
    setRole(demoRole);
    login({
      id: "usr_" + Date.now(),
      name: demoName,
      email: demoEmail,
      role: demoRole,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
    });
    showToast(`Switched profile to ${demoName}`, "success");
  };

  return (
    <Modal
      isOpen={isAuthModalOpen}
      onClose={() => setIsAuthModalOpen(false)}
      title={mode === "login" ? "TravelTest Authentication" : "Create Tester Account"}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "register" && (
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
            Email Address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
            Role / Designation
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="Lead QA Automation Engineer">Lead QA Automation Engineer</option>
            <option value="Senior SDET / Test Architect">Senior SDET / Test Architect</option>
            <option value="Full-Stack Developer">Full-Stack Developer</option>
            <option value="College Project Reviewer">College Project Reviewer</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 shadow-md shadow-brand-500/20 transition mt-2"
        >
          {mode === "login" ? "Sign In & Continue" : "Register Profile"}
        </button>

        {/* Quick Demo Switcher */}
        <div className="pt-3 border-t border-slate-100">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Quick Demo Profiles
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoUser("Alex Mercer", "alex@traveltest.com", "Lead QA Automation Engineer")}
              className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left text-[11px] font-bold text-slate-800"
            >
              Alex (Lead QA)
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoUser("Prof. Verma", "evaluator@university.edu", "College Project Reviewer")}
              className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left text-[11px] font-bold text-slate-800"
            >
              Evaluator (Reviewer)
            </button>
          </div>
        </div>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="text-xs font-semibold text-brand-600 hover:underline"
          >
            {mode === "login" ? "Need a new account? Register here" : "Already registered? Sign in"}
          </button>
        </div>
      </form>
    </Modal>
  );
};
