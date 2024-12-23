import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from 'lucide-react';
import { analyzeStock } from '@/utils/api';
import ResultsTable from './ResultsTable';

const AnalysisForm = () => {
  const [formData, setFormData] = useState({
    ticker: '',
    startDate: '',
    endDate: '',
    volumeThreshold: 200,
    priceThreshold: 2,
    holdingPeriod: 10
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResults(null);

    try {
      const response = await analyzeStock({
        ticker: formData.ticker.toUpperCase(),
        start_date: formData.startDate,
        end_date: formData.endDate,
        volume_threshold: parseFloat(formData.volumeThreshold),
        price_threshold: parseFloat(formData.priceThreshold),
        holding_period: parseInt(formData.holdingPeriod)
      });

      // Check if the response is successful and is a blob
      if (response.ok) {
        const blob = await response.blob();
        
        // Create a download link
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${formData.ticker}_analysis.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        // Also parse the CSV for display
        const text = await blob.text();
        const rows = text.split('\n');
        const data = [];
        let isDataSection = false;

        for (const row of rows) {
          if (row.trim() === 'Detailed Trade List') {
            isDataSection = true;
            continue;
          }
          if (isDataSection && row.trim()) {
            const [date, entryPrice, exitPrice, volumeRatio, dailyReturn, totalReturn] = row.split(',');
            if (date !== 'Date') { // Skip header row
              data.push({
                Date: date,
                Entry_Price: parseFloat(entryPrice),
                Exit_Price: parseFloat(exitPrice),
                Volume_Ratio: parseFloat(volumeRatio),
                Daily_Return: parseFloat(dailyReturn),
                Total_Return: parseFloat(totalReturn)
              });
            }
          }
        }
        setResults(data);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Analysis failed');
      }
    } catch (err) {
      setError(err.message || 'Failed to generate report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Analysis Parameters</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="ticker">Stock Ticker</Label>
              <Input
                id="ticker"
                name="ticker"
                value={formData.ticker}
                onChange={handleInputChange}
                placeholder="e.g., AAPL"
                required
                className="uppercase"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <div className="relative">
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                  />
                  <Calendar className="absolute right-2 top-2 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <div className="relative">
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    required
                  />
                  <Calendar className="absolute right-2 top-2 h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="volumeThreshold">Volume Threshold (%)</Label>
                <Input
                  id="volumeThreshold"
                  name="volumeThreshold"
                  type="number"
                  min="0"
                  step="1"
                  value={formData.volumeThreshold}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="priceThreshold">Price Change (%)</Label>
                <Input
                  id="priceThreshold"
                  name="priceThreshold"
                  type="number"
                  step="0.1"
                  value={formData.priceThreshold}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="holdingPeriod">Holding Period (Days)</Label>
                <Input
                  id="holdingPeriod"
                  name="holdingPeriod"
                  type="number"
                  min="1"
                  value={formData.holdingPeriod}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm mt-2">{error}</div>
            )}

            <Button 
              type="submit" 
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Generating Report...' : 'Generate Report'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {results && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
          </CardHeader>
          <CardContent>
            <ResultsTable data={results} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AnalysisForm;