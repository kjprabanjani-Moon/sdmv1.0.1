const SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE';

fetch(SCRIPT_URL)
  .then(response => response.json())
  .then(data => {
    console.log(data);
    document.getElementById('output').innerText = data.message;
  })
  .catch(error => console.error('Error:', error));
