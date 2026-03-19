"use client";

import { PageContainer } from "@/components/ui/PageContainer";
import SettingsContainer from "@/components/features/settings/SettingsContainer";

/**
 * Personal settings page for the current user.
 */
export default function SettingsPage() {
  return (
    <PageContainer
      title="Account Settings"
      description="Manage your profile, password, and account security."
    >
      <SettingsContainer />
    </PageContainer>
  );
}
