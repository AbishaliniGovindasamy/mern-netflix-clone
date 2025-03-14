import { fetchFromTMDB } from "../services/tmdb.service.js";

export async function getTrendingTv(req, res) {
    try {
        // Use a relative endpoint
        const data = await fetchFromTMDB("/trending/tv/day?language=en-US");

        if (!data?.results?.length) {
            return res.status(404).json({ success: false, message: "No trending TV shows found" });
        }

        const randomShow = data.results[Math.floor(Math.random() * data.results.length)];

        res.json({ success: true, content: randomShow });
    } catch (error) {
        handleError(error, res);
    }
}

export async function getTvTrailers(req, res) {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ success: false, message: "TV show ID is required" });
    }

    try {
        const data = await fetchFromTMDB(`/tv/${id}/videos?language=en-US`);

        if (!data?.results?.length) {
            return res.status(404).json({ success: false, message: "No trailers found" });
        }

        res.json({ success: true, trailers: data.results });
    } catch (error) {
        handleError(error, res);
    }
}

export async function getTvDetails(req, res) {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ success: false, message: "TV show ID is required" });
    }

    try {
        const data = await fetchFromTMDB(`/tv/${id}?language=en-US`);

        if (!data) {
            return res.status(404).json({ success: false, message: "TV show not found" });
        }

        res.status(200).json({ success: true, content: data });
    } catch (error) {
        handleError(error, res);
    }
}

export async function getSimilarTvs(req, res) {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ success: false, message: "TV show ID is required" });
    }

    try {
        const data = await fetchFromTMDB(`/tv/${id}/similar?language=en-US&page=1`);

        if (!data?.results?.length) {
            return res.status(404).json({ success: false, message: "No similar TV shows found" });
        }

        res.status(200).json({ success: true, similar: data.results });
    } catch (error) {
        handleError(error, res);
    }
}

export async function getTvsByCategory(req, res) {
    const { category } = req.params;

    const validCategories = ["popular", "top_rated", "on_the_air", "airing_today"];
    if (!validCategories.includes(category)) {
        return res.status(400).json({ success: false, message: "Invalid category. Choose from: popular, top_rated, on_the_air, airing_today" });
    }

    try {
        const data = await fetchFromTMDB(`/tv/${category}?language=en-US&page=1`);

        if (!data?.results?.length) {
            return res.status(404).json({ success: false, message: "No TV shows found in this category" });
        }

        res.status(200).json({ success: true, content: data.results });
    } catch (error) {
        handleError(error, res);
    }
}

// Centralized Error Handler
function handleError(error, res) {
    console.error("Error:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
    });

    if (error.response?.status === 404) {
        return res.status(404).json({ success: false, message: "Resource not found" });
    }
    res.status(500).json({ success: false, message: "Internal server error" });
}
