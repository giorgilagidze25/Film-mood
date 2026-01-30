import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [streamingContent, setStreamingContent] = useState('')

  const getMoviesByMood = async (mood) => {
    try {
      setLoading(true)
      setMovies([])
      setStreamingContent('')

      const response = await fetch('https://ai-backend-nine-wine.vercel.app/api/movies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ mood })
      })

      if (!response.ok) {
        throw new Error('Failed to fetch movies')
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let completeContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              break;
            }

            try {
              const parsed = JSON.parse(data);
              const content = parsed.content;
              if (content) {
                completeContent += content;
                setStreamingContent(completeContent);
              }
            } catch (e) {
            }
          }
        }
      }

      const movieList = completeContent.split('\n').filter(Boolean);
      setMovies(movieList);
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
        {loading && streamingContent && (
          <div className="movie-card streaming">
            {streamingContent}
          </div>
        )}
      </div>
    </div>
  )
}

export default App
