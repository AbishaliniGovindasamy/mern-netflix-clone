import { useEffect, useRef, useState } from "react";
import { useContentStore } from "../store/content";
import axios from "axios";
import { SMALL_IMG_BASE_URL } from "../utils/constants.js";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

const MovieSlider = ({ category }) => {
  const { contentType } = useContentStore();
  const [content, setContent] = useState([]);
  const [showArrows, setShowArrows] = useState(false);
  const slideRef = useRef(null);

  const formattedCategoryName =
    category.replaceAll("_", " ").charAt(0).toUpperCase() + category.replaceAll("_", " ").slice(1);
  const formattedContentType = contentType === "movie" ? "Movies" : "TV Shows";

  useEffect(() => {
    let isMounted = true;
    const getContent = async () => {
      try {
        const res = await axios.get(`https://api.themoviedb.org/3/${contentType}/${category}`, {
          headers: {
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlOTI0Y2Q5MDFkMDdjMTZmZDUzOTdiYzMwNGVmZjg0NCIsIm5iZiI6MTc0MTUzMzYzNy40OTgsInN1YiI6IjY3Y2RiMWM1Mjc5NGIwZDU5ODJhN2ZhZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.GWWULo1KU51hoVVU1Mr4Am82EIoFWjlaoBWtAvZtdak'
          }
        });
        if (isMounted) setContent(res.data?.results || []);
      } catch (error) {
        console.error("Error fetching content:", error);
      }
    };
    getContent();
    return () => { isMounted = false; };
  }, [contentType, category]);

  const scroll = (direction) => {
    if (slideRef.current) {
      const scrollAmount = slideRef.current.offsetWidth;
      slideRef.current.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div
      className="bg-black text-white relative px-5 md:px-20"
      onMouseEnter={() => setShowArrows(true)}
      onMouseLeave={() => setShowArrows(false)}
    >
      <h2 className="mb-4 text-2xl font-bold">
        {formattedCategoryName} {formattedContentType}
      </h2>

      <div className="flex space-x-4 overflow-x-scroll scrollbar-hide" ref={slideRef}>
        {content.length > 0 ? (
          content.map((item) => (
            <Link to={`/watch/${item.id}`} className="min-w-[250px] relative group" key={item.id}>
              <div className="rounded-lg overflow-hidden">
                <img
                  src={item.backdrop_path ? `${SMALL_IMG_BASE_URL}${item.backdrop_path}` : "/placeholder.jpg"}
                  alt={item.title || item.name}
                  className="transition-transform duration-300 ease-in-out group-hover:scale-125"
                />
              </div>
              <p className="mt-2 text-center">{item.title || item.name}</p>
            </Link>
          ))
        ) : (
          <p className="text-gray-400">No content available.</p>
        )}
      </div>

      {showArrows && (
        <>
          <button
            className="absolute top-1/2 -translate-y-1/2 left-5 md:left-24 flex items-center justify-center 
            size-12 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 text-white z-10"
            onClick={() => scroll("left")}
          >
            <ChevronLeft size={24} />
          </button>

          <button
            className="absolute top-1/2 -translate-y-1/2 right-5 md:right-24 flex items-center justify-center 
            size-12 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 text-white z-10"
            onClick={() => scroll("right")}
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}
    </div>
  );
};

export default MovieSlider;