import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Table({ data, columns, linkPrefix }) {
  const navigate = useNavigate();

  const handleRowClick = (profileId) => {
    // Navigate to the profile page
    navigate(`/${linkPrefix}/${profileId}`);
  };

  return (
    <div className="bg-white rounded m-6 p-6">
      <table className="table-auto w-full border-collapse border border-gray-light text-sm text-gray-dark">
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} className="border border-gray-light p-2">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item) => (
              <tr
                key={item.profile_id}
                className="cursor-pointer hover:bg-gray-light"
                onClick={() => handleRowClick(item.profile_id)} // Handle row click
              >
                {Object.values(item).map((value, i) => (
                  <td key={i} className="border border-gray-light p-2 text-center">
                    {i === 0 ? (
                      // Optionally keep the link styling for the first column
                      <span>{value}</span>
                    ) : (
                      value
                    )}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td className="border border-gray-light p-2 text-center" colSpan={columns.length}>
                No data found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}