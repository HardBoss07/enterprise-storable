import Image from "next/image";

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="container mx-auto py-6 px-4 flex flex-col items-center gap-3">
        <div className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
          <Image 
            src="/logo/icon.svg" 
            alt="Storable Icon" 
            width={24} 
            height={24} 
          />
          <span className="font-bold tracking-tight text-text-primary">Storable</span>
        </div>
        <p className="text-sm text-text-muted">
          All rights reserved. Created by{" "}
          <a
            href="https://m4tt3o.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline font-medium"
          >
            Matteo Bosshard
          </a>
        </p>
      </div>
    </footer>
  );
}
