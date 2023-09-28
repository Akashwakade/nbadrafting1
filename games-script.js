const gamesContainer = document.getElementById('games-container');
const startDateInput = document.getElementById('start-date');
const endDateInput = document.getElementById('end-date');
const seasonSelect = document.getElementById('season');
const filterBtn = document.getElementById('filter-btn');
const pagination = document.getElementById('pagination');

let currentPage = 1;
const gamesPerPage = 10;

// Fetch games data from API
async function fetchGames(page = 1) {
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;
    const season = seasonSelect.value;
    
    let url = `https://www.balldontlie.io/api/v1/games?page=${page}&per_page=${gamesPerPage}`;
    if (startDate && endDate) {
        url += `&start_date=${startDate}&end_date=${endDate}`;
    }
    if (season) {
        url += `&seasons[]=${season}`;
    }
    
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

// Display games on the page
function displayGames(games) {
    gamesContainer.innerHTML = '';
    games.forEach(game => {
        const card = document.createElement('div');
        card.classList.add('game-card');
        const homeTeamScore = game.home_team_score || 0;
        const visitorTeamScore = game.visitor_team_score || 0;
        let resultText = 'TIE';
        if (homeTeamScore > visitorTeamScore) {
            resultText = 'WON';
        } else if (homeTeamScore < visitorTeamScore) {
            resultText = 'LOST';
        }
        card.innerHTML = `
            <h3>${game.date} - Season ${game.season}</h3>
            <p>${game.home_team.full_name} ${resultText}</p>
            <p>${game.visitor_team.full_name} ${resultText}</p>
            <p>Home Team Score: ${homeTeamScore}</p>
            <p>Visitor Team Score: ${visitorTeamScore}</p>
        `;
        gamesContainer.appendChild(card);
    });
}

// Display pagination
function displayPagination(totalPages) {
    pagination.innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        const pageLink = document.createElement('button');
        pageLink.classList.add('page-link');
        pageLink.textContent = i;
        if (i === currentPage) {
            pageLink.classList.add('active');
        }
        pageLink.addEventListener('click', () => {
            currentPage = i;
            fetchAndDisplayGames();
        });
        pagination.appendChild(pageLink);
    }
}

// Fetch and display games based on current page and filters
async function fetchAndDisplayGames() {
    const data = await fetchGames(currentPage);
    const totalPages = 10
    displayGames(data.data);
    displayPagination(totalPages);
}

// Fetch and display games on initial load
fetchAndDisplayGames();

// Filter button functionality
filterBtn.addEventListener('click', () => {
    currentPage = 1;
    fetchAndDisplayGames();
});
