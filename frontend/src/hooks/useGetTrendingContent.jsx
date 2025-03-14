import { useEffect, useState } from "react";
import axios from "axios";

const API_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlOTI0Y2Q5MDFkMDdjMTZmZDUzOTdiYzMwNGVmZjg0NCIsIm5iZiI6MTc0MTUzMzYzNy40OTgsInN1YiI6IjY3Y2RiMWM1Mjc5NGIwZDU5ODJhN2ZhZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.GWWULo1KU51hoVVU1Mr4Am82EIoFWjlaoBWtAvZtdak";

const TRENDING_URL = "https://api.themoviedb.org/3/trending/all/week?language=en-US";

const useGetTrendingContent = () => {
  const [trendingContent, setTrendingContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrendingContent = async () => {
      try {
        setLoading(true);
        const response = await axios.get(TRENDING_URL, {
          headers: {
            Authorization: `Bearer ${API_TOKEN}`,
          },
        });

        console.log("API Response:", response.data);

        if (response.data && response.data.results) {
          setTrendingContent(response.data.results);
        } else {
          setTrendingContent([]); // Ensure it doesn't break if response is unexpected
        }
      } catch (err) {
        console.error("Error fetching trending content:", err);
        setError("Failed to load trending content.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingContent();
  }, []);

  return { trendingContent, loading, error };
};

export default useGetTrendingContent;
