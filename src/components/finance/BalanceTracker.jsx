import  { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Ensure to import this for navigation
import supabase from '../../../supabase'; // Adjust the path as needed
import { Helmet } from 'react-helmet';
import '../../styles/finance/BalanceTracker.css'; // Import your CSS file

const BalanceTracker = () => {
  const [currentBalance, setCurrentBalance] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [,setAlert] = useState({ show: false, message: '', variant: '' });
  const navigate = useNavigate(); // Initialize navigate for navigation

  useEffect(() => {
    fetchBalance();
    fetchRecentTransactions();
  }, []);

  // Function to fetch the current balance from Supabase
  const fetchBalance = async () => {
    const { data, error } = await supabase
      .from('Balance')
      .select('balance')
      .single();

    if (error) {
      setAlert({ show: true, message: `Error fetching balance: ${error.message}`, variant: 'danger' });
    } else if (data) {
      setCurrentBalance(parseFloat(data.balance) || 0);
    }
  };

  // Function to fetch recent transactions from Supabase
  const fetchRecentTransactions = async () => {
    const { data, error } = await supabase
      .from('transactions')
      .select('amount, transaction_type, timestamp')
      .order('timestamp', { ascending: false })
      .limit(5);

    if (error) {
      setAlert({ show: true, message: `Error fetching transactions: ${error.message}`, variant: 'danger' });
    } else {
      setRecentTransactions(data || []);
    }
  };

  // Handler for "Go Back" button
  const handleBack = () => {
    navigate('/finance');
  };

  return (
    <>
      <Helmet>
        <title>Finance - Balance Tracker</title>
      </Helmet>
      <div className="balance-container">
        <h1 className="balance-header">Balance Tracker</h1>
        <div className="current-balance">
          Current Balance: ${currentBalance.toFixed(2)}
        </div>
        <table className="transaction-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Amount</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {recentTransactions.length > 0 ? (
              recentTransactions.map((transaction, index) => (
                <tr key={index}>
                  <td>{transaction.transaction_type.charAt(0).toUpperCase() + transaction.transaction_type.slice(1)}</td>
                  <td>Rs. {parseFloat(transaction.amount).toFixed(2)}</td>
                  <td>{new Date(transaction.timestamp).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center">No recent transactions</td>
              </tr>
            )}
          </tbody>
        </table>
        <button className="back-button" onClick={handleBack}>
          Go Back
        </button>
      </div>
    </>
  );
};

export default BalanceTracker;
