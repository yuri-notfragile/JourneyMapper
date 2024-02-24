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

    //console.log(dayData)

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
            const ps = new kakao.maps.services.Places();

            ps.keywordSearch(position.title, function (data, status) {
                if (status === kakao.maps.services.Status.OK && data.length > 0) {
                    const place = data[0]; 

                    const coords = new kakao.maps.LatLng(place.y, place.x);
                    const imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";
                    const imageSize = new kakao.maps.Size(24, 35);
                    const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);
            
                    const marker = new kakao.maps.Marker({
                        map: map,
                        position: coords,
                        title: position.title,
                        image: markerImage
                    });
            
                    const infowindow = new kakao.maps.InfoWindow({
                        content: `<div style="width:150px;text-align:center;padding:6px 0;">${position.title}</div>`
                    });
                    infowindow.open(map, marker);
                    resolve(); 
                } else {
                    console.error('Error creating markers: Status:', status);
                    reject();
                }
            });
        });
    }))
    .catch(error => {
        console.error('Error creating markers:', error);
    });
}

function generateTravelCards(data) {
    if (!data || !Array.isArray(data) || data.length === 0) return;

    const cardContainer = document.querySelector('.cards-container');
    cardContainer.innerHTML = '';

    let currentDay = 0; 
    let dayCard = null;

    data.forEach(locationData => {
        if (locationData.day !== currentDay) {
            dayCard = createDayCard(locationData.day);
            cardContainer.appendChild(dayCard);
            currentDay = locationData.day;
        }

        const cardClickHandler = () => loadDayMap(locationData.day);
        dayCard.addEventListener('click', cardClickHandler);

        const p = document.createElement('p');
        p.innerText = locationData.name;
        dayCard.appendChild(p);
    });
    cardContainer.addEventListener('click', (event) => {
        const card = event.target.closest('.card');
        if (card) {
            card.style.backgroundColor = 'lightgray';
        }
    });

    cardContainer.addEventListener('mouseover', (event) => {
        const card = event.target.closest('.card');
        if (card) {
            card.style.backgroundColor = 'lightgray';
        }
    });

    cardContainer.addEventListener('mouseout', (event) => {
        const card = event.target.closest('.card');
        if (card) {
            card.style.backgroundColor = '';
        }
    });
}

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

    if (travelData) {
        generateTravelCards(travelData);
    } else {
        console.log('여행 정보가 없습니다.');
    }

    const mypageButton = document.getElementById('mypageButton');
    const saveTravelButton = document.querySelector('.saveTravelButton');
    const travelForm = document.querySelector('#travelForm');
    const submitTravelButton = document.querySelector('#submitTravel');

    if (mypageButton) {
        mypageButton.addEventListener('click', () => {
            window.location.href = 'http://127.0.0.1:5500/mypage.html';
            sessionStorage.removeItem('travelData');
        });
    }

    if (saveTravelButton && travelForm) {
        saveTravelButton.addEventListener('click', () => {
            const isFormVisible = travelForm.style.display === 'block';
            travelForm.style.display = isFormVisible ? 'none' : 'block';
        });
    }

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
    
        let savedTravelInfos = JSON.parse(localStorage.getItem('savedTravelInfos')) || [];

        savedTravelInfos.push(newTravelInfo);
    
        localStorage.setItem('savedTravelInfos', JSON.stringify(savedTravelInfos));
        alert('여행 정보가 저장되었습니다.');
    });

    
});
