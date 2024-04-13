document.addEventListener('DOMContentLoaded', async function() {
    // Get the student data from the server
    const res = await fetch('/api/current_user');
    const data = await res.json();
    if (data.user) {
        const user = data.user;
        const sessions = data.session;
        console.log(sessions);
        if (sessions && sessions.length > 0) {
            for (const session of sessions) {
                if (session.status = "pending") {
                    const sessionElement = document.createElement('div');
                    const title = document.createElement('h3');
                    title.textContent = "Pending";
                    sessionElement.appendChild(title);
                    sessionElement.classList.add('session');
                    console.log(session.course);
                    sessionElement.innerHTML = `
                        <h3>${session.course.title}</h3>
                    `;
                    document.querySelector('.session-list').appendChild(sessionElement);
                } else if (session.status = "in progress") {
                    const sessionElement = document.createElement('div');
                    const title = document.createElement('h3');
                    title.textContent = "In Progress";
                    sessionElement.appendChild(title);
                    sessionElement.classList.add('session');
                    console.log(session.course);
                    sessionElement.innerHTML = `
                        <h3>${session.course.title}</h3>
                        <p>${session.start} - ${session.end}</p>
                        <p>${session.location}</p>
                    `;
                    document.querySelector('.session-list').appendChild(sessionElement);
                }
            }
        } else {
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
