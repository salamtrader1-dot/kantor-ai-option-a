import React from 'react';

export default function Office3D() {
  return (
    <div className="w-full mt-8 overflow-hidden rounded-xl border border-gray-200 shadow-lg">
      <iframe 
        src="http://localhost:3000" 
        className="w-full h-[600px] border-0"
        title="Kantor AI Virtual"
        allow="autoplay; encrypted-media"
      />
    </div>
  );
}
