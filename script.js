// Constants and game variables
const GRID_SIZE = 9;
const BOX_SIZE = 3;
const MAX_LIVES = 3;

let board = [];
let solution = [];
let selectedCell = null;
let difficulty = "easy";
let gameActive = false;
let lives = MAX_LIVES;
let timer = 0;
let timerInterval = null;
let remainingNumbers = {}; // Track remaining numbers

// User data
let currentUser = null;

// DOM elements
let boardElement;
let messageElement;
let timerDisplay;
let livesHearts;
let remainingDisplay;
let numberCounters;
let completionTimeDisplay;

// Screen elements
let loginScreen;
let homeScreen;
let gameScreen;
let gameOverScreen;
let successScreen;
let profileScreen;

// Login form elements
let loginForm;
let nameInput;
let emailInput;
let phoneInput;

// Home screen elements
let userNameDisplay;
let difficultyButtons;
let startGameBtn;
let profileBtn;

// Game screen elements
let newGameBtn;
let homeBtn;

// Profile screen elements
let profileNameDisplay;
let profileEmailDisplay;
let profilePhoneDisplay;
let gamesEasyDisplay;
let gamesMediumDisplay;
let gamesHardDisplay;
let gamesTotalDisplay;
let winsEasyDisplay;
let winsMediumDisplay;
let winsHardDisplay;
let winsTotalDisplay;
let bestTimeEasyDisplay;
let bestTimeMediumDisplay;
let bestTimeHardDisplay;
let backHomeBtn;
let logoutBtn;

// Game over screen elements
let tryAgainBtn;
let backToHomeBtn;

// Success screen elements
let newRecordBadge;
let playAgainBtn;
let successToHomeBtn;

// Confirmation dialog elements
let confirmationDialog;
let overlay;
let confirmYesBtn;
let confirmNoBtn;

// Initialize the game
function initGame() {
    // Get DOM elements after page load
    getElementReferences();
    
    // Check if user is already logged in
    checkLoginStatus();
    
    // Set up event listeners
    bindEvents();
}

// Check if user is already logged in
function checkLoginStatus() {
    const savedUser = localStorage.getItem('sudokuUser');
    
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUIWithUserData();
        showScreen('home-screen');
    } else {
        showScreen('login-screen');
    }
}

// Update UI elements with user data
function updateUIWithUserData() {
    if (!currentUser) return;
    
    // Update home screen
    userNameDisplay.textContent = currentUser.name;
    
    // Update profile screen
    profileNameDisplay.textContent = currentUser.name;
    profileEmailDisplay.textContent = currentUser.email;
    profilePhoneDisplay.textContent = currentUser.phone || 'Not provided';
    
    // Update statistics
    updateStatsDisplay();
}

// Update stats displays with current user data
function updateStatsDisplay() {
    if (!currentUser || !currentUser.stats) return;
    
    const stats = currentUser.stats;
    
    // Games played
    gamesEasyDisplay.textContent = stats.gamesPlayed.easy || 0;
    gamesMediumDisplay.textContent = stats.gamesPlayed.medium || 0;
    gamesHardDisplay.textContent = stats.gamesPlayed.hard || 0;
    gamesTotalDisplay.textContent = 
        (stats.gamesPlayed.easy || 0) + 
        (stats.gamesPlayed.medium || 0) + 
        (stats.gamesPlayed.hard || 0);
    
    // Games won
    winsEasyDisplay.textContent = stats.gamesWon.easy || 0;
    winsMediumDisplay.textContent = stats.gamesWon.medium || 0;
    winsHardDisplay.textContent = stats.gamesWon.hard || 0;
    winsTotalDisplay.textContent = 
        (stats.gamesWon.easy || 0) + 
        (stats.gamesWon.medium || 0) + 
        (stats.gamesWon.hard || 0);
    
    // Best times
    bestTimeEasyDisplay.textContent = stats.bestTimes.easy ? formatTime(stats.bestTimes.easy) : '--:--';
    bestTimeMediumDisplay.textContent = stats.bestTimes.medium ? formatTime(stats.bestTimes.medium) : '--:--';
    bestTimeHardDisplay.textContent = stats.bestTimes.hard ? formatTime(stats.bestTimes.hard) : '--:--';
}

// Get all DOM element references
function getElementReferences() {
    // Screens
    loginScreen = document.getElementById('login-screen');
    homeScreen = document.getElementById('home-screen');
    gameScreen = document.getElementById('game-screen');
    gameOverScreen = document.getElementById('game-over-screen');
    successScreen = document.getElementById('success-screen');
    profileScreen = document.getElementById('profile-screen');
    
    // Login form elements
    loginForm = document.getElementById('login-form');
    nameInput = document.getElementById('name');
    emailInput = document.getElementById('email');
    phoneInput = document.getElementById('phone');
    
    // Home screen elements
    userNameDisplay = document.getElementById('user-name');
    difficultyButtons = document.querySelectorAll('.difficulty-btn');
    startGameBtn = document.getElementById('start-game');
    profileBtn = document.getElementById('profile-btn');
    
    // Board and game elements
    boardElement = document.getElementById('board');
    messageElement = document.getElementById('message');
    timerDisplay = document.getElementById('timer-display');
    livesHearts = document.querySelectorAll('.live-heart');
    remainingDisplay = document.getElementById('remaining-display');
    numberCounters = document.querySelectorAll('.counter');
    completionTimeDisplay = document.getElementById('completion-time');
    
    // Profile screen elements
    profileNameDisplay = document.getElementById('profile-name');
    profileEmailDisplay = document.getElementById('profile-email');
    profilePhoneDisplay = document.getElementById('profile-phone');
    gamesEasyDisplay = document.getElementById('games-easy');
    gamesMediumDisplay = document.getElementById('games-medium');
    gamesHardDisplay = document.getElementById('games-hard');
    gamesTotalDisplay = document.getElementById('games-total');
    winsEasyDisplay = document.getElementById('wins-easy');
    winsMediumDisplay = document.getElementById('wins-medium');
    winsHardDisplay = document.getElementById('wins-hard');
    winsTotalDisplay = document.getElementById('wins-total');
    bestTimeEasyDisplay = document.getElementById('best-time-easy');
    bestTimeMediumDisplay = document.getElementById('best-time-medium');
    bestTimeHardDisplay = document.getElementById('best-time-hard');
    backHomeBtn = document.getElementById('back-home');
    logoutBtn = document.getElementById('logout-btn');
    
    // Game screen elements
    newGameBtn = document.getElementById('new-game');
    homeBtn = document.getElementById('home-btn');
    
    // Game over screen elements
    tryAgainBtn = document.getElementById('try-again');
    backToHomeBtn = document.getElementById('back-to-home');
    
    // Success screen elements
    newRecordBadge = document.getElementById('new-record');
    playAgainBtn = document.getElementById('play-again');
    successToHomeBtn = document.getElementById('success-to-home');
    
    // Confirmation dialog elements
    confirmationDialog = document.getElementById('confirmation-dialog');
    overlay = document.getElementById('overlay');
    confirmYesBtn = document.getElementById('confirm-yes');
    confirmNoBtn = document.getElementById('confirm-no');
}

// Create the visual board
function createBoard() {
    boardElement.innerHTML = '';
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            const index = i * GRID_SIZE + j;
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.index = index;
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.tabIndex = 0; // Make cells focusable
            cell.setAttribute('role', 'gridcell');
            cell.setAttribute('aria-label', `Row ${i + 1}, Column ${j + 1}`);
            boardElement.appendChild(cell);
        }
    }
}

// Show a specific screen
function showScreen(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show the specified screen
    document.getElementById(screenId).classList.add('active');
}

// Show confirmation dialog
function showConfirmationDialog(onConfirm) {
    confirmationDialog.classList.add('active');
    overlay.classList.add('active');
    
    // Setup confirm button
    const handleConfirm = () => {
        hideConfirmationDialog();
        onConfirm();
        confirmYesBtn.removeEventListener('click', handleConfirm);
        confirmNoBtn.removeEventListener('click', hideConfirmationDialog);
    };
    
    confirmYesBtn.addEventListener('click', handleConfirm);
    confirmNoBtn.addEventListener('click', hideConfirmationDialog);
}

// Hide confirmation dialog
function hideConfirmationDialog() {
    confirmationDialog.classList.remove('active');
    overlay.classList.remove('active');
}

// Bind event listeners
function bindEvents() {
    // Login form submit
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleLogin();
    });
    
    // Profile button
    profileBtn.addEventListener('click', () => {
        showScreen('profile-screen');
    });
    
    // Back to home from profile
    backHomeBtn.addEventListener('click', () => {
        showScreen('home-screen');
    });
    
    // Logout button
    logoutBtn.addEventListener('click', () => {
        handleLogout();
    });
    
    // Home screen events
    difficultyButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update difficulty selection
            difficultyButtons.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            difficulty = btn.dataset.difficulty;
        });
    });
    
    startGameBtn.addEventListener('click', () => {
        startNewGame();
        showScreen('game-screen');
    });
    
    // Game screen events
    boardElement.addEventListener('click', (e) => {
        if (!gameActive) return;
        const cell = e.target.closest('.cell');
        if (!cell || cell.classList.contains('fixed')) return;
        
        selectCell(cell);
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!gameActive || !gameScreen.classList.contains('active')) return;
        
        // If a cell is selected
        if (selectedCell) {
            // Number keys (1-9)
            if (e.key >= '1' && e.key <= '9') {
                enterNumber(parseInt(e.key));
                return;
            }
            
            // Delete or Backspace to erase
            if (e.key === 'Delete' || e.key === 'Backspace') {
                enterNumber(0);
                return;
            }
            
            // Arrow keys for navigation
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault(); // Prevent page scrolling
                
                const row = parseInt(selectedCell.dataset.row);
                const col = parseInt(selectedCell.dataset.col);
                
                let newRow = row;
                let newCol = col;
                
                switch (e.key) {
                    case 'ArrowUp':
                        newRow = Math.max(0, row - 1);
                        break;
                    case 'ArrowDown':
                        newRow = Math.min(GRID_SIZE - 1, row + 1);
                        break;
                    case 'ArrowLeft':
                        newCol = Math.max(0, col - 1);
                        break;
                    case 'ArrowRight':
                        newCol = Math.min(GRID_SIZE - 1, col + 1);
                        break;
                }
                
                const newIndex = newRow * GRID_SIZE + newCol;
                const newCell = document.querySelector(`.cell[data-index="${newIndex}"]`);
                selectCell(newCell);
                newCell.focus();
            }
        }
    });
    
    // Number counter clicks
    numberCounters.forEach(counter => {
        if (counter.classList.contains('clickable')) {
            counter.addEventListener('click', () => {
                if (!selectedCell || !gameActive) return;
                
                // Don't allow clicks on counters with 0 remaining
                const num = parseInt(counter.dataset.number);
                if (num > 0 && remainingNumbers[num] <= 0) return;
                
                enterNumber(num);
            });
        }
    });
    
    // New game button
    newGameBtn.addEventListener('click', startNewGame);
    
    // Home button in game screen
    homeBtn.addEventListener('click', () => {
        if (gameActive) {
            // Show custom confirmation dialog
            showConfirmationDialog(() => {
                // Track game as played but not won
                trackGamePlayed(false);
                stopTimer();
                showScreen('home-screen');
            });
        } else {
            // If game is not active, no confirmation needed
            stopTimer();
            showScreen('home-screen');
        }
    });
    
    // Game over screen events
    tryAgainBtn.addEventListener('click', () => {
        startNewGame();
        showScreen('game-screen');
    });
    
    backToHomeBtn.addEventListener('click', () => {
        showScreen('home-screen');
    });
    
    // Success screen events
    playAgainBtn.addEventListener('click', () => {
        startNewGame();
        showScreen('game-screen');
    });
    
    successToHomeBtn.addEventListener('click', () => {
        showScreen('home-screen');
    });
}

// Handle user login
function handleLogin() {
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    
    // Create or update user data
    currentUser = {
        name,
        email,
        phone,
        stats: {
            gamesPlayed: { easy: 0, medium: 0, hard: 0 },
            gamesWon: { easy: 0, medium: 0, hard: 0 },
            bestTimes: { easy: null, medium: null, hard: null }
        }
    };
    
    // Check if user exists in localStorage
    const existingUserJSON = localStorage.getItem(`sudoku_user_${email}`);
    if (existingUserJSON) {
        const existingUser = JSON.parse(existingUserJSON);
        // Keep stats, update profile info
        currentUser.stats = existingUser.stats;
    }
    
    // Save user data
    saveUserData();
    
    // Update UI
    updateUIWithUserData();
    
    // Navigate to home screen
    showScreen('home-screen');
}

// Handle user logout
function handleLogout() {
    localStorage.removeItem('sudokuUser');
    currentUser = null;
    showScreen('login-screen');
}

// Save user data to localStorage
function saveUserData() {
    if (!currentUser) return;
    
    localStorage.setItem('sudokuUser', JSON.stringify(currentUser));
    localStorage.setItem(`sudoku_user_${currentUser.email}`, JSON.stringify(currentUser));
}

// Track when a game is played
function trackGamePlayed(isWon) {
    if (!currentUser || !currentUser.stats) return;
    
    // Increment games played for current difficulty
    currentUser.stats.gamesPlayed[difficulty] = (currentUser.stats.gamesPlayed[difficulty] || 0) + 1;
    
    // If game was won, increment wins and check for best time
    if (isWon) {
        currentUser.stats.gamesWon[difficulty] = (currentUser.stats.gamesWon[difficulty] || 0) + 1;
        
        // Check if this is a new best time
        const currentBestTime = currentUser.stats.bestTimes[difficulty];
        const isNewRecord = !currentBestTime || timer < currentBestTime;
        
        if (isNewRecord) {
            currentUser.stats.bestTimes[difficulty] = timer;
            newRecordBadge.style.display = 'inline-flex';
        } else {
            newRecordBadge.style.display = 'none';
        }
    }
    
    // Save updated user data
    saveUserData();
    
    // Update stats display if profile is visible
    if (profileScreen.classList.contains('active')) {
        updateStatsDisplay();
    }
}

// Start a new game
function startNewGame() {
    // Reset variables
    board = [];
    solution = [];
    lives = MAX_LIVES;
    gameActive = true;
    
    // Reset UI
    updateLivesDisplay();
    stopTimer();
    resetTimer();
    startTimer();
    
    // Hide new record badge
    newRecordBadge.style.display = 'none';
    
    // Clear message
    showMessage('');
    
    // Create board if it doesn't exist
    if (boardElement.children.length === 0) {
        createBoard();
    }
    
    // Generate a new puzzle
    generatePuzzle();
    
    // Initialize remaining numbers
    initializeRemainingNumbers();
    
    // Render the board
    renderBoard();
    
    // Deselect any selected cell
    if (selectedCell) {
        selectedCell.classList.remove('selected');
        selectedCell = null;
    }
    
    // Update cell event listeners
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.addEventListener('focus', () => {
            if (!gameActive || cell.classList.contains('fixed')) return;
            selectCell(cell);
        });
    });
}

// Format time for display (seconds to MM:SS)
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${minutes}:${secs}`;
}

// Initialize the remaining numbers object
function initializeRemainingNumbers() {
    // Start with 9 of each number
    remainingNumbers = {
        1: 9, 2: 9, 3: 9, 4: 9, 5: 9, 6: 9, 7: 9, 8: 9, 9: 9
    };
    
    // Subtract numbers already on the board
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            const value = board[i][j];
            if (value > 0) {
                remainingNumbers[value]--;
            }
        }
    }
    
    // Update the display
    updateRemainingNumbersDisplay();
}

// Update the remaining numbers display
function updateRemainingNumbersDisplay() {
    // Update total remaining
    let totalRemaining = 0;
    for (let num = 1; num <= 9; num++) {
        totalRemaining += remainingNumbers[num];
    }
    remainingDisplay.textContent = totalRemaining;
    
    // Update individual number counters
    numberCounters.forEach(counter => {
        const num = parseInt(counter.dataset.number);
        if (num > 0) { // Skip the eraser button
            const countElement = counter.querySelector('.counter-count');
            countElement.textContent = remainingNumbers[num];
            
            // Visual indication of completed numbers
            if (remainingNumbers[num] <= 0) {
                counter.setAttribute('data-count', '0');
            } else {
                counter.removeAttribute('data-count');
            }
        }
    });
}

// Timer functions
function startTimer() {
    timerInterval = setInterval(() => {
        timer++;
        updateTimerDisplay();
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function resetTimer() {
    timer = 0;
    updateTimerDisplay();
}

function updateTimerDisplay() {
    const minutes = Math.floor(timer / 60).toString().padStart(2, '0');
    const seconds = (timer % 60).toString().padStart(2, '0');
    timerDisplay.textContent = `${minutes}:${seconds}`;
}

function updateLivesDisplay() {
    // Update hearts display based on current lives
    livesHearts.forEach((heart, index) => {
        if (index < lives) {
            heart.classList.remove('lost');
            heart.classList.add('live-heart');
        } else {
            heart.classList.remove('live-heart');
            heart.classList.add('lost');
        }
    });
}

// Select a cell
function selectCell(cell) {
    // Deselect previous cell
    if (selectedCell) {
        selectedCell.classList.remove('selected');
    }
    
    // Select new cell
    cell.classList.add('selected');
    selectedCell = cell;
    
    // Highlight related cells
    highlightRelatedCells(cell);
}

// Enter a number in the selected cell
function enterNumber(value) {
    if (!selectedCell || !gameActive) return;
    
    const row = parseInt(selectedCell.dataset.row);
    const col = parseInt(selectedCell.dataset.col);
    
    // Prevent changing a correct number
    if (selectedCell.classList.contains('correct')) return;
    
    // If there's already a value in this cell, update the remaining count
    const currentValue = board[row][col];
    if (currentValue > 0) {
        remainingNumbers[currentValue]++;
    }
    
    // Erase or set number
    if (value === 0) {
        selectedCell.textContent = '';
        board[row][col] = 0;
        selectedCell.classList.remove('error', 'correct', 'user-guess');
        selectedCell.setAttribute('aria-label', `Row ${row + 1}, Column ${col + 1}, empty`);
        updateRemainingNumbersDisplay();
        return;
    }
    
    // Check if the number is valid according to the solution
    if (value !== solution[row][col]) {
        // Wrong guess
        lives--;
        updateLivesDisplay();
        
        // Check if the game is over
        if (lives <= 0) {
            gameOver();
            return;
        }
        
        // Show error for a short time
        selectedCell.classList.add('error');
        selectedCell.classList.remove('correct', 'user-guess');
        selectedCell.textContent = value;
        selectedCell.setAttribute('aria-label', `Row ${row + 1}, Column ${col + 1}, incorrect ${value}`);
        
        // Flash the lives indicator
        const heartsContainer = document.getElementById('hearts-container');
        heartsContainer.classList.add('flash');
        setTimeout(() => {
            // Clear the cell
            selectedCell.textContent = '';
            selectedCell.classList.remove('error');
            heartsContainer.classList.remove('flash');
        }, 500);
        
        showMessage(`Wrong! ${lives} ${lives === 1 ? 'life' : 'lives'} remaining.`);
    } else {
        // Correct guess
        selectedCell.textContent = value;
        board[row][col] = value;
        selectedCell.classList.remove('error');
        selectedCell.classList.add('correct', 'user-guess');
        selectedCell.setAttribute('aria-label', `Row ${row + 1}, Column ${col + 1}, ${value}`);
        
        // Update remaining numbers
        remainingNumbers[value]--;
        updateRemainingNumbersDisplay();
        
        // Remove correct class after animation completes
        setTimeout(() => {
            selectedCell.classList.remove('correct');
        }, 500);
        
        // Check if game is complete
        if (isBoardFilled()) {
            gameSuccess();
        }
    }
}

// Game over function
function gameOver() {
    gameActive = false;
    stopTimer();
    
    // Track game as played but not won
    trackGamePlayed(false);
    
    showScreen('game-over-screen');
}

// Game success function
function gameSuccess() {
    gameActive = false;
    stopTimer();
    
    // Track game as played and won
    trackGamePlayed(true);
    
    // Update completion time
    const minutes = Math.floor(timer / 60).toString().padStart(2, '0');
    const seconds = (timer % 60).toString().padStart(2, '0');
    completionTimeDisplay.textContent = `${minutes}:${seconds}`;
    
    showScreen('success-screen');
}

// Generate a new puzzle
function generatePuzzle() {
    // Start with an empty board
    for (let i = 0; i < GRID_SIZE; i++) {
        board[i] = Array(GRID_SIZE).fill(0);
        solution[i] = Array(GRID_SIZE).fill(0);
    }
    
    // Generate a solved board
    generateSolution(0, 0);
    
    // Copy solution
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            solution[i][j] = board[i][j];
        }
    }
    
    // Remove numbers based on difficulty
    removeNumbers();
}

// Generate a valid solution using backtracking
function generateSolution(row, col) {
    // If we've filled the entire board, we're done
    if (row === GRID_SIZE) {
        return true;
    }
    
    // Move to next cell
    if (col === GRID_SIZE) {
        return generateSolution(row + 1, 0);
    }
    
    // Skip filled cells
    if (board[row][col] !== 0) {
        return generateSolution(row, col + 1);
    }
    
    // Try numbers 1-9 in random order
    const numbers = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    
    for (let num of numbers) {
        if (isValidPlacement(row, col, num)) {
            board[row][col] = num;
            
            if (generateSolution(row, col + 1)) {
                return true;
            }
            
            // Backtrack if solution not found
            board[row][col] = 0;
        }
    }
    
    return false;
}

// Check if a number placement is valid
function isValidPlacement(row, col, num) {
    // Check row
    for (let i = 0; i < GRID_SIZE; i++) {
        if (i !== col && board[row][i] === num) {
            return false;
        }
    }
    
    // Check column
    for (let i = 0; i < GRID_SIZE; i++) {
        if (i !== row && board[i][col] === num) {
            return false;
        }
    }
    
    // Check 3x3 box
    const boxRow = Math.floor(row / BOX_SIZE) * BOX_SIZE;
    const boxCol = Math.floor(col / BOX_SIZE) * BOX_SIZE;
    
    for (let i = 0; i < BOX_SIZE; i++) {
        for (let j = 0; j < BOX_SIZE; j++) {
            const r = boxRow + i;
            const c = boxCol + j;
            if (r !== row || c !== col) {
                if (board[r][c] === num) {
                    return false;
                }
            }
        }
    }
    
    return true;
}

// Remove numbers from the board based on difficulty
function removeNumbers() {
    let numToRemove;
    
    switch (difficulty) {
        case 'easy':
            numToRemove = 40; // 41 clues
            break;
        case 'medium':
            numToRemove = 50; // 31 clues
            break;
        case 'hard':
            numToRemove = 60; // 21 clues
            break;
        default:
            numToRemove = 40;
    }
    
    const positions = shuffleArray([...Array(GRID_SIZE * GRID_SIZE).keys()]);
    
    for (let i = 0; i < numToRemove; i++) {
        const pos = positions[i];
        const row = Math.floor(pos / GRID_SIZE);
        const col = pos % GRID_SIZE;
        board[row][col] = 0;
    }
}

// Render the board
function renderBoard() {
    const cells = document.querySelectorAll('.cell');
    
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            const index = i * GRID_SIZE + j;
            const value = board[i][j];
            const cell = cells[index];
            
            // Clear previous state
            cell.textContent = '';
            cell.classList.remove('fixed', 'selected', 'error', 'user-guess');
            
            if (value !== 0) {
                cell.textContent = value;
                cell.classList.add('fixed'); // Initial numbers can't be changed
                cell.setAttribute('aria-label', `Row ${i + 1}, Column ${j + 1}, ${value}, fixed`);
            } else {
                cell.setAttribute('aria-label', `Row ${i + 1}, Column ${j + 1}, empty`);
            }
        }
    }
}

// Highlight related cells (same row, column, and box)
function highlightRelatedCells(cell) {
    // Remove previous highlights
    document.querySelectorAll('.cell.highlight').forEach(cell => {
        cell.classList.remove('highlight');
    });
    
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    
    const cells = document.querySelectorAll('.cell');
    
    // Highlight row
    for (let j = 0; j < GRID_SIZE; j++) {
        if (j !== col) {
            const index = row * GRID_SIZE + j;
            cells[index].classList.add('highlight');
        }
    }
    
    // Highlight column
    for (let i = 0; i < GRID_SIZE; i++) {
        if (i !== row) {
            const index = i * GRID_SIZE + col;
            cells[index].classList.add('highlight');
        }
    }
    
    // Box highlighting removed
}

// Check if the board is filled
function isBoardFilled() {
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            if (board[i][j] === 0) {
                return false;
            }
        }
    }
    return true;
}

// Utility function to shuffle an array
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// Display a message to the user
function showMessage(message) {
    messageElement.textContent = message;
}

// Add some animations to the CSS
document.head.insertAdjacentHTML('beforeend', `
<style>
    .flash {
        animation: flash 0.5s ease-in-out;
    }
    
    @keyframes flash {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
    }
</style>
`);

// Start the game when the page loads
document.addEventListener('DOMContentLoaded', initGame); 