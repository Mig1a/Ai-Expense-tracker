"use client"

import { useMemo } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

const COLORS = {
  Food: "var(--food-color)",
  Transport: "var(--transport-color)",
  Entertainment: "var(--entertainment-color)",
  Utilities: "var(--utilities-color)",
  Shopping: "var(--shopping-color)",
  General: "var(--general-color)",
}

const RADIAN = Math.PI / 180
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return percent > 0.05 ? (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize="12px"
      fontWeight="500"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  ) : null
}

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <p className="tooltip-category">{payload[0].name}</p>
        <p className="tooltip-value">${Number.parseFloat(payload[0].value).toFixed(2)}</p>
        <p className="tooltip-percent">{`${(payload[0].payload.percent * 100).toFixed(1)}%`}</p>
      </div>
    )
  }
  return null
}

const ExpensePieChart = ({ expenses }) => {
  const chartData = useMemo(() => {
    // Group expenses by category and sum amounts
    const categoryMap = expenses.reduce((acc, expense) => {
      const category = expense.category
      if (!acc[category]) {
        acc[category] = 0
      }
      acc[category] += Number.parseFloat(expense.amount)
      return acc
    }, {})

    // Convert to array format for recharts
    const data = Object.entries(categoryMap).map(([name, value]) => ({
      name,
      value,
    }))

    // Calculate percentages
    const total = data.reduce((sum, item) => sum + item.value, 0)
    return data.map((item) => ({
      ...item,
      percent: total > 0 ? item.value / total : 0,
    }))
  }, [expenses])

  // If no data, show a message
  if (chartData.length === 0) {
    return (
      <div className="expense-chart-container">
        <h2>Expense Breakdown</h2>
        <div className="no-data-message">
          <p>Add expenses to see your spending breakdown</p>
        </div>
      </div>
    )
  }

  return (
    <div className="expense-chart-container">
      <h2>Expense Breakdown</h2>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={100}
              innerRadius={40}
              fill="#8884d8"
              dataKey="value"
              animationDuration={750}
              animationBegin={0}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.name] || "#64748b"} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              formatter={(value) => <span style={{ color: "var(--text-primary)" }}>{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default ExpensePieChart
