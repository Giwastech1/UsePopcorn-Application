import { useState, useEffect } from "react";
function useMovies(query,key,callBack) {
  const [movies, setMovies] = useState([]); 
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(function () {
    callBack?.();
    const controller = new AbortController();
    async function getMovies() {
      try {
        setError("");
        setIsLoading(true);
        const res = await fetch(`https://www.omdbapi.com/?apikey=${[key]}&s=${query}`,{signal:controller.signal});
        if (!res.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
        const data = await res.json();
        if (data.Response === "False") {
          throw new Error("Movies not found");
        }
        setMovies(data.Search);
        setIsLoading(false);
      } catch (error) {
        if (error.name !== "AbortError") {
          setError(error.message);
        }
        setIsLoading(false); 
      }
    }
    if (query.length<3) {
      setMovies([]);
      setError("");
      //handleCloseMovie();
      return;
    }
    getMovies();
    return function () {
      controller.abort();
    }
  }, [query]);
  return { movies, isLoading, error };
}

export default useMovies;