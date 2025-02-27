// script.js

// 이미지 확대 모달 기능
document.querySelectorAll('#gallery img').forEach((img) => {
    img.addEventListener('click', (e) => {
        const modal = document.getElementById('imageModal');
        const modalImg = document.getElementById('modalImage');
        const caption = document.getElementById('caption');

        modal.style.display = 'block';
        modalImg.src = e.target.src;
        caption.textContent = e.target.alt;
    });
});

document.getElementById('closeBtn').addEventListener('click', () => {
    document.getElementById('imageModal').style.display = 'none';
});

// 퀴즈 제출 기능
document.getElementById('quizForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const answers = document.querySelectorAll('#quizForm input[type="radio"]:checked');
    if (answers.length < 3) {
        alert('모든 질문에 답해주세요!');
        return;
    }

    let score = 0;
    answers.forEach((answer) => {
        if (answer.value === 'correct') {
            score++;
        }
    });

    const result = document.getElementById('quizResult');
    result.textContent = `퀴즈 결과: ${score}/3 정답!`;
    result.style.color = score === 3 ? 'green' : 'orange';
});

// 방문 후기 추가 기능
document.addEventListener('DOMContentLoaded', function() {
    const stars = document.querySelectorAll('.star');
    const reviewText = document.querySelector('.review-text');
    const submitBtn = document.querySelector('.submit-btn');
    const reviewsList = document.querySelector('.reviews-list');
    const emptyReviews = document.querySelector('.empty-reviews');
    let selectedRating = 0;
    
    stars.forEach(star => {
        star.addEventListener('click', function() {
            selectedRating = this.dataset.value;
            resetStars();
            for(let i = 0; i < selectedRating; i++) {
                stars[4-i].classList.add('active');
            }
        });
    });

    function resetStars() {
        stars.forEach(star => star.classList.remove('active'));
    }
    
    submitBtn.addEventListener('click', function() {
        if(selectedRating === 0) {
            alert('별점을 선택해주세요!');
            return;
        }
        if(!reviewText.value.trim()) {
          alert('리뷰 내용을 작성해주세요!');
          return;
        }
        
        if (emptyReviews) {
          emptyReviews.remove();
        }
        
        addReview(selectedRating, reviewText.value);
        
        selectedRating = 0;
        resetStars();
        reviewText.value = '';
    });
    
    function addReview(rating, text) {
        const reviewItem = document.createElement('div');
        reviewItem.className = 'review-item';
        
        const stars = '★'.repeat(rating) + '☆'.repeat(5-rating);
        const date = new Date().toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });

        reviewItem.innerHTML = `
          <div class="review-stars">${stars}</div>
          <div class="review-text-content">${text}</div>
          <div class="review-date">${date}</div>
        `;
        
        reviewsList.insertBefore(reviewItem, reviewsList.firstChild);
      }
    });

class Calendar {
    constructor() {
        this.currentDate = new Date();
        this.monthYearElement = document.getElementById('month-year');
        this.daysElement = document.getElementById('calendar-days');
        this.prevMonthBtn = document.getElementById('prev-month');
        this.nextMonthBtn = document.getElementById('next-month');

        // 모달 요소들
        this.memoModal = document.getElementById('memo-modal');
        this.closeModal = document.querySelector('.close');
        this.memoInput = document.getElementById('memo-input');
        this.saveMemoBtn = document.getElementById('save-memo');
        this.deleteMemoBtn = document.getElementById('delete-memo');
        this.modalDateElement = document.getElementById('modal-date');

        // 메모 저장소 (로컬 스토리지 사용)
        this.memos = JSON.parse(localStorage.getItem('calendarMemos')) || {};

        // 이벤트 리스너 설정
        this.prevMonthBtn.addEventListener('click', () => this.changeMonth(-1));
        this.nextMonthBtn.addEventListener('click', () => this.changeMonth(1));
        this.closeModal.addEventListener('click', () => this.closeMemoModal());
        this.saveMemoBtn.addEventListener('click', () => this.saveMemo());
        this.deleteMemoBtn.addEventListener('click', () => this.deleteMemo());

        this.render();
    }

    render() {
        const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
        const lastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);

        this.monthYearElement.textContent = `${this.currentDate.getFullYear()}년 ${this.currentDate.getMonth() + 1}월`;
        this.daysElement.innerHTML = '';

        const startingDay = firstDay.getDay();
        const today = new Date();

        // 빈 날짜 채우기
        for (let i = 0; i < startingDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.classList.add('day', 'empty');
            this.daysElement.appendChild(emptyDay);
        }

        // 날짜 채우기
        for (let day = 1; day <= lastDay.getDate(); day++) {
            const dayElement = document.createElement('div');
            dayElement.textContent = day;
            dayElement.classList.add('day');

            // 오늘 날짜 강조
            if (this.currentDate.getFullYear() === today.getFullYear() &&
                this.currentDate.getMonth() === today.getMonth() &&
                day === today.getDate()) {
                dayElement.classList.add('today');
            }

            // 메모 표시
            const memoKey = this.getMemoKey(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, day);
            if (this.memos[memoKey]) {
                dayElement.classList.add('has-memo');
            }

            dayElement.addEventListener('click', () => this.openMemoModal(day));

            this.daysElement.appendChild(dayElement);
        }
    }

    changeMonth(offset) {
        this.currentDate.setMonth(this.currentDate.getMonth() + offset);
        this.render();
    }

    getMemoKey(year, month, day) {
        return `${year}-${month}-${day}`;
    }

    openMemoModal(day) {
        const memoKey = this.getMemoKey(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, day);
        this.modalDateElement.textContent = `${this.currentDate.getFullYear()}년 ${this.currentDate.getMonth() + 1}월 ${day}일`;
        this.memoInput.value = this.memos[memoKey] || '';
        this.memoModal.style.display = 'block';
        this.memoInput.focus();
    }

    closeMemoModal() {
        this.memoModal.style.display = 'none';
    }

    saveMemo() {
        const memoKey = this.getMemoKey(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, parseInt(this.modalDateElement.textContent.split(' ')[2]));
        this.memos[memoKey] = this.memoInput.value;
        localStorage.setItem('calendarMemos', JSON.stringify(this.memos));
        this.closeMemoModal();
        this.render();
    }

    deleteMemo() {
        const memoKey = this.getMemoKey(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, parseInt(this.modalDateElement.textContent.split(' ')[2]));
        delete this.memos[memoKey];
        localStorage.setItem('calendarMemos', JSON.stringify(this.memos));
        this.closeMemoModal();
        this.render();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const calendar = new Calendar();
});
