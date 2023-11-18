'use strict';

function loadDayMap(day) {
    let travelData = JSON.parse(sessionStorage.getItem('travelData'));

    if (!travelData) {
        const selectedTravelData = JSON.parse(localStorage.getItem('selectedTravel'));
        if (selectedTravelData && selectedTravelData.itinerary) {
            travelData = selectedTravelData.itinerary;
        }
    }
    if (!travelData) {
        alert('여행 일정 정보가 없습니다.');
        return;
    }

    const dayData = travelData.filter(location => location.day === day);
    if (dayData.length === 0) {
        alert('해당 일자의 데이터가 없습니다.');
        return;
    }

    const positions = dayData.map(location => ({
        title: location.name,
    }));

    const mapOption = {
        center: new kakao.maps.LatLng(33.450701, 126.570667),
        level: 7
    };

    const map = new kakao.maps.Map(document.getElementById('map'), mapOption);

    // Promise를 사용하여 주소 검색과 마커 생성을 제어
    Promise.all(positions.map(position => {
        return new Promise((resolve, reject) => {
            // 카카오맵 API를 사용하여 장소 이름으로 검색
            const ps = new kakao.maps.services.Places();

            ps.keywordSearch(position.title, function (data, status) {
                if (status === kakao.maps.services.Status.OK && data.length > 0) {
                    const place = data[0]; // 첫 번째 검색 결과 사용

                    const coords = new kakao.maps.LatLng(place.y, place.x);
                    const imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";
                    const imageSize = new kakao.maps.Size(24, 35);
                    const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);
            
                    const marker = new kakao.maps.Marker({
                        map: map,
                        position: coords,
                        title: position.title, // 장소 이름
                        image: markerImage
                    });
            
                    const infowindow = new kakao.maps.InfoWindow({
                        content: `<div style="width:150px;text-align:center;padding:6px 0;">${position.title}</div>`
                    });
                    infowindow.open(map, marker);
                    resolve(); // Promise를 해결하여 비동기 작업이 완료되었음을 알림
                } else {
                    console.error('Error creating markers: Status:', status);
                    reject(); // Promise를 거부하여 오류가 발생했음을 알림
                }
            });
        });
    }))
    .catch(error => {
        console.error('Error creating markers:', error);
    });
}
// 여행 카드 생성
function generateTravelCards(data) {
    if (!data || !Array.isArray(data) || data.length === 0) return;

    const cardContainer = document.querySelector('.cards-container');
    cardContainer.innerHTML = '';

    let currentDay = 0; // 초기값을 0으로 설정
    let dayCard = null;

    data.forEach(locationData => {
        if (locationData.day !== currentDay) {
            // 카드를 생성하고 추가
            dayCard = createDayCard(locationData.day);
            cardContainer.appendChild(dayCard);
            currentDay = locationData.day;
        }

        // 카드 클릭 시 해당 일자의 지도 로드
        const cardClickHandler = () => loadDayMap(locationData.day);
        dayCard.addEventListener('click', cardClickHandler);

        const p = document.createElement('p');
        p.innerText = locationData.name;
        dayCard.appendChild(p);
    });
    cardContainer.addEventListener('click', (event) => {
        const card = event.target.closest('.card');
        if (card) {
            card.style.backgroundColor = 'lightgray'; // 클릭 시 색상 변경
        }
    });

    cardContainer.addEventListener('mouseover', (event) => {
        const card = event.target.closest('.card');
        if (card) {
            card.style.backgroundColor = 'lightgray'; // 호버 시 색상 변경
        }
    });

    cardContainer.addEventListener('mouseout', (event) => {
        const card = event.target.closest('.card');
        if (card) {
            card.style.backgroundColor = ''; // 호버 해제 시 원래 색상으로 복원
        }
    });
}

// 일자별 카드 생성
function createDayCard(day) {
    const dayCard = document.createElement('div');
    dayCard.className = 'card';
    dayCard.id = `card${day}`;

    const h2 = document.createElement('h2');
    h2.innerText = `${day}일차`;
    dayCard.appendChild(h2);

    return dayCard;
}

document.addEventListener('DOMContentLoaded', () => {
    let travelData = JSON.parse(sessionStorage.getItem('travelData'));
    if (!travelData) {
        const selectedTravelData = JSON.parse(localStorage.getItem('selectedTravel'));
        if (selectedTravelData && selectedTravelData.itinerary) {
            travelData = selectedTravelData.itinerary;
        }
    }

    // travelData가 유효하다면 여행 카드를 생성합니다.
    if (travelData) {
        generateTravelCards(travelData);
    } else {
        // 여기에 사용자에게 안내 메시지를 표시하는 로직을 추가할 수 있습니다.
        console.log('여행 정보가 없습니다.');
    }

    // 페이지 이동 버튼 및 폼 관련 이벤트 처리
    const mypageButton = document.getElementById('mypageButton');
    const saveTravelButton = document.querySelector('.saveTravelButton');
    const travelForm = document.querySelector('#travelForm');
    const submitTravelButton = document.querySelector('#submitTravel');

    // '마이페이지' 버튼 클릭 시 마이페이지로 이동
    if (mypageButton) {
        mypageButton.addEventListener('click', () => {
            window.location.href = 'http://127.0.0.1:5500/mypage.html';
        });
    }

    // '여행 저장' 버튼 클릭 시 여행 정보 폼 토글
    if (saveTravelButton && travelForm) {
        saveTravelButton.addEventListener('click', () => {
            const isFormVisible = travelForm.style.display === 'block';
            travelForm.style.display = isFormVisible ? 'none' : 'block';
        });
    }

    // '여행 정보 제출' 버튼 클릭 시 여행 정보 저장 (추후 로직 추가 가능)
    if (submitTravelButton) {
        submitTravelButton.addEventListener('click', () => {
            const travelTitle = document.querySelector('#travelTitle').value;
            const travelDescription = document.querySelector('#travelDescription').value;
        });
    }

    document.querySelector('#submitTravel').addEventListener('click', () => {
        const travelTitle = document.querySelector('#travelTitle').value;
        const travelDescription = document.querySelector('#travelDescription').value;
        const searchedTravelData = JSON.parse(sessionStorage.getItem('travelData'));
    
        const newTravelInfo = {
            title: travelTitle,
            description: travelDescription,
            itinerary: searchedTravelData
        };
    
        // 'savedTravelInfos'는 사용자가 저장한 여러 여행 정보를 담는 배열입니다.
        let savedTravelInfos = JSON.parse(localStorage.getItem('savedTravelInfos')) || [];
        
        // 새 여행 정보를 배열에 추가합니다.
        savedTravelInfos.push(newTravelInfo);
    
        // 업데이트된 배열을 로컬 스토리지에 저장합니다.
        localStorage.setItem('savedTravelInfos', JSON.stringify(savedTravelInfos));
        alert('여행 정보가 저장되었습니다.');
    });

    
});
