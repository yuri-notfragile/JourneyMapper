'use strict';

// 회원가입 및 로그인 페이지에서 쓰는 함수들
const loginButton = document.querySelector('.login-toggle');
const signupButton = document.querySelector('.signup-toggle');
const loginSlide = document.querySelector('.slide.login');
const signupSlide = document.querySelector('.slide.signup');

const loginForm = document.querySelector('.slide.login form');
const signupForm = document.querySelector('.slide.signup form');

// 로그인 버튼 클릭 시
loginButton.addEventListener('click', () => {
  // 로그인 슬라이드 표시, 회원가입 슬라이드 숨김
  loginSlide.style.display = 'block';
  signupSlide.style.display = 'none';
  // 버튼 색상 전환
  loginButton.classList.add('active');
  signupButton.classList.remove('active');
});

// 회원가입 버튼 클릭 시
signupButton.addEventListener('click', () => {
  // 로그인 슬라이드 숨김, 회원가입 슬라이드 표시
  loginSlide.style.display = 'none';
  signupSlide.style.display = 'block';
  // 버튼 색상 전환
  loginButton.classList.remove('active');
  signupButton.classList.add('active');
});

// 검색 페이지로 이동하는 함수
function redirectToSearchPage() {
  window.location.href = 'http://127.0.0.1:5500/page_search.html';
}

async function handleSignup(event) {
    event.preventDefault(); // 폼의 기본 동작을 막음
  
    // 입력값 가져오기
    const id = signupForm.querySelector('input[type="text"]').value;
    const nickname = signupForm.querySelector('input[type="text"][placeholder="Nickname"]').value;
    const password = signupForm.querySelector('input[type="password"]').value;
    const confirmPassword = signupForm.querySelector('input[type="password"][placeholder="Confirm Password"]').value;
  
    // 패스워드 확인
    if (password !== confirmPassword) {
      alert('패스워드가 일치하지 않습니다.');
      return;
    }

    const hardcodedsignup = {
        id: 'traveler01',
        nickname: '여행자',
        password: 'traveler01',
       }
  
    // 하드코딩된 회원가입 정보와 비교
    if (id === hardcodedsignup.id && password === hardcodedsignup.password) {
      alert('회원가입 성공!, 로그인 해주세요');
    } else {
      alert('회원가입 실패.');
    }
  }
  
  // 로그인 처리 함수
  async function handleLogin(event) {
    event.preventDefault(); // 폼의 기본 동작을 막음
  
    // 입력값 가져오기
    const id = loginForm.querySelector('input[type="text"]').value;
    const password = loginForm.querySelector('input[type="password"]').value;
    
       const hardcodedlogin = {
        id: 'traveler01',
        password: 'traveler01',
      };
  
    // 하드코딩된 로그인 정보와 비교
    if (id === hardcodedlogin.id && password === hardcodedlogin.password) {
      alert('로그인 성공!');
      redirectToSearchPage();
    } else {
      alert('로그인 실패. 아이디 또는 패스워드를 확인하세요.');
    }
  }
  
  // 이벤트 리스너 할당
  signupForm.addEventListener('submit', handleSignup);
  loginForm.addEventListener('submit', handleLogin);
