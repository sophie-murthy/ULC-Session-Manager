document.addEventListener('DOMContentLoaded', async function() {
    const res = await fetch('/api/sessions');
    const data = await res.json();
    if (data) {
        const sessions = data.sessions;
        console.log(sessions);
        const user = data.user;
        for (const session of sessions) {
            if (session.status === "pending") {
                const sessionElement = document.createElement('div');
                sessionElement.classList.add('session', 'ft-30', 'rounded');
                sessionElement.innerHTML = `
                <h1 class = "font-bold mb-5 pending-header">Pending Session</h1>
                <h3 class = 'pending-course'>Course Name: ${session.course.title}</h3>
                <h3 class = 'pending-student'>Student: ${session.students[0].firstname} ${session.students[0].lastname}</h3>
                <h3 class = 'pending-tutor'>Tutor: ${session.tutor.firstname} ${session.tutor.lastname}</h3>
                <h3 class = 'pending-student'>Time Requested: ${session.start}</h3>
                `;
                document.querySelector('.session-list').appendChild(sessionElement);

                const startButton = document.createElement('button');
                startButton.textContent = 'Start Session';
                startButton.classList.add('start-button');
                startButton.addEventListener('click', async function() {
                    const newsession = await fetch(`/api/sessions/${session._id}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({status: 'in progress'})
                    });
                    const newSession = await newsession.json();
                    sessionElement.remove();
                    const newSessionElement = document.createElement('div');
                    newSessionElement.classList.add('session', 'ft-30', 'rounded');
                    newSessionElement.innerHTML = `
                        <h1 class = "font-bold mb-5 pending-header">In Progress</h1>
                        <h3 class = 'pending-course'>Course Name: ${newSession.course.title}</h3>
                        <h3 class = 'pending-student'>Student: ${newSession.students[0].firstname} ${newSession.students[0].lastname}</h3>
                        <h3 class = 'pending-tutor'>Tutor: ${newSession.tutor.firstname} ${newSession.tutor.lastname}</h3>
                        <h3 class = 'pending-student'>Start: ${newSession.start}</h3>
                    `;
                    document.querySelector('.session-list').appendChild(newSessionElement);
                });
                sessionElement.appendChild(startButton);

                const cancelButton = document.createElement('button');
                cancelButton.textContent = 'Cancel Session';
                cancelButton.classList.add('cancel-button');
                cancelButton.addEventListener('click', async function() {
                    await fetch(`/api/sessions/${session._id}`, {
                        method: 'DELETE'
                    });
                    sessionElement.remove();
                });
                sessionElement.appendChild(cancelButton);
                document.querySelector('.session-list').appendChild(sessionElement);
            } else if (session.status === "in progress") {
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


});