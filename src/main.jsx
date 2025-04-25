import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App-v2'
import StarRating from './StarRating'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    {/*<StarRating maxRating={10} />
    <StarRating size={25} color='green' maxRating={11} message/>
    <StarRating message={["terrible", "bad", "okay", "good", "amazing"]} />*/}
  </StrictMode>
)
