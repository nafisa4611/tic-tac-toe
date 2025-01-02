import React from 'react';

export default function Square({ value, onClick }) {
  return (
    <button
      className="bg-white border border-gray-400 h-16 w-16 m-1 text-xl font-bold"
      onClick={onClick}
    >
      {value}
    </button>
  );
}
