// search.js - Profession search functionality with API integration

async function searchProfession(query) {
    try {
        const response = await fetch('/api/profession-info', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ profession: query })
        });

        if (!response.ok) {
            throw new Error('Failed to fetch profession info');
        }

        return await response.json();
    } catch (error) {
        console.error('Error searching profession:', error);
        // Fallback to local data if API fails
        return searchLocalProfession(query);
    }
}

function searchLocalProfession(query) {
    // Implement local search logic if needed
    return {
        title: query,
        description: "Detailed information about " + query,
        skills: ["Skill 1", "Skill 2", "Skill 3"],
        education: "Bachelor's degree or equivalent",
        salary: "$50,000 - $100,000",
        outlook: "Positive growth expected"
    };
}

function displayProfessionResult(data) {
    const resultContainer = document.getElementById('profession-result');
    
    resultContainer.innerHTML = `
        <div class="profession-result-card">
            <h3>${data.title}</h3>
            <div class="profession-section">
                <h4>Description</h4>
                <p>${data.description}</p>
            </div>
            <div class="profession-section">
                <h4>Key Skills</h4>
                <ul>
                    ${data.skills.map(skill => `<li>${skill}</li>`).join('')}
                </ul>
            </div>
            <div class="profession-section">
                <h4>Education Requirements</h4>
                <p>${data.education}</p>
            </div>
            <div class="profession-section">
                <h4>Salary Range</h4>
                <p>${data.salary}</p>
            </div>
            <div class="profession-section">
                <h4>Job Outlook</h4>
                <p>${data.outlook}</p>
            </div>
        </div>
    `;
}

// Initialize the profession search on DOM load
document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.getElementById('search-profession-btn');
    const searchInput = document.getElementById('profession-search');
    
    if (searchButton && searchInput) {
        // Search button click event
        searchButton.addEventListener('click', async function() {
            const query = searchInput.value.trim();
            if (query) {
                const results = await searchProfession(query);
                displayProfessionResult(results);
            } else {
                alert('Please enter a profession to search');
            }
        });
        
        // Enter key in search input
        searchInput.addEventListener('keypress', async function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const query = searchInput.value.trim();
                if (query) {
                    const results = await searchProfession(query);
                    displayProfessionResult(results);
                } else {
                    alert('Please enter a profession to search');
                }
            }
        });
    }
});