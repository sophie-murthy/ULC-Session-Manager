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
                if (session.status == "pending") {
                    const sessionElement = document.createElement('div');
                    const title = document.createElement('h3');
                    title.textContent = "Pending";
                    sessionElement.appendChild(title);
                    sessionElement.classList.add('session', 'ft-30', 'rounded');;
                    if (!session.tutor) {
                        sessionElement.innerHTML = `
                            <h1 class = "font-bold mb-5 pending-header">Pending Session</h1>
                            <h3 class = 'pending-course'>Course Name: ${session.course.title}</h3>
                            <h3 class = 'pending-student'>Student: ${session.students[0].firstname} ${session.students[0].lastname}</h3>
                            <h3 class = 'pending-student'>Time Requested: ${session.start}</h3>
                        `;
                    } else {
                        sessionElement.innerHTML = `
                            <h1 class = "font-bold mb-5 pending-header">Pending Session</h1>
                            <h3 class = 'pending-course'>Course Name: ${session.course.title}</h3>
                            <h3 class = 'pending-student'>Student: ${session.students[0].firstname} ${session.students[0].lastname}</h3>
                            <h3 class = 'pending-tutor'>Tutor: ${session.tutor.firstname} ${session.tutor.lastname}</h3>
                            <h3 class = 'pending-student'>Time Requested: ${session.start}</h3>
                        `;
                    }
                    const cancelButton = document.createElement('button');
                    cancelButton.textContent = 'Cancel Session';
                    cancelButton.classList.add('cancel-button');
                    cancelButton.addEventListener('click', async function() {
                        await fetch(`/api/current_user`, {
                            method: 'DELETE'
                        });
                        sessionElement.remove();
                    });
                    sessionElement.appendChild(cancelButton);
                    document.querySelector('.session-list').appendChild(sessionElement);
                } else if (session.status == "in progress") {
                    const sessionElement = document.createElement('div');
                    sessionElement.classList.add('session', 'ft-30', 'rounded');
                    sessionElement.innerHTML = `
                        <h1 class = "font-bold mb-5 pending-header">In Progress</h1>
                        <h3 class = 'pending-course'>Course Name: ${session.course.title}</h3>
                        <h3 class = 'pending-student'>Student: ${session.students[0].firstname} ${session.students[0].lastname}</h3>
                        <h3 class = 'pending-tutor'>Tutor: ${session.tutor.firstname} ${session.tutor.lastname}</h3>
                        <h3 class = 'pending-student'>Start: ${session.start}</h3>
                    `;
                    document.querySelector('.session-list').appendChild(sessionElement);
                }
            }
        }
        const requestButton = document.createElement('button');
        requestButton.classList.add('request-button');
        requestButton.textContent = 'Request a Session';
        requestButton.addEventListener('click', async function() {
            document.querySelector('#coursePopup').style.display = 'block';
            requestButton.style.display = 'none';
        });
        document.querySelector('.session-list').appendChild(requestButton);
    }
});
