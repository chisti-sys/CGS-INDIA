const clientId = '4442eeb94b2b4e79be379530bdcaa4aa'; // Replace with your Spotify Client ID
const clientSecret = 'd90e49bc9cab44d8b05b73f301f3c44f'; // Replace with your Spotify Client Secret

let token;

// Default track details
const defaultTrack = {
  name: "Your Default Track Name",
  artist: "Default Artist",
  albumCover: "default_cover_url.jpg", // Replace with a valid image URL
  previewUrl: "default_preview_url.mp3" // Replace with a valid audio preview URL
};

document.addEventListener('DOMContentLoaded', () => {
  setDefaultTrack();
});

document.getElementById('search-button').addEventListener('click', async () => {
  const query = document.getElementById('search-input').value;
  if (!token) {
    await getAccessToken();
  }
  await searchTracks(query);
});

async function getAccessToken() {
  try {
    const result = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
      },
      body: 'grant_type=client_credentials'
    });
    const data = await result.json();
    token = data.access_token;
  } catch (error) {
    console.error('Error fetching access token:', error);
  }
}

async function searchTracks(query) {
  try {
    const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    displayTracks(data.tracks.items);
  } catch (error) {
    console.error('Error fetching tracks:', error);
  }
}

async function displayTracks(tracks) {
  const trackList = document.getElementById('track-list');
  trackList.innerHTML = '';

  tracks.forEach(track => {
    const trackItem = document.createElement('div');
    trackItem.classList.add('track-item', 'mb-2');

    const albumCoverUrl = track.album.images[0]?.url || 'default_cover.png';

    trackItem.innerHTML = `
      <img src="${albumCoverUrl}" alt="${track.name} cover" />
      <div class="track-info">
        <h5>${track.name}</h5>
        <p>${track.artists.map(artist => artist.name).join(', ')}</p>
      </div>
      <button class="btn btn-primary play-button" data-url="${track.preview_url}" data-name="${track.name}" data-artists="${track.artists.map(artist => artist.name).join(', ')}">
        Play Preview
      </button>
    `;
    
    trackList.appendChild(trackItem);
  });

  const playButtons = trackList.getElementsByClassName('play-button');
  Array.from(playButtons).forEach(button => {
    button.addEventListener('click', playTrack);
  });
}

function setDefaultTrack() {
  document.getElementById('track-title').textContent = defaultTrack.name;
  document.getElementById('artist-name').textContent = defaultTrack.artist;
  document.getElementById('album-cover').src = defaultTrack.albumCover;
  const audioPlayer = document.getElementById('audio-player');
  audioPlayer.src = defaultTrack.previewUrl;
  audioPlayer.play(); // Automatically play the default track
}

function playTrack(event) {
  const previewUrl = event.target.getAttribute('data-url');
  const trackName = event.target.getAttribute('data-name');
  const artists = event.target.getAttribute('data-artists');

  if (previewUrl) {
    document.getElementById('track-title').textContent = trackName;
    document.getElementById('artist-name').textContent = artists;
    const audioPlayer = document.getElementById('audio-player');
    audioPlayer.src = previewUrl;
    audioPlayer.play();
  } else {
    alert('No audio preview available for this track.');
  }
}
