# ⚽ Find Football Player Quiz

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://software92.github.io/find-player-game/)
![Deploy Status](https://img.shields.io/github/actions/workflow/status/software92/find-player-game/deploy.yml?branch=master&style=flat-square&label=Deploy&logo=GitHub%20Actions&logoColor=white)

외부 API Rate Limit 문제를 해결하기 위해 서버리스 구조로 개선한 퀴즈형 웹 서비스입니다.  
블러 처리된 프리미어리그 선수 이미지를 보고 정답을 맞추는 과정에서 자동완성, 힌트, 상태 기반 UI를 제공합니다.

---

## 서비스 화면

|                 Loading                  |                         Entry                          |                       자동완성                       |
| :--------------------------------------: | :----------------------------------------------------: | :--------------------------------------------------: |
| ![loading](src/assets/imgs/loading.webp) | ![main-interface](src/assets/imgs/main-interface.webp) | ![auto-complete](src/assets/imgs/auto-complete.webp) |

|                 힌트                 |                  정답                  |
| :----------------------------------: | :------------------------------------: |
| ![hints](src/assets/imgs/hints.webp) | ![result](src/assets/imgs/result.webp) |

---

## 1. 프로젝트 소개

- 블러 처리된 프리미어리그 선수 이미지를 보고 정답을 맞추는 퀴즈 게임
- 자동완성과 힌트 기반 인터랙션으로 사용자 진입 장벽 완화
- 외부 API 직접 의존 구조를 서버리스로 전환해 안정성/가용성 개선

---

## 2. 아키텍처

```text
[기존]
Client → External API

[개선]
Client → Firebase Realtime Database
        ↑
Cloud Functions (데이터 수집/동기화)
        ↑
External API
```
