// script.js

document.addEventListener('DOMContentLoaded', function () {
  fetchUrlList();

  document.getElementById('shortenButton').addEventListener('click', function () {
    shortenUrl();
  });
});

function fetchUrlList() {
  fetch('/list')
    .then(response => response.json())
    .then(data => {
      const urlListBody = document.getElementById('urlListBody');
      urlListBody.innerHTML = '';
      data.forEach(item => {
        const row = `<tr>
                      <td title="${item.fullUrl}">${truncateURL(item.fullUrl, 50)}</td>
                      <td><a href="${item.shortUrl}" target="_blank" onclick="refreshPage()">${item.shortUrl}</a></td>
                      <td>${item.clicks}</td>
                    </tr>`;
        urlListBody.innerHTML += row;
      });
    })
    .catch(error => console.error('Error fetching URL list:', error));
}

function shortenUrl() {
  const urlInput = document.getElementById('shortenInput');
  const url = urlInput.value;

  fetch('/generate-short-url', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fullUrl: url }),
  })
    .then(response => response.json())
    .then(data => {
      console.log('Shortened URL:', data.shortUrl);
      fetchUrlList();
      if (data.shortUrl) {
        location.reload();
      }
    })
    .catch(error => console.error('Error shortening URL:', error));
}

function truncateURL(url, maxLength) {
  if (url.length > maxLength) {
    return url.substring(0, maxLength - 3) + '...';
  }
  return url;
}

function refreshPage() {
  location.reload();
}
