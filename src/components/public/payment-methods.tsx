"use client";

import { motion } from "framer-motion";
import { Shield, Lock } from "lucide-react";

// Mastercard Logo SVG
function MastercardLogo() {
  return (
    <svg viewBox="0 0 60 40" className="h-8 w-auto" aria-label="Mastercard">
      <circle cx="20" cy="20" r="16" fill="#EB001B" />
      <circle cx="40" cy="20" r="16" fill="#F79E1B" />
      <path
        d="M30 8.5c4.5 3 7.5 8 7.5 13.5s-3 10.5-7.5 13.5c-4.5-3-7.5-8-7.5-13.5s3-10.5 7.5-13.5z"
        fill="#FF5F00"
      />
    </svg>
  );
}

// Visa Logo SVG
function VisaLogo() {
  return (
    <svg viewBox="0 0 60 20" className="h-6 w-auto" aria-label="Visa">
      <path
        d="M28.5 1.5h5.2l-4 17.2h-5.2l4-17.2zm14.8 11.3l2-5.5 1.2 5.5h-3.2zm5.5 5.9h4.6l-4-17.2h-4.2c-.9 0-1.7.5-2.1 1.3l-7.4 15.9h5.2l1-2.8h6.2l.7 2.8zm-17.5-5.9c0-4.2-5.8-4.4-5.8-6.3 0-.6.6-1.2 1.8-1.4 1.5-.2 3 .2 3.9.7l.7-3.5c-1-.4-2.6-.8-4.4-.8-4.6 0-7.9 2.5-7.9 6 0 2.6 2 4.1 3.5 4.9 1.6.9 2.1 1.4 2.1 2.2 0 1.2-1.6 1.7-3.1 1.7-2.1 0-3.2-.5-4.1-1l-.7 3.6c.9.4 2.7.9 5 .9 4.9 0 8.1-2.4 8.1-6zM8.6 1.5L.3 18.7h5.5l1.1-2.8h6.6l.6 2.8h4.8L11.2 1.5H8.6zm-.6 10.5l2.5-6.3 1.4 6.3H8z"
        fill="#1A1F71"
      />
    </svg>
  );
}

// PayPal Logo SVG
function PayPalLogo() {
  return (
    <svg viewBox="0 0 80 22" className="h-6 w-auto" aria-label="PayPal">
      <path
        d="M10.2 1.5H4.5c-.4 0-.8.3-.9.7L1.1 17.1c-.1.4.2.7.6.7h2.7c.4 0 .8-.3.9-.7l.6-4c.1-.4.5-.7.9-.7h1.6c3.4 0 5.4-1.6 5.9-4.9.2-1.4 0-2.5-.6-3.3-.8-1-2.1-1.5-3.9-1.5zM11 6.2c-.2 1.5-1.5 1.5-2.7 1.5H7.2l.5-3.2c0-.2.2-.4.5-.4h.2c.8 0 1.6 0 2 .2.7.3.8.9.6 1.9z"
        fill="#003087"
      />
      <path
        d="M25.9 4.5h-2.7c-.3 0-.5.2-.6.4l-.1.6-.2-.3c-.5-.7-1.7-1-2.9-1-2.7 0-5.1 2.1-5.5 5-.2 1.5.1 2.9 1 3.8.8.8 2 1.1 3.3 1.1 2.4 0 3.7-1.5 3.7-1.5l-.1.6c-.1.4.2.7.6.7h2.5c.4 0 .8-.3.9-.7l1.5-9.5c.1-.4-.2-.7-.6-.7-.1 0-.1 0-.2.1zm-4 5.8c-.2 1.3-1.2 2.1-2.5 2.1-.6 0-1.1-.2-1.4-.5-.3-.4-.5-.9-.4-1.5.2-1.3 1.2-2.2 2.4-2.2.6 0 1.1.2 1.4.6.4.3.5.8.5 1.5z"
        fill="#0070E0"
      />
      <path
        d="M39.7 4.5h-2.7c-.3 0-.5.2-.6.4l-.1.6-.2-.3c-.5-.7-1.7-1-2.9-1-2.7 0-5.1 2.1-5.5 5-.2 1.5.1 2.9 1 3.8.8.8 2 1.1 3.3 1.1 2.4 0 3.7-1.5 3.7-1.5l-.1.6c-.1.4.2.7.6.7h2.5c.4 0 .8-.3.9-.7l1.5-9.5c.1-.4-.2-.7-.6-.7 0 0-.1 0-.1.1zm-4 5.8c-.2 1.3-1.2 2.1-2.5 2.1-.6 0-1.1-.2-1.4-.5-.3-.4-.5-.9-.4-1.5.2-1.3 1.2-2.2 2.4-2.2.6 0 1.1.2 1.4.6.3.3.5.8.5 1.5z"
        fill="#003087"
      />
      <path
        d="M53.5 4.5h-2.7c-.3 0-.5.2-.6.4l-.1.6-.2-.3c-.5-.7-1.7-1-2.9-1-2.7 0-5.1 2.1-5.5 5-.2 1.5.1 2.9 1 3.8.8.8 2 1.1 3.3 1.1 2.4 0 3.7-1.5 3.7-1.5l-.1.6c-.1.4.2.7.6.7h2.5c.4 0 .8-.3.9-.7l1.5-9.5c0-.4-.3-.7-.7-.7 0 0 0 0-.1.1zm-4 5.8c-.2 1.3-1.2 2.1-2.5 2.1-.6 0-1.1-.2-1.4-.5-.3-.4-.5-.9-.4-1.5.2-1.3 1.2-2.2 2.4-2.2.6 0 1.1.2 1.4.6.3.3.5.8.5 1.5z"
        fill="#0070E0"
      />
      <path
        d="M66.5 1.5h-2.7c-.4 0-.8.3-.9.7l-2.5 15.9h3.6l.6-4.1h2.3c2.7 0 4.5-1.2 5.1-3.6.2-.9.2-1.7-.1-2.3-.5-1.2-1.6-1.9-3.3-1.9-.2 0-.4 0-.6.1l.8-4.8c0-.1-.1-.3-.3-.3v.3zm-2.2 6.1c.2 0 .4 0 .6-.1.8-.1 1.4.1 1.6.6.1.3.1.7 0 1.2-.3 1.5-1.2 2.2-2.5 2.2h-1.8l.5-3.2c.1-.4.4-.7.8-.7h.8v.1-.1z"
        fill="#003087"
      />
    </svg>
  );
}

// Stripe Logo SVG
function StripeLogo() {
  return (
    <svg viewBox="0 0 60 26" className="h-6 w-auto" aria-label="Stripe">
      <path
        d="M59.6 14.1c0-3.3-1.6-5.9-4.6-5.9-3 0-4.9 2.6-4.9 5.9 0 3.9 2.2 5.9 5.3 5.9 1.5 0 2.7-.3 3.7-1v-2.7c-1 .5-2.1.8-3.4.8-1.4 0-2.5-.5-2.7-2.2h6.5c0-.2.1-.9.1-1.8zm-6.6-.9c0-1.4.9-2 1.7-2 .8 0 1.6.6 1.6 2h-3.3zM43.4 8.2c-1.2 0-2 .5-2.5 1l-.2-.8h-3.1v15.4l3.5-.7v-3.8c.5.3 1.1.6 2.1.6 2.2 0 4.1-1.7 4.1-5.5.1-3.5-2-6.2-3.9-6.2zm-.9 7.7c-.7 0-1.1-.2-1.5-.6V11c.4-.4.8-.7 1.5-.7 1.2 0 2 1.7 2 3.4 0 2-.7 3.2-2 3.2zM35.4 7.9l-3.5.7v2.4h-1.5v2.9h1.5v6.3c0 2.6 1.2 3.5 3.1 3.5 1 0 1.7-.2 2.1-.4v-2.9c-.4.1-.9.2-1.5.2-.8 0-1.2-.3-1.2-1.2v-5.5h1.9v-2.9h-1.9V7.9zm-7.1 2.5h-3.6v-2.9h-3.5v2.9h-2.1v2.9h2.1v5.3c0 2.8 1.3 4.1 4.1 4.1 1.2 0 2.1-.2 2.7-.5v-2.8c-.5.2-1.3.3-1.9.3-.9 0-1.4-.3-1.4-1.3v-5.1h3.6v-2.9zm-13.6 5.7c0-.8.7-1.3 1.8-1.3.8 0 1.6.2 2.3.5V11c-.8-.3-1.8-.5-2.9-.5-2.6 0-5.2 1.4-5.2 4.5 0 4.4 6.1 3.7 6.1 5.6 0 .9-.8 1.2-1.9 1.2-1.1 0-2.3-.4-3.2-.9v3c1 .5 2.2.7 3.2.7 2.7 0 5.4-1.3 5.4-4.5.1-4.8-6.2-3.9-6.2-5.7-.1-.1.1-.4.8-.4zM5.9 8.2c-1.2 0-2.1.4-2.6 1L3 8.4H0v15h3.5v-3.8c.5.3 1.2.6 2.2.6 2.2 0 4.1-1.7 4.1-5.6-.1-3.4-2.1-6-3.9-6zm-.9 7.7c-.7 0-1.1-.3-1.5-.7v-4.2c.4-.4.9-.7 1.5-.7 1.2 0 2 1.7 2 3.4 0 2-.7 3.2-2 3.2z"
        fill="#635BFF"
      />
    </svg>
  );
}

// Razorpay Logo SVG
function RazorpayLogo() {
  return (
    <svg viewBox="0 0 100 22" className="h-5 w-auto" aria-label="Razorpay">
      <path
        d="M14.3 0L5.1 19.7c-.2.4-.6.7-1.1.7H.4L9.6.7c.2-.4.6-.7 1.1-.7h3.6zm5.5 0l-9.2 19.7c-.2.4-.6.7-1.1.7H6l9.2-19.7c.2-.4.6-.7 1.1-.7h3.5zm5.5 0l-9.2 19.7c-.2.4-.6.7-1.1.7h-3.5L21 3.4l4.3 9.2h-3.6l-2.3-5.1 3.4-7.4c.2-.4.6-.7 1.1-.7h3.4zm21.3 5.3h-3.6v14.4h3.6V5.3zm-1.8-4.6c-1.2 0-2.1.9-2.1 2.1s.9 2.1 2.1 2.1 2.1-.9 2.1-2.1-.9-2.1-2.1-2.1zm11.7 4.6c-1.9 0-3.3.9-4 2.1V5.3h-3.6v14.4h3.6v-7.4c0-2 1.1-3.1 2.8-3.1 1.7 0 2.6 1.1 2.6 3v7.5h3.6v-8.3c0-3.3-1.8-5.7-5-5.7zm13.8 0c-3.8 0-6.4 2.8-6.4 6.3s2.6 6.3 6.4 6.3c3.8 0 6.4-2.8 6.4-6.3s-2.6-6.3-6.4-6.3zm0 9.6c-1.8 0-3-1.4-3-3.3s1.2-3.3 3-3.3 3 1.4 3 3.3-1.2 3.3-3 3.3zm14.8-9.6c-1.6 0-2.9.7-3.6 1.8V5.3H84v14.4h3.6v-7.4c0-2 1.1-3.1 2.8-3.1 1.6 0 2.6 1.1 2.6 3v7.5h3.6v-8.3c0-3.3-1.9-5.7-4.9-5.7zm-59.7 0c-1.9 0-3.4.7-4.4 2V5.3h-3.6v14.4h3.6v-7.6c0-1.9 1-2.9 2.5-2.9 1.4 0 2.3.9 2.3 2.6v8h3.6v-8.6c0-3.4-1.7-5.8-4-5.8z"
        fill="#0D94FB"
      />
    </svg>
  );
}

// UPI Logo SVG
function UpiLogo() {
  return (
    <svg viewBox="0 0 60 25" className="h-5 w-auto" aria-label="UPI">
      <path
        d="M8.8 2.5L5.4 9.9H7l1-2.3h3.5l1 2.3h1.7L10.7 2.5H8.8zm-.3 4.2l1.1-2.6 1.1 2.6H8.5z"
        fill="#097939"
      />
      <path d="M17.4 2.5v6.2h3.2v1.2h-8.1V2.5h1.6v7.4h3.2V2.5h.1z" fill="#097939" />
      <path d="M21.7 2.5h1.6v6.2h3.3V2.5h1.6v7.4h-6.5V2.5z" fill="#097939" />
      <path
        d="M33.9 2.5h-1.5l-3.3 7.4h1.7l.7-1.7h3.4l.7 1.7h1.7l-3.4-7.4zm-1.6 4.5l1.1-2.7 1.1 2.7h-2.2z"
        fill="#097939"
      />
      <path
        d="M40.6 5.2c-1.1 0-1.8.4-2.2 1.1V2.5h-1.5v7.4h1.5V7.6c0-1.2.7-1.9 1.8-1.9.2 0 .4 0 .6.1V4.3c-.1 0-.1-.1-.2-.1z"
        fill="#097939"
      />
      <path
        d="M44.9 5.2c-1.8 0-3.1 1.3-3.1 3s1.3 3 3.1 3c1.8 0 3.1-1.3 3.1-3s-1.3-3-3.1-3zm0 4.6c-.9 0-1.6-.7-1.6-1.6 0-.9.7-1.6 1.6-1.6.9 0 1.6.7 1.6 1.6 0 .9-.7 1.6-1.6 1.6z"
        fill="#097939"
      />
      <path
        d="M53.2 5.2c-.9 0-1.7.4-2.1 1.1V5.4h-1.5v7.4h1.5V8.2c0-1.2.7-1.9 1.7-1.9 1 0 1.6.7 1.6 1.8v3.7h1.5V7.8c.1-1.6-.9-2.6-2.7-2.6z"
        fill="#097939"
      />
      <path
        d="M57.6 3.6c-.5 0-.9.4-.9.9s.4.9.9.9.9-.4.9-.9-.4-.9-.9-.9zm-.7 1.8h1.5v5.5h-1.5V5.4z"
        fill="#097939"
      />
      <circle cx="6.5" cy="16" r="1.5" fill="#606060" />
      <circle cx="12" cy="16" r="1.5" fill="#606060" />
      <path d="M8 16h3" stroke="#606060" strokeWidth=".5" />
    </svg>
  );
}

// RuPay Logo SVG
function RupayLogo() {
  return (
    <svg viewBox="0 0 70 25" className="h-5 w-auto" aria-label="RuPay">
      <path
        d="M12.3 5.8c-1.6 0-2.8.7-3.4 1.9V2.5H7v12.9h2v-5.4c.6 1.1 1.8 1.8 3.3 1.8 2.5 0 4.3-1.9 4.3-4.5 0-2.6-1.8-4.5-4.3-4.5zm-.2 7c-1.4 0-2.4-1-2.4-2.5s1-2.5 2.4-2.5 2.4 1 2.4 2.5-1.1 2.5-2.4 2.5z"
        fill="#1A1A1A"
      />
      <path
        d="M20.1 5.8c-2.6 0-4.5 1.9-4.5 4.5s1.9 4.5 4.5 4.5 4.5-1.9 4.5-4.5-1.9-4.5-4.5-4.5zm0 7c-1.4 0-2.4-1-2.4-2.5s1-2.5 2.4-2.5 2.4 1 2.4 2.5-1 2.5-2.4 2.5z"
        fill="#1A1A1A"
      />
      <path
        d="M28.4 8.3V6h-2v9.4h2v-4.5c0-1.6.9-2.3 2.2-2.3.3 0 .6 0 .8.1V6c-1.6 0-2.5.8-3 2.3z"
        fill="#1A1A1A"
      />
      <path
        d="M34.8 5.8c-2.6 0-4.5 1.9-4.5 4.5s1.9 4.5 4.5 4.5 4.5-1.9 4.5-4.5-1.9-4.5-4.5-4.5zm0 7c-1.4 0-2.4-1-2.4-2.5s1-2.5 2.4-2.5 2.4 1 2.4 2.5-1 2.5-2.4 2.5z"
        fill="#1A1A1A"
      />
      <path
        d="M41.3 6v7.4c0 2.3 1.3 3.5 3.5 3.5.8 0 1.4-.1 1.8-.3v-1.8c-.3.1-.8.2-1.4.2-1.2 0-1.9-.6-1.9-1.9V7.7h3.1V6h-3.1V3.2l-2 .4V6h-2z"
        fill="#1A1A1A"
      />
      <path
        d="M51.8 5.8c-1.2 0-2.2.5-2.8 1.4V6h-2v9.4h2v-5c0-1.6.9-2.5 2.2-2.5 1.3 0 2 1 2 2.5v5h2v-5.6c0-2.3-1.3-3.9-3.4-3.9z"
        fill="#1A1A1A"
      />
      <path
        d="M60.5 5.8c-2.6 0-4.5 1.9-4.5 4.5s1.9 4.5 4.5 4.5 4.5-1.9 4.5-4.5-1.9-4.5-4.5-4.5zm0 7c-1.4 0-2.4-1-2.4-2.5s1-2.5 2.4-2.5 2.4 1 2.4 2.5-1 2.5-2.4 2.5z"
        fill="#1A1A1A"
      />
      <path
        d="M68.5 5.8c-.4 0-.8 0-1.1.1v1.9c.3-.1.6-.1.9-.1 1.1 0 1.7.7 1.7 1.9v5h2v-5.6c0-2.1-1.2-3.2-3.5-3.2z"
        fill="#1A1A1A"
      />
    </svg>
  );
}

// Payment Methods Component
export function PaymentMethods() {
  const paymentLogos = [
    { Logo: MastercardLogo, name: "Mastercard" },
    { Logo: PayPalLogo, name: "PayPal" },
    { Logo: RazorpayLogo, name: "Razorpay" },
    { Logo: VisaLogo, name: "Visa" },
    { Logo: StripeLogo, name: "Stripe" },
    { Logo: UpiLogo, name: "UPI" },
    { Logo: RupayLogo, name: "RuPay" },
  ];

  return (
    <div className="w-full bg-gradient-to-r from-teal-700 via-teal-800 to-teal-900 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <Shield className="w-5 h-5 text-teal-300" />
          <span className="text-teal-100 text-sm font-semibold uppercase tracking-wider">
            Secure Payment
          </span>
          <Lock className="w-4 h-4 text-teal-300" />
        </div>

        {/* Payment Icons Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/20"
        >
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
            {paymentLogos.map(({ Logo, name }, index) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                whileHover={{ scale: 1.1, y: -2 }}
                className="flex items-center justify-center px-3 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
              >
                <Logo />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Additional Trust Text */}
        <p className="text-center text-teal-200/70 text-xs mt-4">
          All transactions are encrypted and secure. We never store your card details.
        </p>
      </div>
    </div>
  );
}

// Compact version for footer
export function PaymentMethodsCompact() {
  const paymentLogos = [
    { Logo: MastercardLogo, name: "Mastercard" },
    { Logo: VisaLogo, name: "Visa" },
    { Logo: UpiLogo, name: "UPI" },
    { Logo: RupayLogo, name: "RuPay" },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {paymentLogos.map(({ Logo, name }) => (
        <div
          key={name}
          className="flex items-center justify-center px-2 py-1.5 bg-white rounded-md shadow-sm"
        >
          <Logo />
        </div>
      ))}
    </div>
  );
}
