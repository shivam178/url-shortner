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
        const expirationInfo = getExpirationInfo(item.expirationDate);
        const row = `<tr>
                      <td title="${item.fullUrl}">${truncateURL(item.fullUrl, 50)}</td>
                      <td><a href="${item.shortUrl}" target="_blank">${item.shortUrl}</a></td>
                      <td>${expirationInfo.display}</td>
                      <td>${expirationInfo.isExpired ? 'Yes' : 'No'}</td>
                      <td>${item.clicks}</td>
                    </tr>`;
        urlListBody.innerHTML += row;
      });
    })
    .catch(error => console.error('Error fetching URL list:', error));
}

async function shortenUrl() {
  const urlInput = document.getElementById('shortenInput');
  const expirationInput = document.getElementById('expirationInput');
  const url = urlInput.value;
  const expiration = expirationInput.value;

  try {
    const response = await fetch('/generate-short-url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fullUrl: url, expiration: expiration }),
    });

    if (response.status === 409) {
      Toastify({
        text: "Duplicate record found",
        className: "error",
      }).showToast();
    } else if (response.status === 200) {
      fetchUrlList();
    } else {
      Toastify({
        text: "Unexpected error occurred",
        className: "error",
      }).showToast();
    }
  } catch (error) {
    Toastify({
      text: "Error occurred",
      className: "error",
    }).showToast();
    console.error('Error shortening URL:', error);
  }
}

function truncateURL(url, maxLength) {
  if (url.length > maxLength) {
    return url.substring(0, maxLength - 3) + '...';
  }
  return url;
}

function getExpirationInfo(expirationDate) {
  if (!expirationDate) {
    return { display: 'No Expiration', isExpired: false };
  }

  const expiration = new Date(expirationDate);
  const now = new Date();

  return {
    display: expiration.toLocaleString(), // Format the expiration date as needed
    isExpired: expiration < now,
  };
}
