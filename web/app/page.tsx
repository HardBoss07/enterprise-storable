import Link from 'next/link';
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
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

/**
 * Landing Page: High-conversion hero and feature showcase.
 */
export default function LandingPage() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col">
      {/* Hero Section */}
      <section className="animate-in fade-in slide-in-from-bottom-8 flex flex-col items-center justify-center px-6 py-20 text-center duration-700">
        <h1 className="mb-6 text-5xl font-black tracking-tighter md:text-7xl">
          YOUR DATA, <span className="text-primary">STORABLE</span> ANYWHERE.
        </h1>
        <p className="text-text-secondary mb-10 max-w-2xl text-xl leading-relaxed">
          The high-performance, private file management system designed for self-hosters. Secure,
          fast, and completely under your control.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Link href="/register">
            <Button size="lg" className="group px-8 py-4 text-lg font-bold">
              Get Started for Free
              <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg" className="px-8 py-4 text-lg font-bold">
              Sign In to Dashboard
            </Button>
          </Link>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="bg-surface-100/30 border-surface-200 border-y px-6 py-20">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
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
      <section className="overflow-hidden px-6 py-24">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-16 lg:flex-row">
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

          <div className="relative aspect-square w-full flex-1 md:aspect-video lg:aspect-square">
            {/* Mock Dashboard Preview */}
            <div className="from-primary/20 to-accent/10 absolute inset-0 rounded-3xl bg-gradient-to-br opacity-50 blur-3xl" />
            <div className="bg-bg-main border-surface-300 relative flex h-full w-full flex-col overflow-hidden rounded-2xl border shadow-2xl">
              {/* Header Mock */}
              <div className="border-surface-200 bg-bg-sidebar flex h-12 items-center justify-between border-b px-4">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-red-500/50" />
                  <div className="h-2 w-2 rounded-full bg-yellow-500/50" />
                  <div className="h-2 w-2 rounded-full bg-green-500/50" />
                </div>
                <div className="bg-surface-200 h-6 w-48 rounded-lg" />
                <div className="bg-surface-200 h-8 w-8 rounded-full" />
              </div>

              <div className="flex flex-1">
                {/* Sidebar Mock */}
                <div className="border-surface-200 bg-bg-sidebar hidden w-48 space-y-4 border-r p-4 sm:block">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="bg-surface-200 h-4 w-4 rounded" />
                      <div className="bg-surface-200 h-3 w-20 rounded" />
                    </div>
                  ))}
                </div>

                {/* Content Area Mock */}
                <div className="flex-1 space-y-6 p-6">
                  <div className="flex items-center justify-between">
                    <div className="bg-surface-200 h-6 w-32 rounded-lg" />
                    <div className="flex gap-2">
                      <div className="bg-primary/20 h-8 w-20 rounded-lg" />
                      <div className="bg-surface-200 h-8 w-20 rounded-lg" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {/* Folder Mocks */}
                    <div className="bg-surface-100 border-surface-200 flex items-center gap-3 rounded-xl border p-4">
                      <Folder className="text-accent" size={24} />
                      <div className="bg-surface-200 h-3 w-20 rounded" />
                    </div>
                    <div className="bg-surface-100 border-surface-200 flex items-center gap-3 rounded-xl border p-4">
                      <Folder className="text-accent" size={24} />
                      <div className="bg-surface-200 h-3 w-16 rounded" />
                    </div>

                    {/* File Mocks */}
                    <div className="bg-surface-100 border-surface-200 flex items-center gap-3 rounded-xl border p-4">
                      <File className="text-primary" size={24} />
                      <div className="bg-surface-200 h-3 w-24 rounded" />
                    </div>
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="bg-surface-100 border-surface-200 flex items-center gap-3 rounded-xl border p-4 opacity-50"
                      >
                        <File className="text-text-muted" size={24} />
                        <div className="bg-surface-200 h-3 w-20 rounded" />
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
      <section className="px-6 py-20 text-center">
        <div className="from-primary/10 to-accent/10 border-primary/20 mx-auto max-w-3xl space-y-8 rounded-[2.5rem] border bg-gradient-to-r p-12">
          <h2 className="text-4xl font-black tracking-tight uppercase">READY TO TAKE CONTROL?</h2>
          <p className="text-text-secondary text-lg">
            Join thousands of users who trust Storable for their private data management.
          </p>
          <Link href="/register">
            <Button size="lg" className="rounded-xl px-10 py-5 text-xl font-black">
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
    <div className="border-surface-200 bg-surface-100/50 hover:border-primary/50 group rounded-3xl border p-8 transition-colors">
      <div className="mb-6 transition-transform duration-300 group-hover:scale-110">{icon}</div>
      <h3 className="mb-3 text-xl font-bold">{title}</h3>
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
    <div className="flex items-start gap-4">
      <div className="bg-surface-100 border-surface-200 mt-1 shrink-0 rounded-lg border p-2">
        {icon}
      </div>
      <div>
        <h4 className="text-lg font-bold">{title}</h4>
        <p className="text-text-secondary">{description}</p>
      </div>
    </div>
  );
}
