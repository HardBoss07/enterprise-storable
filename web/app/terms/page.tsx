import { PageContainer } from "@/components/ui/PageContainer";

export default function TermsOfServicePage() {
  return (
    <PageContainer
      title="Terms of Service"
      description="Last Updated: April 21, 2026"
    >
      <div className="max-w-4xl prose prose-invert">
        <div className="space-y-8 text-text-secondary leading-relaxed">
          <section className="space-y-4 text-text-primary font-medium">
            <p>
              By accessing or using this instance of Storable, you agree to the
              following terms. This software is provided as a personal project
              and is hosted on private infrastructure.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-text-primary uppercase tracking-tight">
              1. &quot;As-Is&quot; Usage & Reliability
            </h2>
            <p>
              Storable is provided on an{" "}
              <strong>
                &quot;As-Is&quot; and &quot;As-Available&quot; basis
              </strong>
              . The host makes no guarantees regarding uptime, service
              availability, or the long-term integrity of stored data. You use
              this service at your own risk.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-text-primary uppercase tracking-tight">
              2. User Conduct & Authorization
            </h2>
            <p>Access to this instance is a privilege, not a right.</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Authorized Access Only:</strong> This instance is
                intended for specifically invited users.
              </li>
              <li>
                <strong>Zero-Tolerance Policy:</strong> Any accounts created
                without explicit permission from the host, or users found to be
                attempting to bypass security measures, will be{" "}
                <strong>deleted immediately and without notice</strong>.
              </li>
              <li>
                <strong>Prohibited Content:</strong> You agree not to use
                Storable to store or distribute illegal material.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-text-primary uppercase tracking-tight">
              3. Disclaimer of Liability
            </h2>
            <p>
              The host shall not be held liable for any loss of data, service
              interruptions, or hardware failures. This includes, but is not
              limited to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Physical server failure or disk corruption.</li>
              <li>Software bugs or kernel panics.</li>
              <li>
                Loss of access due to forgotten passwords or configuration
                errors.
              </li>
              <li>Network outages.</li>
            </ul>
            <p className="p-4 bg-primary/5 border border-primary/20 rounded-xl text-text-primary italic">
              <strong>Critical Note:</strong> You are responsible for
              maintaining your own backups of any essential files stored here.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-text-primary uppercase tracking-tight">
              4. Termination of Service
            </h2>
            <p>
              The host reserves the right to throttle, suspend, or terminate
              access to any account or the entire service at any time, for any
              reason, without prior warning.
            </p>
          </section>
        </div>
      </div>
    </PageContainer>
  );
}
