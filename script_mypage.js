'use strict'

document.addEventListener('DOMContentLoaded', function() {
    const travelListContainer = document.querySelector('.travel-list');
  
    // 로컬 스토리지에서 저장된 여러 여행 정보를 불러옵니다.
    const savedTravelInfos = JSON.parse(localStorage.getItem('savedTravelInfos'));

    if (savedTravelInfos && savedTravelInfos.length > 0) {
        console.log('저장된 여행 정보:', savedTravelInfos);

        // 각 여행 정보에 대해 카드를 생성합니다.
        savedTravelInfos.forEach((travelInfo, index) => {
            const travelCard = document.createElement('div');
            travelCard.className = 'travel-card';
            travelCard.innerHTML = `
                <h2>${travelInfo.title || '제목 없음'}</h2>
                <p>${travelInfo.description || '설명 없음'}</p>
            `;
        
            travelCard.addEventListener('click', () => {
                // 선택된 여행 정보를 'selectedTravel'로 로컬 스토리지에 저장
                localStorage.setItem('selectedTravel', JSON.stringify(savedTravelInfos[index]));
                window.location.href = 'page_map.html'; // 지도 페이지로 이동
            });
        
            travelListContainer.appendChild(travelCard);
        });
    } else {
        console.log('저장된 여행 정보가 없습니다.');
        travelListContainer.innerHTML = '<p>저장된 여행 정보가 없습니다.</p>';
    }
});
