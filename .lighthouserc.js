module.exports = {
  ci: {
    collect: {
      // build는 npm run lhci 에서 먼저 실행합니다. preview만 띄워 포트·준비 시점을 안정화합니다.
      startServerCommand:
        'npm run preview -- --host 127.0.0.1 --port 4173 --strictPort',
      startServerReadyPattern: 'Local:',
      startServerReadyTimeout: 120000,
      url: [
        'http://127.0.0.1:4173/find-player-game/',
        'http://127.0.0.1:4173/find-player-game/submission',
      ],
      numberOfRuns: 3,
      settings: {
        chromeFlags:
          '--headless=new --disable-dev-shm-usage --no-sandbox --disable-gpu',
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
}
