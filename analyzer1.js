// analyzer.js - Personality analysis engine

class PersonalityAnalyzer {
    /**
     * Analyze the user's answers to determine their personality traits
     */
    static analyzeTraits(questions, userAnswers) {
        // Initialize trait counter
        const traitCounter = {};
        
        // Calculate trait scores
        Object.entries(userAnswers).forEach(([questionIndexStr, answerIndex]) => {
            const questionIndex = parseInt(questionIndexStr);
            const question = questions[questionIndex];
            
            if (question && typeof answerIndex === 'number' && answerIndex >= 0 && answerIndex < question.traits.length) {
                const selectedTrait = question.traits[answerIndex];
                
                // Increment trait counter
                if (selectedTrait) {
                    traitCounter[selectedTrait] = (traitCounter[selectedTrait] || 0) + 1;
                }
            }
        });
        
        // Sort traits by score
        const sortedTraits = Object.entries(traitCounter)
            .sort((a, b) => b[1] - a[1])
            .map(([trait]) => trait);
        
        // Get top 3-5 dominant traits
        const dominantTraits = sortedTraits.slice(0, Math.min(4, sortedTraits.length));
        
        // Generate a summary
        const traitSummary = this.generateTraitSummary(dominantTraits);
        
        return {
            traitScores: traitCounter,
            dominantTraits,
            traitSummary
        };
    }
    
    /**
     * Find matching professions based on trait analysis
     */
    static findMatchingProfessions(traitAnalysis, professions) {
        // Score each profession based on trait matches
        const scoredProfessions = professions.map(profession => {
            let score = 0;
            
            // For each trait in the profession
            profession.traits.forEach(trait => {
                // If this trait is in the user's dominant traits, add a higher score
                if (traitAnalysis.dominantTraits.includes(trait)) {
                    score += 3;
                } 
                // If this trait is in the user's traits but not dominant, add a smaller score
                else if (traitAnalysis.traitScores[trait]) {
                    score += 1;
                }
            });
            
            return { profession, score };
        });
        
        // Sort professions by score (highest first)
        const sortedProfessions = scoredProfessions
            .sort((a, b) => b.score - a.score)
            .map(({ profession }) => profession);
        
        return sortedProfessions;
    }
    
    /**
     * Generate a summary description based on the dominant traits
     */
    static generateTraitSummary(dominantTraits) {
        if (dominantTraits.length === 0) {
            return "Complete the personality test to get a trait analysis.";
        }
        
        const traitDescriptions = {
            creative: "You have a creative mind and enjoy expressing yourself through art or innovative ideas.",
            analytical: "You excel at logical thinking and problem-solving through careful analysis.",
            caring: "You are empathetic and enjoy helping others, making you great in supportive roles.",
            active: "You have high energy and enjoy physical activities or dynamic environments.",
            social: "You thrive in social settings and enjoy connecting with others.",
            observant: "You notice details that others might miss and are attentive to your surroundings.",
            teamwork: "You collaborate well with others and contribute effectively to group efforts.",
            intellectual: "You enjoy learning and engaging with complex concepts and ideas.",
            artistic: "You have a strong appreciation for aesthetics and creative expression.",
            logical: "You approach problems systematically and prefer objective reasoning.",
            athletic: "You have natural physical abilities and enjoy movement-based activities.",
            verbal: "You communicate effectively and enjoy expressing yourself through words.",
            innovative: "You think outside the box and come up with original solutions.",
            organized: "You value structure and appreciate systems that keep things orderly.",
            diplomatic: "You navigate conflicts well and can help find compromises.",
            cautious: "You carefully consider risks before acting and value preparation.",
            constructive: "You enjoy building and creating tangible results.",
            imaginative: "You have a vivid imagination and can envision new possibilities.",
            strategic: "You think ahead and plan for different scenarios.",
            expressive: "You communicate your feelings and ideas openly and effectively.",
            collaborative: "You work well with others and value cooperative approaches.",
            persistent: "You don't give up easily and work through challenges.",
            adaptive: "You're flexible and can adjust to changing circumstances.",
            reflective: "You think deeply about experiences and learn from them.",
            adventurous: "You seek new experiences and aren't afraid of the unknown.",
            powerful: "You have a strong presence and can be influential.",
            empathetic: "You understand others' feelings and show compassion.",
            knowledgeable: "You have a broad base of knowledge and enjoy learning more.",
            explorer: "You enjoy discovering new places, ideas, or approaches.",
            introspective: "You spend time in self-reflection and understand your inner motivations.",
            gregarious: "You're outgoing and enjoy being around people.",
            inventive: "You create new things and enjoy the process of innovation.",
            courageous: "You face challenges bravely and aren't deterred by difficulties.",
            clever: "You find smart solutions to problems through quick, creative thinking.",
            humorous: "You bring joy through your sense of humor and appreciation for fun.",
            visionary: "You can imagine future possibilities and inspire others with your ideas.",
            compassionate: "You deeply care about others' wellbeing and are moved to help.",
            "nature-loving": "You feel connected to the natural world and enjoy spending time outdoors."
        };
        
        // Create introduction
        let summary = "Based on your responses, you have a personality that features ";
        
        // Add trait descriptions
        if (dominantTraits.length === 1) {
            summary += `${traitDescriptions[dominantTraits[0]] || dominantTraits[0] + ' qualities'}`;
        } else {
            const lastTrait = dominantTraits.pop();
            
            dominantTraits.forEach((trait, index) => {
                summary += traitDescriptions[trait] || `${trait} qualities`;
                if (index < dominantTraits.length - 1) {
                    summary += ", ";
                }
            });
            
            summary += ` and ${traitDescriptions[lastTrait] || `${lastTrait} qualities`}.`;
        }
        
        // Add career guidance
        summary += " This combination of traits suggests you would thrive in professions that allow you to use these strengths regularly.";
        
        return summary;
    }
}

// Function to analyze test results
function analyzeResults(questions, userAnswers, careers) {
    // Analyze traits from answers
    const traitAnalysis = PersonalityAnalyzer.analyzeTraits(questions, userAnswers);
    
    // Find matching professions
    const recommendedProfessions = PersonalityAnalyzer.findMatchingProfessions(traitAnalysis, careers);
    
    // Get top profession recommendation
    const topProfession = recommendedProfessions.length > 0 ? recommendedProfessions[0] : null;
    
    // Save analysis results to localStorage
    const results = {
        traitScores: traitAnalysis.traitScores,
        dominantTraits: traitAnalysis.dominantTraits,
        traitSummary: traitAnalysis.traitSummary,
        recommendedProfessions: recommendedProfessions.slice(0, 3), // Top 3 professions
        topProfession
    };
    
    localStorage.setItem('analysisResults', JSON.stringify(results));
    
    return results;
}