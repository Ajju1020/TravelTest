import React, { useState, useEffect } from "react";
import {
  Settings,
  Bug,
  RotateCcw,
  Zap,
  ShieldAlert,
  CheckCircle2,
  Cpu,
  Database,
  Sliders,
  AlertTriangle
} from "lucide-react";
import { useBooking } from "../context/BookingContext";
import { useTest } from "../context/TestContext";

export const SettingsAdmin = () => {
  const { showToast, refreshBookings } = useBooking();
  const { refreshCases, refreshHistory } = useTest();

  const [bugSettings, setBugSettings] = useState({
    allowSameSourceDest: false,
    movieSeatDoubleBooking: false,
    cabFareMultiplierGlitch: false,
    bypassDuplicateEventEmail: false
  });

  const [speedDelay, setSpeedDelay] = useState(250);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setBugSettings(data.bugSettings);
          if (data.executionConfig) {
            setSpeedDelay(data.executionConfig.speedDelayMs || 250);
          }
        }
      })
      .catch(() => {});
  }, []);

  const handleToggleBug = async (bugKey) => {
    const updated = { ...bugSettings, [bugKey]: !bugSettings[bugKey] };
    setBugSettings(updated);

    try {
      const res = await fetch("/api/settings/bugs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated)
      });
      const json = await res.json();
      if (json.success) {
        showToast(
          updated[bugKey]
            ? `Injected Defect: ${bugKey} is now ACTIVE. Automated tests will catch this!`
            : `Defect resolved: ${bugKey} turned OFF. Tests will now pass.`,
          updated[bugKey] ? "info" : "success"
        );
      }
    } catch (e) {
      showToast("Failed to update bug injection state", "error");
    }
  };

  const handleSpeedChange = async (ms) => {
    setSpeedDelay(ms);
    try {
      await fetch("/api/settings/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ speedDelayMs: ms })
      });
      showToast(`Test execution pacing set to ${ms}ms per assertion step.`, "success");
    } catch (e) {}
  };

  const handleResetData = async () => {
    if (!window.confirm("Reset all test history, bookings, and bug injections back to initial defaults?")) {
      return;
    }

    setIsResetting(true);
    try {
      const res = await fetch("/api/settings/reset", { method: "POST" });
      const json = await res.json();
      if (json.success) {
        setBugSettings({
          allowSameSourceDest: false,
          movieSeatDoubleBooking: false,
          cabFareMultiplierGlitch: false,
          bypassDuplicateEventEmail: false
        });
        showToast("System state reset to clean seed defaults.", "success");
        refreshBookings();
        refreshCases();
        refreshHistory();
      }
    } catch (e) {
      showToast("Failed to reset system data", "error");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Admin & Test Automation Bench
            </h2>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Simulate software bugs, tune Playwright test speed, and reset data sets for demonstration
          </p>
        </div>

        <button
          onClick={handleResetData}
          disabled={isResetting}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200 hover:border-rose-200 font-bold text-xs transition"
        >
          <RotateCcw className={`w-4 h-4 ${isResetting ? "animate-spin" : ""}`} />
          <span>Reset Platform State</span>
        </button>
      </div>

      {/* Flagship Feature: Defect Injection Simulator */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-rose-600 font-extrabold text-base">
              <Bug className="w-5 h-5" />
              <span>Defect Injection Simulator (Live Demonstration Mode)</span>
            </div>
            <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
              Toggle deliberate software defects into the booking system to prove to evaluators that your Playwright test automation suite detects regressions, catches bugs, logs assertion mismatches, and passes once resolved!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Bug 1 */}
          <div
            onClick={() => handleToggleBug("allowSameSourceDest")}
            className={`p-5 rounded-2xl border cursor-pointer transition-all flex items-start justify-between ${
              bugSettings.allowSameSourceDest
                ? "bg-rose-50/70 border-rose-300 ring-2 ring-rose-500/20"
                : "bg-slate-50 border-slate-200 hover:bg-slate-100"
            }`}
          >
            <div className="space-y-1 pr-4">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold bg-white px-2 py-0.5 rounded border border-slate-200">
                  TC-BT-01
                </span>
                <h4 className="text-xs font-bold text-slate-900">
                  Allow Identical Source & Destination in Bus/Train
                </h4>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Bypasses city inequality check, causing test TC-BT-01 to FAIL on assertion.
              </p>
            </div>
            <input
              type="checkbox"
              checked={bugSettings.allowSameSourceDest}
              onChange={() => {}}
              className="w-5 h-5 text-rose-600 rounded focus:ring-rose-500 mt-1 cursor-pointer shrink-0"
            />
          </div>

          {/* Bug 2 */}
          <div
            onClick={() => handleToggleBug("movieSeatDoubleBooking")}
            className={`p-5 rounded-2xl border cursor-pointer transition-all flex items-start justify-between ${
              bugSettings.movieSeatDoubleBooking
                ? "bg-rose-50/70 border-rose-300 ring-2 ring-rose-500/20"
                : "bg-slate-50 border-slate-200 hover:bg-slate-100"
            }`}
          >
            <div className="space-y-1 pr-4">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold bg-white px-2 py-0.5 rounded border border-slate-200">
                  TC-MV-04
                </span>
                <h4 className="text-xs font-bold text-slate-900">
                  Allow Double-Booking of Reserved Movie Seats
                </h4>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Permits users to click seat D4 (already booked), causing TC-MV-04 to FAIL.
              </p>
            </div>
            <input
              type="checkbox"
              checked={bugSettings.movieSeatDoubleBooking}
              onChange={() => {}}
              className="w-5 h-5 text-rose-600 rounded focus:ring-rose-500 mt-1 cursor-pointer shrink-0"
            />
          </div>

          {/* Bug 3 */}
          <div
            onClick={() => handleToggleBug("cabFareMultiplierGlitch")}
            className={`p-5 rounded-2xl border cursor-pointer transition-all flex items-start justify-between ${
              bugSettings.cabFareMultiplierGlitch
                ? "bg-rose-50/70 border-rose-300 ring-2 ring-rose-500/20"
                : "bg-slate-50 border-slate-200 hover:bg-slate-100"
            }`}
          >
            <div className="space-y-1 pr-4">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold bg-white px-2 py-0.5 rounded border border-slate-200">
                  TC-CB-05
                </span>
                <h4 className="text-xs font-bold text-slate-900">
                  Cab Fare Calculation Multiplier Glitch (3x)
                </h4>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Triples the computed sedan fare, failing TC-CB-05 assertion math.
              </p>
            </div>
            <input
              type="checkbox"
              checked={bugSettings.cabFareMultiplierGlitch}
              onChange={() => {}}
              className="w-5 h-5 text-rose-600 rounded focus:ring-rose-500 mt-1 cursor-pointer shrink-0"
            />
          </div>

          {/* Bug 4 */}
          <div
            onClick={() => handleToggleBug("bypassDuplicateEventEmail")}
            className={`p-5 rounded-2xl border cursor-pointer transition-all flex items-start justify-between ${
              bugSettings.bypassDuplicateEventEmail
                ? "bg-rose-50/70 border-rose-300 ring-2 ring-rose-500/20"
                : "bg-slate-50 border-slate-200 hover:bg-slate-100"
            }`}
          >
            <div className="space-y-1 pr-4">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold bg-white px-2 py-0.5 rounded border border-slate-200">
                  TC-EV-07
                </span>
                <h4 className="text-xs font-bold text-slate-900">
                  Bypass Event Duplicate Email Integrity Check
                </h4>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Allows duplicate registrations for already registered emails, failing TC-EV-07.
              </p>
            </div>
            <input
              type="checkbox"
              checked={bugSettings.bypassDuplicateEventEmail}
              onChange={() => {}}
              className="w-5 h-5 text-rose-600 rounded focus:ring-rose-500 mt-1 cursor-pointer shrink-0"
            />
          </div>
        </div>
      </div>

      {/* Execution Pacing & Environment Specs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Speed Controls */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 text-slate-900 font-extrabold text-base">
            <Sliders className="w-5 h-5 text-brand-600" />
            <span>Test Execution Pacing (Slow-Motion Demo)</span>
          </div>
          <p className="text-xs text-slate-500">
            Adjust delay per assertion step so you can watch live logs stream during presentations.
          </p>

          <div className="grid grid-cols-3 gap-3 pt-2">
            {[
              { label: "Turbo Fast", ms: 50, desc: "Fastest execution" },
              { label: "Normal Pace", ms: 250, desc: "Default balanced" },
              { label: "Demo Slow-Mo", ms: 600, desc: "Watch steps unfold" }
            ].map((spd) => (
              <button
                key={spd.ms}
                type="button"
                onClick={() => handleSpeedChange(spd.ms)}
                className={`p-3 rounded-2xl border text-left transition ${
                  speedDelay === spd.ms
                    ? "bg-brand-600 text-white border-brand-600 shadow-md shadow-brand-500/20"
                    : "bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100"
                }`}
              >
                <p className="font-extrabold text-xs">{spd.label}</p>
                <p
                  className={`text-[10px] mt-0.5 ${
                    speedDelay === spd.ms ? "text-brand-100" : "text-slate-400"
                  }`}
                >
                  {spd.desc}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* System & Playwright Environment Info */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 text-slate-900 font-extrabold text-base">
            <Cpu className="w-5 h-5 text-emerald-600" />
            <span>Environment Telemetry</span>
          </div>
          <p className="text-xs text-slate-500">
            Underlying runtime versions and browser automation hooks
          </p>

          <div className="space-y-2 text-xs pt-1">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-400 font-medium">Node.js Runtime</span>
              <span className="font-mono font-bold text-slate-800">v24.16.0 (LTS)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-400 font-medium">Playwright Engine</span>
              <span className="font-mono font-bold text-slate-800">v1.49.1 / v1.65.1</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-400 font-medium">Active Browser Channels</span>
              <span className="font-bold text-emerald-600">Google Chrome & MS Edge (Native)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-400 font-medium">Database Persistence</span>
              <span className="font-mono font-bold text-slate-800">Local JSON Store Engine</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
