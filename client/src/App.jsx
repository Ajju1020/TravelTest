import React, { useState } from "react";
import { AuthProvider } from "./context/AuthContext";
import { BookingProvider, useBooking } from "./context/BookingContext";
import { TestProvider } from "./context/TestContext";

import { Sidebar } from "./components/layout/Sidebar";
import { Navbar } from "./components/layout/Navbar";
import { Toast } from "./components/common/Toast";
import { LiveRunnerModal } from "./components/testing/LiveRunnerModal";
import { TicketPassModal } from "./components/booking/TicketPassModal";
import { LoginModal } from "./components/common/LoginModal";

import { Dashboard } from "./pages/Dashboard";
import { BusTrainBooking } from "./pages/BusTrainBooking";
import { MovieBooking } from "./pages/MovieBooking";
import { CabBooking } from "./pages/CabBooking";
import { EventBooking } from "./pages/EventBooking";
import { PaymentPage } from "./pages/PaymentPage";
import { PaymentStatus } from "./pages/PaymentStatus";
import { PaymentDashboard } from "./pages/PaymentDashboard";
import { TestAutomation } from "./pages/TestAutomation";
import { TestReports } from "./pages/TestReports";
import { BookingHistory } from "./pages/BookingHistory";
import { SettingsAdmin } from "./pages/SettingsAdmin";

function MainContent({ activeTab, setActiveTab }) {
  const { paymentResult, setPaymentResult } = useBooking();

  const renderPage = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard setActiveTab={setActiveTab} />;
      case "bus_train":
        return <BusTrainBooking setActiveTab={setActiveTab} />;
      case "movie":
        return <MovieBooking setActiveTab={setActiveTab} />;
      case "cab":
        return <CabBooking setActiveTab={setActiveTab} />;
      case "event":
        return <EventBooking setActiveTab={setActiveTab} />;
      case "payment":
        return <PaymentPage setActiveTab={setActiveTab} setPaymentResult={setPaymentResult} />;
      case "payment_status":
        return <PaymentStatus result={paymentResult} setActiveTab={setActiveTab} />;
      case "payment_mgmt":
        return <PaymentDashboard />;
      case "automation":
        return <TestAutomation />;
      case "reports":
        return <TestReports />;
      case "history":
        return <BookingHistory />;
      case "settings":
        return <SettingsAdmin />;
      default:
        return <Dashboard setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto">
          {renderPage()}
        </main>
      </div>

      {/* Global Modals & Overlays */}
      <LiveRunnerModal />
      <TicketPassModal />
      <LoginModal />
      <Toast />
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <AuthProvider>
      <BookingProvider>
        <TestProvider>
          <MainContent activeTab={activeTab} setActiveTab={setActiveTab} />
        </TestProvider>
      </BookingProvider>
    </AuthProvider>
  );
}
