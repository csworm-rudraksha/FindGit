document.addEventListener('DOMContentLoaded', function () {
  const userDetailsContainer = document.getElementById('userDetails');
  const profileTitle = document.getElementById('profileTitle');
  const usernameInput = document.getElementById('usernameInput');
  const searchButton = document.getElementById('searchButton');
  const loading = document.getElementById('loading');

  searchButton.addEventListener('click', fetchData);
  usernameInput.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
      fetchData();
    }
  });

  function fetchData() {
    const username = usernameInput.value.trim();

    if (username === '') {
      alert('Please enter a GitHub username');
      return;
    }

    loading.style.display = 'inline-block';

    fetch(`https://api.github.com/users/${username}`)
      .then(response => {
        loading.style.display = 'none';
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        return response.json();
      })
      .then(userData => {
        profileTitle.textContent = userData.name ? userData.name : userData.login;

        fetch(userData.repos_url)
          .then(response => response.json())
          .then(reposData => {
            const repositories = reposData.map(repo => `<div class="repository"><a href="${repo.html_url}" target="_blank">${repo.name}</a></div>`).join('');

            const userDetailsHTML = `
              <img src="${userData.avatar_url}" alt="User Avatar">
              <p><strong>Username:</strong> ${userData.login}</p>
              <p><strong>Name:</strong> ${userData.name || 'N/A'}</p>
              <p><strong>Location:</strong> ${userData.location || 'N/A'}</p>
              <p><strong>Public Repositories:</strong> ${userData.public_repos}</p>
              <p><strong>Followers:</strong> ${userData.followers}</p>
              <p><strong>Following:</strong> ${userData.following}</p>
              <div class="repositories">${repositories}</div>
            `;
            userDetailsContainer.innerHTML = userDetailsHTML;
            userDetailsContainer.classList.add('show');
          })
          .catch(error => {
            console.error(error);
            userDetailsContainer.innerHTML = '<p>Error fetching user data</p>';
          });
      })
      .catch(error => {
        console.error(error);
        userDetailsContainer.innerHTML = '<p>Error fetching user data</p>';
      });
  }
});
