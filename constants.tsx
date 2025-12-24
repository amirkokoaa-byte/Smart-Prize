
import React from 'react';

export const PRESET_EXPENSES = [
  'المياه',
  'الغاز',
  'الكهرباء',
  'الانترنت المنزلي',
  'الخط الارضي',
  'جمعيات',
  'اقساط بنك'
];

export const PRESET_OBLIGATIONS = [
  'جمعيات',
  'اقساط بنك',
  'التزامات اخرى'
];

export const THEMES = {
  'modern-blue': {
    sidebar: 'bg-slate-900',
    header: 'bg-white',
    body: 'bg-slate-50',
    primary: 'bg-blue-600 hover:bg-blue-700',
    text: 'text-slate-800',
    accent: 'text-blue-600'
  },
  'deep-dark': {
    sidebar: 'bg-black',
    header: 'bg-zinc-900',
    body: 'bg-zinc-950',
    primary: 'bg-zinc-700 hover:bg-zinc-600',
    text: 'text-zinc-100',
    accent: 'text-zinc-400'
  },
  'nature-green': {
    sidebar: 'bg-emerald-900',
    header: 'bg-white',
    body: 'bg-emerald-50',
    primary: 'bg-emerald-600 hover:bg-emerald-700',
    text: 'text-emerald-900',
    accent: 'text-emerald-600'
  },
  'royal-purple': {
    sidebar: 'bg-indigo-950',
    header: 'bg-white',
    body: 'bg-indigo-50',
    primary: 'bg-indigo-600 hover:bg-indigo-700',
    text: 'text-indigo-900',
    accent: 'text-indigo-600'
  }
};
