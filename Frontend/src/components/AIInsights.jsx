import React, { useState } from 'react'
import "../styles/dashboard.css"

const AIInsights = ({ session }) => {
  const [activeTab, setActiveTab] = useState('yearly')
  const [insight, setInsight] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchInsight = async (timeframe) => {
    setLoading(true)
    setInsight('')

    const token = session?.access_token

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/insights?range=${timeframe}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Failed to fetch insights')

      setInsight(data.insights)
    } catch (err) {
      console.error(err)
      setInsight('❌ Unable to fetch insights.')
    } finally {
      setLoading(false)
    }
  }

  const handleTabClick = (type) => {
    setActiveTab(type)
    fetchInsight(type) // could send type to server later
  }

  return (
   
    <div className="ai-insights-box">
      <div className="insights-header">
        <div className="insights-title">
          <span>✨</span>
          <span>AI Insights</span>
        </div>

        <div className="insights-tabs">
          {['weekly', 'monthly', 'yearly'].map((tab) => (
              <button
              key={tab}
              onClick={() => handleTabClick(tab)}
              className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
              >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
          ))}
        </div>
      </div>

      <div className="insight-body">
        {loading ? (
        <p>⏳ Generating insight…</p>
        ) : insight ? (
        <div className="insight-text">
            <span>✨</span>
            <span>{insight}</span>
        </div>
        ) : (
        <p className="placeholder">Click a timeframe to generate AI insights.</p>
        )}
      </div>
    </div>

  )
}

export default AIInsights
