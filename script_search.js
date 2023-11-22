'use strict';

const apiKey = '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';
const apiEndpoint = 'https://api.openai.com/v1/chat/completions';
const userInput = document.querySelector('#queryInput');
const sendButton = document.querySelector('.search-form button');
const UserMessage = `
사용자는 장소와 여행 기간에 대해 한국어로 질문할 것입니다. 각 일차별로 방문할 만한 3-4곳의 장소를 JSON 형식으로 제공해주세요. 사용자가 질문한 지역에서만 효율적인 동선으로 추천하세요. 응답형식은 다음과 같아야 합니다:
    [
        {
            "day": 1,
            "name": "Place Name"
        }, ...
    `;

const validateResponseFormat = (response) => {
    if (!Array.isArray(response)) return false;

    for (const item of response) {
        if (!item.hasOwnProperty("day") || !item.hasOwnProperty("name")) {
            return false;
        }

        if (typeof item.day !== "number" || typeof item.name !== "string") {
            return false;
        }
    }
    return true;
};

// ChatGPT API 요청
async function fetchAIResponse(prompt) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: UserMessage,
                },
                {
                    role: "user",
                    content: ` ${prompt}`,
                },
            ],
        },
        ),
    };

    // API 요청 후 응답 처리
    try {
        const response = await fetch(apiEndpoint, requestOptions);
        if (!response.ok) {
            throw new Error('ChatGPT API 오류');
        }
        const data = await response.json();
        const aiResponse = data.choices[0].message.content;
        const jsonResponse = JSON.parse(aiResponse);

        if (!validateResponseFormat(jsonResponse)) {
            console.error('잘못된 형식의 응답입니다. 재시도 중...');
            // 잘못된 형식의 응답일 경우, 동일한 프롬프트로 재귀적으로 요청
            await fetchAIResponse(prompt);
            return;
        }

        // 결과를 세션 스토리지에 저장
        sessionStorage.setItem('travelData', JSON.stringify(jsonResponse));

        // 결과 확인 후 지도 페이지로 이동
        window.location.href = '/page_map.html';
    } catch (error) {
        console.error('OpenAI API 호출 중 오류 발생:', error);
    }
}

sendButton.addEventListener('click', (event) => {
    event.preventDefault(); 
    const message = userInput.value.trim();
    if (message.length === 0) return;

    document.getElementById('loading').style.display = 'block';

    fetchAIResponse(message).then(() => {
        document.getElementById('loading').style.display = 'none';
    }).catch((error) => {
        document.getElementById('loading').style.display = 'none';
        console.error('An error occurred:', error);
    });

    userInput.value = '';
});

userInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        sendButton.click();
    }
});
