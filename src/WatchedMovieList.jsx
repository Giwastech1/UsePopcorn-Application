function WatchedMovieList({watched,onDeleteMovie}) {
  return  <ul className="list box">
  {watched.map((movie) => (
    <WatchedMovie movie={movie} key={movie.imdbID}onDeleteMovie={onDeleteMovie} />
  ))}
</ul>
}
function WatchedMovie({ movie,onDeleteMovie }) {
  return <li>
  <img src={movie.poster} alt={`${movie.title}poster`} />
  <h3>{movie.title}</h3>
  <div>
    <p>
      <span>⭐</span>
      <span>{movie.imdbRating}</span>
    </p>
    <p>
      <span>🌟</span>
      <span>{movie.userRating}</span>
    </p>
    <p>
      <span>⏳</span>
        <span>{movie.runtime}</span>
      </p>
      <button className="btn-delete" onClick={()=>onDeleteMovie(movie.imdbID)}>X</button>
  </div>
</li>
}
export default WatchedMovieList;