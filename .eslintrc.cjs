module.exports = {
  root: true,
  overrides: [
    {
      files: ['app/**/*.{ts,tsx}', 'src/**/*.{ts,tsx}'],
      rules: {
        'no-restricted-globals': [
          'error',
          { name: 'window', message: 'Use window only in client components or inside useEffect.' },
          { name: 'document', message: 'Use document only in client components or inside useEffect.' },
          { name: 'localStorage', message: 'Use localStorage only in client components or inside useEffect.' },
        ],
      },
    },
  ],
};
