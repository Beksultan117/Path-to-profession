// professionApi.js - API integration for profession search

// Function to search for profession information
async function searchProfession(query) {
    if (!query || query.trim() === '') {
        return { error: 'Please enter a profession name to search' };
    }

    try {
        // Show loading state
        const professionContainer = document.getElementById('profession-result');
        professionContainer.innerHTML = '<div class="loading-spinner"></div>';
        
        // Get profession information using the server API
        const response = await fetch('/api/profession-info', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ profession: query }),
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch profession information');
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error searching for profession:', error);
        return { 
            error: 'An error occurred while searching for profession information'
        };
    }
}

// Function to display profession search results
function displayProfessionResult(result) {
    const professionContainer = document.getElementById('profession-result');
    
    if (result.error) {
        professionContainer.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <p>${result.error}</p>
            </div>
        `;
        return;
    }
    
    // Display the profession information in a card
    professionContainer.innerHTML = `
        <div class="profession-result-card">
            <h3>${result.title}</h3>
            
            <div class="profession-section">
                <h4>Description</h4>
                <p>${result.description}</p>
            </div>
            
            <div class="profession-section">
                <h4>Required Skills</h4>
                <ul>
                    ${result.skills.map(skill => `<li>${skill}</li>`).join('')}
                </ul>
            </div>
            
            <div class="profession-section">
                <h4>Education Requirements</h4>
                <p>${result.education}</p>
            </div>
            
            <div class="profession-section">
                <h4>Salary Range</h4>
                <p>${result.salary}</p>
            </div>
            
            <div class="profession-section">
                <h4>Job Outlook</h4>
                <p>${result.outlook}</p>
            </div>
        </div>
    `;
}