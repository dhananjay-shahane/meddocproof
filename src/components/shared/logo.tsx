import Image from "next/image";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <div className={`flex items-center justify-center ${className ?? ""}`}>
      <Image
        src="/images/logo.png"
        alt="MediProofDocs"
        width={150}
        height={100}
        className="w-full h-full object-cover rounded-md"
      />
    </div>
  );
}
