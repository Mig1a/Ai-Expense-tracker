import React, { useState } from 'react';
import '../styles/dashboard.css';

const ExpenseTracker = () => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('0.00');
  const [category, setCategory] = useState('General');
  const [expenses, setExpenses] = useState([]);

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!description || parseFloat(amount) <= 0) return;
    
    const newExpense = {
      id: Date.now(),
      description,
      amount: parseFloat(amount).toFixed(2),
      category,
      date: new Date().toLocaleDateString()
    };
    
    setExpenses([newExpense, ...expenses]);
    setDescription('');
    setAmount('0.00');
    setCategory('General');
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
  const expenseCount = expenses.length;

  return (
    <div className="expense-tracker">
      <h1>Expense Tracker</h1>
      <p className="subtitle">Track and manage your expenses easily</p>
      
      <div className="tracker-container">
        {/* Add Expense Section */}
        <div className="add-expense-section">
          <h2>Add Expense</h2>
          <p>Record a new expense</p>
          
          <form onSubmit={handleAddExpense}>
            <div className="form-group">
              <label>Description</label>
              <p className="hint">What did you spend on?</p>
              <input 
                type="text" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Amount</label>
              <p className="hint">$ 0.00</p>
              <input 
                type="number" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0.01"
                step="0.01"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Category</label>
              <p className="hint">General</p>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="General">General</option>
                <option value="Food">Food</option>
                <option value="Transport">Transport</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Utilities">Utilities</option>
                <option value="Shopping">Shopping</option>
              </select>
            </div>
            
            <div className="divider"></div>
            
            <button type="submit" className="add-button">Add Expense</button>
          </form>
        </div>
        
        {/* Summary Section */}
        <div className="summary-section">
          <h2>Total Expenses</h2>
          <p className="total-amount">${totalExpenses.toFixed(2)}</p>
          
          <h3>Expense Count</h3>
          <p>{expenseCount}</p>
        </div>
        
        {/* Recent Expenses Section */}
        <div className="recent-expenses">
          <h2>Recent Expenses</h2>
          <p className="category-filter">All Categories</p>
          
          {expenses.length === 0 ? (
            <p className="no-expenses">No expenses found. Add some expenses to get started!</p>
          ) : (
            <ul className="expenses-list">
              {expenses.map(expense => (
                <li key={expense.id} className="expense-item">
                  <div className="expense-info">
                    <span className="expense-desc">{expense.description}</span>
                    <span className="expense-category">{expense.category}</span>
                  </div>
                  <div className="expense-amount">${expense.amount}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpenseTracker;