const playersContainer=document.getElementById("players-container")

const searchInput=document.getElementById("search-input")

const searchBtn=document.getElementById("search-btn")

const pagination=document.getElementById("pagination")

let currentPage=1;
const playersPerPage=10;

//fetching players data

async function fetchPlayers(page = 1) {
    const response = await fetch(`https://www.balldontlie.io/api/v1/players?page=${page}&per_page=${playersPerPage}`);
    const data = await response.json();
    return data;
}
//checking fun working or not
//  fetchPlayers()

//now display players on dom
function displayPlayers(players) {
    playersContainer.innerHTML = '';
    players.forEach(player => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <img src="https://www.pngkey.com/png/full/73-730477_first-name-profile-image-placeholder-png.png" alt="${player.first_name} ${player.last_name}">
            <h3>${player.first_name} ${player.last_name}</h3>
            <p>Position:${player.position}</p>
            <button class="team-details-btn" data-team-id="${player.team.id}">Team Details</button>
        `;
        playersContainer.appendChild(card);
    });
}

//display pagination
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
            fetchAndDisplayPlayers();
        });
        pagination.appendChild(pageLink);
    }
}

// Fetch and display players based on current page
async function fetchAndDisplayPlayers() {
    const data = await fetchPlayers(currentPage);
     const totalPages = 10;

    console.log(data)
    console.log(totalPages)
    displayPlayers(data.data);
    displayPagination(totalPages);
}

// Fetch and display players on initial load
fetchAndDisplayPlayers();

// Search functionality
searchBtn.addEventListener('click', () => {
    const playerName = searchInput.value.trim();
    if (playerName !== '') {
        searchPlayers(playerName);
    } else {
        fetchAndDisplayPlayers();
    }
});

// Search players by name
async function searchPlayers(name) {
    const response = await fetch(`https://www.balldontlie.io/api/v1/players?search=${name}`);
    const data = await response.json();
    displayPlayers(data.data);
}

// Team details button functionality
playersContainer.addEventListener('click', async (event) => {
    if (event.target.classList.contains('team-details-btn')) {
        const teamId = event.target.getAttribute('data-team-id');
        const response = await fetch(`https://www.balldontlie.io/api/v1/teams/${teamId}`);
        const teamData = await response.json();




       

        
        
      

         alert(`Team Name: ${teamData.full_name}\nAbbreviation: ${teamData.abbreviation}\nConference: ${teamData.conference}\nDivision: ${teamData.division}\nCity: ${teamData.city}`);
    }
});


