import React from 'react';
import { Table } from '@/components/ui/table';

const ResultsTable = ({ data }) => {
  if (!data || !data.length) {
    return null;
  }

  return (
    <div className="mt-6">
      <Table>
        <thead>
          <tr>
            <th className="p-2 border">Date</th>
            <th className="p-2 border">Entry Price</th>
            <th className="p-2 border">Exit Price</th>
            <th className="p-2 border">Volume Ratio</th>
            <th className="p-2 border">Daily Return (%)</th>
            <th className="p-2 border">Total Return (%)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td className="p-2 border">{row.Date}</td>
              <td className="p-2 border text-right">${row.Entry_Price.toFixed(2)}</td>
              <td className="p-2 border text-right">${row.Exit_Price.toFixed(2)}</td>
              <td className="p-2 border text-right">{row.Volume_Ratio.toFixed(2)}x</td>
              <td className="p-2 border text-right">{row.Daily_Return.toFixed(2)}%</td>
              <td className="p-2 border text-right">{row.Total_Return.toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ResultsTable;