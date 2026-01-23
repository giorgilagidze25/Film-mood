import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const apiKey = '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'
  
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)

  const getMoviesByMood = async (e) => {
    setLoading(true)
    setMovies([])

    const prompt = `Recommend 5 ${e} movies. 
Return only a numbered list with movie name and year.`

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "xiaomi/mimo-v2-flash:free",
        messages: [
          { role: "system", content: "You are a movie expert." },
          { role: "user", content: prompt },
        ],
      }),
    })

    const data = await response.json()
    const text = data.choices[0].message.content

    const list = text.split("\n").filter((line) => line.trim() !== "")

    setMovies(list)
    setLoading(false)
  }

  return (
    <div className="card">
      <h1> Choose Mood</h1>

      <div className="btns">
        <button onClick={() => getMoviesByMood("funny")}> მხიარული</button>
        <button onClick={() => getMoviesByMood("romantic")}> რომანტიკული</button>
        <button onClick={() => getMoviesByMood("action")}> Action</button>
        <button onClick={() => getMoviesByMood("sad")}> სევდიანი</button>
        <button onClick={() => getMoviesByMood("horror")}> საშინელებათა</button>
      </div>

      {loading && <p>Loading movies...</p>}

      <div className="movie-list">
        {movies.map((movie, index) => (
          <div key={index} className="movie-card">
            {movie}
          </div>
        ))}
      </div>
    </div>
  )
}

export default App