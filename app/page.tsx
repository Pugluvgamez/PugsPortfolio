"use client";
import { useEffect, useRef } from "react";

type Review = {
  name: string;
  text: string;
  rating: number;
  date: Date;
};

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
// ...existing code...
import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";


type Project = {
  title: string;
  desc: string;
  images: string[];
};

export default function Portfolio() {
        // Polling for changes in projects and reviews
        useEffect(() => {
          let prevProjects: string = "";
          let prevReviews: string = "";
          const interval = setInterval(async () => {
            try {
              const projRes = await fetch("/api/get-images");
              const projData = await projRes.json();
              const projString = JSON.stringify(projData.projects);
              if (prevProjects && prevProjects !== projString) {
                window.location.reload();
              }
              prevProjects = projString;
              const revRes = await fetch("/api/reviews");
              const revData = await revRes.json();
              const revString = JSON.stringify(revData.reviews);
              if (prevReviews && prevReviews !== revString) {
                window.location.reload();
              }
              prevReviews = revString;
            } catch (e) {}
          }, 5000); // Poll every 5 seconds
          return () => clearInterval(interval);
        }, []);
      // Auto-reload logic removed for production viability
    const [reviewName, setReviewName] = useState("");
  // Duplicate declaration removed
  // Store current user's name for review actions
  const [currentUser, setCurrentUser] = useState<string>("");

  useEffect(() => {
    const storedName = localStorage.getItem("reviewUserName") || "";
    setCurrentUser(storedName);
  }, []);

  useEffect(() => {
    if (reviewName) localStorage.setItem("reviewUserName", reviewName);
  }, [reviewName]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [previewIndexes, setPreviewIndexes] = useState<number[]>([]);
  const previewIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Update previewIndexes when projects change
  useEffect(() => {
    setPreviewIndexes(projects.map(() => 0));
  }, [projects]);

  // Auto-rotate preview images
  useEffect(() => {
    if (!projects.length) return;
    if (previewIntervalRef.current) clearInterval(previewIntervalRef.current);
    previewIntervalRef.current = setInterval(() => {
      setPreviewIndexes((prev) =>
        prev.map((idx, i) => {
          const imgs = projects[i]?.images || [];
          if (!imgs.length) return 0;
          return (idx + 1) % imgs.length;
        })
      );
    }, 2000);
    return () => {
      if (previewIntervalRef.current) clearInterval(previewIntervalRef.current);
    };
  }, [projects]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [viewerImages, setViewerImages] = useState<string[]>([]);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [carouselIndex, setCarouselIndex] = useState(0);
  // Review state
  const [reviews, setReviews] = useState<Review[]>([]);
  // Edit review state removed
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [showReviewModal, setShowReviewModal] = useState(false);

  useEffect(() => {
    fetch("/api/get-images")
      .then((res) => res.json())
      .then((data) => setProjects(data.projects));
    fetch("/api/reviews")
      .then((res) => res.json())
      .then((data) => setReviews(data.reviews));
  }, []);

  const toggleDropdown = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const nextProject = () => {
    setCarouselIndex((carouselIndex + 1) % projects.length);
    setOpenIndex(null);
  };
  const prevProject = () => {
    setCarouselIndex((carouselIndex - 1 + projects.length) % projects.length);
    setOpenIndex(null);
  };

  const openViewer = (images: string[], index: number) => {
    setViewerImages(images);
    setViewerIndex(index);
  };

  const closeViewer = () => setViewerImages([]);

  const nextImage = () =>
    setViewerIndex((viewerIndex + 1) % viewerImages.length);

  const prevImage = () =>
    setViewerIndex((viewerIndex - 1 + viewerImages.length) % viewerImages.length);

  // Handle review submission
  const handleReviewSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewText.trim()) return;
    const newReview = { name: reviewName.trim(), text: reviewText.trim(), rating: reviewRating, date: new Date() };
    await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newReview),
    });
    fetch("/api/reviews")
      .then((res) => res.json())
      .then((data) => setReviews(data.reviews));
    setReviewName("");
    setReviewText("");
    setReviewRating(5);
  };

  const handleDeleteReview = async (index: number) => {
    await fetch("/api/reviews", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ index }),
    });
    fetch("/api/reviews")
      .then((res) => res.json())
      .then((data) => setReviews(data.reviews));
  };

  // Edit review handlers removed

  // Sort reviews: highest rating first, then most recent
  const sortedReviews = [...reviews].sort((a, b) => {
    if (b.rating !== a.rating) return b.rating - a.rating;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-sky-700 via-sky-900 to-neutral-950 text-white p-4 md:p-10 overflow-hidden" style={{ fontFamily: "'Inter', Arial, Helvetica, sans-serif" }}>
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed top-0 left-0 w-full h-full object-cover z-0 pointer-events-none"
        src="/LiveBG.mp4"
      />
      <div className="relative z-10">
      <div className="relative mb-10 flex justify-center">
        <h1
          className="text-3xl md:text-5xl font-extrabold tracking-tight drop-shadow-lg font-sans uppercase text-center text-sky-300"
          style={{
            letterSpacing: '-0.03em',
            fontFamily: 'var(--font-geist-sans), var(--font-sans), sans-serif',
          }}
        >
          Pug's Portfolio
        </h1>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 relative w-full max-w-5xl mx-auto min-h-[420px] md:min-h-[520px] perspective-[2200px]">
        <button
          onClick={prevProject}
          className="absolute left-0 z-20 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 shadow-lg backdrop-blur-md transition top-1/2 -translate-y-1/2"
          aria-label="Previous project"
        >
          <ChevronLeft size={36} />
        </button>
        <div
          className={`relative flex w-full items-center justify-center mb-8 transition-all duration-300 ${openIndex !== null ? 'min-h-[500px] md:min-h-[700px] md:min-h-[800px]' : 'min-h-[320px] md:min-h-[520px]'}`}
        >
          {[ -1, 0, 1 ].map((offset) => {
            if (!projects.length) return null;
            const idx = (carouselIndex + offset + projects.length) % projects.length;
            const project = projects[idx];
            if (!project || !project.images) return null;
            const previewIdx = previewIndexes[idx] || 0;
            const isCenter = offset === 0;
            const zIdx = 10 - Math.abs(offset);
            const scale = isCenter ? 1.08 : 0.92;
            const translateX = offset * 220;
            return (
              <motion.div
                key={idx}
                style={{
                  zIndex: zIdx,
                  transform: `translateX(${translateX}px) scale(${scale})`,
                  boxShadow: isCenter ? '0 12px 48px 0 rgba(31,38,135,0.22)' : '0 2px 8px 0 rgba(31,38,135,0.10)',
                  opacity: isCenter ? 1 : 0.7,
                  position: 'absolute',
                  left: '50%',
                  top: 0,
                  width: isCenter ? '420px' : '320px',
                  marginLeft: isCenter ? '-210px' : '-160px',
                  pointerEvents: isCenter ? 'auto' : 'none',
                  transition: 'all 0.5s cubic-bezier(.4,2,.6,1)',
                }}
                initial={{ opacity: 0, x: offset > 0 ? 200 : offset < 0 ? -200 : 0 }}
                animate={{
                  opacity: isCenter ? 1 : 0.7,
                  scale: scale,
                  x: translateX,
                }}
                exit={{ opacity: 0, x: offset > 0 ? 200 : offset < 0 ? -200 : 0 }}
                className={`transition-all duration-700 ${isCenter ? '' : 'blur-[2px]'} `}
              >
                <Card className="bg-sky-800/30 border border-sky-400/30 rounded-3xl shadow-2xl backdrop-blur-md hover:bg-sky-700/40 transition-colors duration-300 w-full min-h-[220px] md:min-h-[380px] flex flex-col">
                  {/* Auto-rotating preview image */}
                  {project.images.length > 0 && (
                    <div className="w-full rounded-t-3xl border-b border-white/20 mb-4 bg-[#222] flex items-center justify-center" style={{ height: isCenter ? 256 : 192 }}>
                      <img
                        src={project.images[previewIdx]}
                        alt="project preview"
                        className="w-full h-full object-cover rounded-t-3xl border-b-4 border-sky-400"
                        style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  )}
                  <CardContent className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h2 className="text-3xl font-bold mb-2 tracking-tight font-sans uppercase drop-shadow-sm text-sky-200" style={{ letterSpacing: '-0.02em', fontFamily: 'var(--font-geist-sans), var(--font-sans), sans-serif' }}>{project.title}</h2>
                      <p className="text-sky-100 mb-6 font-light italic tracking-wide font-sans" style={{ letterSpacing: '0.01em', fontFamily: 'var(--font-geist-sans), var(--font-sans), sans-serif' }}>{project.desc}</p>
                    </div>
                    {isCenter && (
                      <div>
                        <Button className="bg-sky-600 hover:bg-sky-500 text-white border border-sky-400" onClick={() => toggleDropdown(idx)}>
                          {openIndex === idx ? "Hide Images" : "View More"}
                        </Button>
                        {openIndex === idx && (
                          <div className="mt-4 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 max-h-48 md:max-h-72 overflow-y-auto">
                            {project.images.map((img, imgIdx) => (
                              <img
                                key={imgIdx}
                                src={img}
                                onClick={() => openViewer(project.images, imgIdx)}
                                className="rounded-xl border border-sky-400 cursor-pointer hover:scale-105 transition w-full h-32 object-cover"
                                alt="project preview"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
        <button
          onClick={nextProject}
          className="absolute right-0 z-20 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 shadow-lg backdrop-blur-md transition top-1/2 -translate-y-1/2"
          aria-label="Next project"
        >
          <ChevronRight size={36} />
        </button>
      </div>

      <AnimatePresence>
        {viewerImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
          >
            <button
              onClick={closeViewer}
              className="absolute top-6 right-6"
            >
              <X size={32} />
            </button>

            <button
              onClick={prevImage}
              className="absolute left-6"
            >
              <ChevronLeft size={40} />
            </button>

            <img
              src={viewerImages[viewerIndex]}
              className="max-h-[80vh] rounded-xl"
            />

            <button
              onClick={nextImage}
              className="absolute right-6"
            >
              <ChevronRight size={40} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Review Logs Bar */}
      <div className="w-full flex flex-col md:flex-row items-center justify-between bg-sky-800/20 border border-sky-400/30 rounded-xl shadow-lg p-2 md:p-4 backdrop-blur-md mt-4 mb-8">
        <div className="flex overflow-x-auto gap-2 md:gap-4 w-full">
          {sortedReviews.length === 0 ? (
            <div className="text-neutral-400 italic">No reviews yet.</div>
          ) : (
            sortedReviews.slice(0, 6).map((review, idx) => (
              <div key={idx} className="min-w-[180px] bg-sky-900/80 border border-sky-400/20 rounded-lg p-3 flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">{review.name}</span>
                  <span className="text-yellow-400 text-md">{'★'.repeat(review.rating)}</span>
                </div>
                <div className="text-neutral-200 text-xs truncate">{review.text}</div>
              </div>
            ))
          )}
        </div>
        <Button className="mt-2 md:mt-0 md:ml-4 w-full md:w-auto bg-sky-600 hover:bg-sky-500 text-white border border-sky-400" onClick={() => setShowReviewModal(true)}>Leave a Review</Button>
      </div>

      {/* Review Modal */}
      <AnimatePresence>
        {showReviewModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          >
            <div className="bg-sky-900/80 border border-sky-400/20 rounded-2xl shadow-lg p-4 md:p-8 backdrop-blur-md max-w-xs md:max-w-2xl w-full relative">
              <button
                onClick={() => setShowReviewModal(false)}
                className="absolute top-4 right-4 text-white"
              >
                <X size={28} />
              </button>
              <h2 className="text-2xl font-bold mb-4">Leave a Review</h2>
              <form onSubmit={handleReviewSubmit} className="flex flex-col gap-2 md:gap-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="p-2 rounded bg-sky-950 border border-sky-400/20 text-white"
                  value={reviewName}
                  onChange={e => setReviewName(e.target.value)}
                  maxLength={32}
                  required
                  autoComplete="off"
                />
                <textarea
                  placeholder="Your Review"
                  className="p-2 rounded bg-sky-950 border border-sky-400/20 text-white min-h-[60px]"
                  value={reviewText}
                  onChange={e => setReviewText(e.target.value)}
                  maxLength={300}
                  required
                />
                <div className="flex items-center gap-2">
                  <span className="mr-2">Rating:</span>
                  {[1,2,3,4,5].map(star => (
                    <button
                      type="button"
                      key={star}
                      className={`text-2xl ${reviewRating >= star ? 'text-yellow-400' : 'text-gray-500'}`}
                      onClick={() => setReviewRating(star)}
                      aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <Button type="submit" className="w-fit bg-sky-600 hover:bg-sky-500 text-white border border-sky-400">Submit Review</Button>
              </form>
              {/* Reviews List */}
              <h3 className="text-xl font-semibold mt-8 mb-2 text-sky-200">Recent & Top Reviews</h3>
              <div className="max-h-40 md:max-h-64 overflow-y-auto space-y-2 md:space-y-4 pr-2">
                {sortedReviews.length === 0 && (
                  <div className="text-neutral-400 italic">No reviews yet. Be the first!</div>
                )}
                {sortedReviews.map((review, idx) => (
                  <div key={idx} className="bg-sky-950/80 border border-sky-400/20 rounded-lg p-4 flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{review.name}</span>
                      <span className="text-yellow-400 text-lg">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                      <span className="text-xs text-neutral-400 ml-auto">{new Date(review.date).toLocaleString()}</span>
                    </div>
                    <div className="text-neutral-200">{review.text}</div>
                  </div>
                ))}
                {/* Edit review form removed */}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  </div>
  );
}
