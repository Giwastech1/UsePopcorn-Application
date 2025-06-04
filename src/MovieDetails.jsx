import { useState, useEffect } from "react";
import StarRating from "./StarRating";
const key = "6ee10de5";
 function MovieDetails({ selectedId, onAddWatched, onCloseMovie, setSelectedId, watched}) {
  const [loading, setLoading] = useState(false);
  const [movie, setMovie] = useState({});
  const [userRating, setUserRating] = useState(0);
  const { Title: title,
    Year: year,
    Poster: poster,
    Rated: rated,
    Released: released,
    Actors: actors,
    Director: directors,
    Genre: genre,
    Runtime: runtime,
    Plot: plot,
    imdbRating: imdbRating,
  } = movie;
     const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
     const watchedUserRating = watched.find((movie) => movie.imdbID === selectedId)?.userRating;
  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedId,
      imdbRating:Number(imdbRating),
      title,
      year,
      poster,
      runtime: Number(runtime.split(" ").at(0)),
      userRating
    };
    onAddWatched(newWatchedMovie);
    setSelectedId(null);
     }
     function Loader() {
         return <h1>Loading...</h1>
     }
  useEffect(function () {
    async function getMoviesDetails() {
      setLoading(true);
      const res = await fetch(`https://www.omdbapi.com/?apikey=${[key]}&i=${selectedId}`);
      const data = await res.json();
      setMovie(data);
      setLoading(false);
    }
    getMoviesDetails();
  }, [selectedId]);
  useEffect(function () {
    function callBack(e) {
      if (e.code === "Escape") {
        onCloseMovie();
      }
    }
    document.addEventListener("keydown", callBack);
    return function () {
      document.removeEventListener("keydown", callBack);
    }
  },[])
  useEffect(function () {
    if (!title) {
      return;
    }
    document.title = `Movie | ${title}`;
    return function () {
      document.title = "usePopcorn";
    }
  }, [title]);
  return (
    <div>
      {
        loading ? <Loader /> :
          <>
            <header className="details">
              <button className="btn-back" onClick={onCloseMovie}>&larr;</button>
        <img src={poster} alt={`Poster of ${movie}`} />
        <div className="details-overview">
          <h2>{title}</h2>
          <p>{released} &bull; {runtime}</p>
          <p>{genre}</p>
          <span>⭐{imdbRating} IMDd rating</span>
        </div>
            </header>
            <section>
              {
                isWatched ? <><p className="rating">You rated this movie {watchedUserRating}⭐</p>
                  <p>
                <em>{plot}</em>
             </p>
               <p>Starring {actors}</p>
               <p>Directed by {directors}</p></>:
                <>
                  <div className="rating">
                <StarRating size={20} message={["terrible", "bad", "okay", "good", "amazing"]} maxRating={10} onSetRating={setUserRating} />
                {userRating>0 && <button className="btn-add" onClick={handleAdd}>+ Add to list</button>}
             </div>
           <p>
             <em>{plot}</em>
          </p>
            <p>Starring {actors}</p>
            <p>Directed by {directors}</p>
                </>
              }
        </section>
            
          </>
      }
      </div>  
  ) 
}
export default MovieDetails;