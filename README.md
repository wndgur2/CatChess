## 실시간 웹 대전 게임

http://catchess.ap-northeast-2.elasticbeanstalk.com/

### Nodejs, Express, Three.js 사용

## 기록

### 2023.12.1 ~ 2024.1.14 3인 개발

유규빈: three.js, effect 구현  
오준묵: react, frontend 개발  
이중혁(나): nodeJs, backend 개발

DONE

-   socket 세션 관리를 통해 실시간 온라인 로직 구현
-   Player, Game, Unit 모듈을 중심으로 게임 로직 구현

#### 주요 게임 모듈

-   Player: 세션 정보, 체력, 돈, 보유 유닛 등 게임 데이터와 유저 데이터를 관리
-   Game: 플레이어 2명의 정보, 해당 게임의 stage, state(준비, 전투, 결과, 대기) flow를 담당
-   Unit: 각 유닛의 스탯, 스킬 등 관리
-   Battle: 전투 로직 수행

#### front display는 server 테스트를 위해 threejs 없이 html, js, css로만 구현함

### 2024.1.15 ~ 1인 개발

-   react에서 express로 프레임워크 변경

## ~ commit history 참고 ~

### 1.29 서버-클라이언트 통신 방식 개선 시도

-   Unit 참조 시, 좌표 참조형 방식에서 unit.uid 참조형 방식으로 변경을 시도함.  
    -> client 측에서 game state에 따라 같은 Unit을 다양한 목적으로 활용하고 있었다는 것을 간과함. (목적이 모호했음)  
    -> 한 인스턴스를 참조하게 되면서 다양한 목적을 하나의 인스턴스가 해결해야 하기 때문에 복잡한 코드가 마구 생겨버림.  
    -> 결국 처음에 의도한 간결한 알고리즘이 되지 않아 개선을 철회함.  
    -> 이후, client에서 같은 uid의 여러 Unit을 다루면서 서버와 클라이언트가 uid로 소통할 수 있게 개선

배운 점: 많은 코드에 손이 가는, 통신 구조 변경과 같은 수정 사항은 그 여파를 고려해보고, 이 시스템을 처음 설계한 의도와 걸맞는지 판단한 후에 적용하기

## ~ commit history 참고 ~

### 2.11

DONE

-   aws beanstalk(ec2) 배포.

TODO

-   기획, mesh, UI, sound

## ~ commit history 참고 ~

### 2.26

로직은 웬만큼 다 한 것 같다. 스킬 제외

DONE

-   AWS 지역 스톡홀롬에서 서울로 변경: 응답 속도 개선(1초 이상 -> 거의 실시간)
-   Home 화면 UI 개선: frame, footer, "CAT CHESS" logo 등

TODO

-   modal UI 개선
-   in Game UI 개선

### 2.27

DONE

-   home UI 개선
    <img width="1440" alt="0 1 0" src="https://github.com/wndgur2/CatChess/assets/65120311/0d7e2329-f187-4da7-bcf2-18816215912b">

-   modal UI 개선
-   modal close callback 구현

TODO

-   ingame UI 개선 (inventory)
-   ~~surrender 구현~~

### 2.29

DONE

-   ingame UI 설계 figma
-   inventory UI 개선

TODO

-   ingame UI 설계 확정 및 구현

### 3.1

DONE

-   ingame time, inventory UI 구현

    <img width="1440" alt="game_0 1 5" src="https://github.com/wndgur2/CatChess/assets/65120311/4ab1ff4d-096e-41be-90a5-580d4c829940">
    <img width="1440" alt="home_modal_0 1 5" src="https://github.com/wndgur2/CatChess/assets/65120311/ae3e7135-5780-4260-920a-3cd58a25a09e">
    <img width="1440" alt="home2_0 1 5" src="https://github.com/wndgur2/CatChess/assets/65120311/8793fbc5-0ecc-47bb-8235-5f38a97912c4">

TODO

-   ingame UI 개선(damage stastics, bottomWrapper, system btns)
-   Queens Gambit과 같은 Chess UX 구현 고민하기 (sound, visuality, functionality)

### 3.2

sound from pixaby?

TODO

-   홈 화면 ambient sound

### 3.9

DONE

-   shopList UI 개선

<img width="1440" alt="game_0 1 5_2" src="https://github.com/wndgur2/CatChess/assets/65120311/61045a95-1877-4126-bd05-22ccf3d26ca4">
-   source (coin / Poeir) 추가

TODO(big)

-   기획(item/cats)
-   스킬 구현
-   사운드 소스
-   메인 페이지 이미지 소스

### 3.10

DONE

-   home Card elements 초안
-   synergy UI
-   synergy 소스 변경
-   NODE_ENV 활용

TODO(big)

-   home 페이지 구현: Card Opener, 개요, Synergy 별 설명
-   Unit 기획
-   스킬 구현
-   사운드 소스

### 3.11

home Card opener 구현 중, cat img와 desc를 불러오기 위해서, 모든 CATS를 받아와야 함.  
이렇게 받아왔다면, Unit 인스턴스를 생성할 때, cat preset을 가져올 필요가 없음. (skill, synergies 등)

아니면 현재 방식을 유지하는 방법으로, Unit 인스턴스를 활용해서 Card Opener를 구현하는 방법이 있다.

DONE

-   Card opener 구현

![0 1 7rec](https://github.com/wndgur2/CatChess/assets/65120311/5596ad44-7198-48ee-b8a2-9a2f274ac720)

TODO

-   home 페이지 구현: 개요, Synergy 별 설명

### 3.12

DONE

-   Card opener 마무리, home content( country desciption ) 아웃라인

TODO

-   시작 시, 모든 유닛 desc 받아오기

### 3.13

DONE

-   data fetching 단계 추가

### 3.14

TODO

-   description에 Unit cards 추가
-   Creep 설명 추가 (Other creatures?)

### 3.18

TODO

-   unit design
-   KOREAN

### 3.20

TODO

-   Source fetch loading
-   Therme Units
-   Item
-   Skill

### 3.21

TO LEARN in free time

-   js document

TODO

-   Threme Units << spellai coin 쌓이면
-   Unit detail design

DONE

-   Source fetch loading
-   인게임 UI 개선
-   게임 튜토리얼 작성

### 3.22

TODO

-   세계관 작성

-   MP bar
-   KOREAN
-   Push alarm
-   intersection observer
-   beacon

DONE

-   세계관 개요, Pado 도입부 작성
-   DB 연결

NOTE

-   시간에 쫓기는 게 좀.

### 3.23

    NOTE

    encryption
    https route5s DNS
    window.crypto.subtle
    AES symmetric, RSA asymmetric

    로그인 안전에 대한 내용
    client-암호화 -> server-복호화/해싱 -> db
    ==>> google open authentication

    Cat editor : 정형화된 변수들로 만드는 cat img/render

DONE

-   Sign in UI

### 3.25

DONE

-   google OAuth. token handling
-   KST. log configuartion in .ebextensions

### 3.26

DONE

-   디렉토리 구조 변경
-   packaging for AWS 자동화
-   0.2.4 배포
-   User schema 작성
-   Supported Device check logic

### 3.27

DONE

-   User Info UI
-   Google email로 User 조회/생성
-   Therme Units source 입력
-   body-parser middleware

    NOTE
    understanding of history & religion

TODO

-   Painter 완성도 손보기
-   threejs(text display, cat model, range attack motion ...)
-   Skills
-   logging browser info in database.
