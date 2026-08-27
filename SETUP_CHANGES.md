# Setup Changes Log

이 문서는 OpsMate 프로젝트를 위해 설치한 도구와 패키지, 수정한 사용자/시스템 설정, 인증정보 위치 및 프로젝트 종료 시 안전한 원복 절차를 기록합니다.

## 운영 원칙

- 기존 Python, Git, Docker, Node.js 및 기타 개발 환경을 임의로 삭제하거나 변경하지 않는다.
- 전역 패키지 설치 또는 시스템/사용자 설정 변경은 실행 전에 사용자에게 알리고 승인을 받는다.
- Xano Workspace에 푸시하기 전에는 항상 관련 `git diff`를 사용자에게 보여주고 명시적 승인을 기다린다.
- Xano Workspace에 푸시한 후에는 라이브 백엔드를 테스트한다.
- 비밀값, 토큰, API Key 및 환경변수 값은 이 문서나 Git에 기록하지 않는다.
- 프로젝트 관련 환경 변경이 생기거나 제거될 때마다 이 문서를 갱신한다.

## 2026-08-26 — Xano CLI 및 Developer MCP 설치

### 설치 방식

- 전역 설치를 하지 않고 Codex 작업 디렉터리의 프로젝트 전용 도구 폴더에 설치했다.
- 도구 위치:
  - `C:\Users\jjw08\Documents\Codex\2026-08-26\devpost-https-go-xano-co-start\work\xano-tools`
- 설치된 주요 패키지:
  - `@xano/cli` 1.2.0
  - `@xano/developer-mcp` 2.2.5
  - `node` / `node-win-x64` 22.23.2
  - `@modelcontextprotocol/sdk` 1.30.0
- Codex에 번들된 pnpm을 사용했다. 기존 시스템 Node.js, npm, Python, Git 및 Docker는 변경하지 않았다.
- pnpm 패키지 캐시가 `C:\Users\jjw08\Documents\Codex\.pnpm-store\v11`에 생성 또는 사용되었다. 이 캐시는 다른 Codex 프로젝트와 공유될 수 있으므로 전체 폴더를 임의로 삭제하지 않는다.

### 사용자 설정 변경

- 수정 파일: `C:\Users\jjw08\.codex\config.toml`
- 추가 항목: `[mcp_servers.xano]` 블록
- 목적: Codex가 위 프로젝트 전용 도구 폴더의 Xano Developer MCP를 시작하도록 등록
- 기존 Codex MCP, 플러그인 및 사용자 설정은 유지했다.

### 인증정보

- Xano CLI 인증 파일 위치:
  - `C:\Users\jjw08\Documents\Codex\2026-08-26\devpost-https-go-xano-co-start\work\xano-tools\credentials.yaml`
- 프로필 이름: `default`
- 연결 대상: 선택한 Xano 인스턴스, Workspace ID `1`, 라이브 브랜치
- 인증 파일과 토큰 내용은 OpsMate Git 저장소 외부에 있으며 Git에 포함하지 않는다.
- Windows 권한 격리로 인해 기본 사용자 홈의 `.xano` 인증 폴더는 생성하지 않았다.

### 호환 및 검증 파일

- `windows-userinfo-shim.cjs`: Windows 격리 환경에서 Xano CLI 실행을 지원한다.
- `verify-mcp.mjs`: Developer MCP의 stdio 연결과 도구 목록을 검증한다.

### 검증 결과

- Xano CLI 1.2.0이 인증된 사용자, 인스턴스 및 Workspace ID `1`을 정상 조회했다.
- Xano Developer MCP 2.2.5가 정상 시작되었고 MCP 도구 목록 조회에 성공했다.
- Xano Workspace의 데이터, 스키마, API, 함수 및 정적 호스팅은 변경하지 않았다.

## 2026-08-26 — OpsMate Git 저장소 초기화

- 프로젝트 경로: `C:\Users\jjw08\OneDrive\바탕 화면\Opsmate`
- Git 저장소를 `main` 브랜치로 초기화했다.
- `.gitignore`를 추가해 환경변수, 인증정보, 토큰, API Key, 개인 키, 로컬 도구, 의존성 및 빌드 산출물이 Git에 포함되지 않도록 했다.
- GitHub 저장소 생성, 원격 연결, 커밋 및 push는 수행하지 않았다.
- Xano Workspace와 OpsMate 기능 코드는 변경하지 않았다.

## 2026-08-27 — Incident 기본 백엔드 구현

- Xano Workspace ID `1`의 라이브 `v1` 브랜치에 OpsMate 전용 객체를 추가했다.
- 추가된 Xano 객체:
  - `incident` 테이블
  - `OpsMate` API 그룹 (`api:opsmate`)
  - `POST /incidents`
  - `GET /incidents`
  - `GET /incidents/{incident_id}`
  - `PATCH /incidents/{incident_id}`
- 기존 Xano Quick Start 테이블, 인증 API, 함수 및 AI 예제 객체는 수정하거나 삭제하지 않았다.
- XanoScript 원본은 저장소의 `xano/` 폴더에서 관리한다.
- 라이브 API에서 생성, 목록, 상세, 필수값 검증, 404, resolve 및 반복 resolve 멱등성을 확인했다.
- 실제 Xano 인증정보나 토큰은 저장소에 기록하지 않았다.

## 2026-08-27 — Xano AI Incident 분석 연결

- Xano의 내장 `xano-free` provider를 사용하는 `OpsMate Incident Analyst` agent를 추가했다.
- 별도 유료 AI 서비스 가입, 외부 API Key 생성 또는 Xano 환경변수 추가는 필요하지 않았다.
- `POST /incidents`가 Xano backend 안에서 AI 분석을 실행하고 JSON 결과를 검증한 뒤 Incident를 저장하도록 변경했다.
- AI 출력은 `ai_summary`, `possible_causes`, `recommended_actions`, `severity`로 제한한다.
- `severity`는 `low`, `medium`, `high`, `critical`만 허용하며 JSON parsing 또는 구조 검증 실패 시 레코드를 저장하지 않고 오류를 반환한다.
- 라이브 API에서 nginx 502 오류 분석과 DB 영속 저장을 확인했다.

## 2026-08-27 — Frontend 및 Xano Static Hosting 배포

- 별도 frontend framework나 패키지 설치 없이 `frontend/`에 HTML, CSS, JavaScript SPA를 추가했다.
- Xano Workspace ID `1`에 `opsmate` Static Host를 생성했다.
- 배포된 build:
  - Build ID: `1`
  - Build name: `4012f5e`
- Dev URL: `https://opsmate-dev-fdab0e-xq4b-bkh8-ih5r.k7.xano.io`
- Production URL: `https://opsmate-prod-fdab0e-xq4b-bkh8-ih5r.k7.xano.io`
- production에서 AI 분석, history, detail, resolve, 새로고침 영속성과 브라우저 console 오류 부재를 확인했다.
- Static Host에는 공개 frontend 파일 3개만 업로드했으며 credential이나 secret은 포함하지 않았다.

## 2026-08-27 — 제출 전 UI 문구 및 AI 응답 길이 정리

- 메인 헤드라인과 서브카피를 한국어 제출용 문구로 변경하고, 화면의 장애 관련 용어를 `오류`와 `인시던트`로 통일했다.
- 기존 레이아웃, API 구조, Incident 흐름 및 Xano AI 분석 방식은 유지했다.
- AI prompt에 요약 2~3문장, 가능한 원인 최대 3개, 권장 해결 순서 최대 3개 제한을 추가했다.
- Xano Static Host Build ID `3` (`ui-copy-refresh-v2`)을 dev와 production에 배포했다.
- dev와 production에서 분석 생성, 결과 개수 제한, 기록, 상세, resolve 및 새로고침 후 상태 영속성을 확인했다.

## 2026-08-27 — 최종 MVP UI/UX polish

- Hero 문구를 최종 제출용 카피로 변경하고 desktop과 390px mobile에서 자연스러운 2줄 headline이 유지되도록 타이포그래피를 조정했다.
- 시각적 피드백 없이 중복되던 수동 History 새로고침 버튼을 제거했다.
- 초기 로드, Incident 생성 성공 후, resolve 성공 후 `GET /incidents`를 다시 실행하며 캐시를 사용하지 않도록 설정했다.
- AI Agent가 설명은 자연스러운 한국어로 작성하되 오류 메시지, 명령어, 코드, 기술명, 서비스명, 제품명은 원문을 유지하도록 prompt를 변경했다.
- Xano Static Host Build ID `6` (`final-mvp-polish-v3`)을 dev와 production에 배포했다.
- production에서 분석 생성, 한국어 AI 결과, History 자동 갱신, 상세 조회, dialog 닫기/재열기, resolve, desktop/mobile layout 및 console 오류 부재를 확인했다.

## 프로젝트 종료 시 안전한 제거 및 원복

제거 전에는 필요한 소스, 문서, Xano Workspace 상태를 백업하고 각 경로를 다시 확인한다.

1. Codex를 종료한다.
2. `C:\Users\jjw08\.codex\config.toml`에서 `[mcp_servers.xano]` 블록과 그 블록에 속한 `command`, `args`, `startup_timeout_sec`만 제거한다. 다른 Codex 설정은 유지한다.
3. 더 이상 필요하지 않은 경우 다음 프로젝트 전용 도구 폴더만 제거한다:
   - `C:\Users\jjw08\Documents\Codex\2026-08-26\devpost-https-go-xano-co-start\work\xano-tools`
4. `C:\Users\jjw08\Documents\Codex\.pnpm-store\v11`은 공유 캐시일 수 있으므로 전체 삭제하지 않는다. 필요하다면 pnpm의 안전한 캐시 정리 방법을 별도로 검토한다.
5. Python, Git, Docker, 기존 Node.js, Codex 런타임 및 다른 프로젝트의 설정과 파일은 삭제하거나 변경하지 않는다.
6. Codex를 다시 시작해 Xano MCP가 더 이상 로드되지 않는지 확인한다.

> 실제 제거 작업은 삭제 대상과 Git 상태를 사용자에게 먼저 보여주고 명시적 승인을 받은 뒤 수행한다.
