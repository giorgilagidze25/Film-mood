import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const apiKey = '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'
  
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)

 const getMoviesByMood = async (mood) => {
  try {
    setLoading(true)
    setMovies([])

    const prompt = `Recommend 5 ${mood} movies. 
Return only a numbered list with movie name and year.`

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:5173",
        "X-Title": "Movie Mood App"
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a movie expert." },
          { role: "user", content: prompt }
        ]
      })
    })

    const data = await response.json()

    if (!data.choices) {
      console.error("API error:", data)
      return
    }

    const text = data.choices[0].message.content
    const list = text.split("\n").filter(Boolean)

    setMovies(list)
  } catch (err) {
    console.error(err)
  } finally {
    setLoading(false)
  }
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