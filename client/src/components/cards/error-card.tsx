import React from 'react';

export default function ErrorCard() {
  return (
    <div className="p-6 text-red-600 border border-red-200 bg-red-50 rounded-lg mx-6 mt-6">
      <h2 className="font-bold">⚠️ Error</h2>
      <p>Gagal memuat data dari server. Silakan coba lagi. Lihat konsol untuk detail.</p>
    </div>
  );
}
