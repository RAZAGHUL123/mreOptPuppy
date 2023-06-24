const BASE_URL = "https://fsa-puppy-bowl.herokuapp.com";
const COHORT_NAME = "2302-acc-pt-web-pt-e";

class PuppyBowlApp {
  constructor() {
    this.playerContainer = document.getElementById('all-players-container');
    this.randomPlayerButton = document.getElementById('random-player-button');
    this.addPlayerForm = document.getElementById('add-player-form');
    this.removePlayerButton = document.getElementById('remove-player-button');
    this.viewRosterButton = document.getElementById('view-roster-button');
    this.filterButton = document.getElementById('filter-button');
    this.statusFilter = document.getElementById('status-filter');

    this.APIURL = `${BASE_URL}/api/${COHORT_NAME}/players`;

    this.init();
  }

  init() {
    this.randomPlayerButton.addEventListener('click', this.getRandomPlayer.bind(this));
    this.addPlayerForm.addEventListener('submit', this.addPlayer.bind(this));
    this.removePlayerButton.addEventListener('click', this.handleRemovePlayer.bind(this));
    this.viewRosterButton.addEventListener('click', this.viewRoster.bind(this));
    this.filterButton.addEventListener('click', this.viewRoster.bind(this));

    // Make the initial API call
    fetch(this.APIURL)
      .then(response => response.json())
      .then(data => {
        // Handle the response
        if (data.success) {
          // Process the data if the response is successful
          console.log(data.data);
        } else {
          // Handle the error if the response is unsuccessful
          const errorResponse = {
            success: false,
            error: {
              name: "ErrorName",
              message: "This is an error message."
            },
            data: null
          };
          console.log(errorResponse);
        }
      })
      .catch(error => {
        // Handle any network or other errors
        console.error(error);
      });
  }

  displayError(message) {
    const errorContainer = document.getElementById('error-container');
    errorContainer.textContent = message;
  }

  getRandomPlayer() {
    fetch(this.APIURL)
      .then(response => response.json())
      .then(({ success, error, data: { players } }) => {
        if (!success) {
          throw new Error(error?.message || 'Failed to fetch random player.');
        }

        if (players.length === 0) {
          throw new Error('No players available.');
        }

        const randomIndex = Math.floor(Math.random() * players.length);
        const randomPlayer = players[randomIndex];

        this.playerContainer.innerHTML = '';

        const playerWrapper = document.createElement('div');
        playerWrapper.classList.add('player-wrapper');

        const playerImage = document.createElement('img');
        playerImage.src = randomPlayer.imageUrl;
        playerImage.alt = randomPlayer.name;
        playerImage.classList.add('player-image');

        const playerName = document.createElement('p');
        playerName.textContent = `Name: ${randomPlayer.name}`;
        playerName.classList.add('player-detail', 'neon-green');

        const playerBreed = document.createElement('p');
        playerBreed.textContent = `Breed: ${randomPlayer.breed}`;
        playerBreed.classList.add('player-detail', 'neon-green');

        const playerStatus = document.createElement('p');
        playerStatus.textContent = `Status: ${randomPlayer.status}`;
        playerStatus.classList.add('player-detail', 'neon-green');

        const playerId = document.createElement('p');
        playerId.textContent = `ID: ${randomPlayer.id}`;
        playerId.classList.add('player-detail', 'neon-green');

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete Player';
        deleteButton.classList.add('delete-button');
        deleteButton.addEventListener('click', () => {
          this.removePlayer(randomPlayer.id);
        });

        playerWrapper.appendChild(playerImage);
        playerWrapper.appendChild(playerName);
        playerWrapper.appendChild(playerBreed);
        playerWrapper.appendChild(playerStatus);
        playerWrapper.appendChild(playerId);
        playerWrapper.appendChild(deleteButton);

        this.playerContainer.appendChild(playerWrapper);
      })
      .catch(error => {
        this.displayError(error.message);
        console.error(error);
      });
  }

  viewRoster() {
    fetch(this.APIURL)
      .then(response => response.json())
      .then(({ success, error, data: { players } }) => {
        if (!success) {
          throw new Error(error?.message || 'Failed to fetch roster.');
        }

        if (players.length === 0) {
          throw new Error('No players available.');
        }

        this.playerContainer.innerHTML = '';

        const rosterGrid = document.createElement('div');
        rosterGrid.classList.add('roster-grid');

        players.forEach(player => {
          const playerElement = document.createElement('div');
          playerElement.classList.add('player');

          const playerName = document.createElement('p');
          playerName.textContent = `Name: ${player.name}`;
          const playerBreed = document.createElement('p');
          playerBreed.textContent = `Breed: ${player.breed}`;
          const playerStatus = document.createElement('p');
          playerStatus.textContent = `Status: ${player.status}`;
          const playerId = document.createElement('p');
          playerId.textContent = `ID: ${player.id}`;

          const playerImage = document.createElement('img');
          playerImage.src = player.imageUrl;
          playerImage.alt = player.name;
          playerImage.classList.add('player-image');

          playerElement.appendChild(playerName);
          playerElement.appendChild(playerBreed);
          playerElement.appendChild(playerStatus);
          playerElement.appendChild(playerId);
          playerElement.appendChild(playerImage);

          rosterGrid.appendChild(playerElement);

          // Add a horizontal line between player elements
          const horizontalLine = document.createElement('hr');
          rosterGrid.appendChild(horizontalLine);
        });

        this.playerContainer.appendChild(rosterGrid);
      })
      .catch(error => {
        this.displayError(error.message);
        console.error(error);
      });
  }

  async removePlayer(playerId) {
    try {
      const response = await fetch(`${this.APIURL}/${playerId}`, {
        method: 'DELETE'
      });
      const result = await response.json();
      const { success, error } = result;

      if (!success) {
        throw new Error(error?.message || 'Failed to remove player.');
      }

      console.log('Player successfully deleted.');

      // Fetch a new random player to display
      this.getRandomPlayer();
    } catch (error) {
      this.displayError(error.message);
      console.error(error);
    }
  }

  addPlayer(event) {
    event.preventDefault();

    const nameInput = document.getElementById('name-input');
    const breedInput = document.getElementById('breed-input');
    const statusSelect = document.getElementById('status-select');
    const imageUrlInput = document.getElementById('image-url-input');

    const newPlayer = {
      name: nameInput.value.trim(),
      breed: breedInput.value.trim(),
      status: statusSelect.value,
      imageUrl: imageUrlInput.value.trim(),
      teamId: 520 // Set the desired teamId value here
    };

    fetch(this.APIURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newPlayer)
    })
      .then(response => response.json())
      .then(({ success, error, data: { newPlayer } }) => {
        if (!success) {
          throw new Error(error?.message || 'Failed to add player.');
        }

        const playerName = document.createElement('p');
        playerName.textContent = `Name: ${newPlayer.name}`;
        const playerBreed = document.createElement('p');
        playerBreed.textContent = `Breed: ${newPlayer.breed}`;
        const playerStatus = document.createElement('p');
        playerStatus.textContent = `Status: ${newPlayer.status}`;
        const playerId = document.createElement('p');
        playerId.textContent = `ID: ${newPlayer.id}`;
        playerId.style.color = 'gold';
        const playerImage = document.createElement('img');
        playerImage.src = newPlayer.imageUrl;
        playerImage.alt = newPlayer.name;

        this.playerContainer.innerHTML = '';
        this.playerContainer.appendChild(playerName);
        this.playerContainer.appendChild(playerBreed);
        this.playerContainer.appendChild(playerStatus);
        this.playerContainer.appendChild(playerId);
        this.playerContainer.appendChild(playerImage);

        nameInput.value = '';
        breedInput.value = '';
        statusSelect.value = 'bench';
        imageUrlInput.value = '';
      })
      .catch(error => {
        this.displayError(error.message);
        console.error(error);
      });
  }

  handleRemovePlayer() {
    const userInput = prompt('Enter the ID of the player you want to remove:');
    if (userInput) {
      this.removePlayer(userInput);
    }
  }
}

// Initialize the app
new PuppyBowlApp();
