const clientId = '4442eeb94b2b4e79be379530bdcaa4aa'; // Replace with your Spotify Client ID
const clientSecret = 'd90e49bc9cab44d8b05b73f301f3c44f'; // Replace with your Spotify Client Secret

let token;

document.getElementById('play-random').addEventListener('click', async () => {
    if (!token) {
        await getAccessToken();
    }
    await playRandomSong();
});

async function getAccessToken() {
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(`${clientId}:${clientSecret}`)
        },
        body: 'grant_type=client_credentials'
    });

    if (!response.ok) {
        throw new Error('Failed to fetch access token');
    }

    const data = await response.json();
    token = data.access_token;
}

async function playRandomSong() {
    const randomChar = String.fromCharCode(Math.floor(Math.random() * 26) + 97); // Random letter a-z

    const response = await fetch(`https://api.spotify.com/v1/search?q=${randomChar}&type=track&limit=1`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch random song');
    }

    const data = await response.json();
    const track = data.tracks.items[0];

    if (track) {
        document.getElementById('track-title').textContent = track.name;
        document.getElementById('artist-name').textContent = track.artists.map(artist => artist.name).join(', ');
        document.getElementById('album-cover').src = track.album.images[0].url;
        const audioPlayer = document.getElementById('audio-player');
        audioPlayer.src = track.preview_url; // Play the song preview
        audioPlayer.play();
    } else {
        alert('No track found! Try again.');
    }
}
