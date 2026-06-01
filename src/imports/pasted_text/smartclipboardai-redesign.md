Create a completely redesigned modern Android mobile app UI for an app called “SmartClipboardAI”.

Do not copy the current draft design. Redesign the entire visual style from scratch while keeping all current buttons, functions, and screen flows. The new design should look polished, modern, and suitable for a product concept presentation.

SmartClipboardAI is an AI-powered productivity app that collects photos, screenshots, copied text, copied links, and files into one intelligent data flow. The app preprocesses each input into a common DataItem, clusters similar information, recommends work topics, and helps the user turn scattered information into actionable drafts such as notes, calendar events, reminders, share drafts, and to-do lists.

Design style:
- Modern Android mobile app UI
- Inspired by Samsung One UI, Notion, and AI productivity tools
- Clean, practical, trustworthy, organized, and slightly futuristic
- Use spacious layouts, rounded cards, soft shadows, large touch-friendly buttons, and clear hierarchy
- Avoid a plain default Android look
- Make it feel like a real AI assistant app for organizing collected information

Color concept:
- Main colors: deep blue, indigo, navy
- Secondary colors: soft purple, lavender, mint
- Background: white or very light blue-gray
- Warning/delete states: red
- AI recommendation or smart action states: purple or blue
- Use subtle gradients only if they improve the design

Use Korean labels and realistic Korean sample content in the UI.

Create the following 3 main mobile screens based on the current app structure:

1. Home Screen

The Home screen must include:
- App title: “SmartClipboardAI”
- A main input card with the question: “무엇을 정리할까요?”
- A text input field with placeholder text such as “예: 어제 회의 자료, 여행 링크, 일정 캡처”
- Two main buttons:
  - “AI가 찾아주기”
  - “직접 고르기”
- A “오늘 수집” summary card
  - Show total collected count, such as “5개 수집됨”
  - Show type counts such as “링크 0 · 메모 0 · 스크린샷 5”
  - Include “전체 보기” button
  - Include helper text explaining that collected data can be used to recommend summaries, schedules, and tasks
- A “추천 작업” section
  - Include a “숨기기” button
  - Show an AI recommendation card such as:
    - Title: “Screenshot collection”
    - Description: “스크린샷 5개를 시각 노트나 문서로 정리할 수 있어요.”
    - Metadata: “screenshots · 5개 · 60%”
    - Button: “검토”
- A “스크린샷 가져오기” card
  - Explain that the app can scan recent screenshots again
  - Include button: “다시 스캔”
  - Include result message such as “새 스크린샷 없음 — 이전 항목은 모두 가져왔어요”
  - Include button: “닫기”
- A “최근 수집” section
  - Include “전체 보기” button
  - Show a list of recently collected screenshot items
  - Each item should include type label “스크린샷”, file name, and date/time
- Bottom navigation with 3 tabs:
  - “홈”
  - “데이터”
  - “작업”

2. Data Screen

The Data screen must include:
- Page title: “수집 데이터”
- Top action buttons:
  - “선택”
  - “전체 삭제”
- A summary line such as:
  - “5개 전체 · 텍스트 0 · 링크 0 · 이미지 0 · 스크린샷 5”
- Filter chips:
  - “전체”
  - “메모”
  - “링크”
  - “이미지”
  - “파일”
  - “스크린샷”
- A card-based list of collected DataItems
- Each DataItem card should include:
  - Type label such as “스크린샷”
  - File name such as “Screenshot_20260520_164512_Test.jpg”
  - MIME type such as “image/jpeg”
  - Created date such as “5월 20일 16:45”
  - Content preview area
  - Delete button: “삭제”
- For screenshot items, include image preview thumbnails or cropped screenshot previews
- For text extracted from screenshots, show text preview snippets
- The layout should support both image-based and text-based collected data
- Make delete actions visually clear but not too dominant

3. Tasks Screen

The Tasks screen must include:
- Page title: “작업”
- A “모은 주제” card
  - Description: “선택한 데이터를 주제별로 모아두고, 이후 요약/일정/알림 액션을 붙입니다.”
  - Button: “데이터 골라 주제 만들기”
- A “주제 목록” section
  - Show at least one topic card such as:
    - Title: “Collected items (5)”
    - Last updated text: “5월 26일 11:34 업데이트”
    - Item count: “5”
- An “자동 추가 후보” section
  - Show an AI proposal card such as:
    - Title: “Screenshot collection”
    - Description: “스크린샷 5개를 시각 노트나 문서로 정리할 수 있어요.”
    - Metadata: “screenshots · 5개 · 60%”
    - Button: “검토”
- The Tasks screen should clearly communicate that topics are created from selected data and later connected to summaries, schedules, reminders, and actions

Also create optional extended screens if possible:

4. Topic Detail / AI Analysis Screen
- Show selected topic title
- Show related DataItems
- Show AI-generated summary
- Show key points
- Show source item references
- Show generated action draft cards:
  - 요약 노트
  - 캘린더 일정
  - 리마인더
  - 공유 초안
  - 할 일 목록
- Each action card should have status labels:
  - Draft
  - Edited
  - Executed
  - Dismissed

5. Action Review Screen
- Show a user-editable AI-generated draft before execution
- Include fields:
  - 제목
  - 본문
  - 대상 앱
  - 관련 데이터 소스
- Include buttons:
  - 수정
  - 실행
  - 닫기
  - 다시 시도
- Show examples for Samsung Notes and Samsung Calendar integration
- Make it clear that AI does not execute actions automatically; the user confirms before execution

Important UX requirements:
- The app should clearly show this flow:
  collected data → clustered data → topic → AI analysis → action draft → user confirmation → external app execution
- Keep all existing functions from the current draft:
  AI가 찾아주기, 직접 고르기, 전체 보기, 숨기기, 검토, 다시 스캔, 닫기, 선택, 전체 삭제, 삭제, 데이터 골라 주제 만들기
- Use icons for:
  home, data list, task, photo, screenshot, text, link, AI, note, calendar, reminder, share, delete
- Use Android mobile screen size, preferably 390x844
- Use bottom navigation with tabs: 홈, 데이터, 작업
- Make the UI polished enough for a product concept presentation
- Use realistic Korean sample data and Korean UI labels