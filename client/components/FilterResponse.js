import React, { useState, useEffect } from 'react';
import './FilterResponse.css';

const FilterResponse = () => {
  const [apiInput, setApiInput] = useState('{"data":["M","1","334","4","B"]}');
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [filteredResponse, setFilteredResponse] = useState({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [operationCode, setOperationCode] = useState('');
  const [apiResponse, setApiResponse] = useState(null);
  const [error, setError] = useState(null);
  const [operationStatus, setOperationStatus] = useState(null);

  const API_URL = 'http://localhost:5001/api';

  const filterOptions = [
    { value: 'numbers', label: 'Numbers' },
    { value: 'highestAlphabet', label: 'Highest Alphabet' }
  ];

  useEffect(() => {
    fetch(API_URL)
      .then(response => response.json())
      .then(data => {
        setOperationCode(data.operation_code);
        setOperationStatus({ success: true, message: 'Operation code fetched successfully' });
      })
      .catch(err => {
        setError('Failed to fetch operation code');
        setOperationStatus({ success: false, message: 'Failed to fetch operation code' });
      });
  }, []);

  const handleFilterSelect = (value) => {
    if (!selectedFilters.includes(value)) {
      setSelectedFilters([...selectedFilters, value]);
    }
    setIsDropdownOpen(false);
  };

  const handleRemoveFilter = (valueToRemove) => {
    setSelectedFilters(selectedFilters.filter(value => value !== valueToRemove));
  };

  const parseResponse = (response) => {
    const result = {};
    
    if (selectedFilters.includes('numbers')) {
      result.numbers = response.numbers.join(',');
    }
    
    if (selectedFilters.includes('highestAlphabet')) {
      result.highestAlphabet = response.highest_alphabet[0];
    }
    
    setFilteredResponse(result);
  };

  const handleSubmit = async () => {
    try {
      const parsedInput = JSON.parse(apiInput);
      
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parsedInput)
      });

      const data = await response.json();
      setOperationStatus({ success: data.is_success, message: data.message || 'Operation completed' });
      
      if (!data.is_success) {
        setError(data.message);
        return;
      }

      setApiResponse(data);
      parseResponse(data);
      setError(null);
    } catch (error) {
      setOperationStatus({ success: false, message: 'Error processing request' });
      setError('Error processing request: ' + error.message);
    }
  };

  return (
    <div className="container">
      <div className="card">
        {operationStatus && (
          <div className={`status-message ${operationStatus.success ? 'success' : 'error'}`}>
            Operation Status: {operationStatus.success ? 'Success' : 'Failed'}
            <div className="status-details">
              {operationStatus.message}
            </div>
          </div>
        )}

        {operationCode && (
          <div className="operation-code">
            Operation Code: {operationCode}
          </div>
        )}

        <div className="input-group">
          <label>API Input</label>
          <textarea
            value={apiInput}
            onChange={(e) => setApiInput(e.target.value)}
            rows={3}
          />
        </div>

        <button 
          className="submit-button"
          onClick={handleSubmit}
        >
          Submit
        </button>

        <div className="filter-container">
          <label>Multi Filter</label>
          <div className="filter-box">
            {selectedFilters.map(filter => {
              const option = filterOptions.find(opt => opt.value === filter);
              return (
                <span
                  key={filter}
                  className="filter-tag"
                >
                  {option.label}
                  <button
                    onClick={() => handleRemoveFilter(filter)}
                    className="remove-button"
                  >
                    ×
                  </button>
                </span>
              );
            })}
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="select-button"
            >
              Select...
            </button>
          </div>
          
          {isDropdownOpen && (
            <div className="dropdown-menu">
              {filterOptions
                .filter(option => !selectedFilters.includes(option.value))
                .map(option => (
                  <button
                    key={option.value}
                    className="dropdown-item"
                    onClick={() => handleFilterSelect(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
            </div>
          )}
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {apiResponse && (
          <div className="response-section">
            <h3>API Response</h3>
            <div className="response-details">
              <p><strong>is success:</strong> {apiResponse.is_success ? 'True' : 'False'}</p>
              <p>User ID: {apiResponse.user_id}</p>
              <p>Email: {apiResponse.email}</p>
              <p>Roll Number: {apiResponse.roll_number}</p>
            </div>
          </div>
        )}

        <div className="filtered-response">
          <h3>Filtered Response</h3>
          {filteredResponse.numbers && (
            <p>Numbers: {filteredResponse.numbers}</p>
          )}
          {filteredResponse.highestAlphabet && (
            <p>Highest Alphabet: {filteredResponse.highestAlphabet}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterResponse;