'use client';

import { useEffect, useState } from 'react';
import { UserDto } from '@/types/api';
import { getUsers, removeUser, changeUserRole } from '@/lib/api/admin';
import { Button } from '@/components/ui/Button';
import { Trash2, User as UserIcon, Shield, ChevronDown } from 'lucide-react';
import { useConfirm } from '@/context/ConfirmContext';
import { useToast } from '@/context/ToastContext';
import { Spinner } from '@/components/ui/Spinner';
import { cn } from '@/lib/utils';

export default function UserManagementPage() {
  const [users, setUsers] = useState<UserDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const { confirm } = useConfirm();
  const { showToast } = useToast();

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      showToast('Failed to fetch users', 'error');
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
      await changeUserRole({ userId, role: newRole as any });
      showToast('User role updated successfully', 'success');

      // Update local state instead of full refresh
      setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole as any } : u)));
    } catch (error) {
      showToast('Failed to update user role', 'error');
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleDeleteUser = async (userToDelete: UserDto) => {
    const isConfirmed = await confirm({
      title: 'Delete User',
      message: `Are you sure you want to delete user "${userToDelete.username}"? This will permanently remove all their files and data. This action cannot be undone.`,
      confirmLabel: 'Delete Permanently',
      variant: 'danger',
    });

    if (isConfirmed) {
      try {
        await removeUser(userToDelete.id);
        showToast(`User ${userToDelete.username} deleted successfully`, 'success');
        fetchUsers();
      } catch (error) {
        showToast('Failed to delete user', 'error');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-bg-sidebar border-surface-300 overflow-hidden rounded-2xl border shadow-2xl">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-surface-100 border-surface-300 border-b">
              <th className="text-text-muted px-6 py-4 text-xs font-bold tracking-wider uppercase">
                User
              </th>
              <th className="text-text-muted px-6 py-4 text-xs font-bold tracking-wider uppercase">
                Email
              </th>
              <th className="text-text-muted px-6 py-4 text-xs font-bold tracking-wider uppercase">
                Role
              </th>
              <th className="text-text-muted px-6 py-4 text-xs font-bold tracking-wider uppercase">
                ID
              </th>
              <th className="text-text-muted px-6 py-4 text-right text-xs font-bold tracking-wider uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-surface-300 divide-y">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-surface-200/50 group transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-surface-200 text-text-secondary group-hover:bg-primary/10 group-hover:text-primary flex h-10 w-10 items-center justify-center rounded-full transition-colors">
                      <UserIcon size={20} />
                    </div>
                    <span className="text-text-primary font-bold">{user.username}</span>
                  </div>
                </td>
                <td className="text-text-secondary px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">
                  {user.id === 'f43c0bcf-11e4-4629-b072-321ccd04e72a' ? (
                    <span className="bg-accent/10 text-accent border-accent/20 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold tracking-tighter uppercase">
                      <Shield size={12} />
                      ADMIN
                    </span>
                  ) : (
                    <div className="group/select relative inline-flex items-center">
                      <div
                        className={cn(
                          'pointer-events-none absolute left-2.5 z-10 transition-colors',
                          user.role === 'ADMIN' ? 'text-accent' : 'text-primary',
                        )}
                      >
                        {user.role === 'ADMIN' ? <Shield size={12} /> : <UserIcon size={12} />}
                      </div>
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        disabled={updatingUserId === user.id}
                        className={cn(
                          'focus:ring-primary cursor-pointer appearance-none rounded-full border py-1 pr-8 pl-7 text-xs font-bold tracking-tighter uppercase transition-all focus:ring-1 focus:outline-none',
                          user.role === 'ADMIN'
                            ? 'bg-accent/10 text-accent border-accent/20 hover:bg-accent/20'
                            : 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20',
                          updatingUserId === user.id && 'cursor-not-allowed opacity-50',
                        )}
                      >
                        <option value="USER" className="bg-bg-sidebar text-text-primary">
                          USER
                        </option>
                        <option value="ADMIN" className="bg-bg-sidebar text-text-primary">
                          ADMIN
                        </option>
                      </select>
                      <ChevronDown
                        size={12}
                        className={cn(
                          'pointer-events-none absolute right-2.5 transition-colors',
                          user.role === 'ADMIN' ? 'text-accent/50' : 'text-primary/50',
                        )}
                      />
                      {updatingUserId === user.id && (
                        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/10">
                          <Spinner size="sm" className="scale-50" />
                        </div>
                      )}
                    </div>
                  )}
                </td>
                <td className="text-text-muted px-6 py-4 font-mono text-xs">{user.id}</td>
                <td className="px-6 py-4 text-right">
                  <Button
                    onClick={() => handleDeleteUser(user)}
                    variant="ghost"
                    size="sm"
                    className="text-text-muted hover:bg-red-500/10 hover:text-red-500"
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
          <div className="text-text-muted p-12 text-center">No users found in the system.</div>
        )}
      </div>
    </div>
  );
}
