"use client";

import { motion } from "framer-motion";

const TRUST_STEPS = [
  {
    id: "01",
    title: "Data Privacy and Protection",
    text: "We respect your privacy and treat your personal and medical details with care. All information is securely handled and used only for doctor consultation and issuing your medical certificate. Our system is built to protect your details at every step.",
    position: "below",
  },
  {
    id: "02",
    title: "Genuine And Verified Certificates",
    text: "Medical certificates are provided only after consultation with a registered Indian medical practitioner. Each certificate carries the doctor's name and registration number, ensuring it is genuine and acceptable for official and professional use across India.",
    position: "above",
  },
  {
    id: "03",
    title: "Easy And Convenient Process",
    text: "Our online service is designed to be simple and easy to use. You can submit your request, speak with a doctor, and receive your medical certificate smoothly, without delays or complicated steps.",
    position: "below",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const headerVariants = {
  hidden: { opacity: 0, y: -30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const lineVariants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: {
      duration: 1,
      ease: "easeInOut",
    },
  },
};

const stepVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const mobileItemVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export function TrustSection() {
  return (
    <section className="relative px-4 py-20 lg:py-28 mb-2.5 overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop')" }}
      />
      {/* Light Primary Overlay */}
      <div className="absolute inset-0 bg-primary/85" />
      
      <div className="mx-auto max-w-6xl relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          {/* Header */}
          <motion.div variants={headerVariants} className="text-center">
            <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl text-white">
              Why Trust Us?
            </h2>
            <p className="mt-4 mx-auto max-w-2xl text-white/80 text-lg">
              Trusted by patients across India for secure, doctor-verified, and hassle-free certificate support.
            </p>
          </motion.div>

          {/* Desktop Timeline */}
          <div className="hidden lg:block relative mt-64 mb-52">
            {/* Main horizontal line */}
            <motion.div
              variants={lineVariants}
              className="absolute top-1/2 left-0 right-0 h-0.5 bg-white -translate-y-1/2 origin-left"
            />
            
            {/* Start dot */}
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              viewport={{ once: true }}
              className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white"
            />
            
            {/* End dot */}
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ delay: 1.2, duration: 0.3 }}
              viewport={{ once: true }}
              className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white"
            />

            <div className="flex justify-between items-center relative px-8">
              {TRUST_STEPS.map((step, index) => (
                <motion.div
                  key={step.id}
                  variants={stepVariants}
                  custom={index}
                  className="flex flex-col items-center relative"
                >
                  {/* Text above */}
                  {step.position === "above" && (
                    <>
                      <motion.div
                        variants={textVariants}
                        className="absolute bottom-full mb-16 text-center w-56"
                      >
                        <h3 className="text-sm font-bold text-white mb-2">{step.title}</h3>
                        <p className="text-xs text-white/70 leading-relaxed line-clamp-6">
                          {step.text}
                        </p>
                      </motion.div>
                      {/* Vertical connector line going up */}
                      <motion.div
                        initial={{ scaleY: 0 }}
                        whileInView={{ scaleY: 1 }}
                        transition={{ delay: 0.8 + index * 0.2, duration: 0.3 }}
                        viewport={{ once: true }}
                        className="absolute bottom-full mb-1 w-0.5 h-14 bg-white origin-bottom"
                      />
                      {/* Small connector dot at top */}
                      <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        transition={{ delay: 1 + index * 0.2, duration: 0.2 }}
                        viewport={{ once: true }}
                        className="absolute bottom-full mb-14 w-2 h-2 rounded-full bg-white"
                      />
                    </>
                  )}

                  {/* Number circle */}
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400 }}
                    className="relative z-10 flex items-center justify-center w-16 h-16 rounded-full border-3 border-white bg-primary shadow-lg"
                  >
                    <span className="text-2xl font-bold text-white">{step.id}</span>
                  </motion.div>

                  {/* Text below */}
                  {step.position === "below" && (
                    <>
                      {/* Vertical connector line going down */}
                      <motion.div
                        initial={{ scaleY: 0 }}
                        whileInView={{ scaleY: 1 }}
                        transition={{ delay: 0.8 + index * 0.2, duration: 0.3 }}
                        viewport={{ once: true }}
                        className="absolute top-full mt-1 w-0.5 h-14 bg-white origin-top"
                      />
                      {/* Small connector dot at bottom */}
                      <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        transition={{ delay: 1 + index * 0.2, duration: 0.2 }}
                        viewport={{ once: true }}
                        className="absolute top-full mt-14 w-2 h-2 rounded-full bg-white"
                      />
                      <motion.div
                        variants={textVariants}
                        className="absolute top-full mt-16 text-center w-56"
                      >
                        <h3 className="text-sm font-bold text-white mb-2">{step.title}</h3>
                        <p className="text-xs text-white/70 leading-relaxed line-clamp-6">
                          {step.text}
                        </p>
                      </motion.div>
                    </>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Tablet Timeline */}
          <div className="hidden md:block lg:hidden relative mt-52 mb-44">
            {/* Main horizontal line */}
            <motion.div
              variants={lineVariants}
              className="absolute top-1/2 left-4 right-4 h-0.5 bg-white -translate-y-1/2 origin-left"
            />
            
            {/* Start dot */}
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              viewport={{ once: true }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white"
            />
            
            {/* End dot */}
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ delay: 1.2, duration: 0.3 }}
              viewport={{ once: true }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white"
            />

            <div className="flex justify-between items-center relative px-8">
              {TRUST_STEPS.map((step, index) => (
                <motion.div
                  key={step.id}
                  variants={stepVariants}
                  custom={index}
                  className="flex flex-col items-center relative"
                >
                  {/* Text above */}
                  {step.position === "above" && (
                    <>
                      <motion.div variants={textVariants} className="absolute bottom-full mb-14 text-center w-40">
                        <h3 className="text-xs font-bold text-white mb-1">{step.title}</h3>
                        <p className="text-[10px] text-white/70 leading-relaxed line-clamp-6">
                          {step.text}
                        </p>
                      </motion.div>
                      <motion.div
                        initial={{ scaleY: 0 }}
                        whileInView={{ scaleY: 1 }}
                        transition={{ delay: 0.8 + index * 0.2, duration: 0.3 }}
                        viewport={{ once: true }}
                        className="absolute bottom-full mb-1 w-0.5 h-12 bg-white origin-bottom"
                      />
                      <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        transition={{ delay: 1 + index * 0.2, duration: 0.2 }}
                        viewport={{ once: true }}
                        className="absolute bottom-full mb-12 w-1.5 h-1.5 rounded-full bg-white"
                      />
                    </>
                  )}

                  {/* Number circle */}
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400 }}
                    className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 border-white bg-primary"
                  >
                    <span className="text-lg font-bold text-white">{step.id}</span>
                  </motion.div>

                  {/* Text below */}
                  {step.position === "below" && (
                    <>
                      <motion.div
                        initial={{ scaleY: 0 }}
                        whileInView={{ scaleY: 1 }}
                        transition={{ delay: 0.8 + index * 0.2, duration: 0.3 }}
                        viewport={{ once: true }}
                        className="absolute top-full mt-1 w-0.5 h-12 bg-white origin-top"
                      />
                      <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        transition={{ delay: 1 + index * 0.2, duration: 0.2 }}
                        viewport={{ once: true }}
                        className="absolute top-full mt-12 w-1.5 h-1.5 rounded-full bg-white"
                      />
                      <motion.div variants={textVariants} className="absolute top-full mt-14 text-center w-40">
                        <h3 className="text-xs font-bold text-white mb-1">{step.title}</h3>
                        <p className="text-[10px] text-white/70 leading-relaxed line-clamp-6">
                          {step.text}
                        </p>
                      </motion.div>
                    </>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Mobile Timeline - Vertical */}
          <motion.div
            variants={containerVariants}
            className="md:hidden relative mt-12"
          >
            {/* Vertical line */}
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              viewport={{ once: true }}
              className="absolute left-7 top-0 bottom-0 w-0.5 bg-white origin-top"
            />

            <div className="space-y-10">
              {TRUST_STEPS.map((step, index) => (
                <motion.div
                  key={step.id}
                  variants={mobileItemVariants}
                  custom={index}
                  className="flex items-start gap-6"
                >
                  {/* Number circle */}
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400 }}
                    className="relative z-10 shrink-0 flex items-center justify-center w-14 h-14 rounded-full border-2 border-white bg-primary"
                  >
                    <span className="text-xl font-bold text-white">{step.id}</span>
                  </motion.div>

                  {/* Text */}
                  <div className="pt-1">
                    <h3 className="text-base font-bold text-white mb-2">{step.title}</h3>
                    <p className="text-sm text-white/70 leading-relaxed">
                      {step.text}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
