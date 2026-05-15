module.exports = {
  ci: {
    collect: {
      // preview 전에 dist 필요. VITE_LHCI 는 반드시 build 할 때 넣어야 번들에 반영됩니다.
      startServerCommand:
        'VITE_LHCI=true npm run build && npm run preview -- --host 127.0.0.1 --port 4173 --strictPort',
      startServerReadyPattern: 'http://127.0.0.1:4173',
      url: [
        'http://127.0.0.1:4173/find-player-game/',
        'http://127.0.0.1:4173/find-player-game/submission',
      ],
      // numberOfRuns: 5,
      numberOfRuns: 3,
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
}
