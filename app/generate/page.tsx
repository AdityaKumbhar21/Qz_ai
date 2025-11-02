"use client"

import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

const page = () => {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/quiz/generate', {
      method: 'POST',
      body: JSON.stringify({ topic, difficulty }),
    });
    const data = await res.json();
    if (data.quizId) {
        console.log("Topic: ", data.topic);
        console.log("Difficulty: ", data.difficulty);
        console.log(data.questions);
    };
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-8">
      <input
        type="text"
        placeholder="Enter topic (e.g., React Hooks)"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        className="w-full p-3 border rounded mb-4"
        required
      />
      <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="w-full p-3 border rounded mb-4">
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>
      <button disabled={loading} className="w-full bg-blue-500 text-white p-3 rounded">
        {loading ? 'Generating...' : 'Generate Quiz'}
      </button>
    </form>
  );
}

export default page