'use strict';

const loginButton = document.querySelector('.login-toggle');
const signupButton = document.querySelector('.signup-toggle');
const loginSlide = document.querySelector('.slide.login');
const signupSlide = document.querySelector('.slide.signup');

const loginForm = document.querySelector('.slide.login form');
const signupForm = document.querySelector('.slide.signup form');

loginButton.addEventListener('click', () => {
  loginSlide.style.display = 'block';
  signupSlide.style.display = 'none';
  loginButton.classList.add('active');
  signupButton.classList.remove('active');
});

signupButton.addEventListener('click', () => {
  loginSlide.style.display = 'none';
  signupSlide.style.display = 'block';
  loginButton.classList.remove('active');
  signupButton.classList.add('active');
});

function redirectToSearchPage() {
  window.location.href = 'http://127.0.0.1:5500/page_search.html';
}

async function handleSignup(event) {
    event.preventDefault();
  
    const id = signupForm.querySelector('input[type="text"]').value;
    const nickname = signupForm.querySelector('input[type="text"][placeholder="Nickname"]').value;
    const password = signupForm.querySelector('input[type="password"]').value;
    const confirmPassword = signupForm.querySelector('input[type="password"][placeholder="Confirm Password"]').value;
  
    if (password !== confirmPassword) {
      alert('패스워드가 일치하지 않습니다.');
      return;
    }

    const hardcodedsignup = {
        id: 'traveler01',
        nickname: '여행자',
        password: 'traveler01',
       }
  
    if (id === hardcodedsignup.id && password === hardcodedsignup.password) {
      alert('회원가입 성공!, 로그인 해주세요');
    } else {
      alert('회원가입 실패.');
    }
  }
  
  async function handleLogin(event) {
    event.preventDefault();
  
    const id = loginForm.querySelector('input[type="text"]').value;
    const password = loginForm.querySelector('input[type="password"]').value;
    
       const hardcodedlogin = {
        id: 'traveler01',
        password: 'traveler01',
      };
  
    if (id === hardcodedlogin.id && password === hardcodedlogin.password) {
      alert('로그인 성공!');
      redirectToSearchPage();
    } else {
      alert('로그인 실패. 아이디 또는 패스워드를 확인하세요.');
    }
  }
  

  signupForm.addEventListener('submit', handleSignup);
  loginForm.addEventListener('submit', handleLogin);
