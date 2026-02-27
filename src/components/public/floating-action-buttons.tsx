"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, X, Send, Sparkles, Loader2, MessageSquare, HelpCircle, Clock, FileCheck, Shield, CreditCard } from "lucide-react";

// Website Knowledge Base
const WEBSITE_KNOWLEDGE = {
  company: {
    name: "MediProofDocs",
    tagline: "QuickMedicalCertificate.com",
    description: "Your trusted online platform for genuine medical certificates issued by registered Indian doctors through compliant digital consultations.",
  },
  certificates: [
    {
      name: "Sick Leave Medical Certificate",
      slug: "sick-leave",
      price: "₹599 - ₹799",
      description: "Official medical confirmation when health issues prevent you from attending work, school, or college.",
      delivery: "30-90 minutes after consultation",
    },
    {
      name: "Work From Home Medical Certificate",
      slug: "work-from-home",
      price: "₹599",
      description: "Supports remote working arrangements based on medical advice when office attendance is difficult.",
    },
    {
      name: "Caretaker Medical Certificate",
      slug: "caretaker",
      price: "₹599",
      description: "Confirms your need to care for a family member during their recovery period.",
    },
    {
      name: "Recovery Medical Certificate",
      slug: "recovery",
      price: "₹599",
      description: "Confirms you've recovered from a medical condition and are fit to resume activities.",
    },
    {
      name: "Medical Fitness Certificate",
      slug: "fitness",
      price: "₹599",
      description: "Health clearance for employment, sports, admissions, or travel requirements.",
    },
    {
      name: "Fit-to-Fly Certificate",
      slug: "fit-to-fly",
      price: "₹599",
      description: "Medical clearance confirming you are safe to travel by air. Accepted by airlines worldwide.",
    },
    {
      name: "Unfit To Work Certificate",
      slug: "unfit-to-work",
      price: "₹599",
      description: "Medical documentation when illness prevents you from performing work duties safely.",
    },
    {
      name: "Unfit To Travel Certificate",
      slug: "unfit-to-travel",
      price: "₹599",
      description: "Medical documentation when health conditions make travel inadvisable.",
    },
    {
      name: "Medical Diagnosis Certificate",
      slug: "medical-diagnosis",
      price: "₹599",
      description: "Official documentation of your medical condition for various purposes.",
    },
  ],
  pricing: {
    digitalWithoutPrescription: { name: "Digital Certificate without prescription", price: "₹599", refundable: false },
    digitalWithPrescription: { name: "Digital Certificate with prescription", price: "₹799", refundable: true, convenienceFee: "₹199" },
    digitalExpress: { name: "Digital Certificate (30-Min Express Delivery)", price: "₹899", refundable: true, convenienceFee: "₹199" },
    handwrittenWithoutPrescription: { name: "Handwritten Certificate without prescription", price: "₹1,099", refundable: false },
    handwrittenWithPrescription: { name: "Handwritten Certificate with prescription", price: "₹1,399", refundable: true, convenienceFee: "₹299" },
    handwrittenWithShipping: { name: "Handwritten Certificate + Shipping", price: "₹1,299 - ₹1,499", refundable: true, convenienceFee: "₹299" },
  },
  process: [
    { step: 1, title: "Submit Your Request", description: "Fill out our easy online form with your personal and medical details." },
    { step: 2, title: "Online Doctor Consultation", description: "A certified doctor reviews your request and connects with you online." },
    { step: 3, title: "Receive Your Certificate", description: "Digital copy via WhatsApp/Email within 30-90 minutes. Physical copy in 8-10 days." },
  ],
  features: [
    "Digital copy delivered within 30-90 minutes",
    "Handwritten certificate with courier option available",
    "Issued by registered Indian MBBS/MD/MS doctors",
    "Accepted by airlines, banks, colleges & corporate offices",
    "Aligned with NMC and Indian telemedicine guidelines",
    "Fully online process — no clinic visit required",
    "100% genuine and legally valid certificates",
  ],
  refundPolicy: {
    eligible: [
      "Before doctor consultation or review",
      "Underage user (below 12) without parental consent",
      "Doctor fails to contact within 48 working hours",
      "Wrong product selected before consultation",
    ],
    notEligible: [
      "After doctor consultation is completed",
      "Non-refundable document format selected",
      "Certificate already issued",
      "False or misleading information provided",
    ],
  },
  contact: {
    email: "contact@quickmedicalcertificate.com",
    whatsapp: "+91 99999 99999",
    phone: "+91 99999 99999",
    hours: "24/7 Online Service",
  },
  cities: ["Hyderabad", "Bangalore", "Pune", "Chennai", "Mumbai", "Delhi", "Kolkata", "Surat", "Jaipur", "Lucknow", "Ahmedabad", "Indore", "Nagpur", "Bhopal", "Patna", "Vadodara", "Ghaziabad", "Ludhiana", "Agra", "Nashik"],
  validity: "All certificates follow NMC & WHO guidelines and are legally valid across India. Each certificate includes the doctor's name and registration number for verification.",
};

// AI Response Generator
function generateAIResponse(userMessage: string): string {
  const message = userMessage.toLowerCase();

  // Greeting
  if (message.match(/^(hi|hello|hey|namaste|greetings)/)) {
    return "👋 Hello! Welcome to MediProofDocs! I'm your AI assistant and I know everything about our medical certificate services. How can I help you today?";
  }

  // Certificate types inquiry
  if (message.includes("certificate") && (message.includes("type") || message.includes("kind") || message.includes("what") || message.includes("available") || message.includes("offer"))) {
    return `📋 We offer 9 types of medical certificates:\n\n1. **Sick Leave Certificate** - For work/school absence\n2. **Work From Home Certificate** - For remote work arrangements\n3. **Fitness Certificate** - For jobs, sports, admissions\n4. **Fit-to-Fly Certificate** - For air travel clearance\n5. **Unfit to Work Certificate** - When you cannot work\n6. **Unfit to Travel Certificate** - When travel is inadvisable\n7. **Medical Diagnosis Certificate** - Official condition documentation\n8. **Caretaker Certificate** - For family caregiving leave\n9. **Recovery Certificate** - To confirm you've recovered\n\nWould you like details about any specific certificate?`;
  }

  // Pricing inquiry
  if (message.includes("price") || message.includes("cost") || message.includes("fee") || message.includes("how much") || message.includes("₹")) {
    return `💰 Our pricing is transparent:\n\n**Digital Certificates:**\n• Without Prescription: ₹599 (Non-refundable)\n• With Prescription: ₹799\n• Express Delivery (30 min): ₹899\n\n**Handwritten Certificates:**\n• Without Prescription: ₹1,099\n• With Prescription: ₹1,399\n• With Shipping: ₹1,299 - ₹1,499\n\n*Note: Convenience fees apply for refundable products (₹199-₹299)*\n\nWhich certificate are you interested in?`;
  }

  // Process inquiry
  if (message.includes("process") || message.includes("how to") || message.includes("steps") || message.includes("apply") || message.includes("get certificate")) {
    return `🔄 Our simple 3-step process:\n\n**1. Submit Your Request** 📋\nFill out our online form with your personal and medical details\n\n**2. Online Doctor Consultation** 👨‍⚕️\nA certified doctor reviews your case and connects with you\n\n**3. Receive Your Certificate** 📄\n• Digital copy: Within 30-90 minutes via WhatsApp/Email\n• Physical copy: 8-10 business days by post\n\nNo clinic visit required! Would you like to start your application?`;
  }

  // Time/Delivery inquiry
  if (message.includes("time") || message.includes("delivery") || message.includes("fast") || message.includes("quick") || message.includes("when") || message.includes("how long")) {
    return `⏱️ **Delivery Times:**\n\n• **Digital Certificate**: 30-90 minutes after doctor consultation\n• **Express Delivery**: Within 30 minutes (₹899)\n• **Physical Copy**: 8-10 business days via courier\n\nOur doctors are available 24/7 to process your request quickly. Need an express delivery?`;
  }

  // Validity inquiry
  if (message.includes("valid") || message.includes("genuine") || message.includes("real") || message.includes("fake") || message.includes("legal") || message.includes("accept")) {
    return `✅ **100% Genuine & Legally Valid!**\n\nOur certificates are:\n• Issued by registered Indian MBBS/MD/MS doctors\n• Compliant with NMC & WHO guidelines\n• Accepted by airlines, banks, colleges & corporate offices\n• Include doctor's name & registration number for verification\n• Follow Indian telemedicine guidelines\n\nYour employer/institution can verify by contacting the doctor directly using the details on the certificate.`;
  }

  // Refund inquiry
  if (message.includes("refund") || message.includes("cancel") || message.includes("money back")) {
    return `💸 **Refund Policy:**\n\n**Eligible for Refund (before doctor review):**\n• Wrong product selected\n• Underage user without consent\n• Doctor doesn't contact within 48 hours\n\n**NOT Eligible:**\n• After doctor consultation starts\n• Non-refundable format selected\n• Certificate already issued\n• False information provided\n\nConvenience fees (₹199-₹299) apply for eligible refunds. Would you like more details?`;
  }

  // Contact inquiry
  if (message.includes("contact") || message.includes("call") || message.includes("email") || message.includes("reach") || message.includes("support")) {
    return `📞 **Contact Us:**\n\n• **Email:** contact@quickmedicalcertificate.com\n• **Phone/WhatsApp:** +91 99999 99999\n• **Service Hours:** 24/7 Online\n\nYou can also click the WhatsApp or Phone buttons at the bottom left to connect with us instantly!`;
  }

  // Cities inquiry
  if (message.includes("city") || message.includes("location") || message.includes("where") || message.includes("area") || message.includes("state")) {
    return `🌍 **Available Across India!**\n\nWe serve all major cities including:\n${WEBSITE_KNOWLEDGE.cities.slice(0, 15).join(" • ")} and 100+ more cities!\n\nSince we operate online, you can get your certificate from anywhere in India without visiting a clinic.`;
  }

  // Sick leave specific
  if (message.includes("sick") || message.includes("leave") || message.includes("absent")) {
    return `🤒 **Sick Leave Certificate**\n\n**Price:** ₹599 - ₹799\n**Delivery:** 30-90 minutes\n\nThis certificate provides official medical confirmation when health issues prevent you from attending work, school, or college.\n\n**Features:**\n✓ Accepted by employers & institutions\n✓ Issued by registered MBBS doctor\n✓ No clinic visit required\n\nWould you like to apply for a sick leave certificate?`;
  }

  // Fitness certificate specific
  if (message.includes("fitness") || message.includes("fit to work") || message.includes("gym")) {
    return `💪 **Medical Fitness Certificate**\n\n**Price:** ₹599\n**Delivery:** 30-90 minutes\n\nRequired for:\n• New job joining\n• Academic admissions\n• Sports activities\n• Travel requirements\n\n**Features:**\n✓ Thorough health evaluation\n✓ Recognized across India\n✓ Available in digital & print\n\nNeed a fitness certificate?`;
  }

  // Fit to fly specific
  if (message.includes("fly") || message.includes("travel") || message.includes("flight") || message.includes("airport") || message.includes("airline")) {
    return `✈️ **Fit-to-Fly Certificate**\n\n**Price:** ₹599\n**Delivery:** 30-90 minutes\n\nMedical clearance confirming you are safe to travel by air. Required by most airlines for:\n• Pregnant women (after 28 weeks)\n• Recent surgery patients\n• Passengers with medical conditions\n• Post-COVID travelers\n\n**Accepted by:** All major airlines & immigration authorities worldwide\n\nPlanning to travel soon?`;
  }

  // Work from home specific
  if (message.includes("work from home") || message.includes("wfh") || message.includes("remote")) {
    return `🏠 **Work From Home Certificate**\n\n**Price:** ₹599\n**Delivery:** 30-90 minutes\n\nWhen you can work but office attendance is difficult due to:\n• Mobility issues\n• Recovery from illness\n• Contagious conditions\n• Doctor-advised rest at home\n\nThis certificate supports your remote work request with medical backing.\n\nNeed to work from home?`;
  }

  // Privacy/Security inquiry
  if (message.includes("privacy") || message.includes("secure") || message.includes("data") || message.includes("safe") || message.includes("confidential")) {
    return `🔒 **Your Data is 100% Secure!**\n\n• All information is encrypted and securely stored\n• Only used for doctor consultation and certificate issuance\n• We never share your data with third parties\n• Compliant with healthcare data protection standards\n• Your medical details remain confidential\n\nYour privacy is our top priority!`;
  }

  // Doctor inquiry
  if (message.includes("doctor") || message.includes("physician") || message.includes("who issue")) {
    return `👨‍⚕️ **Certified Doctors**\n\nAll certificates are issued by:\n• Registered Indian MBBS/MD/MS doctors\n• Licensed medical practitioners\n• Doctors registered with Medical Council of India/NMC\n
Each certificate includes:\n✓ Doctor's full name\n✓ Registration number\n✓ Contact details\n✓ Official signature & stamp\n\nYour employer can verify authenticity by contacting the doctor directly.`;
  }

  // Payment inquiry
  if (message.includes("payment") || message.includes("pay") || message.includes("online payment") || message.includes("upi") || message.includes("card")) {
    return `💳 **Payment Options:**\n\nWe accept all major payment methods:\n• Credit/Debit Cards\n• UPI (Google Pay, PhonePe, Paytm)\n• Net Banking\n• Wallets\n
All payments are secure and encrypted. You pay only after selecting your certificate type and filling the basic form.`;
  }

  // Physical copy inquiry
  if (message.includes("physical") || message.includes("handwritten") || message.includes("original") || message.includes("hard copy") || message.includes("print")) {
    return `📝 **Handwritten Certificate with Shipping**\n\n**Price:** ₹1,299 - ₹1,499\n**Delivery:** 8-10 business days\n\nIncludes:\n• Hand-signed certificate by doctor\n• Official stamp & letterhead\n• Courier delivery to your address\n• Tracking number provided\n
Perfect for organizations that require original handwritten documents. Digital copy also included free!`;
  }

  // Thank you
  if (message.includes("thank") || message.includes("thanks") || message.includes("helpful")) {
    return "🙏 You're welcome! I'm glad I could help. If you have any more questions about our medical certificate services, feel free to ask. Have a great day! 😊";
  }

  // Bye
  if (message.includes("bye") || message.includes("goodbye") || message.includes("see you")) {
    return "👋 Goodbye! Feel free to come back if you need any help with medical certificates. Take care and stay healthy! 🏥✨";
  }

  // Default response with suggestions
  return `🤔 I'm not sure I understood that correctly. Here are some things I can help you with:\n\n• 📋 Types of certificates we offer\n• 💰 Pricing and fees\n• 🔄 How the process works\n• ⏱️ Delivery timeframes\n• ✅ Certificate validity & acceptance\n• 💸 Refund policy\n• 📞 Contact information\n• 🌍 Service locations\n\nWhat would you like to know?`;
}

export function FloatingActionButtons() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([
    { role: "assistant", content: "👋 Hello! I'm MediProofDocs AI Assistant! 🤖✨\n\nI know everything about our medical certificate services - from pricing to process, validity to refunds. How can I help you today?" },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showTyping, setShowTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage.trim();
    setInputMessage("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setShowTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      setShowTyping(false);
      const aiResponse = generateAIResponse(userMessage);
      setMessages((prev) => [...prev, { role: "assistant", content: aiResponse }]);
    }, 1500 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Quick action buttons
  const quickActions = [
    { label: "💰 Pricing", message: "What are the prices?" },
    { label: "📋 Certificates", message: "What certificates do you offer?" },
    { label: "🔄 Process", message: "How does the process work?" },
    { label: "⏱️ Timing", message: "How long does it take?" },
  ];

  return (
    <>
      {/* Fixed Bottom Left - WhatsApp & Phone */}
      <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-3">
        {/* WhatsApp Button */}
        <motion.a
          href="https://wa.me/919999999999"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ scale: 0, opacity: 0, x: -50 }}
          animate={{ scale: 1, opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
          whileHover={{ scale: 1.1, rotate: [0, -10, 10, 0] }}
          whileTap={{ scale: 0.9 }}
          className="group relative flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer"
          title="Chat on WhatsApp"
        >
          {/* Pulse animation ring */}
          <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />
          
          {/* Shine effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          />
          
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="relative z-10"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>

          {/* Tooltip */}
          <motion.span
            initial={{ opacity: 0, x: 10 }}
            whileHover={{ opacity: 1, x: 0 }}
            className="absolute left-full ml-3 px-3 py-1.5 bg-gray-800 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity"
          >
            Chat on WhatsApp
          </motion.span>
        </motion.a>

        {/* Phone Button */}
        <motion.a
          href="tel:+919999999999"
          initial={{ scale: 0, opacity: 0, x: -50 }}
          animate={{ scale: 1, opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
          whileHover={{ scale: 1.1, rotate: [0, 10, -10, 0] }}
          whileTap={{ scale: 0.9 }}
          className="group relative flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
          title="Call Us"
        >
          {/* Pulse animation */}
          <span className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-20" />
          
          {/* Ring animation */}
          <motion.span
            className="absolute inset-0 rounded-full border-2 border-blue-400"
            animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          
          <Phone className="w-6 h-6 relative z-10" />

          {/* Tooltip */}
          <motion.span
            initial={{ opacity: 0, x: 10 }}
            whileHover={{ opacity: 1, x: 0 }}
            className="absolute left-full ml-3 px-3 py-1.5 bg-gray-800 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity"
          >
            Call Us Now
          </motion.span>
        </motion.a>
      </div>

      {/* Fixed Bottom Right - AI Chat */}
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 50, rotateX: -15 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: 50, rotateX: 15 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="absolute bottom-20 right-0 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden"
              style={{ transformOrigin: "bottom right" }}
            >
              {/* Chat Header with Gradient Animation */}
              <div className="relative bg-gradient-to-r from-teal-500 via-teal-600 to-teal-500 p-4 overflow-hidden">
                {/* Animated gradient background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-teal-400 via-teal-600 to-teal-400 opacity-50"
                  animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                  style={{ backgroundSize: "200% 200%" }}
                />
                
                {/* Floating particles */}
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-white/20 rounded-full"
                    style={{
                      left: `${20 + i * 15}%`,
                      top: `${30 + (i % 2) * 40}%`,
                    }}
                    animate={{
                      y: [0, -20, 0],
                      opacity: [0.2, 0.5, 0.2],
                    }}
                    transition={{
                      duration: 2 + i * 0.5,
                      repeat: Infinity,
                      delay: i * 0.3,
                    }}
                  />
                ))}

                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Animated Avatar */}
                    <motion.div
                      className="relative w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      <Sparkles className="w-5 h-5 text-white" />
                      {/* Orbiting dots */}
                      <motion.span
                        className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-300 rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    </motion.div>
                    <div>
                      <h3 className="text-white font-bold flex items-center gap-1">
                        AI Assistant
                        <motion.span
                          animate={{ rotate: [0, 20, -20, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          ✨
                        </motion.span>
                      </h3>
                      <div className="flex items-center gap-1.5">
                        <motion.span
                          className="w-2 h-2 bg-green-400 rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        />
                        <p className="text-white/80 text-xs">Online • Knows everything!</p>
                      </div>
                    </div>
                  </div>
                  <motion.button
                    onClick={() => setIsChatOpen(false)}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    className="text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="h-80 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-gray-50 to-white">
                <AnimatePresence mode="popLayout">
                  {messages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      className={`flex ${
                        message.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                          message.role === "user"
                            ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-br-none shadow-md"
                            : "bg-white text-gray-700 rounded-bl-none shadow-sm border border-gray-100"
                        }`}
                      >
                        {message.role === "assistant" && (
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <Sparkles className="w-3 h-3 text-teal-500" />
                            <span className="text-xs font-semibold text-teal-600">AI Assistant</span>
                          </div>
                        )}
                        <div className="whitespace-pre-line">{message.content}</div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Typing Indicator */}
                {showTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="flex justify-start"
                  >
                    <div className="bg-white p-3 rounded-2xl rounded-bl-none shadow-sm border border-gray-100">
                      <div className="flex items-center gap-1">
                        <motion.div
                          className="w-2 h-2 bg-teal-500 rounded-full"
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.5, repeat: Infinity, delay: 0 }}
                        />
                        <motion.div
                          className="w-2 h-2 bg-teal-500 rounded-full"
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.5, repeat: Infinity, delay: 0.15 }}
                        />
                        <motion.div
                          className="w-2 h-2 bg-teal-500 rounded-full"
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.5, repeat: Infinity, delay: 0.3 }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Action Buttons */}
              <div className="px-3 py-2 bg-gray-50 border-t border-gray-100">
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                  {quickActions.map((action, index) => (
                    <motion.button
                      key={index}
                      onClick={() => {
                        setInputMessage(action.message);
                        setTimeout(() => handleSendMessage(), 100);
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-shrink-0 px-3 py-1.5 bg-white text-teal-600 text-xs font-medium rounded-full border border-teal-200 hover:bg-teal-50 hover:border-teal-300 transition-colors whitespace-nowrap shadow-sm cursor-pointer"
                    >
                      {action.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Chat Input */}
              <div className="p-3 bg-white border-t border-gray-100">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything..."
                    className="flex-1 px-4 py-2.5 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-700 placeholder:text-gray-400 transition-all"
                  />
                  <motion.button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || showTyping}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {showTyping ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Chat Toggle Button */}
        <motion.div
          className="relative"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.3 }}
        >
          {/* Ripple effect when chat is closed */}
          {!isChatOpen && (
            <>
              <motion.span
                className="absolute inset-0 rounded-full bg-gradient-to-r from-teal-400 to-teal-500 opacity-30"
                animate={{ scale: [1, 1.5, 1.5], opacity: [0.3, 0, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.span
                className="absolute inset-0 rounded-full bg-gradient-to-r from-teal-400 to-teal-500 opacity-20"
                animate={{ scale: [1, 1.8, 1.8], opacity: [0.2, 0, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              />
            </>
          )}

          <motion.button
            onClick={() => setIsChatOpen(!isChatOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`relative flex items-center justify-center w-16 h-16 rounded-full shadow-2xl transition-all duration-300 cursor-pointer ${
              isChatOpen
                ? "bg-gray-700 text-white"
                : "bg-gradient-to-r from-teal-500 via-teal-500 to-teal-400 text-white"
            }`}
            title="AI Chat Assistant"
          >
            {/* Background glow */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-teal-400 to-teal-500 blur-lg opacity-50" />
            
            <AnimatePresence mode="wait">
              {isChatOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0, scale: 0 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0 }}
                  transition={{ duration: 0.2 }}
                  className="relative"
                >
                  <X className="w-7 h-7" />
                </motion.div>
              ) : (
                <motion.div
                  key="chat"
                  initial={{ rotate: 90, opacity: 0, scale: 0 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: -90, opacity: 0, scale: 0 }}
                  transition={{ duration: 0.2 }}
                  className="relative"
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <MessageSquare className="w-7 h-7" />
                  </motion.div>
                  <motion.div
                    className="absolute -top-1 -right-1"
                    animate={{ scale: [1, 1.3, 1], rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles className="w-4 h-4 text-yellow-300" />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Notification badge */}
            {!isChatOpen && messages.length <= 1 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white"
              >
                1
              </motion.span>
            )}
          </motion.button>

          {/* Label */}
          {!isChatOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-gray-800 text-white text-xs font-medium rounded-lg whitespace-nowrap"
            >
              Ask me anything!
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-gray-800 rotate-45" />
            </motion.div>
          )}
        </motion.div>
      </div>
    </>
  );
}
