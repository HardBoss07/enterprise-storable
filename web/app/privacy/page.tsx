import { PageContainer } from "@/components/ui/PageContainer";

export default function PrivacyPolicyPage() {
  return (
    <PageContainer
      title="Privacy Policy"
      description="Last Updated: April 21, 2026"
    >
      <div className="max-w-4xl prose prose-invert">
        <div className="space-y-8 text-text-secondary leading-relaxed">
          <section className="space-y-4">
            <p>
              Your privacy is a priority. Because Storable is a self-hosted
              platform, your data is not being fed into a corporate machine.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-text-primary uppercase tracking-tight">
              1. Data Collection
            </h2>
            <p>
              We only collect the minimum information necessary to provide the
              service and maintain security:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Account Information:</strong> Your username and email
                address are stored to manage your account and authentication.
              </li>
              <li>
                <strong>Logs:</strong> Our server may log your IP address,
                browser type, and timestamps of access. These logs are used
                strictly for troubleshooting and defending against unauthorized
                access or "brute-force" attacks.
              </li>
              <li>
                <strong>File Metadata:</strong> We store metadata (filenames,
                paths, and permissions) in a local database to facilitate the
                Virtual File System.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-text-primary uppercase tracking-tight">
              2. Data Usage & Sharing
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>No Selling:</strong> We do not sell, trade, or rent your
                personal information or your stored files to third parties.
              </li>
              <li>
                <strong>No Tracking:</strong> There are no third-party tracking
                pixels, analytics scripts, or advertising "cookies" used on this
                platform.
              </li>
              <li>
                <strong>Internal Use Only:</strong> Your data is used solely to
                manage your files and ensure the platform functions correctly.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-text-primary uppercase tracking-tight">
              3. Physical Storage
            </h2>
            <p>
              Files uploaded to Storable are stored as physical files on the
              host&apos;s local disk. While the database stores references to
              these files, the actual content resides on private hardware.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-text-primary uppercase tracking-tight">
              4. Data Deletion
            </h2>
            <p>
              When an account is deleted—either by the user or by the host due
              to a violation of the Terms of Service—all associated database
              entries and physical files will be recursively wiped from the
              server&apos;s active storage. Note that traces may remain in
              system-level backups until those backups are rotated or
              overwritten.
            </p>
          </section>
        </div>
      </div>
    </PageContainer>
  );
}
