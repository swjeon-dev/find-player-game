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
      // CI(GitHub Actions)에서는 1회, 로컬은 3회
      numberOfRuns: process.env.GITHUB_ACTIONS === 'true' ? 1 : 3,
      settings: {
        chromeFlags:
          '--headless=new --disable-dev-shm-usage --no-sandbox --disable-gpu',
      },
    },
    upload: {
      target: 'temporary-public-storage',
      // target: 'filesystem',
      // outputDir: './lighthouse-results',
      // outputFilenamePrefix: 'lighthouse-results',
      // 각 보고서 파일 이름 규칙을 지정합니다.
      // reportFilenamePattern: '%%PATHNAME%%-%%DATETIME%%-report.%%EXTENSION%%',
    },
    assert: {
      assertions: {
        'first-contentful-paint': ['warn', { minScore: 0.7 }],
        'largest-contentful-paint': ['warn', { minScore: 0.8 }],
        'speed-index': ['warn', { minScore: 0.8 }],
        'time-to-interactive': ['warn', { minScore: 0.8 }],
        'total-blocking-time': ['warn', { minScore: 0.8 }],
        'cumulative-layout-shift': ['warn', { minScore: 0.8 }],
        // 'categories:performance': ['warn', { minScore: 0.9 }],
        // 'categories:accessibility': ['warn', { minScore: 0.9 }],
        // 'categories:best-practices': ['warn', { minScore: 0.9 }],
        // 'categories:seo': ['warn', { minScore: 0.9 }],
      },
    },
  },
}
