document.addEventListener('DOMContentLoaded', async function() {
    // Get the student data from the server
    const res = await fetch('/api/current_user');
    const data = await res.json();
    if (data.user) {
        const user = data.user;
        console.log(user);
        let foundSession = false;
        /*
        for (const session of user.sessions) {
            if (session.status === 'pending') {
                foundSession = true;
                const sessionElement = document.createElement('div');
                const title = document.createElement('h3');
                title.textContent = "Pending";
                sessionElement.appendChild(title);
                sessionElement.classList.add('session');
                sessionElement.innerHTML = `
                    <h3>${session.course.title}</h3>
                    <p>${session.start} - ${session.end}</p>
                    <p>${session.location}</p>
                `;

            } if (session.status === 'in progress') {
                foundSession = true;
                const sessionElement = document.createElement('div');
                const title = document.createElement('h3');
                title.textContent = "In Progress";
                sessionElement.appendChild(title);
                sessionElement.classList.add('session');
                sessionElement.innerHTML = `
                    <h3>${session.course.title}</h3>
                    <p>${session.start} - ${session.end}</p>
                    <p>${session.location}</p>
                `;
            }
        }
        */
        if (!foundSession) {
            console.log('No sessions found');
            const requestButton = document.createElement('button');
            requestButton.classList.add('request-button');
            requestButton.textContent = 'Request a Session';
            requestButton.addEventListener('click', async function() {
                document.querySelector('#coursePopup').style.display = 'block';
                requestButton.style.display = 'none';
            });
            document.querySelector('.session-list').appendChild(requestButton);
        }
    }
});
