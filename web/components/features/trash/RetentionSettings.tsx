"use client";

import { Settings, Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { cn } from "@/lib/utils";

interface RetentionSettingsProps {
  /** Current retention days in state. */
  days: number;
  /** Whether the user is currently editing. */
  isEditing: boolean;
  /** Whether the save operation is in progress. */
  isSaving: boolean;
  /** Callback to update days in state. */
  onDaysChange: (days: number) => void;
  /** Callback to toggle editing mode. */
  onEditToggle: (isEditing: boolean) => void;
  /** Callback to save the new retention value. */
  onSave: () => void;
}

/**
 * Organism: Admin configuration block for managing the global trash retention policy.
 * Coordinates an input (Atom) and actions (Atoms) to manage a specific setting.
 *
 * @param {RetentionSettingsProps} props - The component props.
 * @returns {JSX.Element} The rendered RetentionSettings component.
 */
export function RetentionSettings({
  days,
  isEditing,
  isSaving,
  onDaysChange,
  onEditToggle,
  onSave,
}: RetentionSettingsProps) {
  if (!isEditing) {
    return (
      <div className="retention-container">
        <Button
          onClick={() => onEditToggle(true)}
          variant="ghost"
          size="sm"
          className="text-xs text-neutral-400 hover:text-neutral-100"
        >
          <Settings size={14} className="mr-2" />
          Retention: {days}d
        </Button>
      </div>
    );
  }

  return (
    <div className="retention-container">
      <div className="flex items-center space-x-2 px-2">
        <Settings size={14} className="text-neutral-500" />
        <input
          type="number"
          value={days}
          onChange={(e) => onDaysChange(parseInt(e.target.value) || 0)}
          className="retention-input"
          min="0"
        />
        <span className="text-xs text-neutral-400">days</span>
        <IconButton
          icon={Save}
          onClick={onSave}
          variant="secondary"
          size="sm"
          iconSize={14}
          isLoading={isSaving}
        />
      </div>
    </div>
  );
}

export default RetentionSettings;
