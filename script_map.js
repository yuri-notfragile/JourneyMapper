'use strict';

'use strict';

function loadDayMap(day) {
    // 세션 스토리지에서 여행 데이터 가져오기
    const travelData = JSON.parse(sessionStorage.getItem('travelData'));
    // 해당 일자의 장소 데이터 필터링
    const dayData = travelData.filter(location => location.day === day);

    // 각 장소의 위치와 이름을 positions 배열에 저장
    const positions = dayData.map(location => ({
        title: location.name,
        address: location.address
    }));

    // 지도 옵션 설정
    const mapOption = {
        center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도 중심 좌표 (제주도 중심 좌표)
        level: 3
    };

    // 카카오맵을 생성
    const map = new kakao.maps.Map(document.getElementById('map'), mapOption);

    // 주소-좌표 변환 객체를 생성
    const geocoder = new kakao.maps.services.Geocoder();

    // 각 위치에 대한 마커를 생성하고 지도에 추가
    positions.forEach(position => {
        // 주소로 좌표를 검색
        geocoder.addressSearch(position.address, function (result, status) {
            console.log('Status:', status);
            console.log('Result:', result);
            console.log('dayData:', dayData);
            console.log('positions:', positions);
            // 정상적으로 검색이 완료됐으면
            if (status === kakao.maps.services.Status.OK) {
                const coords = new kakao.maps.LatLng(result[0].y, result[0].x);

                // 마커 이미지 설정
                const imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";
                const imageSize = new kakao.maps.Size(24, 35);
                const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

                // 마커를 생성하여 지도에 표시
                const marker = new kakao.maps.Marker({
                    map: map,
                    position: coords,
                    title: position.title,
                    image: markerImage
                });

                // 인포윈도우로 장소에 대한 설명을 표시
                const infowindow = new kakao.maps.InfoWindow({
                    content: `<div style="width:150px;text-align:center;padding:6px 0;">${position.title}</div>`
                });
                infowindow.open(map, marker);
            }
        });
    });
}

// 여행 카드 생성
function generateTravelCards(data) {
    if (!data || !Array.isArray(data) || data.length === 0) return;

    const cardContainer = document.querySelector('.cards-container');
    cardContainer.innerHTML = '';

    let currentDay = 1;
    let dayCard = createDayCard(currentDay);

    data.forEach(locationData => {
        if (locationData.day !== currentDay) {
            cardContainer.appendChild(dayCard);
            currentDay = locationData.day;
            dayCard = createDayCard(currentDay);
        }

        // 카드 클릭 시 해당 일자의 지도 로드
        dayCard.addEventListener('click', () => loadDayMap(locationData.day));

        const p = document.createElement('p');
        p.innerText = `${locationData.name} - ${locationData.address}`;
        dayCard.appendChild(p);
    });

    cardContainer.appendChild(dayCard);
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
    // 세션 스토리지에서 여행 데이터 가져오기
    const travelData = JSON.parse(sessionStorage.getItem('travelData'));
    // 확인
    const rawData = sessionStorage.getItem('travelData');
    console.log(rawData);

    // 여행 카드 생성
    generateTravelCards(travelData);

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
});
