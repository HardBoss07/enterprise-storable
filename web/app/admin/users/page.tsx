"use client";

import { useEffect, useState } from "react";
import { UserDto } from "@/types/Admin";
import { getAllUsers, deleteUser, updateUserRole } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Trash2, User as UserIcon, Shield, ChevronDown } from "lucide-react";
import { useConfirm } from "@/context/ConfirmContext";
import { useToast } from "@/context/ToastContext";
import { Spinner } from "@/components/ui/Spinner";
import { cn } from "@/lib/utils";

export default function UserManagementPage() {
  const [users, setUsers] = useState<UserDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
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

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      setUpdatingUserId(userId);
      await updateUserRole(userId, newRole);
      showToast("User role updated successfully", "success");
      
      // Update local state instead of full refresh
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole as any } : u));
    } catch (error) {
      showToast("Failed to update user role", "error");
    } finally {
      setUpdatingUserId(null);
    }
  };

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
                  {user.id === 'f43c0bcf-11e4-4629-b072-321ccd04e72a' ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      <Shield size={12} />
                      ADMIN
                    </span>
                  ) : (
                    <div className="relative inline-flex items-center group/select">
                      <div className={cn(
                        "absolute left-2.5 z-10 pointer-events-none transition-colors",
                        user.role === 'ADMIN' ? 'text-purple-400' : 'text-blue-400'
                      )}>
                        {user.role === 'ADMIN' ? <Shield size={12} /> : <UserIcon size={12} />}
                      </div>
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        disabled={updatingUserId === user.id}
                        className={cn(
                          "appearance-none text-xs font-medium rounded-full pl-7 pr-8 py-1 border transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary-accent",
                          user.role === 'ADMIN' 
                            ? 'bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500/20' 
                            : 'bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20',
                          updatingUserId === user.id && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        <option value="USER" className="bg-neutral-800 text-neutral-100">USER</option>
                        <option value="ADMIN" className="bg-neutral-800 text-neutral-100">ADMIN</option>
                      </select>
                      <ChevronDown 
                        size={12} 
                        className={cn(
                          "absolute right-2.5 pointer-events-none transition-colors",
                          user.role === 'ADMIN' ? 'text-purple-400/50' : 'text-blue-400/50'
                        )} 
                      />
                      {updatingUserId === user.id && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-full">
                          <Spinner size="sm" className="scale-50" />
                        </div>
                      )}
                    </div>
                  )}
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
