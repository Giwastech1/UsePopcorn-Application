import { useState } from "react";
function MoviesList({ movies, onSelectId }) {
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");
  function filteredMovies() {
      return movies.filter((movie) => {
          const matchesGenre = selectedGenre === "All" || movie.Genre?.includes(selectedGenre);
          const matchesYear = selectedYear === "All" || movie.Year === selectedYear;
          return matchesGenre && matchesYear;
      })
  }
  return (
    <>
      {movies.length > 0 && (
        <div className="filters">
          <select value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)}>
            <option value="All">All Genres</option>
            <option value="Action">Action</option>
            <option value="Comedy">Comedy</option>
            <option value="Drama">Drama</option>
            <option value="Horror">Horror</option>
          </select>
          <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
            <option value="All">All Years</option>
            {Array.from({ length: new Date().getFullYear() - 1960 + 1 }, (_, i) => {
              const year = new Date().getFullYear() - i;
                return (
                    <option key={year} value={year}>
                        {year}
                    </option>
                );
            })}
         </select>

        </div>
      )}

      {/* Show filtered movies */}
      <ul className="list list-movies box">
        {filteredMovies().map((movie) => (
          <Movie movie={movie} key={movie.imdbID} onSelectId={onSelectId} />
        ))}
      </ul>
    </>
  );
}


{/*function MoviesList({ movies, onSelectId }) {
  return (
    <ul className="list list-movies box">
      {movies.map((movie) => (
      <Movie movie={movie} key={movie.imdbID} onSelectId={onSelectId} />
      ))}
    </ul>
  )
}
*/}
function Movie({movie,onSelectId}) {
    return <li onClick={() => onSelectId(movie.imdbID)}>
        <img src={movie.Poster} alt={`Poster${movie.Title}Poster`} />
        <h3>{movie.Title}</h3>
        <div>
          <p>
            <span>🗓</span>
            <span>{movie.Year}</span>
          </p>
        </div>
    </li >  
}
export default MoviesList;