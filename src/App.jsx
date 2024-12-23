import React from 'react';
import AnalysisForm from './components/AnalysisForm';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          Stock Breakout Analysis
        </h1>
        <AnalysisForm />
      </div>
    </div>
  );
}

export default App;