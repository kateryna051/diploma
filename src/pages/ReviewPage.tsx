import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import { useLanguage } from "../context/LanguageContext";
import { ui } from "../i18n/ui";

interface Review {
  id: number;
  userId: number;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
}

const ReviewPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [myReview, setMyReview] = useState<Review | null>(null);
  const { lang} = useLanguage();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [menuOpen, setMenuOpen] = useState<number | null>(null);

  const [currentUser, setCurrentUser] = useState<{ id: number; name: string } | null>(null);

  // Load logged in user
  useEffect(() => {
    const userId = Number(localStorage.getItem("userId"));
    const name = localStorage.getItem("userName") || "User";

    if (userId) setCurrentUser({ id: userId, name });
  }, []);

  // Load all reviews from backend
  useEffect(() => {
    const fetchReviews = async () => {
      const userId = Number(localStorage.getItem("userId"));

      try {
        const res = await axios.get("http://localhost:8080/api/reviews", {
          params: { userId },
        });

        setReviews(res.data.reviews || []);
        setMyReview(res.data.myReview || null);

        if (res.data.myReview) {
          setRating(res.data.myReview.rating);
          setComment(res.data.myReview.comment);
        }
      } catch (e) {
        console.error("Error loading reviews:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Submit new review
  const submitReview = async () => {
    if (!currentUser) return;

    try {
      const res = await axios.post("http://localhost:8080/api/reviews", {
        rating,
        comment,
        userId: currentUser.id,
        name: currentUser.name,
      });

      setMyReview(res.data);
      setShowForm(false);
      setReviews((prev) => [...prev, res.data]);
    } catch (e) {
      console.error(e);
    }
  };

  // Edit review
  const editReview = async () => {
    if (!myReview || !currentUser) return;

    try {
      const res = await axios.put(
        `http://localhost:8080/api/reviews/${myReview.id}`,
        {
          rating,
          comment,
          userId: currentUser.id,
        }
      );

      setMyReview(res.data);
      setShowForm(false);
      setReviews((prev) => prev.map((r) => (r.id === res.data.id ? res.data : r)));
    } catch (e) {
      console.error(e);
    }
  };

  // Delete review
  const deleteReview = async (id: number) => {
    if (!currentUser) return;

    try {
      await axios.delete(`http://localhost:8080/api/reviews/${id}`, {
        params: { userId: currentUser.id },
      });

      setReviews((prev) => prev.filter((r) => r.id !== id));
      if (myReview?.id === id) setMyReview(null);
    } catch (e) {
      console.error(e);
    }
  };

  const openEditForm = (review: Review) => {
    setMyReview(review);
    setRating(review.rating);
    setComment(review.comment);
    setShowForm(true);
    setMenuOpen(null);
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="w-screen min-h-screen flex flex-col bg-gradient-to-br from-sky-50 to-teal-100 text-gray-900">
      <Header />

      {/* Main content */}
      <div className="max-w-6xl mx-auto mt-12 mb-12 p-8 bg-white rounded-2xl shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{ui[lang].reviews}</h1>

          {!myReview && currentUser && (
            <button
              onClick={() => setShowForm(true)}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
            >
             {ui[lang].writeReview}
            </button>
          )}
        </div>

        {/* Review Form */}
        {showForm && (
          <div className="bg-gray-50 p-6 rounded-xl shadow-inner mb-8">
            <h2 className="text-xl font-semibold mb-3">
              {myReview ? "Edit Your Review" : "Leave a Review"}
            </h2>

            {/* Stars */}
            <div className="flex gap-2 mb-3">
              {[1, 2, 3, 4, 5].map((s) => (
                <span
                  key={s}
                  onClick={() => setRating(s)}
                  className={`cursor-pointer text-3xl ${
                    s <= rating ? "text-yellow-500" : "text-gray-300"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>

            <textarea
              className="w-full border p-3 rounded-md"
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your thoughts..."
            />

            <button
              onClick={myReview ? editReview : submitReview}
              className="mt-3 px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
            >
              {myReview ? "Save Changes" : "Submit Review"}
            </button>
          </div>
        )}

        {/* Reviews List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="relative p-8 border rounded-2xl shadow-sm bg-white hover:shadow-md transition"
            >
              {/* Owner actions */}
              {currentUser?.id === r.userId && (
                <div className="absolute top-4 right-4">
                  <button onClick={() => setMenuOpen(menuOpen === r.id ? null : r.id)}>
                    ⋮
                  </button>

                  {menuOpen === r.id && (
                    <div className="absolute right-0 mt-2 w-32 bg-white shadow rounded-lg text-sm">
                      <button
                        onClick={() => openEditForm(r)}
                        className="block w-full px-3 py-2 hover:bg-gray-100 text-left"
                      >
                        {ui[lang].edit}
                      </button>

                      <button
                        onClick={() => deleteReview(r.id)}
                        className="block w-full px-3 py-2 text-red-500 hover:bg-gray-100 text-left"
                      >
                        { ui[lang].delete}
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center gap-2 pr-12">
                <p className="font-bold text-lg">{r.name}</p>
                <p className="text-yellow-500">
                  {"★".repeat(r.rating)}
                  {"☆".repeat(5 - r.rating)}
                </p>
              </div>

              <p className="text-gray-600 text-sm mt-1">
                {new Date(r.createdAt).toLocaleDateString()}
              </p>

              <p className="mt-3">{r.comment}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full bg-white py-5 text-center text-gray-500 shadow-inner mt-auto">
        <p className="text-sm">
          © {new Date().getFullYear()} Lith&Talk | Made with 💙 by{" "}
          <a
            href="mailto:kate160203@gmail.com"
            className="text-gray-700 underline hover:text-gray-900"
          >
            kate160203@gmail.com
          </a>
        </p>
      </footer>
    </div>
  );
};

export default ReviewPage;
