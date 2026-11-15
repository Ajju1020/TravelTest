export const testCases = [
  // Module 1: Bus and Train (7 cases)
  {
    id: "TC-BT-01",
    module: "bus_train",
    moduleTitle: "Bus & Train Reservation",
    title: "Verify source and destination selection",
    description: "Ensure source and destination cities can be selected and cannot be identical.",
    severity: "High",
    type: "Validation / Functional",
    expectedResult: "Different cities valid; same source and destination triggers validation error."
  },
  {
    id: "TC-BT-02",
    module: "bus_train",
    moduleTitle: "Bus & Train Reservation",
    title: "Verify journey date validation",
    description: "Validate that past dates are rejected and only today or future dates within booking horizon are accepted.",
    severity: "High",
    type: "Boundary / Validation",
    expectedResult: "Past journey date triggers rejection; future date is accepted."
  },
  {
    id: "TC-BT-03",
    module: "bus_train",
    moduleTitle: "Bus & Train Reservation",
    title: "Verify passenger count validation",
    description: "Ensure passenger count is between 1 and 6 and passenger detail fields match the selected count.",
    severity: "Medium",
    type: "Validation",
    expectedResult: "Passenger count within 1-6 validated; passenger names and ages checked."
  },
  {
    id: "TC-BT-04",
    module: "bus_train",
    moduleTitle: "Bus & Train Reservation",
    title: "Verify search functionality",
    description: "Verify that searching trains and buses queries fleet catalog and returns filtered, available options.",
    severity: "Critical",
    type: "Functional / Search",
    expectedResult: "Search returns list of available trains/buses with timings, classes, and prices."
  },
  {
    id: "TC-BT-05",
    module: "bus_train",
    moduleTitle: "Bus & Train Reservation",
    title: "Verify seat availability and layout toggle",
    description: "Verify interactive seat map loads available seats and toggles seat selection states.",
    severity: "High",
    type: "UI / State",
    expectedResult: "Clicking available seat marks it selected and updates passenger seat assignment."
  },
  {
    id: "TC-BT-06",
    module: "bus_train",
    moduleTitle: "Bus & Train Reservation",
    title: "Verify successful booking workflow",
    description: "Complete full reservation workflow with passenger details and verify generated PNR confirmation.",
    severity: "Critical",
    type: "End-to-End",
    expectedResult: "Booking confirmed with unique PNR, journey details, and entry in booking history."
  },
  {
    id: "TC-BT-07",
    module: "bus_train",
    moduleTitle: "Bus & Train Reservation",
    title: "Verify invalid booking rejection",
    description: "Attempt booking with empty passenger name or missing required fields to verify error handling.",
    severity: "High",
    type: "Negative Test",
    expectedResult: "Submission blocked and explicit error message displayed on missing fields."
  },

  // Module 2: Movie Ticket Booking (6 cases)
  {
    id: "TC-MV-01",
    module: "movie",
    moduleTitle: "Movie Ticket Booking",
    title: "Verify movie selection from catalog",
    description: "Ensure user can browse and select a movie card, loading its details and ratings.",
    severity: "High",
    type: "Functional",
    expectedResult: "Selected movie card highlighted and details populated in cinema selector."
  },
  {
    id: "TC-MV-02",
    module: "movie",
    moduleTitle: "Movie Ticket Booking",
    title: "Verify cinema and showtime selection",
    description: "Verify cinema multiplex and available showtime slots can be chosen.",
    severity: "Medium",
    type: "Functional",
    expectedResult: "Cinema and showtime selected, loading corresponding screen layout."
  },
  {
    id: "TC-MV-03",
    module: "movie",
    moduleTitle: "Movie Ticket Booking",
    title: "Verify interactive seat selection",
    description: "Verify user can select available cinema seats across Silver, Gold, and Platinum tiers.",
    severity: "High",
    type: "UI / Interactive",
    expectedResult: "Selected seats update active list and recalculate seat count."
  },
  {
    id: "TC-MV-04",
    module: "movie",
    moduleTitle: "Movie Ticket Booking",
    title: "Prevent selection of already-booked seats",
    description: "Verify seats marked as booked are disabled and cannot be selected by the user.",
    severity: "Critical",
    type: "Security / Integrity",
    expectedResult: "Clicking booked seat is blocked and warning toast/indicator is shown."
  },
  {
    id: "TC-MV-05",
    module: "movie",
    moduleTitle: "Movie Ticket Booking",
    title: "Verify ticket price calculation",
    description: "Verify mathematical accuracy of subtotal + 18% GST + convenience fee for chosen seat tiers.",
    severity: "High",
    type: "Calculation / Math",
    expectedResult: "Total matches (SeatPrice * Count) + GST(18%) + ConvenienceFee exactly."
  },
  {
    id: "TC-MV-06",
    module: "movie",
    moduleTitle: "Movie Ticket Booking",
    title: "Verify successful movie booking",
    description: "Complete movie ticket purchase and verify generated Booking ID and Screen Ticket Pass.",
    severity: "Critical",
    type: "End-to-End",
    expectedResult: "Ticket pass generated with Audi, Seats, QR Code, and added to Booking History."
  },

  // Module 3: Cab Booking (6 cases)
  {
    id: "TC-CB-01",
    module: "cab",
    moduleTitle: "Cab Booking",
    title: "Verify pickup and drop location inputs",
    description: "Verify pickup and destination locations can be entered and suggested.",
    severity: "Medium",
    type: "Input / Suggestion",
    expectedResult: "Pickup and Drop locations populate properly."
  },
  {
    id: "TC-CB-02",
    module: "cab",
    moduleTitle: "Cab Booking",
    title: "Verify pickup and drop locations are different",
    description: "Verify that setting the same pickup and drop location is rejected with an error message.",
    severity: "High",
    type: "Validation / Negative",
    expectedResult: "Error displayed: 'Pickup and drop locations must be different'."
  },
  {
    id: "TC-CB-03",
    module: "cab",
    moduleTitle: "Cab Booking",
    title: "Verify date and time validation for ride scheduling",
    description: "Verify 'Schedule for Later' validates future pickup time and disallows past hours.",
    severity: "Medium",
    type: "Validation",
    expectedResult: "Only future schedule date/time accepted; past schedule rejected."
  },
  {
    id: "TC-CB-04",
    module: "cab",
    moduleTitle: "Cab Booking",
    title: "Verify cab category selection",
    description: "Verify switching between Mini, Sedan, SUV, and Luxury updates capacity, ETA, and vehicle model.",
    severity: "High",
    type: "State / Selection",
    expectedResult: "Category switch displays corresponding car details, capacity, and rate."
  },
  {
    id: "TC-CB-05",
    module: "cab",
    moduleTitle: "Cab Booking",
    title: "Verify fare calculation",
    description: "Ensure calculated estimated fare reflects BaseFare + (DistanceKm * RatePerKm) accurately.",
    severity: "High",
    type: "Calculation",
    expectedResult: "Estimated fare computed correctly according to category formula."
  },
  {
    id: "TC-CB-06",
    module: "cab",
    moduleTitle: "Cab Booking",
    title: "Verify successful cab booking",
    description: "Confirm cab ride, match nearby driver, and verify generated ride OTP and vehicle details.",
    severity: "Critical",
    type: "End-to-End",
    expectedResult: "Driver assigned with vehicle plate number, rating, and 4-digit ride OTP."
  },

  // Module 4: Event Registration (7 cases)
  {
    id: "TC-EV-01",
    module: "event",
    moduleTitle: "Event Registration",
    title: "Verify event selection and details loading",
    description: "Verify event card selection loads venue, date, agenda, and ticket tiers.",
    severity: "Medium",
    type: "Functional",
    expectedResult: "Event details, banner, dates, and tier options displayed accurately."
  },
  {
    id: "TC-EV-02",
    module: "event",
    moduleTitle: "Event Registration",
    title: "Verify participant details validation",
    description: "Ensure participant full name and contact number are validated as non-empty and formatted.",
    severity: "High",
    type: "Validation",
    expectedResult: "Empty or invalid participant name/phone triggers validation error."
  },
  {
    id: "TC-EV-03",
    module: "event",
    moduleTitle: "Event Registration",
    title: "Verify email format validation",
    description: "Ensure registration rejects invalid email addresses lacking '@' or valid domain syntax.",
    severity: "High",
    type: "Validation / Security",
    expectedResult: "Invalid email string rejected with RFC format error message."
  },
  {
    id: "TC-EV-04",
    module: "event",
    moduleTitle: "Event Registration",
    title: "Verify ticket quantity and tier selection",
    description: "Ensure ticket quantity selector (1-5) and ticket tier (Student, General, VIP) update total price.",
    severity: "Medium",
    type: "UI / Calculation",
    expectedResult: "Total registration fee equals TierPrice * Quantity."
  },
  {
    id: "TC-EV-05",
    module: "event",
    moduleTitle: "Event Registration",
    title: "Verify ticket availability limits",
    description: "Ensure system prevents ordering more tickets than currently available in inventory.",
    severity: "High",
    type: "Boundary / Inventory",
    expectedResult: "Quantity capped at remaining available tier seats."
  },
  {
    id: "TC-EV-06",
    module: "event",
    moduleTitle: "Event Registration",
    title: "Verify registration submission and badge generation",
    description: "Complete registration and verify generation of Delegate Badge with attendee ID and QR code.",
    severity: "Critical",
    type: "End-to-End",
    expectedResult: "Registration confirmed with unique Delegate Badge and added to Booking History."
  },
  {
    id: "TC-EV-07",
    module: "event",
    moduleTitle: "Event Registration",
    title: "Verify duplicate registration prevention",
    description: "Attempt registering an attendee with an email address already registered for that event.",
    severity: "Critical",
    type: "Business Logic / Negative",
    expectedResult: "Registration blocked with: 'Duplicate registration detected: This email is already registered for this event.'"
  },

  // Module 5: Payment Gateway Integration (12 cases)
  {
    id: "TC-PAY-01",
    module: "payment",
    moduleTitle: "Payment Gateway",
    title: "Open payment page",
    description: "Verify payment checkout interface loads with valid pending booking details.",
    severity: "Critical",
    type: "UI / Navigation",
    expectedResult: "Payment page displayed with matching booking ID, passenger details, and breakdown."
  },
  {
    id: "TC-PAY-02",
    module: "payment",
    moduleTitle: "Payment Gateway",
    title: "Verify booking amount",
    description: "Assert itemized breakdown (base fare + taxes + fees) equals final payable amount.",
    severity: "High",
    type: "Calculation / Integrity",
    expectedResult: "Correct total amount displayed with zero rounding discrepancy."
  },
  {
    id: "TC-PAY-03",
    module: "payment",
    moduleTitle: "Payment Gateway",
    title: "Click Pay Now",
    description: "Verify clicking Pay Now generates Razorpay order on backend and triggers Checkout SDK.",
    severity: "Critical",
    type: "Integration",
    expectedResult: "Razorpay order created with valid order_id and Razorpay Checkout opens."
  },
  {
    id: "TC-PAY-04",
    module: "payment",
    moduleTitle: "Payment Gateway",
    title: "Select UPI",
    description: "Verify UPI payment option presents Google Pay, PhonePe, Paytm, and VPA inputs.",
    severity: "Medium",
    type: "UI / Method Selection",
    expectedResult: "UPI option available and ready to receive Virtual Payment Address or app intent."
  },
  {
    id: "TC-PAY-05",
    module: "payment",
    moduleTitle: "Payment Gateway",
    title: "Select card",
    description: "Verify debit/credit card option presents cardholder fields and test card presets.",
    severity: "Medium",
    type: "UI / Method Selection",
    expectedResult: "Card option available supporting Visa, Mastercard, and RuPay test cards."
  },
  {
    id: "TC-PAY-06",
    module: "payment",
    moduleTitle: "Payment Gateway",
    title: "Successful test payment",
    description: "Verify valid Razorpay test payment with valid HMAC signature marks payment SUCCESS and confirms booking.",
    severity: "Critical",
    type: "End-to-End",
    expectedResult: "Payment marked SUCCESS and booking status updated to Confirmed."
  },
  {
    id: "TC-PAY-07",
    module: "payment",
    moduleTitle: "Payment Gateway",
    title: "Failed test payment",
    description: "Verify simulated bank decline marks payment FAILED and keeps booking unconfirmed.",
    severity: "High",
    type: "Negative / Error Handling",
    expectedResult: "Payment marked FAILED with clear bank decline reason; booking remains unconfirmed."
  },
  {
    id: "TC-PAY-08",
    module: "payment",
    moduleTitle: "Payment Gateway",
    title: "Invalid payment signature",
    description: "Verify backend rejects tampered or forged HMAC payment signature with 400 error.",
    severity: "Critical",
    type: "Security / Cryptography",
    expectedResult: "Payment verification rejected with 'Invalid payment signature'."
  },
  {
    id: "TC-PAY-09",
    module: "payment",
    moduleTitle: "Payment Gateway",
    title: "Duplicate payment request",
    description: "Verify backend prevents duplicate charge on an already verified successful order.",
    severity: "High",
    type: "Idempotency / Business Logic",
    expectedResult: "Duplicate processing prevented; 409 conflict returned."
  },
  {
    id: "TC-PAY-10",
    module: "payment",
    moduleTitle: "Payment Gateway",
    title: "Refresh payment page",
    description: "Verify refreshing payment page retrieves consistent pending booking and order state.",
    severity: "Medium",
    type: "State Consistency",
    expectedResult: "Payment state remains consistent without data loss."
  },
  {
    id: "TC-PAY-11",
    module: "payment",
    moduleTitle: "Payment Gateway",
    title: "Payment pending",
    description: "Verify booking remains in Pending Payment status until server-side signature verification succeeds.",
    severity: "Critical",
    type: "Business Rule / State",
    expectedResult: "Booking remains unconfirmed while payment status is pending."
  },
  {
    id: "TC-PAY-12",
    module: "payment",
    moduleTitle: "Payment Gateway",
    title: "Verify payment receipt",
    description: "Verify generated payment receipt contains valid transaction ID, amount, and GST tax invoice details.",
    severity: "High",
    type: "Compliance / Document",
    expectedResult: "Correct transaction details, payment ID, and GSTIN displayed on receipt."
  }
];
