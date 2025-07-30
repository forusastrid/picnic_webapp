import { auth, db } from './firebase-config.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import {
  doc, setDoc, getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const validDeviceCodes = [
  "A7X2bQ9cLmY1",
];

const signupForm = document.getElementById('signupForm');
if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = signupForm.signupEmail.value.trim();
    const password = signupForm.signupPassword.value.trim();
    const deviceCode = signupForm.deviceCode.value.trim();

    if (!email || !password || password.length < 6 || !deviceCode) {
      alert('모든 항목을 올바르게 입력해주세요.');
      return;
    }

    if (!validDeviceCodes.includes(deviceCode)) {
      alert('유효하지 않은 기기 코드입니다.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        email,
        deviceCode,
        createdAt: new Date()
      });

      alert('회원가입 성공! 기능 페이지로 이동합니다.');
      window.location.href = 'main.html';

    } catch (error) {
      alert('회원가입 실패: ' + error.message);
    }
  });
}

const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = loginForm.loginEmail.value.trim();
    const password = loginForm.loginPassword.value.trim();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = 'main.html';
    } catch (error) {
      alert('로그인 실패: ' + error.message);
    }
  });
}

export function logout() {
  signOut(auth)
    .then(() => {
      alert('로그아웃 되었습니다.');
      window.location.href = 'index.html';
    })
    .catch((error) => {
      alert('로그아웃 오류: ' + error.message);
    });
}

const loginBtn = document.getElementById('loginBtn');
onAuthStateChanged(auth, (user) => {
  if (user) {
    if (loginBtn) {
      loginBtn.textContent = '로그아웃';
      loginBtn.onclick = logout;
    }
  } else {
    if (loginBtn) {
      loginBtn.textContent = '로그인';
      loginBtn.onclick = () => location.href = 'index.html';
    }
  }
});
