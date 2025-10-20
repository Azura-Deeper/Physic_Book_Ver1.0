// Search functionality module
class SearchManager {
    constructor() {
        this.searchIndex = [];
        this.searchHistory = [];
        this.maxHistoryItems = 10;
        this.buildSearchIndex();
    }

    // Build search index from content
    buildSearchIndex() {
        const sections = document.querySelectorAll('.content-section');
        this.searchIndex = [];

        sections.forEach(section => {
            const sectionData = {
                id: section.id,
                title: section.querySelector('h2')?.textContent || '',
                content: this.extractTextContent(section),
                keywords: this.extractKeywords(section),
                type: 'section'
            };
            this.searchIndex.push(sectionData);

            // Index subsections
            const subsections = section.querySelectorAll('.subsection');
            subsections.forEach(subsection => {
                const subsectionTitle = subsection.querySelector('h3, h4')?.textContent || '';
                if (subsectionTitle) {
                    this.searchIndex.push({
                        id: subsection.id || section.id,
                        title: subsectionTitle,
                        content: this.extractTextContent(subsection),
                        keywords: this.extractKeywords(subsection),
                        type: 'subsection',
                        parent: sectionData.title
                    });
                }
            });
        });

        console.log(`🔍 Search index built with ${this.searchIndex.length} items`);
    }

    // Extract text content from element
    extractTextContent(element) {
        // Clone element to avoid modifying original
        const clone = element.cloneNode(true);
        
        // Remove script and style elements
        const scripts = clone.querySelectorAll('script, style');
        scripts.forEach(script => script.remove());
        
        // Get text content and clean it up
        let text = clone.textContent || '';
        text = text.replace(/\s+/g, ' ').trim();
        
        return text;
    }

    // Extract keywords from element
    extractKeywords(element) {
        const keywords = new Set();
        
        // Add text from headings
        const headings = element.querySelectorAll('h1, h2, h3, h4, h5, h6');
        headings.forEach(heading => {
            const words = this.tokenizeText(heading.textContent);
            words.forEach(word => keywords.add(word));
        });
        
        // Add text from strong/em elements
        const emphasized = element.querySelectorAll('strong, em, b, i');
        emphasized.forEach(em => {
            const words = this.tokenizeText(em.textContent);
            words.forEach(word => keywords.add(word));
        });
        
        // Add physics-specific terms
        const physicsTerms = this.extractPhysicsTerms(element.textContent);
        physicsTerms.forEach(term => keywords.add(term));
        
        return Array.from(keywords);
    }

    // Extract physics-specific terms
    extractPhysicsTerms(text) {
        const physicsKeywords = [
            'dao động', 'điều hòa', 'biên độ', 'chu kì', 'tần số', 'pha',
            'lò xo', 'con lắc', 'khối lượng', 'độ cứng', 'li độ',
            'vận tốc', 'gia tốc', 'lực', 'năng lượng', 'cơ năng',
            'tắt dần', 'cưỡng bức', 'cộng hưởng', 'ma sát',
            'newton', 'hertz', 'radian', 'joule', 'watt'
        ];
        
        const foundTerms = [];
        const lowerText = text.toLowerCase();
        
        physicsKeywords.forEach(keyword => {
            if (lowerText.includes(keyword)) {
                foundTerms.push(keyword);
            }
        });
        
        return foundTerms;
    }

    // Tokenize text into words
    tokenizeText(text) {
        return text.toLowerCase()
            .replace(/[^\w\sàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/g, ' ')
            .split(/\s+/)
            .filter(word => word.length > 2);
    }

    // Perform search
    search(query, options = {}) {
        const {
            limit = 10,
            threshold = 0.3,
            includeContent = true
        } = options;

        if (!query || query.length < 2) {
            return [];
        }

        const normalizedQuery = query.toLowerCase().trim();
        const queryWords = this.tokenizeText(normalizedQuery);
        
        const results = this.searchIndex.map(item => {
            const score = this.calculateRelevanceScore(item, normalizedQuery, queryWords);
            return { ...item, score };
        })
        .filter(item => item.score > threshold)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);

        // Add to search history
        this.addToHistory(query);

        return results;
    }

    // Calculate relevance score
    calculateRelevanceScore(item, query, queryWords) {
        let score = 0;
        const titleLower = item.title.toLowerCase();
        const contentLower = item.content.toLowerCase();
        const keywords = item.keywords.map(k => k.toLowerCase());

        // Exact phrase match in title (highest weight)
        if (titleLower.includes(query)) {
            score += 10;
        }

        // Exact phrase match in content
        if (contentLower.includes(query)) {
            score += 5;
        }

        // Individual word matches in title
        queryWords.forEach(word => {
            if (titleLower.includes(word)) {
                score += 3;
            }
        });

        // Individual word matches in content
        queryWords.forEach(word => {
            if (contentLower.includes(word)) {
                score += 1;
            }
        });

        // Keyword matches
        queryWords.forEach(word => {
            if (keywords.includes(word)) {
                score += 2;
            }
        });

        // Fuzzy matching for physics terms
        const fuzzyMatches = this.findFuzzyMatches(query, keywords);
        score += fuzzyMatches * 1.5;

        // Boost score for certain section types
        if (item.type === 'section') {
            score *= 1.2;
        }

        return score;
    }

    // Find fuzzy matches
    findFuzzyMatches(query, keywords) {
        let matches = 0;
        const queryLower = query.toLowerCase();

        keywords.forEach(keyword => {
            const similarity = this.calculateSimilarity(queryLower, keyword);
            if (similarity > 0.7) {
                matches++;
            }
        });

        return matches;
    }

    // Calculate string similarity (simple Jaccard similarity)
    calculateSimilarity(str1, str2) {
        const set1 = new Set(str1.split(''));
        const set2 = new Set(str2.split(''));
        const intersection = new Set([...set1].filter(x => set2.has(x)));
        const union = new Set([...set1, ...set2]);
        
        return intersection.size / union.size;
    }

    // Add to search history
    addToHistory(query) {
        const trimmedQuery = query.trim();
        if (!trimmedQuery || this.searchHistory.includes(trimmedQuery)) {
            return;
        }

        this.searchHistory.unshift(trimmedQuery);
        if (this.searchHistory.length > this.maxHistoryItems) {
            this.searchHistory.pop();
        }

        // Save to localStorage
        try {
            localStorage.setItem('physics-search-history', JSON.stringify(this.searchHistory));
        } catch (e) {
            console.warn('Could not save search history to localStorage');
        }
    }

    // Load search history
    loadHistory() {
        try {
            const saved = localStorage.getItem('physics-search-history');
            if (saved) {
                this.searchHistory = JSON.parse(saved);
            }
        } catch (e) {
            console.warn('Could not load search history from localStorage');
            this.searchHistory = [];
        }
    }

    // Get search suggestions
    getSuggestions(query, limit = 5) {
        const suggestions = [];
        const queryLower = query.toLowerCase();

        // Add from search history
        this.searchHistory.forEach(item => {
            if (item.toLowerCase().includes(queryLower) && suggestions.length < limit) {
                suggestions.push({
                    text: item,
                    type: 'history'
                });
            }
        });

        // Add physics terms
        const physicsTerms = [
            'dao động điều hòa',
            'con lắc lò xo',
            'con lắc đơn',
            'biên độ dao động',
            'chu kì dao động',
            'tần số dao động',
            'dao động tắt dần',
            'dao động cưỡng bức',
            'hiện tượng cộng hưởng',
            'phương trình dao động',
            'năng lượng dao động'
        ];

        physicsTerms.forEach(term => {
            if (term.includes(queryLower) && suggestions.length < limit) {
                const existing = suggestions.find(s => s.text === term);
                if (!existing) {
                    suggestions.push({
                        text: term,
                        type: 'suggestion'
                    });
                }
            }
        });

        return suggestions;
    }

    // Clear search history
    clearHistory() {
        this.searchHistory = [];
        try {
            localStorage.removeItem('physics-search-history');
        } catch (e) {
            console.warn('Could not clear search history from localStorage');
        }
    }
}

// Advanced search UI
class SearchUI {
    constructor(searchManager) {
        this.searchManager = searchManager;
        this.currentQuery = '';
        this.selectedIndex = -1;
        this.initUI();
    }

    initUI() {
        this.createSuggestionBox();
        this.setupAdvancedSearch();
    }

    createSuggestionBox() {
        const searchContainer = document.querySelector('.search-container');
        if (!searchContainer) return;

        const suggestionBox = document.createElement('div');
        suggestionBox.className = 'search-suggestions';
        suggestionBox.innerHTML = `
            <div class="suggestions-list"></div>
        `;
        
        searchContainer.appendChild(suggestionBox);
        this.suggestionBox = suggestionBox;
    }

    setupAdvancedSearch() {
        const searchInput = document.getElementById('search-input');
        if (!searchInput) return;

        // Show suggestions on focus
        searchInput.addEventListener('focus', () => {
            this.showSuggestions();
        });

        // Hide suggestions on blur (with delay for click handling)
        searchInput.addEventListener('blur', () => {
            setTimeout(() => this.hideSuggestions(), 200);
        });

        // Handle keyboard navigation
        searchInput.addEventListener('keydown', (e) => {
            this.handleKeyNavigation(e);
        });

        // Update suggestions on input
        searchInput.addEventListener('input', (e) => {
            this.currentQuery = e.target.value;
            this.updateSuggestions();
        });
    }

    showSuggestions() {
        if (this.suggestionBox) {
            this.suggestionBox.style.display = 'block';
            this.updateSuggestions();
        }
    }

    hideSuggestions() {
        if (this.suggestionBox) {
            this.suggestionBox.style.display = 'none';
        }
    }

    updateSuggestions() {
        if (!this.suggestionBox) return;

        const suggestions = this.searchManager.getSuggestions(this.currentQuery);
        const listContainer = this.suggestionBox.querySelector('.suggestions-list');
        
        if (suggestions.length === 0) {
            this.hideSuggestions();
            return;
        }

        const suggestionsHTML = suggestions.map((suggestion, index) => `
            <div class="suggestion-item ${index === this.selectedIndex ? 'selected' : ''}" 
                 data-index="${index}" data-text="${suggestion.text}">
                <i class="fas ${suggestion.type === 'history' ? 'fa-history' : 'fa-lightbulb'}"></i>
                ${this.highlightQuery(suggestion.text, this.currentQuery)}
            </div>
        `).join('');

        listContainer.innerHTML = suggestionsHTML;

        // Add click handlers
        listContainer.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', () => {
                const text = item.getAttribute('data-text');
                this.selectSuggestion(text);
            });
        });

        this.showSuggestions();
    }

    highlightQuery(text, query) {
        if (!query) return text;
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<strong>$1</strong>');
    }

    handleKeyNavigation(e) {
        const suggestions = this.suggestionBox?.querySelectorAll('.suggestion-item') || [];
        
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                this.selectedIndex = Math.min(this.selectedIndex + 1, suggestions.length - 1);
                this.updateSelectedSuggestion();
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                this.selectedIndex = Math.max(this.selectedIndex - 1, -1);
                this.updateSelectedSuggestion();
                break;
                
            case 'Enter':
                e.preventDefault();
                if (this.selectedIndex >= 0 && suggestions[this.selectedIndex]) {
                    const text = suggestions[this.selectedIndex].getAttribute('data-text');
                    this.selectSuggestion(text);
                } else {
                    this.performSearch(this.currentQuery);
                }
                break;
                
            case 'Escape':
                this.hideSuggestions();
                this.selectedIndex = -1;
                break;
        }
    }

    updateSelectedSuggestion() {
        const suggestions = this.suggestionBox?.querySelectorAll('.suggestion-item') || [];
        suggestions.forEach((item, index) => {
            item.classList.toggle('selected', index === this.selectedIndex);
        });
    }

    selectSuggestion(text) {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.value = text;
            this.currentQuery = text;
        }
        this.hideSuggestions();
        this.performSearch(text);
    }

    performSearch(query) {
        const results = this.searchManager.search(query);
        this.displayResults(results);
    }

    displayResults(results) {
        const searchResults = document.getElementById('search-results');
        if (!searchResults) return;

        if (results.length === 0) {
            searchResults.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <p>Không tìm thấy kết quả nào cho "${this.currentQuery}"</p>
                    <div class="search-tips">
                        <h4>Gợi ý tìm kiếm:</h4>
                        <ul>
                            <li>Kiểm tra chính tả</li>
                            <li>Sử dụng từ khóa đơn giản hơn</li>
                            <li>Thử tìm các thuật ngữ vật lý</li>
                        </ul>
                    </div>
                </div>
            `;
            return;
        }

        const resultsHTML = results.map(result => `
            <div class="search-result" data-section="${result.id}">
                <div class="result-header">
                    <h4>${result.title}</h4>
                    <span class="result-type">${result.type === 'section' ? 'Chương' : 'Mục'}</span>
                </div>
                <p class="result-content">${this.truncateContent(result.content, 150)}</p>
                <div class="result-meta">
                    <span class="result-score">Độ phù hợp: ${Math.round(result.score * 10)}%</span>
                    ${result.parent ? `<span class="result-parent">Thuộc: ${result.parent}</span>` : ''}
                </div>
            </div>
        `).join('');

        searchResults.innerHTML = resultsHTML;

        // Add click handlers
        searchResults.querySelectorAll('.search-result').forEach(result => {
            result.addEventListener('click', () => {
                const sectionId = result.getAttribute('data-section');
                this.navigateToResult(sectionId);
            });
        });
    }

    truncateContent(content, maxLength) {
        if (content.length <= maxLength) return content;
        return content.substring(0, maxLength) + '...';
    }

    navigateToResult(sectionId) {
        // Close search panel
        const searchPanel = document.getElementById('search-panel');
        if (searchPanel) {
            searchPanel.classList.add('hidden');
        }
        
        // Navigate to section
        if (typeof navigateToSection === 'function') {
            navigateToSection(sectionId);
        }
    }
}

// Initialize search functionality
document.addEventListener('DOMContentLoaded', function() {
    const searchManager = new SearchManager();
    const searchUI = new SearchUI(searchManager);
    
    // Load search history
    searchManager.loadHistory();
    
    // Make search manager globally available
    window.searchManager = searchManager;
    window.searchUI = searchUI;
});

// Add CSS for search suggestions
const searchCSS = `
.search-suggestions {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--surface-color);
    border: 1px solid var(--border-color);
    border-top: none;
    border-radius: 0 0 var(--border-radius) var(--border-radius);
    box-shadow: var(--shadow-medium);
    max-height: 300px;
    overflow-y: auto;
    z-index: 1000;
    display: none;
}

.suggestions-list {
    padding: var(--spacing-sm) 0;
}

.suggestion-item {
    padding: var(--spacing-sm) var(--spacing-md);
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    transition: background-color var(--transition-fast);
}

.suggestion-item:hover,
.suggestion-item.selected {
    background: rgba(37, 99, 235, 0.1);
}

.suggestion-item i {
    color: var(--text-secondary);
    width: 16px;
}

.search-container {
    position: relative;
}

.no-results {
    text-align: center;
    padding: var(--spacing-xl);
    color: var(--text-secondary);
}

.no-results i {
    font-size: 3rem;
    margin-bottom: var(--spacing-lg);
    opacity: 0.5;
}

.search-tips {
    margin-top: var(--spacing-lg);
    text-align: left;
    max-width: 300px;
    margin-left: auto;
    margin-right: auto;
}

.search-tips ul {
    list-style: none;
    padding: 0;
}

.search-tips li {
    padding: var(--spacing-xs) 0;
    position: relative;
    padding-left: var(--spacing-lg);
}

.search-tips li::before {
    content: "→";
    position: absolute;
    left: 0;
    color: var(--primary-color);
}

.result-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-sm);
}

.result-type {
    background: var(--primary-color);
    color: white;
    padding: var(--spacing-xs) var(--spacing-sm);
    border-radius: var(--border-radius);
    font-size: var(--font-size-xs);
}

.result-content {
    color: var(--text-secondary);
    margin-bottom: var(--spacing-sm);
    line-height: 1.5;
}

.result-meta {
    display: flex;
    justify-content: space-between;
    font-size: var(--font-size-sm);
    color: var(--text-secondary);
}

.result-score {
    color: var(--accent-color);
    font-weight: 500;
}
`;

// Inject CSS
const style = document.createElement('style');
style.textContent = searchCSS;
document.head.appendChild(style);