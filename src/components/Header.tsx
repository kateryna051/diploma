import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { ui } from "../i18n/ui";
import { useState } from "react";
import { User, X } from "lucide-react";

export const Header: React.FC<{ onLogout?: () => void }> = ({ onLogout }) => {
  const navigate = useNavigate();
  const { lang, toggleLang } = useLanguage();
  const [openMenu, setOpenMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const userName = localStorage.getItem("userName") || "";
  const userSurname = localStorage.getItem("userSurname") || "";

  const handleNavigate = (path: string) => {
    navigate(path);
    setOpenMenu(false);
  };

  const handleDeleteAccount = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/auth/delete-account", {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to delete account");

      localStorage.clear();
      navigate("/");
    } catch (e) {
      console.error("Account deletion failed", e);
      alert("Failed to delete account. Try again later.");
    } finally {
      setShowDeleteModal(false);
      setOpenMenu(false);
    }
  };

  return (
    <header className="sticky top-0 w-full flex justify-between items-center px-10 py-5 bg-white text-gray-900 shadow-md border-b border-gray-200 z-20">
      {/* LOGO */}
      <h1 className="text-3xl font-bold transition">
        Lith<span className="text-teal-500">&</span>Talk
      </h1>

      {/* Center Links */}
      <div className="flex space-x-8">
        <button onClick={() => navigate("/about")} className="text-gray-700 hover:text-gray-900 font-medium transition">
          {ui[lang].about}
        </button>
        <button onClick={() => navigate("/main")} className="text-gray-700 hover:text-gray-900 font-medium transition">
          {ui[lang].categories}
        </button>
        <button onClick={() => navigate("/reviews")} className="text-gray-700 hover:text-gray-900 font-medium transition">
          {ui[lang].reviews}
        </button>
      </div>

      {/* Right: Language + User */}
      <div className="flex items-center space-x-4 relative">
        <button
          onClick={toggleLang}
          className="bg-gray-100 text-sm px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-200 transition"
        >
          {lang}
        </button>

        <button onClick={() => setOpenMenu(prev => !prev)} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition">
          <User size={22} className="text-gray-900" />
        </button>

        {/* Dropdown Menu */}
        {openMenu && (
          <div className="absolute right-0 top-14 bg-white text-gray-800 rounded-xl shadow-xl w-52 py-2 border border-gray-200">
            <div className="px-4 py-2 text-gray-500 cursor-default">
              {userName} {userSurname}
            </div>
            <hr className="my-1 border-gray-200" />

            <div onClick={() => handleNavigate("/change-password")} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
              {ui[lang].menuChangePassword}
            </div>
            <div
              onClick={async () => {
                try {
                  await fetch("http://localhost:8080/api/auth/logout", { method: "POST", credentials: "include" });
                  localStorage.clear();
                  navigate("/");
                } catch (e) {
                  console.error("Logout failed", e);
                } finally {
                  setOpenMenu(false);
                }
              }}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600"
            >
              {ui[lang].menuLogout}
            </div>

            {/* Delete Account */}
            <div
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600 font-semibold"
            >
              {ui[lang].deleteAccount}
            </div>
          </div>
        )}

        {/* Custom Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 relative">
              <button onClick={() => setShowDeleteModal(false)} className="absolute top-3 right-3">
                <X size={20} />
              </button>
              <h2 className="text-xl font-bold mb-4 text-gray-800">{ui[lang].deleteAccount}</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete your account? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
