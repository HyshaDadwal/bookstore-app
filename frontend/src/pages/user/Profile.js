import UserLayout from "../../components/layout/UserLayout";
import { useAuth } from "../../context/AuthContext";

function Profile() {
  const { user } = useAuth();

  return (
    <UserLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-surface-900 mb-8">My Profile</h1>

        <div className="card p-8">
          {/* Avatar & Info */}
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 pb-8 border-b border-surface-100">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-3xl font-bold shadow-glow">
              {user?.email?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold text-surface-900">{user?.email?.split("@")[0] || "User"}</h2>
              <p className="text-surface-500">{user?.email}</p>
              <span className={`mt-2 inline-block ${user?.role === "ADMIN" ? "badge bg-purple-100 text-purple-700" : "badge-brand"}`}>
                {user?.role || "USER"}
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-surface-500 mb-1">Email Address</label>
              <p className="text-surface-900 font-medium">{user?.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-500 mb-1">User ID</label>
              <p className="text-surface-900 font-medium">{user?.id}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-500 mb-1">Role</label>
              <p className="text-surface-900 font-medium">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}

export default Profile;
