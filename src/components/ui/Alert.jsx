import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

export default function Alert({ type = 'success', message }) {
  if (!message) return null;
  const isError = type === 'error';
  return (
    <div class={`p-4 rounded-lg flex items-start gap-3 my-3 text-sm ${isError ? 'bg-red-50 text-red-800 border border-red-200' : 'bg-green-50 text-green-800 border border-green-200'}`}>
      {isError ? <AlertCircle class="h-5 w-5 shrink-0" /> : <CheckCircle class="h-5 w-5 shrink-0" />}
      <div>{message}</div>
    </div>
  );
}