import React from 'react';

export default function Loader({ size = 'md' }) {
  const dimensions = size === 'sm' ? 'h-5 w-5' : size === 'lg' ? 'h-12 w-12' : 'h-8 w-8';
  return (
    <div class="flex items-center justify-center p-4">
      <div class={`${dimensions} animate-spin rounded-full border-4 border-slate-200 border-t-blue-600`}></div>
    </div>
  );
}