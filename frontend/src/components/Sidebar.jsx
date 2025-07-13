import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Search } from "lucide-react";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.fullName.toLowerCase().includes(search.toLowerCase());
    const isOnline = onlineUsers.includes(user._id);
    return matchesSearch && (!showOnlineOnly || isOnline);
  });

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 bg-base-100 border-r border-base-300 shadow-md flex flex-col">
      <div className="px-4 py-4">
        <h2 className="text-xl font-semibold mb-4 hidden lg:block text-base-content">Chat</h2>
        <div className="relative mb-3">
          <input
            type="text"
            placeholder="Search Name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full bg-base-200 placeholder:text-sm text-sm focus:outline-none text-base-content"
          />
          <Search className="absolute top-2.5 left-3 w-4 h-4 text-base-content/50" />
        </div>

        <div className="hidden lg:flex items-center gap-2 text-sm text-base-content/70">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            Show online only
          </label>
          <span className="text-xs text-base-content/50">({onlineUsers.length - 1} online)</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-4">
        {filteredUsers.map((user) => (
          <button
            key={user._id || user.email}
            onClick={() => setSelectedUser(user)}
            className={`
              flex items-center w-full px-2 py-2 rounded-lg transition-colors
              hover:bg-base-200 ${
                selectedUser?._id === user._id ? "bg-base-200" : ""
              }`
            }
          >
            <div className="relative w-12 h-12">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.fullName || "User"}
                className="w-12 h-12 object-cover rounded-full border"
              />
              {onlineUsers.includes(user._id) && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-base-100" />
              )}
            </div>
            <div className="ml-3 text-left hidden lg:block">
              <div className="text-sm font-medium truncate text-base-content">{user.fullName}</div>
              <div className="text-xs text-base-content/60">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center text-base-content/60 py-6 text-sm">
            No users found
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
