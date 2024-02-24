'use strict'

document.addEventListener('DOMContentLoaded', function() {
    const travelListContainer = document.querySelector('.travel-list');
  
    const savedTravelInfos = JSON.parse(localStorage.getItem('savedTravelInfos'));

    if (savedTravelInfos && savedTravelInfos.length > 0) {
        console.log('저장된 여행 정보:', savedTravelInfos);

        savedTravelInfos.forEach((travelInfo, index) => {
            const travelCard = document.createElement('div');
            travelCard.className = 'travel-card';
            travelCard.innerHTML = `
                <h2>${travelInfo.title || '제목 없음'}</h2>
                <p>${travelInfo.description || '설명 없음'}</p>
            `;
        
            travelCard.addEventListener('click', () => {
                localStorage.setItem('selectedTravel', JSON.stringify(savedTravelInfos[index]));
                window.location.href = 'page_map.html';
            });
        
            travelListContainer.appendChild(travelCard);
        });
    } else {
        console.log('저장된 여행 정보가 없습니다.');
        travelListContainer.innerHTML = '<p>저장된 여행 정보가 없습니다.</p>';
    }
});
