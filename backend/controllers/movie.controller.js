import { fetchFromTMDB } from "../services/tmdb.service.js";

export async function getTrendingMovies(req, res) {
    try {
        // Note: The correct trending endpoint for movies is /trending/movie/day
        const data = await fetchFromTMDB("https://api.themoviedb.org/3/trending/movie/day?language=en-US");

        if (!data?.results?.length) {
            return res.status(404).json({ success: false, message: "No trending movies found" });
        }

        return res.status(200).json({ success: true, content: data.results });
    } catch (error) {
        handleError(error, res);
    }
}

export async function getMovieTrailers(req, res) {
    const { id } = req.params;
    try {
        const data = await fetchFromTMDB(`/movie/${id}/videos?language=en-US`);

        if (!data?.results?.length) {
            return res.status(404).json({ success: false, message: "No trailers found" });
        }

        return res.status(200).json({ success: true, trailers: data.results });
    } catch (error) {
        handleError(error, res);
    }
}

export async function getMovieDetails(req, res) {
    const { id } = req.params;
    try {
        const data = await fetchFromTMDB(`/movie/${id}?language=en-US`);

        if (!data) {
            return res.status(404).json({ success: false, message: "Movie not found" });
        }

        return res.status(200).json({ success: true, content: data });
    } catch (error) {
        handleError(error, res);
    }
}

export async function getSimilarMovies(req, res) {
    const { id } = req.params;
    try {
        const data = await fetchFromTMDB(`/movie/${id}/similar?language=en-US`);

        if (!data?.results?.length) {
            return res.status(404).json({ success: false, message: "No similar movies found" });
        }

        return res.status(200).json({ success: true, similar: data.results });
    } catch (error) {
        handleError(error, res);
    }
}

export async function getMoviesByCategory(req, res) {
    const { category } = req.params;
    const validCategories = ["popular", "top_rated", "upcoming", "now_playing"];
    
    if (!validCategories.includes(category)) {
        return res.status(400).json({ 
            success: false, 
            message: "Invalid category. Choose from: popular, top_rated, upcoming, now_playing" 
        });
    }
    
    try {
        const data = await fetchFromTMDB(`/movie/${category}?language=en-US`);
        
        if (!data?.results?.length) {
            return res.status(404).json({ success: false, message: "No movies found in this category" });
        }

        return res.status(200).json({ success: true, content: data.results });
    } catch (error) {
        handleError(error, res);
    }
}

function handleError(error, res) {
    console.error("Error Details:", {
        message: error.message,
        status: error.response?.status,
        responseData: error.response?.data
    });
    const statusCode = error.response?.status || 500;
    const errorMessage = error.response?.data?.status_message || error.message || "Internal server error";
    return res.status(statusCode).json({ success: false, message: errorMessage });
}
