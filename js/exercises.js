// Exercise management system
class ExerciseManager {
    constructor() {
        this.exercises = [];
        this.userProgress = {};
        this.currentExercise = null;
        this.init();
    }

    init() {
        this.loadProgress();
        this.initExerciseHandlers();
        this.initQuizHandlers();
        console.log('📝 Exercise system initialized');
    }

    // Load user progress from localStorage
    loadProgress() {
        try {
            const saved = localStorage.getItem('physics-exercise-progress');
            if (saved) {
                this.userProgress = JSON.parse(saved);
            }
        } catch (e) {
            console.warn('Could not load exercise progress');
            this.userProgress = {};
        }
    }

    // Save user progress to localStorage
    saveProgress() {
        try {
            localStorage.setItem('physics-exercise-progress', JSON.stringify(this.userProgress));
        } catch (e) {
            console.warn('Could not save exercise progress');
        }
    }

    // Initialize exercise handlers
    initExerciseHandlers() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-solution')) {
                const exerciseId = this.getExerciseId(e.target);
                this.toggleSolution(exerciseId);
            }
        });
    }

    // Initialize quiz handlers
    initQuizHandlers() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-check')) {
                const quizElement = e.target.closest('.quiz');
                if (quizElement) {
                    const quizId = quizElement.id;
                    const correctAnswer = e.target.getAttribute('data-correct') || 
                                        e.target.getAttribute('onclick')?.match(/checkQuiz\(.*?,\s*'([^']+)'/)?.[1];
                    if (correctAnswer) {
                        this.checkQuiz(quizId, correctAnswer);
                    }
                }
            }
        });
    }

    // Get exercise ID from button
    getExerciseId(button) {
        const exercise = button.closest('.exercise');
        return exercise ? exercise.getAttribute('data-exercise') : null;
    }

    // Toggle solution visibility
    toggleSolution(exerciseId) {
        const solutionElement = document.getElementById(`solution-${exerciseId}`);
        const button = document.querySelector(`[data-exercise="${exerciseId}"] .btn-solution`);
        
        if (!solutionElement || !button) return;

        const isVisible = solutionElement.classList.contains('show');
        
        if (isVisible) {
            solutionElement.classList.remove('show');
            button.textContent = 'Xem lời giải';
            button.innerHTML = '<i class="fas fa-eye"></i> Xem lời giải';
        } else {
            solutionElement.classList.add('show');
            button.innerHTML = '<i class="fas fa-eye-slash"></i> Ẩn lời giải';
            
            // Mark as viewed
            this.markExerciseViewed(exerciseId);
            
            // Render math if MathJax is available
            if (window.MathJax) {
                window.MathJax.typesetPromise([solutionElement]).catch(function (err) {
                    console.warn('MathJax typeset failed: ' + err.message);
                });
            }
        }
    }

    // Mark exercise as viewed
    markExerciseViewed(exerciseId) {
        if (!this.userProgress.exercises) {
            this.userProgress.exercises = {};
        }
        
        this.userProgress.exercises[exerciseId] = {
            viewed: true,
            viewedAt: new Date().toISOString()
        };
        
        this.saveProgress();
    }

    // Check quiz answer
    checkQuiz(quizId, correctAnswer) {
        const quizElement = document.getElementById(quizId);
        if (!quizElement) return;

        const selectedOption = quizElement.querySelector('input[type="radio"]:checked');
        const resultElement = document.getElementById(`result-${quizId.split('-')[1]}`);
        
        if (!selectedOption) {
            this.showQuizResult(resultElement, 'Vui lòng chọn một đáp án!', 'warning');
            return;
        }

        const userAnswer = selectedOption.value;
        const isCorrect = userAnswer === correctAnswer;
        
        if (isCorrect) {
            this.showQuizResult(resultElement, '🎉 Chính xác! Bạn đã trả lời đúng.', 'correct');
        } else {
            this.showQuizResult(resultElement, `❌ Sai rồi! Đáp án đúng là: ${correctAnswer.toUpperCase()}`, 'incorrect');
        }

        // Save quiz result
        this.saveQuizResult(quizId, userAnswer, isCorrect);
        
        // Disable quiz after answering
        this.disableQuiz(quizElement);
    }

    // Show quiz result
    showQuizResult(resultElement, message, type) {
        if (!resultElement) return;
        
        resultElement.textContent = message;
        resultElement.className = `quiz-result ${type}`;
        resultElement.style.display = 'block';
        
        // Auto-hide warning messages
        if (type === 'warning') {
            setTimeout(() => {
                resultElement.style.display = 'none';
            }, 3000);
        }
    }

    // Save quiz result
    saveQuizResult(quizId, userAnswer, isCorrect) {
        if (!this.userProgress.quizzes) {
            this.userProgress.quizzes = {};
        }
        
        this.userProgress.quizzes[quizId] = {
            answer: userAnswer,
            correct: isCorrect,
            answeredAt: new Date().toISOString(),
            attempts: (this.userProgress.quizzes[quizId]?.attempts || 0) + 1
        };
        
        this.saveProgress();
    }

    // Disable quiz after answering
    disableQuiz(quizElement) {
        const inputs = quizElement.querySelectorAll('input[type="radio"]');
        const button = quizElement.querySelector('.btn-check');
        
        inputs.forEach(input => {
            input.disabled = true;
        });
        
        if (button) {
            button.disabled = true;
            button.textContent = 'Đã trả lời';
            button.style.opacity = '0.6';
        }
    }

    // Reset quiz
    resetQuiz(quizId) {
        const quizElement = document.getElementById(quizId);
        if (!quizElement) return;

        const inputs = quizElement.querySelectorAll('input[type="radio"]');
        const button = quizElement.querySelector('.btn-check');
        const resultElement = document.getElementById(`result-${quizId.split('-')[1]}`);
        
        inputs.forEach(input => {
            input.disabled = false;
            input.checked = false;
        });
        
        if (button) {
            button.disabled = false;
            button.textContent = 'Kiểm tra';
            button.style.opacity = '1';
        }
        
        if (resultElement) {
            resultElement.style.display = 'none';
        }

        // Remove from progress
        if (this.userProgress.quizzes && this.userProgress.quizzes[quizId]) {
            delete this.userProgress.quizzes[quizId];
            this.saveProgress();
        }
    }

    // Get user statistics
    getStatistics() {
        const stats = {
            exercisesViewed: 0,
            quizzesCompleted: 0,
            correctAnswers: 0,
            totalQuizzes: document.querySelectorAll('.quiz').length,
            accuracy: 0
        };

        if (this.userProgress.exercises) {
            stats.exercisesViewed = Object.keys(this.userProgress.exercises).length;
        }

        if (this.userProgress.quizzes) {
            const quizzes = Object.values(this.userProgress.quizzes);
            stats.quizzesCompleted = quizzes.length;
            stats.correctAnswers = quizzes.filter(q => q.correct).length;
            stats.accuracy = stats.quizzesCompleted > 0 ? 
                (stats.correctAnswers / stats.quizzesCompleted * 100) : 0;
        }

        return stats;
    }

    // Show progress dashboard
    showProgressDashboard() {
        const stats = this.getStatistics();
        const modal = this.createProgressModal(stats);
        document.body.appendChild(modal);
        
        // Show modal
        setTimeout(() => modal.classList.add('show'), 10);
        
        // Close handlers
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.classList.contains('close-modal')) {
                this.closeModal(modal);
            }
        });
    }

    // Create progress modal
    createProgressModal(stats) {
        const modal = document.createElement('div');
        modal.className = 'progress-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-chart-bar"></i> Tiến độ học tập</h3>
                    <button class="close-modal"><i class="fas fa-times"></i></button>
                </div>
                <div class="modal-body">
                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-icon"><i class="fas fa-book-open"></i></div>
                            <div class="stat-content">
                                <div class="stat-number">${stats.exercisesViewed}</div>
                                <div class="stat-label">Bài tập đã xem</div>
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon"><i class="fas fa-question-circle"></i></div>
                            <div class="stat-content">
                                <div class="stat-number">${stats.quizzesCompleted}/${stats.totalQuizzes}</div>
                                <div class="stat-label">Câu hỏi đã làm</div>
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon"><i class="fas fa-check-circle"></i></div>
                            <div class="stat-content">
                                <div class="stat-number">${stats.correctAnswers}</div>
                                <div class="stat-label">Câu trả lời đúng</div>
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon"><i class="fas fa-percentage"></i></div>
                            <div class="stat-content">
                                <div class="stat-number">${Math.round(stats.accuracy)}%</div>
                                <div class="stat-label">Độ chính xác</div>
                            </div>
                        </div>
                    </div>
                    <div class="progress-section">
                        <h4>Tiến độ hoàn thành</h4>
                        <div class="progress-bar-large">
                            <div class="progress-fill-large" style="width: ${(stats.quizzesCompleted / stats.totalQuizzes) * 100}%"></div>
                        </div>
                        <p class="progress-text">${Math.round((stats.quizzesCompleted / stats.totalQuizzes) * 100)}% hoàn thành</p>
                    </div>
                    <div class="actions">
                        <button class="btn-reset" onclick="exerciseManager.resetAllProgress()">
                            <i class="fas fa-redo"></i> Đặt lại tiến độ
                        </button>
                        <button class="btn-export" onclick="exerciseManager.exportProgress()">
                            <i class="fas fa-download"></i> Xuất dữ liệu
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        return modal;
    }

    // Close modal
    closeModal(modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
    }

    // Reset all progress
    resetAllProgress() {
        if (confirm('Bạn có chắc chắn muốn đặt lại toàn bộ tiến độ học tập?')) {
            this.userProgress = {};
            this.saveProgress();
            
            // Reset UI
            document.querySelectorAll('.solution.show').forEach(solution => {
                solution.classList.remove('show');
            });
            
            document.querySelectorAll('.btn-solution').forEach(button => {
                button.innerHTML = '<i class="fas fa-eye"></i> Xem lời giải';
            });
            
            document.querySelectorAll('.quiz').forEach(quiz => {
                const inputs = quiz.querySelectorAll('input[type="radio"]');
                const button = quiz.querySelector('.btn-check');
                const resultElement = quiz.parentNode.querySelector('.quiz-result');
                
                inputs.forEach(input => {
                    input.disabled = false;
                    input.checked = false;
                });
                
                if (button) {
                    button.disabled = false;
                    button.textContent = 'Kiểm tra';
                    button.style.opacity = '1';
                }
                
                if (resultElement) {
                    resultElement.style.display = 'none';
                }
            });
            
            alert('Đã đặt lại toàn bộ tiến độ học tập!');
            
            // Close modal if open
            const modal = document.querySelector('.progress-modal');
            if (modal) {
                this.closeModal(modal);
            }
        }
    }

    // Export progress data
    exportProgress() {
        const data = {
            progress: this.userProgress,
            exportDate: new Date().toISOString(),
            stats: this.getStatistics()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `physics-progress-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Import progress data
    importProgress(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (data.progress) {
                    this.userProgress = data.progress;
                    this.saveProgress();
                    alert('Đã nhập dữ liệu tiến độ thành công!');
                    location.reload(); // Reload to update UI
                } else {
                    alert('File dữ liệu không hợp lệ!');
                }
            } catch (error) {
                alert('Lỗi khi đọc file dữ liệu!');
                console.error(error);
            }
        };
        reader.readAsText(file);
    }
}

// Global functions for backward compatibility
function toggleSolution(exerciseId) {
    if (window.exerciseManager) {
        window.exerciseManager.toggleSolution(exerciseId);
    }
}

function checkQuiz(quizId, correctAnswer) {
    if (window.exerciseManager) {
        window.exerciseManager.checkQuiz(quizId, correctAnswer);
    }
}

// Add progress button to header
function addProgressButton() {
    const headerControls = document.querySelector('.header-controls');
    if (headerControls && !document.getElementById('progress-btn')) {
        const progressBtn = document.createElement('button');
        progressBtn.id = 'progress-btn';
        progressBtn.className = 'btn-icon';
        progressBtn.title = 'Xem tiến độ';
        progressBtn.innerHTML = '<i class="fas fa-chart-bar"></i>';
        progressBtn.addEventListener('click', () => {
            if (window.exerciseManager) {
                window.exerciseManager.showProgressDashboard();
            }
        });
        
        headerControls.insertBefore(progressBtn, headerControls.firstChild);
    }
}

// Initialize exercise manager
document.addEventListener('DOMContentLoaded', function() {
    window.exerciseManager = new ExerciseManager();
    addProgressButton();
});

// Add CSS for exercise features
const exerciseCSS = `
.solution {
    display: none;
    animation: slideDown 0.3s ease;
}

.solution.show {
    display: block;
}

@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.quiz-result {
    display: none;
    padding: var(--spacing-md);
    border-radius: var(--border-radius);
    margin-top: var(--spacing-md);
    font-weight: 500;
}

.quiz-result.correct {
    background: rgba(34, 197, 94, 0.1);
    color: #15803d;
    border: 1px solid #22c55e;
}

.quiz-result.incorrect {
    background: rgba(239, 68, 68, 0.1);
    color: #dc2626;
    border: 1px solid #ef4444;
}

.quiz-result.warning {
    background: rgba(245, 158, 11, 0.1);
    color: #d97706;
    border: 1px solid #f59e0b;
}

.progress-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.progress-modal.show {
    opacity: 1;
}

.modal-content {
    background: var(--background-color);
    border-radius: var(--border-radius-lg);
    max-width: 600px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: var(--shadow-large);
    transform: translateY(-20px);
    transition: transform 0.3s ease;
}

.progress-modal.show .modal-content {
    transform: translateY(0);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-xl);
    border-bottom: 1px solid var(--border-color);
}

.modal-header h3 {
    margin: 0;
    color: var(--text-color);
}

.close-modal {
    background: none;
    border: none;
    font-size: var(--font-size-xl);
    color: var(--text-secondary);
    cursor: pointer;
    padding: var(--spacing-sm);
    border-radius: var(--border-radius);
    transition: all var(--transition-fast);
}

.close-modal:hover {
    background: var(--surface-color);
    color: var(--text-color);
}

.modal-body {
    padding: var(--spacing-xl);
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: var(--spacing-lg);
    margin-bottom: var(--spacing-xl);
}

.stat-card {
    background: var(--surface-color);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius-lg);
    padding: var(--spacing-lg);
    text-align: center;
    transition: all var(--transition-fast);
}

.stat-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-medium);
}

.stat-icon {
    font-size: 2rem;
    color: var(--primary-color);
    margin-bottom: var(--spacing-md);
}

.stat-number {
    font-size: var(--font-size-2xl);
    font-weight: 700;
    color: var(--text-color);
    margin-bottom: var(--spacing-xs);
}

.stat-label {
    font-size: var(--font-size-sm);
    color: var(--text-secondary);
}

.progress-section {
    margin-bottom: var(--spacing-xl);
}

.progress-section h4 {
    margin-bottom: var(--spacing-md);
    color: var(--text-color);
}

.progress-bar-large {
    height: 20px;
    background: var(--border-color);
    border-radius: 10px;
    overflow: hidden;
    margin-bottom: var(--spacing-md);
}

.progress-fill-large {
    height: 100%;
    background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
    transition: width 0.5s ease;
}

.progress-text {
    text-align: center;
    color: var(--text-secondary);
    font-weight: 500;
}

.actions {
    display: flex;
    gap: var(--spacing-md);
    justify-content: center;
}

.btn-reset,
.btn-export {
    padding: var(--spacing-sm) var(--spacing-lg);
    border: none;
    border-radius: var(--border-radius);
    cursor: pointer;
    font-weight: 500;
    transition: all var(--transition-fast);
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
}

.btn-reset {
    background: #ef4444;
    color: white;
}

.btn-reset:hover {
    background: #dc2626;
    transform: translateY(-2px);
}

.btn-export {
    background: var(--accent-color);
    color: white;
}

.btn-export:hover {
    background: #0891b2;
    transform: translateY(-2px);
}

@media (max-width: 768px) {
    .stats-grid {
        grid-template-columns: repeat(2, 1fr);
    }
    
    .actions {
        flex-direction: column;
    }
    
    .modal-content {
        width: 95%;
        margin: var(--spacing-md);
    }
}
`;

// Inject CSS
const exerciseStyle = document.createElement('style');
exerciseStyle.textContent = exerciseCSS;
document.head.appendChild(exerciseStyle);