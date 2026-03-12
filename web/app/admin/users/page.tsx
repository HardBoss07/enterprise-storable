"use client";

import { useEffect, useState } from "react";
import { UserDto } from "@/types/Admin";
import { getAllUsers, deleteUser } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Trash2, User as UserIcon, Shield } from "lucide-react";
import { useConfirm } from "@/context/ConfirmContext";
import { useToast } from "@/context/ToastContext";
import { Spinner } from "@/components/ui/Spinner";

export default function UserManagementPage() {
  const [users, setUsers] = useState<UserDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { confirm } = useConfirm();
  const { showToast } = useToast();

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      showToast("Failed to fetch users", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (userToDelete: UserDto) => {
    const isConfirmed = await confirm({
      title: "Delete User",
      message: `Are you sure you want to delete user "${userToDelete.username}"? This will permanently remove all their files and data. This action cannot be undone.`,
      confirmLabel: "Delete Permanently",
      variant: "danger",
    });

    if (isConfirmed) {
      try {
        await deleteUser(userToDelete.id);
        showToast(`User ${userToDelete.username} deleted successfully`, "success");
        fetchUsers();
      } catch (error) {
        showToast("Failed to delete user", "error");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-neutral-800/50 rounded-xl border border-neutral-700 overflow-hidden shadow-lg">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-neutral-800 border-b border-neutral-700">
              <th className="px-6 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider">User</th>
              <th className="px-6 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Email</th>
              <th className="px-6 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Role</th>
              <th className="px-6 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider">ID</th>
              <th className="px-6 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-700">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-neutral-800/80 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center text-neutral-300 group-hover:bg-primary-accent/10 group-hover:text-primary-accent transition-colors">
                      <UserIcon size={20} />
                    </div>
                    <span className="font-medium text-neutral-200">{user.username}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-neutral-400">{user.email}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                    user.role === 'ADMIN' 
                      ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' 
                      : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                  }`}>
                    {user.role === 'ADMIN' && <Shield size={12} />}
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs font-mono text-neutral-500">{user.id}</td>
                <td className="px-6 py-4 text-right">
                  <Button
                    onClick={() => handleDeleteUser(user)}
                    variant="ghost"
                    size="sm"
                    className="text-neutral-500 hover:text-red-500 hover:bg-red-500/10"
                    title="Delete User"
                  >
                    <Trash2 size={18} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {users.length === 0 && (
          <div className="p-12 text-center text-neutral-500">
            No users found in the system.
          </div>
        )}
      </div>
    </div>
  );
}
