import { useEffect, useState } from "react";
import { Camera, Edit3, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { updateProfile, updateProfileImage } from "../redux/slices/userSlice";
import toast from "react-hot-toast";
import { getUserData } from "../redux/slices/authSlice";

const Profile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [previewImg, setPreviewImg] = useState<string | null>(null);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  const [fullName, setFullName] = useState(user?.fullName || "");
  const [username, setUsername] = useState(user?.username || "");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/signin");
    }
  }, [isAuthenticated, navigate]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Set preview image for better UX
    const reader = new FileReader();
    reader.onload = () => setPreviewImg(reader.result as string);
    reader.readAsDataURL(file);

    try {
      setIsUpdatingProfile(true);
      const result = await dispatch(
        updateProfileImage({ avatar: file })
      ).unwrap();
      toast.success(result.message);
      dispatch(getUserData());
    } catch (error: any) {
      const errorMessage =
        typeof error === "string"
          ? error
          : error?.message || "An error occurred";
      toast.error(errorMessage);
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleSaveProfile = async () => {
    if(fullName === user?.fullName && username === user?.username) return setIsEditing(false);
    try {
      setIsUpdating(true);
      await dispatch(updateProfile({ fullName, username })).unwrap();
      setIsEditing(false);
      toast.success("Profile updated successfully");
      dispatch(getUserData());
    } catch (error: any) {
      toast.error(
        typeof error === "string"
          ? error
          : error?.message || "An error occurred"
      );
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    if (!isEditing) {
      setFullName(user?.fullName || "");
      setUsername(user?.username || "");
    }
  }, [isEditing, user?.fullName, user?.username]); // Depend on the user fields to ensure proper sync
  

  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          {/* Avatar Upload Section */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={previewImg || user?.avatar || "/default-avatar.png"}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4"
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${
                    isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                  }
                `}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {isUpdatingProfile
                ? "Uploading..."
                : "Click the camera icon to update your photo"}
            </p>
          </div>

          {/* User Details Section */}
          <div className="space-y-6">
            {/* Full Name */}
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  className="px-4 py-2.5 bg-base-200 rounded-lg border w-full"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={!isEditing || isUpdating}
                />
              </div>
            </div>
            {/* Username */}
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Edit3 className="w-4 h-4" />
                Username
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  className="px-4 py-2.5 bg-base-200 rounded-lg border w-full"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={!isEditing || isUpdating}
                />
              </div>
            </div>
          </div>
          {/* Edit and Save Buttons */}
          <div className="flex justify-start gap-4">
            {isEditing ? (
              <>
                <button
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                  onClick={() => setIsEditing(false)}
                  disabled={isUpdating}
                >
                  Cancel
                </button>
                <button
                  className={`px-4 py-2 ${
                    isUpdating ? "bg-blue-400" : "bg-blue-500 hover:bg-blue-600"
                  } text-white rounded-lg`}
                  onClick={handleSaveProfile}
                  disabled={isUpdating}
                >
                  {isUpdating ? "Saving..." : "Save"}
                </button>
              </>
            ) : (
              <button
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
            )}
          </div>

          {/* Account Information Section */}
          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{user?.accountCreatedAt || "N/A"}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
