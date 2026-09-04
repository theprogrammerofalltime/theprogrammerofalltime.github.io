/* Last.fm now playing / last played for lynx@web */
(function () {
  'use strict';

  var LASTFM_USER = 'TheSerufu';
  var LASTFM_API_KEY = 'a86e143bf8a7401689bf158a9e069064';
  var POLL_MS = 45000;

  var el = document.getElementById('spotify-widget');
  if (!el) return;

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function pickImage(images) {
    if (!images || !images.length) return '';
    // Last.fm returns size: small, medium, large, extralarge
    var order = ['extralarge', 'large', 'medium', 'small'];
    for (var i = 0; i < order.length; i++) {
      for (var j = 0; j < images.length; j++) {
        if (images[j].size === order[i] && images[j]['#text']) {
          return images[j]['#text'];
        }
      }
    }
    return images[images.length - 1]['#text'] || '';
  }

  function render(track) {
    if (!track) {
      el.innerHTML = '<p class="music-placeholder">No recent scrobbles yet. Play something on Spotify (connected to Last.fm).</p>';
      return;
    }

    var artist = track.artist && (track.artist['#text'] || track.artist.name) || 'Unknown artist';
    var name = track.name || 'Unknown track';
    var album = track.album && track.album['#text'] || '';
    var url = track.url || ('https://www.last.fm/user/' + encodeURIComponent(LASTFM_USER));
    var img = pickImage(track.image);
    var now = track['@attr'] && track['@attr'].nowplaying === 'true';
    var status = now ? 'now playing' : 'last played';

    el.innerHTML =
      '<div class="lfm-card">' +
        (img
          ? '<img class="lfm-art" src="' + esc(img) + '" alt="" loading="lazy" width="72" height="72">'
          : '<div class="lfm-art lfm-art-empty" aria-hidden="true"></div>') +
        '<div class="lfm-meta">' +
          '<span class="tag lfm-status">' + esc(status) + '</span>' +
          '<a class="lfm-title" href="' + esc(url) + '" target="_blank" rel="noopener">' + esc(name) + '</a>' +
          '<div class="lfm-artist">' + esc(artist) + '</div>' +
          (album ? '<div class="lfm-album">' + esc(album) + '</div>' : '') +
        '</div>' +
      '</div>';
  }

  function fetchTrack() {
    var url =
      'https://ws.audioscrobbler.com/2.0/?method=user.getRecentTracks' +
      '&user=' + encodeURIComponent(LASTFM_USER) +
      '&api_key=' + encodeURIComponent(LASTFM_API_KEY) +
      '&limit=1&format=json';

    return fetch(url)
      .then(function (res) {
        if (!res.ok) throw new Error('Last.fm HTTP ' + res.status);
        return res.json();
      })
      .then(function (data) {
        if (data.error) throw new Error(data.message || ('Last.fm error ' + data.error));
        var tracks = data.recenttracks && data.recenttracks.track;
        if (!tracks) {
          render(null);
          return;
        }
        // API may return a single object or an array
        var track = Array.isArray(tracks) ? tracks[0] : tracks;
        render(track);
      })
      .catch(function (err) {
        el.innerHTML =
          '<p class="music-placeholder">Could not load Last.fm: ' +
          esc(err && err.message ? err.message : String(err)) +
          '</p>';
      });
  }

  el.innerHTML = '<p class="music-placeholder">Loading Last.fm…</p>';
  fetchTrack();
  setInterval(fetchTrack, POLL_MS);
})();
