let cardCount = 20, row = 5, column = Math.floor(cardCount/5), pair = -1, pairindex = -1 // 카드 개수, 행수, 맞는 짝 카운트용 변수
let arrDeck = [] // 카드 배열
let language = 0 // 0: 한국어, 1: 영어, 2: 중국어

document.addEventListener('DOMContentLoaded', () => {
    cardCount = row * column // 가로*세로 개수를 무조건 맞춤
    document.documentElement.style.setProperty('--row', row)

    // UI 생성
    for (let i = 0; i < cardCount; i++) {
        let el = document.createElement('div')
        el.id = 'card' + i + (10 * language);
        el.classList.add('card')
        el.classList.add('back')
        document.querySelector('.placeholder').appendChild(el)
    }

    // 클릭 이벤트 핸들러
    document.querySelector('.placeholder').addEventListener('click', (e) => {
        if (e.target.classList.contains('card') && e.target.classList.contains('back')) {
            console.log('clicked');
            e.target.classList.remove('back')
            e.target.classList.add('front')
            e.target.style.backgroundImage = `url("./image/${e.target.dataset.number}.png")` // 앞면 이미지 설정
        }
    })

    // 애니메이션 완료 핸들러 - 애니메이션 종료 후 매칭 판단
    document.querySelector('.placeholder').addEventListener('transitionend', (e) => {
        if (e.target.classList.contains('card')) {
            console.log('transitionended');
            if (e.target.classList.contains('front')) {
                if (pair < 0) {
                    pair = e.target.dataset.number
                    pairindex = e.target.dataset.index
                } else {
                    if (pair == e.target.dataset.number && pairindex != e.target.dataset.index) {
                        // 매치됨 - 컬러링
                        document.querySelectorAll('.placeholder .card.front').forEach((card) => { card.classList.add('matched'); })
                        pair = -1
                        pairindex = -1
                        if (document.querySelector('.placeholder .card:not(.matched)') == null) {
                            // 완료
                            console.log('card finding end.')
                            doneFinding()
                        }
                    } else if (pairindex != e.target.dataset.index) {
                        // 매치안됨 - 페어 리셋
                        document.querySelectorAll('.placeholder .card.front:not(.matched)').forEach((card) => {
                            card.classList.remove('front')
                            card.classList.add('back')
                            card.style.backgroundImage = 'url("./image/0.gif")' // 뒷면 이미지로 재설정
                        })
                        pair = -1
                        pairindex = -1
                    }
                }
            }
        }
    })

    // 배열 셔플
    reShuffle(false)
    // 정보 초기화
    initCard()
})

function initCard() {
    // 카드에 셔플 숫자 지정
    for (let i = 0; i < cardCount; i++) {
        document.querySelectorAll('.placeholder .card').forEach((card, idx) => {
            card.dataset.number = arrDeck[idx] + (10*language)
            card.dataset.index = idx
        })
    }

    // 초기화 애니메이션
    let init = window.setInterval(() => {
        let card = document.querySelector('.placeholder .card:not(.back)')
        if (card) {
            card.classList.remove('front')
            card.classList.remove('matched')
            card.classList.add('back')
            card.style.backgroundImage = 'url("./image/0.gif")' // 뒷면 이미지로 재설정
        } else {
            window.clearInterval(init)
        }
    }, 50);
}

// 배열 셔플 호출용
function reShuffle(bReInit) {
    if (!bReInit) {
        for (let i = 0; i < Math.floor(cardCount / 2); i++) {
            arrDeck.push(i + 1, i + 1)
        }
    }
    arrDeck = fyShuffler(arrDeck)
}

// 배열 셔플 메인
const fyShuffler = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor((i + 1) * Math.random());
        [arr[i], arr[j]] = [arr[j], arr[i]]; // 배열 값 교환
    }
    return arr
}

// 다 찾은 후 재 실행 선택
function doneFinding() {
    if (confirm('찾기 완료! 데스크에서 상품을 수령해 주세요')) {
        reShuffle(true)
        initCard()
        resetGame();
    }
}

let timeLeft = 60;
const maxTime = 60;
const thermoLevel = document.getElementById('thermo-level');
const timerText = document.getElementById('timer-text');
let timerInterval;

function updateThermometer() {
    const heightPercentage = (timeLeft / maxTime) * 100;
    thermoLevel.style.height = `${heightPercentage}%`;
    timerText.textContent = timeLeft;

    if (timeLeft > 40) {
        thermoLevel.style.backgroundColor = 'green';
    } else if (timeLeft > 20) {
        thermoLevel.style.backgroundColor = 'orange';
    } else {
        thermoLevel.style.backgroundColor = 'red';
    }
}

function startTimer() {
    timerInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateThermometer();
        } else if(language == 0) {
            clearInterval(timerInterval);
            alert('시간 초과');
            resetGame(); // 타이머가 0이 되었을 때 게임 초기화
        } else if(language == 1) {
            clearInterval(timerInterval);
            alert('Game Over');
            resetGame(); // 타이머가 0이 되었을 때 게임 초기화
        } else if(language == 2) {
            clearInterval(timerInterval);
            alert('暂停');
            resetGame(); // 타이머가 0이 되었을 때 게임 초기화
        }  
    }, 1000);
}

function resetGame() {
    clearInterval(timerInterval);
    timeLeft = maxTime;
    updateThermometer();
    startTimer();
    // 게임을 초기화하는 추가 코드
    reShuffle(true);
    initCard();
}

function resetGameAndChangeKorean() {
    clearInterval(timerInterval);
    timeLeft = maxTime;
    updateThermometer();
    startTimer();
    language = 0;
    // 게임을 초기화하는 추가 코드
    reShuffle(true);
    initCard();
}

function resetGameAndChangeEnglish() {
    clearInterval(timerInterval);
    timeLeft = maxTime;
    updateThermometer();
    startTimer();
    language = 1;
    // 게임을 초기화하는 추가 코드
    reShuffle(true);
    initCard();
}

function resetGameAndChangeChinese() {
    clearInterval(timerInterval);
    timeLeft = maxTime;
    updateThermometer();
    startTimer();
    language = 2;
    // 게임을 초기화하는 추가 코드
    reShuffle(true);
    initCard();
}

document.addEventListener('DOMContentLoaded', () => {
    updateThermometer();
    startTimer();
    // 게임 초기화 관련 코드 추가
    reShuffle(true);
    initCard();
});
