export const initialData = {
  cities: [
    { id: "DEL", name: "New Delhi", state: "Delhi" },
    { id: "BOM", name: "Mumbai", state: "Maharashtra" },
    { id: "BLR", name: "Bengaluru", state: "Karnataka" },
    { id: "MAA", name: "Chennai", state: "Tamil Nadu" },
    { id: "CCU", name: "Kolkata", state: "West Bengal" },
    { id: "HYD", name: "Hyderabad", state: "Telangana" },
    { id: "PNQ", name: "Pune", state: "Maharashtra" },
    { id: "JAI", name: "Jaipur", state: "Rajasthan" },
    { id: "AMD", name: "Ahmedabad", state: "Gujarat" },
    { id: "GOI", name: "Goa", state: "Goa" }
  ],

  trains: [
    {
      id: "TR-22436",
      number: "22436",
      name: "Vande Bharat Express",
      type: "Superfast Express",
      from: "New Delhi",
      to: "Varanasi",
      departure: "06:00",
      arrival: "14:00",
      duration: "8h 00m",
      rating: 4.8,
      classes: [
        { code: "CC", name: "AC Chair Car", price: 1750, available: 42 },
        { code: "EC", name: "Exec. Chair Car", price: 3300, available: 12 }
      ],
      runsOn: ["Mon", "Tue", "Wed", "Fri", "Sat", "Sun"]
    },
    {
      id: "TR-12952",
      number: "12952",
      name: "Mumbai Rajdhani Express",
      type: "Rajdhani Special",
      from: "New Delhi",
      to: "Mumbai",
      departure: "16:55",
      arrival: "08:35",
      duration: "15h 40m",
      rating: 4.7,
      classes: [
        { code: "3A", name: "AC 3 Tier", price: 2120, available: 35 },
        { code: "2A", name: "AC 2 Tier", price: 3045, available: 18 },
        { code: "1A", name: "AC 1st Class", price: 4950, available: 6 }
      ],
      runsOn: ["Daily"]
    },
    {
      id: "TR-12628",
      number: "12628",
      name: "Karnataka Superfast Express",
      type: "Superfast",
      from: "New Delhi",
      to: "Bengaluru",
      departure: "20:20",
      arrival: "12:00",
      duration: "39h 40m",
      rating: 4.5,
      classes: [
        { code: "SL", name: "Sleeper Class", price: 890, available: 64 },
        { code: "3A", name: "AC 3 Tier", price: 2340, available: 28 },
        { code: "2A", name: "AC 2 Tier", price: 3410, available: 14 }
      ],
      runsOn: ["Daily"]
    },
    {
      id: "TR-82902",
      number: "82902",
      name: "Tejas Corporate Express",
      type: "Tejas Express",
      from: "Ahmedabad",
      to: "Mumbai",
      departure: "06:40",
      arrival: "13:05",
      duration: "6h 25m",
      rating: 4.9,
      classes: [
        { code: "CC", name: "AC Chair Car", price: 1420, available: 50 },
        { code: "EC", name: "Executive Class", price: 2680, available: 16 }
      ],
      runsOn: ["Mon", "Tue", "Thu", "Fri", "Sat", "Sun"]
    },
    {
      id: "TR-12002",
      number: "12002",
      name: "Bhopal Shatabdi Express",
      type: "Shatabdi",
      from: "New Delhi",
      to: "Jaipur",
      departure: "06:15",
      arrival: "10:45",
      duration: "4h 30m",
      rating: 4.6,
      classes: [
        { code: "CC", name: "AC Chair Car", price: 980, available: 38 },
        { code: "EC", name: "Executive Class", price: 1890, available: 8 }
      ],
      runsOn: ["Daily"]
    }
  ],

  buses: [
    {
      id: "BUS-101",
      operator: "IntrCity SmartBus",
      busType: "Volvo 9600 Multi-Axle AC Sleeper (2+1)",
      from: "New Delhi",
      to: "Jaipur",
      departure: "22:30",
      arrival: "04:45",
      duration: "6h 15m",
      rating: 4.7,
      reviews: 1420,
      price: 850,
      availableSeats: 18,
      amenities: ["WiFi", "Blanket", "Charging Point", "Water Bottle", "Live Tracking"]
    },
    {
      id: "BUS-102",
      operator: "Zingbus Luxury Electric",
      busType: "Electric AC Semi-Sleeper (2+2)",
      from: "New Delhi",
      to: "Jaipur",
      departure: "23:15",
      arrival: "05:30",
      duration: "6h 15m",
      rating: 4.6,
      reviews: 980,
      price: 720,
      availableSeats: 22,
      amenities: ["Zero Emission", "Snacks", "Charging Point", "Emergency SOS"]
    },
    {
      id: "BUS-103",
      operator: "SRS Travels Premium",
      busType: "Scania Multi-Axle AC Sleeper",
      from: "Bengaluru",
      to: "Hyderabad",
      departure: "21:00",
      arrival: "06:30",
      duration: "9h 30m",
      rating: 4.8,
      reviews: 2310,
      price: 1100,
      availableSeats: 14,
      amenities: ["Reading Light", "Blanket", "Pillow", "WiFi", "GPS"]
    },
    {
      id: "BUS-104",
      operator: "Orange Tours & Travels",
      busType: "Mercedes Benz Multi-Axle Sleeper",
      from: "Mumbai",
      to: "Pune",
      departure: "07:30",
      arrival: "11:00",
      duration: "3h 30m",
      rating: 4.9,
      reviews: 3100,
      price: 550,
      availableSeats: 28,
      amenities: ["Air Suspension", "Movie Screen", "Snacks", "Water Bottle"]
    }
  ],

  movies: [
    {
      id: "MOV-01",
      title: "Dune: Part Two",
      genre: "Sci-Fi / Adventure",
      certificate: "UA 16+",
      duration: "2h 46m",
      rating: 8.8,
      language: "English / IMAX",
      releaseDate: "2024",
      poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80",
      synopsis: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family."
    },
    {
      id: "MOV-02",
      title: "Oppenheimer",
      genre: "Biography / Drama",
      certificate: "A",
      duration: "3h 00m",
      rating: 8.9,
      language: "English / Hindi",
      releaseDate: "2023",
      poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=600&auto=format&fit=crop&q=80",
      synopsis: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during WWII."
    },
    {
      id: "MOV-03",
      title: "Interstellar 70mm",
      genre: "Sci-Fi / Space",
      certificate: "UA",
      duration: "2h 49m",
      rating: 8.7,
      language: "English / Dolby Atmos",
      releaseDate: "Special Re-Release",
      poster: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=600&auto=format&fit=crop&q=80",
      synopsis: "When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot is tasked to pilot a spacecraft along with a team of researchers."
    },
    {
      id: "MOV-04",
      title: "Cyber Odyssey 2026",
      genre: "Cyberpunk / Action",
      certificate: "UA 13+",
      duration: "2h 15m",
      rating: 8.5,
      language: "English / IMAX 3D",
      releaseDate: "2026",
      poster: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
      synopsis: "In a neon-drenched metropolis, an AI security engineer uncovers a global conspiracy threatening digital civilization."
    }
  ],

  cinemas: [
    { id: "CIN-01", name: "PVR ICON: Gold Class & IMAX, Promenade", screens: ["Audi 1 (IMAX)", "Audi 2 (Gold Class)", "Audi 3 (Dolby Atmos)"] },
    { id: "CIN-02", name: "INOX Megaplex: Laser IMAX & Insignia", screens: ["Screen 1 (Laser IMAX)", "Screen 2 (Insignia Lounge)"] },
    { id: "CIN-03", name: "Cinepolis VIP: RealD 3D & 4DX", screens: ["Audi 4 (4DX Experience)", "Audi 5 (VIP Recliner)"] }
  ],

  showtimes: ["10:30 AM", "01:45 PM", "05:00 PM", "08:30 PM", "11:15 PM"],

  cabs: {
    categories: [
      {
        id: "mini",
        name: "Mini",
        tagline: "Everyday economical compact rides",
        baseFare: 60,
        perKm: 13,
        capacity: 4,
        etaMinutes: 3,
        vehicleModel: "Maruti WagonR / Tata Tiago"
      },
      {
        id: "sedan",
        name: "Prime Sedan",
        tagline: "Comfortable sedans with top rated drivers",
        baseFare: 90,
        perKm: 17,
        capacity: 4,
        etaMinutes: 4,
        vehicleModel: "Maruti Dzire / Honda Amaze"
      },
      {
        id: "suv",
        name: "Prime SUV",
        tagline: "Spacious 6-seaters for family & luggage",
        baseFare: 140,
        perKm: 23,
        capacity: 6,
        etaMinutes: 6,
        vehicleModel: "Toyota Innova / Maruti Ertiga"
      },
      {
        id: "luxury",
        name: "Executive Luxury",
        tagline: "Premium electric & executive luxury sedans",
        baseFare: 220,
        perKm: 30,
        capacity: 4,
        etaMinutes: 7,
        vehicleModel: "BYD Seal / Mercedes C-Class"
      }
    ],
    drivers: [
      {
        id: "DRV-101",
        name: "Vikramaditya Rao",
        phone: "+91 98765 43210",
        rating: 4.9,
        trips: 3420,
        vehicle: "Silver Innova Crysta",
        plate: "DL 01 AB 4022",
        category: "suv",
        location: "Connaught Place, New Delhi"
      },
      {
        id: "DRV-102",
        name: "Rajesh Sharma",
        phone: "+91 98111 22334",
        rating: 4.8,
        trips: 2150,
        vehicle: "White Honda Amaze",
        plate: "DL 03 CD 8821",
        category: "sedan",
        location: "Cyber Hub, Gurugram"
      },
      {
        id: "DRV-103",
        name: "Priya Narayanan",
        phone: "+91 99887 76655",
        rating: 5.0,
        trips: 1820,
        vehicle: "Emerald Nexon EV",
        plate: "DL 05 EV 1009",
        category: "mini",
        location: "Aerocity, New Delhi"
      },
      {
        id: "DRV-104",
        name: "Sandeep Patil",
        phone: "+91 97654 32198",
        rating: 4.9,
        trips: 4100,
        vehicle: "Deep Black BYD Seal",
        plate: "DL 01 EX 9999",
        category: "luxury",
        location: "Chanakyapuri, New Delhi"
      }
    ]
  },

  events: [
    {
      id: "EVT-01",
      title: "Global AI & Cloud Innovation Summit 2026",
      category: "Technology & AI",
      date: "Dec 12-14, 2026",
      time: "09:00 AM - 06:00 PM IST",
      venue: "Bharat Mandapam Convention Centre",
      city: "New Delhi",
      banner: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80",
      description: "Join 3,000+ AI researchers, tech executives, and engineers discussing GenAI breakthroughs, autonomous agents, and cloud scale architectures.",
      tiers: [
        { id: "student", name: "Student Delegate Pass", price: 499, total: 300, available: 42, perks: ["Keynote Access", "Student Hack Arena", "Digital Certificate"] },
        { id: "standard", name: "General Professional Pass", price: 1499, total: 800, available: 164, perks: ["All Track Access", "Lunch & Networking Buffet", "Conference Kit"] },
        { id: "vip", name: "VIP Executive & Speaker Lounge", price: 3999, total: 150, available: 18, perks: ["VIP Lounge", "Exclusive Speaker Dinner", "Fast-track Registration", "1-on-1 Mentorship"] }
      ],
      registeredAttendees: [
        { email: "john.doe@techcorp.com", name: "John Doe", ticketTier: "standard", bookingDate: "2026-11-01" },
        { email: "sarah.connor@ai-labs.org", name: "Sarah Connor", ticketTier: "vip", bookingDate: "2026-11-02" }
      ]
    },
    {
      id: "EVT-02",
      title: "DevCon NextGen Hackathon & Expo",
      category: "Software Development",
      date: "Nov 28-30, 2026",
      time: "48-Hour Non-stop",
      venue: "Bengaluru International Exhibition Centre (BIEC)",
      city: "Bengaluru",
      banner: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80",
      description: "India's premier 48-hour builder hackathon with ₹15,00,000 in bounties across Web3, AI Agents, and Open Source Software.",
      tiers: [
        { id: "student", name: "Hacker Pass (Student / Solo)", price: 299, total: 500, available: 85, perks: ["24/7 Red Bull & Meals", "Mentorship Sessions", "Swag Box"] },
        { id: "standard", name: "Team Pass (Up to 4 Hackers)", price: 999, total: 200, available: 32, perks: ["Team Booth", "Cloud Credits", "Direct Investor Pitch"] }
      ],
      registeredAttendees: [
        { email: "alex.coder@devs.io", name: "Alex Kumar", ticketTier: "student", bookingDate: "2026-11-05" }
      ]
    },
    {
      id: "EVT-03",
      title: "Neon Pulse Electronic Music Festival 2026",
      category: "Music & Entertainment",
      date: "Dec 20-22, 2026",
      time: "04:00 PM - Late Night",
      venue: "Vagator Coastal Grounds",
      city: "Goa",
      banner: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80",
      description: "A 3-day multi-stage electronic music festival under the coastal stars featuring top international DJs, visual art, and beach stages.",
      tiers: [
        { id: "single_day", name: "Single Day General Admission", price: 1999, total: 1000, available: 210, perks: ["General Arena Entry", "Access to 3 Stages"] },
        { id: "weekend", name: "Full Weekend Festival Pass", price: 4499, total: 600, available: 75, perks: ["3-Day Unlimited Entry", "Official Festival Band", "Free After-party Entry"] },
        { id: "vip", name: "VIP Elevated Deck & Hospitality", price: 8999, total: 100, available: 12, perks: ["Elevated Deck View", "Complimentary Beverages", "Dedicated Parking"] }
      ],
      registeredAttendees: []
    }
  ]
};
