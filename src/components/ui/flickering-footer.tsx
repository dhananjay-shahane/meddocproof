"use client";

import { ChevronRightIcon } from "@radix-ui/react-icons";
import { ClassValue, clsx } from "clsx";
import * as Color from "color-bits";
import Link from "next/link";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { Logo } from "@/components/shared/logo";
import { Facebook, Twitter, Instagram, Linkedin, Mail } from "lucide-react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getRGBA = (
  cssColor: React.CSSProperties["color"],
  fallback: string = "rgba(180, 180, 180)",
): string => {
  if (typeof window === "undefined") return fallback;
  if (!cssColor) return fallback;

  try {
    if (typeof cssColor === "string" && cssColor.startsWith("var(")) {
      const element = document.createElement("div");
      element.style.color = cssColor;
      document.body.appendChild(element);
      const computedColor = window.getComputedStyle(element).color;
      document.body.removeChild(element);
      return Color.formatRGBA(Color.parse(computedColor));
    }

    return Color.formatRGBA(Color.parse(cssColor));
  } catch (e) {
    console.error("Color parsing failed:", e);
    return fallback;
  }
};

export const colorWithOpacity = (color: string, opacity: number): string => {
  if (!color.startsWith("rgb")) return color;
  return Color.formatRGBA(Color.alpha(Color.parse(color), opacity));
};

interface FlickeringGridProps extends React.HTMLAttributes<HTMLDivElement> {
  squareSize?: number;
  gridGap?: number;
  flickerChance?: number;
  color?: string;
  width?: number;
  height?: number;
  className?: string;
  maxOpacity?: number;
  text?: string;
  textColor?: string;
  fontSize?: number;
  fontWeight?: number | string;
}

export const FlickeringGrid: React.FC<FlickeringGridProps> = ({
  squareSize = 3,
  gridGap = 3,
  flickerChance = 0.2,
  color = "#B4B4B4",
  width,
  height,
  className,
  maxOpacity = 0.15,
  text = "",
  fontSize = 140,
  fontWeight = 600,
  ...props
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  const memoizedColor = useMemo(() => {
    return getRGBA(color);
  }, [color]);

  const drawGrid = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
      cols: number,
      rows: number,
      squares: Float32Array,
      dpr: number,
    ) => {
      ctx.clearRect(0, 0, width, height);

      const maskCanvas = document.createElement("canvas");
      maskCanvas.width = width;
      maskCanvas.height = height;
      const maskCtx = maskCanvas.getContext("2d", { willReadFrequently: true });
      if (!maskCtx) return;

      if (text) {
        maskCtx.save();
        maskCtx.scale(dpr, dpr);
        maskCtx.fillStyle = "white";
        maskCtx.font = `${fontWeight} ${fontSize}px "Geist", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
        maskCtx.textAlign = "center";
        maskCtx.textBaseline = "middle";
        maskCtx.fillText(text, width / (2 * dpr), height / (2 * dpr));
        maskCtx.restore();
      }

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * (squareSize + gridGap) * dpr;
          const y = j * (squareSize + gridGap) * dpr;
          const squareWidth = squareSize * dpr;
          const squareHeight = squareSize * dpr;

          const maskData = maskCtx.getImageData(
            x,
            y,
            squareWidth,
            squareHeight,
          ).data;
          const hasText = maskData.some(
            (value, index) => index % 4 === 0 && value > 0,
          );

          const opacity = squares[i * rows + j];
          const finalOpacity = hasText
            ? Math.min(1, opacity * 3 + 0.4)
            : opacity;

          ctx.fillStyle = colorWithOpacity(memoizedColor, finalOpacity);
          ctx.fillRect(x, y, squareWidth, squareHeight);
        }
      }
    },
    [memoizedColor, squareSize, gridGap, text, fontSize, fontWeight],
  );

  const setupCanvas = useCallback(
    (canvas: HTMLCanvasElement, width: number, height: number) => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      const cols = Math.ceil(width / (squareSize + gridGap));
      const rows = Math.ceil(height / (squareSize + gridGap));

      const squares = new Float32Array(cols * rows);
      for (let i = 0; i < squares.length; i++) {
        squares[i] = Math.random() * maxOpacity;
      }

      return { cols, rows, squares, dpr };
    },
    [squareSize, gridGap, maxOpacity],
  );

  const updateSquares = useCallback(
    (squares: Float32Array, deltaTime: number) => {
      for (let i = 0; i < squares.length; i++) {
        if (Math.random() < flickerChance * deltaTime) {
          squares[i] = Math.random() * maxOpacity;
        }
      }
    },
    [flickerChance, maxOpacity],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let gridParams: ReturnType<typeof setupCanvas>;

    const updateCanvasSize = () => {
      const newWidth = width || container.clientWidth;
      const newHeight = height || container.clientHeight;
      setCanvasSize({ width: newWidth, height: newHeight });
      gridParams = setupCanvas(canvas, newWidth, newHeight);
    };

    updateCanvasSize();

    let lastTime = 0;
    const animate = (time: number) => {
      if (!isInView) return;

      const deltaTime = (time - lastTime) / 1000;
      lastTime = time;

      updateSquares(gridParams.squares, deltaTime);
      drawGrid(
        ctx,
        canvas.width,
        canvas.height,
        gridParams.cols,
        gridParams.rows,
        gridParams.squares,
        gridParams.dpr,
      );
      animationFrameId = requestAnimationFrame(animate);
    };

    const resizeObserver = new ResizeObserver(() => {
      updateCanvasSize();
    });

    resizeObserver.observe(container);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0 },
    );

    intersectionObserver.observe(canvas);

    if (isInView) {
      animationFrameId = requestAnimationFrame(animate);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, [setupCanvas, updateSquares, drawGrid, width, height, isInView]);

  return (
    <div
      ref={containerRef}
      className={cn(`h-full w-full ${className}`)}
      {...props}
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none"
        style={{
          width: canvasSize.width,
          height: canvasSize.height,
        }}
      />
    </div>
  );
};

export function useMediaQuery(query: string) {
  const [value, setValue] = useState(false);

  useEffect(() => {
    function checkQuery() {
      const result = window.matchMedia(query);
      setValue(result.matches);
    }

    checkQuery();

    window.addEventListener("resize", checkQuery);

    const mediaQuery = window.matchMedia(query);
    mediaQuery.addEventListener("change", checkQuery);

    return () => {
      window.removeEventListener("resize", checkQuery);
      mediaQuery.removeEventListener("change", checkQuery);
    };
  }, [query]);

  return value;
}

interface FooterLink {
  id: number;
  title: string;
  url: string;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

interface SocialLink {
  icon: React.ReactNode;
  href: string;
  label: string;
}

interface FlickeringFooterProps {
  logoSrc?: string;
  brandName?: string;
  description?: string;
  footerLinks?: FooterColumn[];
  socialLinks?: SocialLink[];
  serviceAreas?: string[];
  gridText?: string;
}

const defaultSocialLinks: SocialLink[] = [
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

export const FlickeringFooter: React.FC<FlickeringFooterProps> = ({
  logoSrc: _logoSrc = "/logo.png",
  brandName: _brandName = "MediProofDocs",
  description = "Get your medical certificate online from verified doctors. Streamlined process with secure verification and fast delivery.",
  footerLinks = [
    {
      title: "Quick Links",
      links: [
        { id: 1, title: "Home", url: "/" },
        { id: 2, title: "About Us", url: "/about" },
        { id: 3, title: "Contact", url: "/contact" },
        { id: 4, title: "FAQ", url: "/faq" },
      ],
    },
    {
      title: "Services",
      links: [
        { id: 5, title: "Sick Leave", url: "/apply/sick-leave" },
        { id: 6, title: "Fitness Certificate", url: "/apply/fitness" },
        { id: 7, title: "Work From Home", url: "/apply/work-from-home" },
        { id: 8, title: "All Certificates", url: "/#certificates" },
      ],
    },
    {
      title: "Legal",
      links: [
        { id: 9, title: "Privacy Policy", url: "/privacy" },
        { id: 10, title: "Terms of Service", url: "/terms" },
        { id: 11, title: "Refund Policy", url: "/refund-policy" },
        { id: 12, title: "Doctor Portal", url: "/doctor/login" },
      ],
    },
  ],
  socialLinks = defaultSocialLinks,
  serviceAreas = [],
  gridText = "MediProofDocs",
}) => {
  const tablet = useMediaQuery("(max-width: 1024px)");
  const mobile = useMediaQuery("(max-width: 640px)");

  return (
    <footer id="footer" className="w-full pb-0 bg-gradient-to-r from-blue-900 to-teal-900 text-white shadow-[0_-8px_30px_rgb(0,0,0,0.3)]">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between p-4 md:p-6 lg:p-10 max-w-[90rem] mx-auto gap-6 md:gap-8">
        <div className="flex flex-col items-start justify-start gap-y-4 max-w-xs">
          <Link href="/" className="flex items-center gap-2 md:gap-3">
             <Logo />
          </Link>
          <p className="tracking-tight text-white/80 text-sm font-medium leading-relaxed">
            {description}
          </p>
          <div className="flex items-center gap-3 pt-2">
            {socialLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className={`flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white/80 transition-all duration-300 hover:text-white hover:scale-110 active:scale-95 backdrop-blur-sm ${(link as any).hoverBg || 'hover:bg-white/10 hover:border-white'}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.icon}
                <span className="sr-only">{link.label}</span>
              </Link>
            ))}
          </div>
        </div>
        <div className="pt-0 md:w-2/3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {footerLinks.map((column, columnIndex) => (
              <ul key={columnIndex} className="flex flex-col gap-y-2">
                <li className="mb-2 text-sm font-semibold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
                  {column.title}
                </li>
                {column.links.map((link) => (
                  <li
                    key={link.id}
                    className="group inline-flex cursor-pointer items-center justify-start gap-1 text-sm text-white/70"
                  >
                    <Link href={link.url} className="hover:text-white transition-colors">
                      {link.title}
                    </Link>
                    <div className="flex size-4 items-center justify-center border border-white/20 rounded translate-x-0 transform opacity-0 transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:opacity-100">
                      <ChevronRightIcon className="h-3 w-3 text-white" />
                    </div>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>

      {serviceAreas.length > 0 && (
        <div className="border-t border-white/10 py-6 px-6 md:px-10 max-w-[90rem] mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            {/* Service Areas - Left */}
            <div className="flex-1">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/60">
                Our Service Areas
              </p>
              <div className="flex flex-wrap gap-x-1 gap-y-0.5">
                {serviceAreas.map((city, index) => (
                  <a
                    key={index}
                    href="/#certificates"
                    className="text-xs font-medium text-blue-400 border-b border-blue-400 hover:text-blue-300 hover:border-blue-300 transition-all duration-200 leading-relaxed"
                  >
                    {city}
                  </a>
                  ))}
              </div>
            </div>

            {/* Secure Payment - Right */}
            <div className="lg:shrink-0">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/60">
                Secure Payment
              </p>
              <div className="flex flex-wrap items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3 border border-blue-400/30 w-fit">
                <img src="https://cdn.jsdelivr.net/gh/nicepay-dev/payment-icons@master/icons/mastercard.svg" alt="Mastercard" className="h-8 object-contain" />
                <img src="https://cdn.jsdelivr.net/gh/nicepay-dev/payment-icons@master/icons/paypal.svg" alt="PayPal" className="h-7 object-contain" />
                <img src="https://cdn.razorpay.com/static/assets/logo/payment.svg" alt="Razorpay" className="h-6 object-contain brightness-0 invert" />
                <img src="https://cdn.jsdelivr.net/gh/nicepay-dev/payment-icons@master/icons/visa.svg" alt="Visa" className="h-7 object-contain" />
                <span className="text-sm font-bold text-cyan-400 tracking-wide">stripe</span>
                <span className="text-sm font-bold text-white/90 tracking-wide">UPI</span>
                <span className="text-xs font-semibold text-yellow-400 tracking-wide">RuPay</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="w-full h-32 md:h-40 relative z-0">
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900 to-transparent z-10 from-0% to-40%" />
        <div className="absolute inset-0 mx-4 md:mx-6">
          <FlickeringGrid
            text={mobile ? "" : (tablet ? "Medproof" : gridText)}
            fontSize={tablet ? 50 : 70}
            className="h-full w-full"
            squareSize={2}
            gridGap={tablet ? 2 : 3}
            color="rgba(100, 200, 255, 0.4)"
            maxOpacity={0.3}
            flickerChance={0.1}
          />
        </div>
      </div>
      <div className="border-t border-white/10 py-4 px-4 md:px-6 lg:px-10">
        <div className="max-w-[90rem] mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-white/60">
          <p>©{new Date().getFullYear()} <span className="text-white text-[10px] md:text-xs">Medi</span><span className="text-green-400 text-[10px] md:text-xs">Proof</span><span className="text-white text-[10px] md:text-xs">Docs</span>. All rights reserved.</p>
          <p className="hidden md:block">All certificates are issued by registered medical practitioners.</p>
        </div>
      </div>
    </footer>
  );
};

export default FlickeringFooter;
