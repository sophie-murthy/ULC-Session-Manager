document.addEventListener('DOMContentLoaded', async function() {
    // Get the student data from the server
    const res = await fetch('/api/current_user');
    const data = await res.json();
    if (data.user) {
        const user = data.user;
        const sessions = data.session;
        const requestButton = document.createElement('button');
        requestButton.classList.add('request-button', 'shadow-lg');
        requestButton.textContent = 'Request a Session';
        requestButton.addEventListener('click', async function() {
            document.querySelector('#coursePopup').showModal();
        });
        document.querySelector('#closeCoursePopup').addEventListener('click', function() {
            document.querySelector('#coursePopup').close();
        });
        document.querySelector('.session-list').appendChild(requestButton);
        if (sessions && sessions.length > 0) {
            for (const session of sessions) {
                if (session.status == "pending") {
                    const sessionElement = document.createElement('div');
                    const title = document.createElement('h3');
                    title.textContent = "Pending";
                    sessionElement.appendChild(title);
                    sessionElement.classList.add('session', 'ft-30', 'rounded', 'shadow-lg');;
                    if (!session.tutor) {
                        let innerHTML = `
                            <h1 class="font-bold mb-5 pending-header">Pending Session</h1>
                            <h3 class='pending-course'>Course Name: ${session.course.title}</h3>
                            <h3 class='pending-student'>Student: ${session.students[0].firstname} ${session.students[0].lastname}</h3>
                            <h3 class='pending-student'>Time Requested: ${session.start}</h3>
                        `;

                        if (session.location) {
                            innerHTML += `<h3 class='pending-tutor'>Location: ${session.location}</h3>`;
                        }
                        sessionElement.innerHTML = innerHTML;
                    } else {
                        let innerHTML = `
                            <h1 class = "font-bold mb-5 pending-header">Pending Session</h1>
                            <h3 class = 'pending-course'>Course Name: ${session.course.title}</h3>
                            <h3 class = 'pending-student'>Student: ${session.students[0].firstname} ${session.students[0].lastname}</h3>
                            <h3 class = 'pending-tutor'>Tutor: ${session.tutor.firstname} ${session.tutor.lastname}</h3>
                            <h3 class = 'pending-student'>Time Requested: ${session.start}</h3>
                        `;
                        if (session.location) {
                            innerHTML += `<h3 class='pending-tutor'>Location: ${session.location}</h3>`;
                        }
                        sessionElement.innerHTML = innerHTML;
                    }
                    const cancelButton = document.createElement('button');
                    cancelButton.textContent = 'Cancel Session';
                    cancelButton.classList.add('cancel-button', 'shadow-lg');
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
                    sessionElement.classList.add('session', 'ft-30', 'rounded', 'shadow-lg');
                    let innerHTML = `
                        <h1 class="font-bold mb-5 pending-header">In Progress</h1>
                        <h3 class='pending-course'>Course Name: ${session.course.title}</h3>
                        <h3 class='pending-student'>Student: ${session.students[0].firstname} ${session.students[0].lastname}</h3>
                        <h3 class='pending-tutor'>Tutor: ${session.tutor.firstname} ${session.tutor.lastname}</h3>
                        <h3 class='pending-student'>Time Requested: ${session.start}</h3>
                    `;

                    if (session.location) {
                        innerHTML += `<h3 class='pending-tutor'>Location: ${session.location}</h3>`;
                    }
                    sessionElement.innerHTML = innerHTML;
                    document.querySelector('.session-list').appendChild(sessionElement);
                }
            }
        }
    }
});
