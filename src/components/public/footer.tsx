"use client";

import { FlickeringFooter } from "@/components/ui/flickering-footer";
import { FOOTER_QUICK_LINKS, FOOTER_LEGAL_LINKS, SERVICE_AREAS } from "@/lib/certificate-types";
import { Facebook, Twitter, Instagram, Linkedin, Mail } from "lucide-react";

export default function PublicFooter() {
  const footerLinks = [
    {
      title: "Quick Links",
      links: FOOTER_QUICK_LINKS.map((link, index) => ({
        id: index + 1,
        title: link.name,
        url: link.href,
      })),
    },
    {
      title: "Services",
      links: [
        { id: 5, title: "Sick Leave Certificate", url: "/apply/sick-leave" },
        { id: 6, title: "Fitness Certificate", url: "/apply/fitness" },
        { id: 7, title: "Work From Home", url: "/apply/work-from-home" },
        { id: 8, title: "All Certificates", url: "/#certificates" },
      ],
    },
    {
      title: "Legal",
      links: FOOTER_LEGAL_LINKS.map((link, index) => ({
        id: index + 9,
        title: link.name,
        url: link.href,
      })),
    },
  ];

  const socialLinks = [
    {
      icon: <Facebook className="h-4 w-4" />,
      href: "https://facebook.com/medproofdocs",
      label: "Facebook",
    },
    {
      icon: <Twitter className="h-4 w-4" />,
      href: "https://twitter.com/medproofdocs",
      label: "Twitter",
    },
    {
      icon: <Instagram className="h-4 w-4" />,
      href: "https://instagram.com/medproofdocs",
      label: "Instagram",
    },
    {
      icon: <Linkedin className="h-4 w-4" />,
      href: "https://linkedin.com/company/medproofdocs",
      label: "LinkedIn",
    },
    {
      icon: <Mail className="h-4 w-4" />,
      href: "mailto:support@medproofdocs.com",
      label: "Email",
    },
  ];

  return (
    <FlickeringFooter
      brandName="MediProofDocs"
      description="Get your medical certificate online from verified doctors. Streamlined process with secure verification and fast delivery."
      footerLinks={footerLinks}
      socialLinks={socialLinks}
      serviceAreas={SERVICE_AREAS}
      gridText="MediProofDocs"
    />
  );
}
