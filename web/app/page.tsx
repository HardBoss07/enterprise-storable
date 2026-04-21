import Link from "next/link";
import {
  ArrowRight,
  Shield,
  Zap,
  HardDrive,
  Layout,
  Search,
  FolderPlus,
  Share2,
  File,
  Folder,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

/**
 * Landing Page: High-conversion hero and feature showcase.
 */
export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-8rem)]">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-20 px-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">
          YOUR DATA, <span className="text-primary">STORABLE</span> ANYWHERE.
        </h1>
        <p className="text-xl text-text-secondary max-w-2xl mb-10 leading-relaxed">
          The high-performance, private file management system designed for
          self-hosters. Secure, fast, and completely under your control.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/register">
            <Button size="lg" className="px-8 py-4 text-lg font-bold group">
              Get Started for Free
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/login">
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-4 text-lg font-bold"
            >
              Sign In to Dashboard
            </Button>
          </Link>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-20 px-6 bg-surface-100/30 border-y border-surface-200">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Shield className="text-primary" size={32} />}
            title="Privacy First"
            description="Built for self-hosting. Your files never leave your infrastructure unless you decide to share them."
          />
          <FeatureCard
            icon={<Zap className="text-accent" size={32} />}
            title="Lightning Fast"
            description="Powered by a high-performance Spring Boot backend and a modern Next.js frontend for instant interactions."
          />
          <FeatureCard
            icon={<Layout className="text-primary" size={32} />}
            title="Atomic Design"
            description="A beautiful, modular interface that feels like a premium desktop application in your browser."
          />
        </div>
      </section>

      {/* Visual Showcase (Dummy Components) */}
      <section className="py-24 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 space-y-8">
            <h2 className="text-4xl font-black tracking-tight uppercase">
              A POWERFUL <span className="text-accent">FILE EXPLORER</span>.
            </h2>
            <div className="space-y-6">
              <ShowcaseItem
                icon={<FolderPlus size={20} className="text-primary" />}
                title="Virtual File System"
                description="Organize your files logically with recursive folders and intuitive navigation."
              />
              <ShowcaseItem
                icon={<Share2 size={20} className="text-accent" />}
                title="Granular Sharing"
                description="Share folders and files with other users using VIEW, EDIT, or OWNER permissions."
              />
              <ShowcaseItem
                icon={<Search size={20} className="text-primary" />}
                title="Global Search"
                description="Find any file in seconds with our high-speed indexed search engine."
              />
            </div>
          </div>

          <div className="flex-1 relative w-full aspect-square md:aspect-video lg:aspect-square">
            {/* Mock Dashboard Preview */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/10 rounded-3xl blur-3xl opacity-50" />
            <div className="relative h-full w-full bg-bg-main border border-surface-300 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
              {/* Header Mock */}
              <div className="h-12 border-b border-surface-200 flex items-center justify-between px-4 bg-bg-sidebar">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500/50" />
                  <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                  <div className="w-2 h-2 rounded-full bg-green-500/50" />
                </div>
                <div className="h-6 w-48 bg-surface-200 rounded-lg" />
                <div className="w-8 h-8 rounded-full bg-surface-200" />
              </div>

              <div className="flex flex-1">
                {/* Sidebar Mock */}
                <div className="w-48 border-r border-surface-200 bg-bg-sidebar p-4 space-y-4 hidden sm:block">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded bg-surface-200" />
                      <div className="h-3 w-20 bg-surface-200 rounded" />
                    </div>
                  ))}
                </div>

                {/* Content Area Mock */}
                <div className="flex-1 p-6 space-y-6">
                  <div className="flex justify-between items-center">
                    <div className="h-6 w-32 bg-surface-200 rounded-lg" />
                    <div className="flex gap-2">
                      <div className="w-20 h-8 bg-primary/20 rounded-lg" />
                      <div className="w-20 h-8 bg-surface-200 rounded-lg" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {/* Folder Mocks */}
                    <div className="p-4 bg-surface-100 border border-surface-200 rounded-xl flex items-center gap-3">
                      <Folder className="text-accent" size={24} />
                      <div className="h-3 w-20 bg-surface-200 rounded" />
                    </div>
                    <div className="p-4 bg-surface-100 border border-surface-200 rounded-xl flex items-center gap-3">
                      <Folder className="text-accent" size={24} />
                      <div className="h-3 w-16 bg-surface-200 rounded" />
                    </div>

                    {/* File Mocks */}
                    <div className="p-4 bg-surface-100 border border-surface-200 rounded-xl flex items-center gap-3">
                      <File className="text-primary" size={24} />
                      <div className="h-3 w-24 bg-surface-200 rounded" />
                    </div>
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="p-4 bg-surface-100 border border-surface-200 rounded-xl flex items-center gap-3 opacity-50"
                      >
                        <File className="text-text-muted" size={24} />
                        <div className="h-3 w-20 bg-surface-200 rounded" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-3xl mx-auto bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 p-12 rounded-[2.5rem] space-y-8">
          <h2 className="text-4xl font-black uppercase tracking-tight">
            READY TO TAKE CONTROL?
          </h2>
          <p className="text-lg text-text-secondary">
            Join thousands of users who trust Storable for their private data
            management.
          </p>
          <Link href="/register">
            <Button
              size="lg"
              className="px-10 py-5 text-xl font-black rounded-xl"
            >
              START STORING NOW
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-8 rounded-3xl border border-surface-200 bg-surface-100/50 hover:border-primary/50 transition-colors group">
      <div className="mb-6 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-text-secondary leading-relaxed">{description}</p>
    </div>
  );
}

function ShowcaseItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4 items-start">
      <div className="mt-1 p-2 bg-surface-100 border border-surface-200 rounded-lg shrink-0">
        {icon}
      </div>
      <div>
        <h4 className="text-lg font-bold">{title}</h4>
        <p className="text-text-secondary">{description}</p>
      </div>
    </div>
  );
}
