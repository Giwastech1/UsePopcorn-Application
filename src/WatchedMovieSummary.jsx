function WatchedMovieSummary({ watched,average }) {
  const validImdbRating = watched.map((movie) => movie.imdbRating).filter((imdbRating) => !isNaN(imdbRating));
  const avgImdbRating = average(validImdbRating);
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const validRuntime = watched.map((movie) => movie.runtime).filter((runtime) => !isNaN(runtime));
  const avgRuntime = average(validRuntime);
  return <div className="summary">
  <h2>Movies you watched</h2>
  <div>
    <p>
      <span>#️⃣</span>
      <span>{watched.length} movies</span>
    </p>
    <p>
      <span>⭐</span>
      <span>{avgImdbRating.toFixed(2)}</span>
    </p>
    <p>
      <span>🌟</span>
      <span>{avgUserRating.toFixed(2)}</span>
    </p>
    <p>
      <span>⏳</span>
      <span>{Math.round(avgRuntime)} min</span>
    </p>
  </div>
</div>
}
export default WatchedMovieSummary;