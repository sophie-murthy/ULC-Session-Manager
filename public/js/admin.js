document.addEventListener('DOMContentLoaded', async function() {
    // Get the session data from the server
    const res = await fetch('/api/sessions');
    const data = await res.json();
    console.log(data);
    if (data) {
        const sessions = data;
        for (const session of sessions) {
            if (session.status === "pending") {
                const sessionElement = document.createElement('div');
                sessionElement.classList.add('session', 'ft-30', 'rounded');
                sessionElement.innerHTML = `
                    <h1 class = "font-bold mb-5 pending-header">Pending Session</h1>
                    <h3 class = 'pending-course'>Course Name: ${session.course.title}</h3>
                    <h3 class = 'pending-student'>Student: ${session.students[0].firstname} ${session.students[0].lastname}</h3>
                    <h3 class = 'pending-student'>Time Requested: ${session.start}</h3>
                `;
                // admin can assign tutor to session
                const form = document.createElement('form');
                const select = document.createElement('select');
                select.name = 'tutor';
                select.id = 'tutor';
                const tutors = await fetch('/api/tutors');
                const tutorData = await tutors.json();
                for (const tutor of tutorData) {
                    const option = document.createElement('option');
                    option.value = tutor._id;
                    option.textContent = `${tutor.firstname} ${tutor.lastname}`;
                    select.appendChild(option);
                }
                form.appendChild(select);   
                const assignButton = document.createElement('button');
                assignButton.textContent = 'Assign Tutor';
                assignButton.classList.add('assign-button');
                assignButton.addEventListener('click', async function() {
                    const tutorId = select.value;
                    await fetch(`/api/sessions/${session._id}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({tutor: tutorId})
                    });
                    sessionElement.remove();
                });
                form.appendChild(assignButton);
                sessionElement.appendChild(form);
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
                sessionElement.classList.add('session');
                sessionElement.innerHTML = `
                    <h3>${session.course.title}</h3>
                    <p>${session.start} - ${session.end}</p>
                    <p>${session.location}</p>
                `;
                document.querySelector('.session-list').appendChild(sessionElement);
            }
        }
    } 
});