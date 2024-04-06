## 실시간 웹 대전 게임

### Cat Chess home [링크](http://catchess.ap-northeast-2.elasticbeanstalk.com/)

<img width="1440" alt="image" src="https://github.com/wndgur2/CatChess/assets/65120311/127f7c91-6917-416a-accb-38428a96945a">

<img width="1920" alt="image" src="https://github.com/wndgur2/CatChess/assets/65120311/2dedbbe7-e11c-4fd4-885e-4791b6e3b3cb">

### 0.2.9 Demo video [링크](https://www.youtube.com/watch?v=07bcqwNsibg&t=314s)

![0:2:8capt](https://github.com/wndgur2/CatChess/assets/65120311/713951bb-b64e-4fb0-92ce-ae3a41c3149b)

### Figma: 기획, 화면 설계 [링크](https://www.figma.com/file/UTLu1K2qiGxK4XhZFt7q1h/catChess?type=design&node-id=0%3A1&mode=design&t=4keMP4w5z6JixYat-1)

<img width="1440" alt="image" src="https://github.com/wndgur2/CatChess/assets/65120311/32380036-5096-427a-83c6-a50344274caa">

### Drawio: 로직 설계 [링크](https://drive.google.com/file/d/1AHRsH_nBJkpwJ-txst1yUMQeNCm4xSDl/view?usp=drive_link)

<img width="1292" alt="image" src="https://github.com/wndgur2/CatChess/assets/65120311/26d4e8b4-8e0a-4c7e-8c68-ebda08d2b904">

### 주요 스택: Nodejs, Express, Three.js

### 서버측 주요 모듈

-   Player.js: 세션 정보, 체력, 돈, 보유 유닛 등 게임 데이터와 유저 데이터를 관리
-   Game.js: 매칭된 플레이어 2명의 정보, 해당 게임의 stage, state(준비, 전투, 결과, 대기) flow 담당
-   Unit.js: 각 유닛의 스탯, 스킬 등 관리
-   Battle.js: 전투 로직 수행

### 클라이언트측 주요 모듈

-   UI.js: event listeners, element 변화 관리
-   Painter.js: 3D display/interface 담당
-   User.js: authentication 관리

### 페이지 구조

-   page.pug: google auth를 제외한 모든 어플리케이션 기능을 담당.
-   #home/#game 으로 게임 시작 전/후를 나눔

## 기록

### ~ 2024.1.14

DONE

-   socket 세션 관리를 통해 실시간 온라인 로직 구현
-   Player, Game, Unit 모듈을 중심으로 게임 로직 구현

### 1인 개발 시작

-   react에서 express로 프레임워크 변경

## 1.15 ~ 1.28

-   3D display 구현 시작
-   socket message type 세분화(update board/queue)

-   3d display(boards, units)

-   유닛 이동, 체력바 구현
-   드래그 이벤트 리스너 구현
-   서버 로직 개선

-   아이템 부여 구현
-   blood effect 적용

-   아이템 팝업 설명, 유닛 판매, 유닛 움직임 애니메이션 구현

-   unit info UI 개선

-   giveItem bug fix

-   UI 개선

-   시너지 구현
-   단축키 구현

-   스킬 구현

### 1.29 서버-클라이언트 통신 방식 개선 시도

## 1.29 ~ 2.2

-   Unit 참조 시, 좌표 참조형 방식에서 unit.uid 참조형 방식으로 변경을 시도함.  
    -> client 측에서 game state에 따라 같은 Unit을 다양한 목적으로 활용하고 있었다는 것을 간과함. (목적이 모호했음)  
    -> 한 인스턴스를 참조하게 되면서 다양한 목적을 하나의 인스턴스가 해결해야 하기 때문에 복잡한 코드가 마구 생겨버림.  
    -> 결국 처음에 의도한 간결한 알고리즘이 되지 않아 개선을 철회함.  
    -> 이후, client에서 같은 uid의 여러 Unit을 다루면서 서버와 클라이언트가 uid로 소통할 수 있게 개선

배운 점: 많은 코드에 손이 가는, 통신 구조 변경과 같은 수정 사항은 그 여파를 고려해보고, 이 시스템을 처음 설계한 의도와 걸맞는지 판단한 후에 적용하기

-   uid 적용
-   테스트

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

### 3.28

### 3.29

TODO

-   게임 종료 화면
-   첫 로그인이라면 greeting, local 기록 저장할지

DONE

-   로그인했다면, Player id를 email address로.
-   게임 종료 시 결과 User DB에 저장
-   surrender 구현

<img width="1440" alt="image" src="https://github.com/wndgur2/CatChess/assets/65120311/13147a8f-1c7e-4dc6-a6dc-8920535836b8">
<img width="1440" alt="Screenshot 2024-03-31 at 16 29 58" src="https://github.com/wndgur2/CatChess/assets/65120311/e84ca6e8-b0a2-45bf-ade5-d3f8b2b2c843">

### 3.30

DONE

-   db에 접속 log 남기기 (device info)

TODO

-   유저 순위, 시너지별 순위?

### 4.4

enhancements

-   consts (images, text):
    item image
    korean

-   UI home/ingame
    ingame button styles
    language detection, setting
    level visibility
    item combination
    unitInfo UI
    winning, losing streak
    skill effect(text: like WOW)

-   home 제국 wrapper 높이 지정 후 배경 다르게

### 4.5

언어 설정 시도

DONE

-   home setting UI
-   server rendering language

-   app.js middleware 설정

client 측 언어 설정 실패
data fetch api 수정해야 -> data 구조를 바꿔야할 수도 있음. units 테이블에서 desc를 분리해서 언어별로 불러올 수 있도록

### 4.6

TODO

-   서버측에서 언어별 데이터 보내기

방법 1. 컨트롤러에서 랜더링된 페이지를 클라이언트한테 보낼 때, 언어 정보를 쿠키에 넣어 보낸다. 후에 클라이언트에서 서버에 언어에 맞는 데이터를 요청

방법 2. 서버에서 각 클라이언트의 언어 정보를 관리한다. 해당 클라이언트로부터 데이터 요청이 왔을 때 해당 언어에 해당하는 데이터를 보낸다. ==> 관리하기가 복잡

방법 3. 데이터 패치는 모든 언어를 진행하고, 클라이언트 내부에서 조건문으로 처리한다. -> 네트워크 비효율, 코딩 비효율

-   어제 한거처럼 하되, 데이터 패치를 언어별로 나누어서, 쿠키 관리 잘 해서 재시도

DONE

-   언어 설정

> 브라우저 관리 인터페이스의 필요성
> UI에서 다 해야하나

TODO

-   규빈 피드백: 메인 페이지 card opener 개선 -> 공간의 중요도에 비해 정보량이나 보는 즐거움이 적음
-   mobile UI 개선
-   글이 아직도 너무 많다.

-! ingame 언어 불러오기 설정 안함: Error
