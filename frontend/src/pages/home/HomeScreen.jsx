import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { Play, Info } from "lucide-react";
import useGetTrendingContent from "../../hooks/useGetTrendingContent.jsx";
import { ORIGINAL_IMG_BASE_URL, MOVIE_CATEGORIES, TV_CATEGORIES } from "../../utils/constants.js";
import MovieSlider from "../../components/MovieSlider.jsx";
import { useContentStore } from "../../store/content.js";

const HomeScreen = () => {
  const { trendingContent } = useGetTrendingContent();
  const { contentType } = useContentStore();

  if (!trendingContent || trendingContent.length === 0) {
    return (
      <div className="h-screen bg-black text-white">
        <Navbar />
        <div className="absolute top-0 left-0 w-full h-full bg-black/70 flex items-center justify-center -z-10">
          Loading trending content...
        </div>
      </div>
    );
  }

  const bannerContent = trendingContent[0];

  return (
    <>
      <div className="relative h-screen text-white">
        {/* Navbar with higher z-index */}
        <Navbar />

        {/* Background overlay */}
        <div className="absolute top-0 left-0 w-full h-full bg-black/70 z-0" />

        {/* Banner Image */}
        <img
          src={ORIGINAL_IMG_BASE_URL + bannerContent.backdrop_path}
          alt="Banner"
          className="absolute top-0 left-0 w-full h-full object-cover z-[-1]"
        />

        {/* Banner Content */}
        <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center px-8 md:px-16 lg:px-32 z-10">
          <div className="bg-gradient-to-b from-black via-transparent to-transparent absolute w-full h-full top-0 left-0 z-0" />
          <div className="max-w-2xl">
            <h1 className="mt-4 text-6xl font-extrabold text-balance">
              {bannerContent.title || bannerContent.name || "Unknown Title"}
            </h1>
            <p className="mt-2 text-lg">
              {bannerContent.release_date ? bannerContent.release_date.split("-")[0] : "Unknown Year"} |{" "}
              {bannerContent.adult ? "18+" : "PG-13"}
            </p>
            <p className="mt-4 text-lg">
              {bannerContent.overview
                ? bannerContent.overview.length > 200
                  ? bannerContent.overview.slice(0, 200) + "..."
                  : bannerContent.overview
                : "No description available for this title."}
            </p>
          </div>
          <div className="flex mt-8">
            <Link
              to={`/watch/${bannerContent.id}`}
              className="bg-white hover:bg-white/80 text-black font-bold py-2 px-4 rounded mr-4 flex items-center"
            >
              <Play className="size-6 mr-2 fill-black" /> Play
            </Link>
            <Link
              to={`/details/${bannerContent.id}`}
              className="bg-gray-500/70 hover:bg-gray-500 text-white py-2 px-4 rounded flex items-center"
            >
              <Info className="size-6 mr-2" /> More Info
            </Link>
          </div>
        </div>
      </div>

      {/* Movie Sliders */}
      <div className="flex flex-col gap-10 bg-black py-10">
        {contentType === "movie"
          ? MOVIE_CATEGORIES.map((category) => (
              <MovieSlider key={category} category={category} />
            ))
          : TV_CATEGORIES.map((category) => (
              <MovieSlider key={category} category={category} />
            ))}
      </div>
    </>
  );
};

export default HomeScreen;
