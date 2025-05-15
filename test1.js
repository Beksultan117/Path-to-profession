// test.js - Personality test functionality

// Test state variables
let currentQuestion = 0;
let userAnswers = {};
let questions = [];
let careers = [];
let testInitialized = false;

// Initialize test on DOM load
document.addEventListener('DOMContentLoaded', async () => {
    // Get test button and attach event listener
    document.getElementById('testBtn')?.addEventListener('click', () => {
        if (!testInitialized) {
            initTestSection();
        }
    });
    
    // Load saved answers if available
    const savedAnswers = localStorage.getItem('userAnswers');
    if (savedAnswers) {
        userAnswers = JSON.parse(savedAnswers);
    }
    
    // Check if test was completed
    const testCompleted = localStorage.getItem('testCompleted');
    if (testCompleted === 'true') {
        // TODO: Show test completion message if needed
    }
});

// Initialize the test section
async function initTestSection() {
    testInitialized = true;
    
    // Clear previous question display
    document.getElementById('question-container').innerHTML = "Loading questions...";
    document.getElementById('options-container').innerHTML = "";
    
    // Load data
    try {
        // Load questions
        if (questions.length === 0) {
            questions = await loadQuestions();
        }
        
        // Load careers
        if (careers.length === 0) {
            careers = await loadCareers();
        }
        
        // Start test
        startTest();
    } catch (error) {
        console.error("Error initializing test:", error);
        document.getElementById('question-container').innerHTML = 
            "Error loading test data. Please try again later.";
    }
}

// Load questions from questions.json
async function loadQuestions() {
    try {
        // First try API endpoint
        const response = await fetch('/api/questions');
        if (response.ok) {
            const data = await response.json();
            console.log("Loaded questions from API:", data);
            return data.questions || [];
        }
        
        // If API fails, try direct file access
        const fileResponse = await fetch('/questions.json');
        if (fileResponse.ok) {
            const data = await fileResponse.json();
            console.log("Loaded questions from file:", data);
            return data.questions || [];
        }
        
        throw new Error('Failed to load questions from both API and direct file');
    } catch (error) {
        console.error('Error loading questions:', error);
        // Alert user about the error
        alert('Could not load personality test questions. Please refresh the page or try again later.');
        return [];
    }
}

// Load careers from careers.json
async function loadCareers() {
    try {
        // First try API endpoint
        const response = await fetch('/api/careers');
        if (response.ok) {
            const data = await response.json();
            console.log("Loaded careers from API:", data);
            return data;
        }
        
        // If API fails, try direct file access
        const fileResponse = await fetch('/careers.json');
        if (fileResponse.ok) {
            const data = await fileResponse.json();
            console.log("Loaded careers from file:", data);
            return data;
        }
        
        throw new Error('Failed to load careers from both API and direct file');
    } catch (error) {
        console.error('Error loading careers:', error);
        // Alert user about the error
        alert('Could not load career data. Please refresh the page or try again later.');
        return [];
    }
}

// Start the test
function startTest() {
    // Reset current question to the first unanswered question or 0
    if (Object.keys(userAnswers).length > 0) {
        // Find the highest answered question index
        const highestAnsweredIndex = Math.max(...Object.keys(userAnswers).map(Number));
        
        // Check if we have more questions
        if (highestAnsweredIndex < questions.length - 1) {
            currentQuestion = highestAnsweredIndex + 1;
        } else {
            currentQuestion = 0; // Start over if all questions were answered
        }
    } else {
        currentQuestion = 0;
    }
    
    // Display the current question
    showQuestion();
    
    // Set up navigation buttons
    setupNavButtons();
}

// Display the current question
function showQuestion() {
    if (!questions || questions.length === 0) {
        document.getElementById('question-container').innerHTML = "No questions available.";
        return;
    }
    
    const question = questions[currentQuestion];
    
    // Update question text
    document.getElementById('question-container').innerHTML = `
        <h3>Question ${currentQuestion + 1} of ${questions.length}</h3>
        <p>${question.text}</p>
    `;
    
    // Generate options
    const optionsHTML = question.options.map((option, index) => {
        const isSelected = userAnswers[currentQuestion] === index;
        return `
            <div class="option ${isSelected ? 'selected' : ''}" data-index="${index}">
                ${option}
            </div>
        `;
    }).join('');
    
    document.getElementById('options-container').innerHTML = optionsHTML;
    
    // Add click handlers to options
    document.querySelectorAll('.option').forEach(option => {
        option.addEventListener('click', function() {
            const optionIndex = parseInt(this.getAttribute('data-index'));
            selectOption(optionIndex);
        });
    });
    
    // Update navigation buttons visibility
    updateNavButtons();
}

// Handle option selection
function selectOption(optionIndex) {
    // Save the answer
    userAnswers[currentQuestion] = optionIndex;
    localStorage.setItem('userAnswers', JSON.stringify(userAnswers));
    
    // Update UI to show selected option
    document.querySelectorAll('.option').forEach(option => {
        option.classList.remove('selected');
    });
    
    document.querySelector(`.option[data-index="${optionIndex}"]`).classList.add('selected');
}

// Set up navigation buttons
function setupNavButtons() {
    const backBtn = document.getElementById('back-btn');
    const nextBtn = document.getElementById('next-btn');
    const finishBtn = document.getElementById('finish-btn');
    
    // Clear existing event listeners if any (to prevent duplicates)
    const newBackBtn = backBtn.cloneNode(true);
    backBtn.parentNode.replaceChild(newBackBtn, backBtn);
    const newNextBtn = nextBtn.cloneNode(true);
    nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);
    const newFinishBtn = finishBtn.cloneNode(true);
    finishBtn.parentNode.replaceChild(newFinishBtn, finishBtn);
    
    // Back button handler - Fix to properly go back to previous question
    newBackBtn.addEventListener('click', () => {
        if (currentQuestion > 0) {
            currentQuestion--;
            showQuestion();
        }
    });
    
    // Next button handler
    newNextBtn.addEventListener('click', () => {
        if (currentQuestion < questions.length - 1) {
            // Only proceed if current question is answered
            if (userAnswers[currentQuestion] !== undefined) {
                currentQuestion++;
                showQuestion();
            } else {
                alert('Please select an answer before proceeding.');
            }
        }
    });
    
    // Finish button handler
    newFinishBtn.addEventListener('click', () => {
        // Check if all questions are answered
        if (Object.keys(userAnswers).length < questions.length) {
            const continueAnyway = confirm('You have not answered all questions. Continue anyway?');
            if (!continueAnyway) return;
        }
        
        // Show loading indicator
        document.getElementById('question-container').innerHTML = `
            <h3>Analyzing Your Responses...</h3>
            <p>Our AI is processing your answers to find your ideal profession match.</p>
            <div class="loading-spinner"></div>
        `;
        
        document.getElementById('options-container').innerHTML = '';
        document.getElementById('back-btn').style.display = 'none';
        document.getElementById('next-btn').style.display = 'none';
        document.getElementById('finish-btn').style.display = 'none';
        
        // Short delay to simulate AI processing
        setTimeout(() => {
            // Analyze results using the AI engine
            const results = analyzeResults(questions, userAnswers, careers);
            
            // Mark test as completed
            localStorage.setItem('testCompleted', 'true');
            
            // Show completion message with AI recommendation
            document.getElementById('question-container').innerHTML = `
                <h3>Test Completed!</h3>
                <p>Thank you for completing the personality test.</p>
                <p>Our AI has analyzed your responses and determined your recommended profession is:</p>
                <h4>${results.topProfession?.title || 'No specific recommendation'}</h4>
                <p>${results.topProfession?.description || ''}</p>
                <p>This recommendation is based on your ${results.dominantTraits?.length || 0} dominant personality traits.</p>
                <p>View your full profile to see more details about your personality analysis.</p>
            `;
            
            // Create button container
            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'test-completion-buttons';
            buttonContainer.style.display = 'flex';
            buttonContainer.style.gap = '10px';
            buttonContainer.style.marginTop = '20px';
            
            // Add a button to go to profile
            const profileBtn = document.createElement('button');
            profileBtn.innerText = 'View Your Profile';
            profileBtn.className = 'profile-btn';
            profileBtn.style.padding = '10px 20px';
            profileBtn.style.backgroundColor = 'var(--primary-color)';
            profileBtn.style.color = 'white';
            profileBtn.style.border = 'none';
            profileBtn.style.borderRadius = '5px';
            profileBtn.style.cursor = 'pointer';
            profileBtn.addEventListener('click', () => {
                document.getElementById('profileBtn').click();
            });
            
            // Add a button to retake the test
            const retakeBtn = document.createElement('button');
            retakeBtn.innerText = 'Retake Test';
            retakeBtn.className = 'profile-btn';
            retakeBtn.style.padding = '10px 20px';
            retakeBtn.style.backgroundColor = 'var(--accent-color)';
            retakeBtn.style.color = 'white';
            retakeBtn.style.border = 'none';
            retakeBtn.style.borderRadius = '5px';
            retakeBtn.style.cursor = 'pointer';
            retakeBtn.addEventListener('click', () => {
                // Reset test state
                userAnswers = {};
                localStorage.setItem('userAnswers', JSON.stringify(userAnswers));
                localStorage.setItem('testCompleted', 'false');
                currentQuestion = 0;
                
                // Restart test
                initTestSection();
            });
            
            // Add buttons to container
            buttonContainer.appendChild(profileBtn);
            buttonContainer.appendChild(retakeBtn);
            
            // Add button container to question container
            document.getElementById('question-container').appendChild(buttonContainer);
        }, 2000); // 2 second delay for AI simulation
    });
    
    // Initial update of button visibility
    updateNavButtons();
}

// Update navigation buttons visibility
function updateNavButtons() {
    const backBtn = document.getElementById('back-btn');
    const nextBtn = document.getElementById('next-btn');
    const finishBtn = document.getElementById('finish-btn');
    
    // Back button visibility
    backBtn.style.display = currentQuestion > 0 ? 'block' : 'none';
    
    // Next/Finish button visibility
    if (currentQuestion < questions.length - 1) {
        nextBtn.style.display = 'block';
        finishBtn.style.display = 'none';
    } else {
        nextBtn.style.display = 'none';
        finishBtn.style.display = 'block';
    }
}

// Initialize professions section
function initProfessionsSection() {
    const container = document.getElementById('professions-container');
    const searchInput = document.getElementById('profession-search');
    
    // Load careers if not already loaded
    if (careers.length === 0) {
        loadCareers().then(loadedCareers => {
            careers = loadedCareers;
            displayProfessions(careers);
        });
    } else {
        displayProfessions(careers);
    }
    
    // Set up search functionality
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filtered = careers.filter(career => 
                career.title.toLowerCase().includes(searchTerm) ||
                career.traits.some(trait => trait.toLowerCase().includes(searchTerm)) ||
                career.description.toLowerCase().includes(searchTerm)
            );
            
            displayProfessions(filtered);
        });
    }
}

// Display professions in the professions section
function displayProfessions(professionsToDisplay) {
    const container = document.getElementById('professions-container');
    if (!container) return;
    
    // Get recommended profession
    const analysisResults = JSON.parse(localStorage.getItem('analysisResults') || '{}');
    const recommendedTitle = analysisResults.topProfession?.title;
    
    // Create profession cards
    const professionsHTML = professionsToDisplay.map(profession => {
        const isRecommended = profession.title === recommendedTitle;
        
        return `
            <div class="profession-card ${isRecommended ? 'recommended' : ''}">
                <div class="profession-header">
                    <h3 class="profession-title">${profession.title}</h3>
                    ${isRecommended ? '<span class="recommended-badge">Recommended</span>' : ''}
                </div>
                <p class="profession-description">${profession.description}</p>
                <div class="profession-traits">
                    ${profession.traits.map(trait => 
                        `<span class="trait-tag">${trait.charAt(0).toUpperCase() + trait.slice(1)}</span>`
                    ).join('')}
                </div>
            </div>
        `;
    }).join('');
    
    // Update container
    if (professionsToDisplay.length > 0) {
        container.innerHTML = professionsHTML;
    } else {
        container.innerHTML = '<p>No professions found matching your search.</p>';
    }
}