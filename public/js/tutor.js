document.addEventListener('DOMContentLoaded', async function() {
    const res = await fetch('/api/sessions');
    const data = await res.json();
    if (data) {
        const sessions = data.sessions;
        const user = data.user;
        for (const session of sessions) {
            if (session.status === "pending") {
                const sessionElement = document.createElement('div');
                sessionElement.classList.add('session', 'ft-30', 'rounded', 'shadow-lg');
                sessionElement.innerHTML = `
                <h1 class = "font-bold mb-5 pending-header">Pending Session</h1>
                <h3 class = 'pending-course'>Course Name: ${session.course.title}</h3>
                <h3 class = 'pending-student'>Student: ${session.students[0].firstname} ${session.students[0].lastname}</h3>
                <h3 class = 'pending-tutor'>Tutor: ${session.tutor.firstname} ${session.tutor.lastname}</h3>
                <h3 class = 'pending-student'>Time Requested: ${session.start}</h3>
                `;
                if (session.location) {
                    sessionElement.innerHTML += `<h3 class='pending-tutor'>Location: ${session.location}</h3>`;
                }
                document.querySelector('.session-list').appendChild(sessionElement);

                const startButton = document.createElement('button');
                startButton.textContent = 'Start Session';
                startButton.classList.add('start-button', 'shadow-lg');
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
                    newSessionElement.classList.add('session', 'ft-30', 'rounded', 'shadow-lg');
                    let innerHTML = `
                        <h1 class = "font-bold mb-5 pending-header">In Progress</h1>
                        <h3 class = 'pending-course'>Course Name: ${newSession.course.title}</h3>
                        <h3 class = 'pending-student'>Student: ${newSession.students[0].firstname} ${newSession.students[0].lastname}</h3>
                        <h3 class = 'pending-tutor'>Tutor: ${newSession.tutor.firstname} ${newSession.tutor.lastname}</h3>
                        <h3 class = 'pending-student'>Start: ${newSession.start}</h3>
                    `;
                    if (newSession.location) {
                        innerHTML += `<h3 class='pending-tutor'>Location: ${session.location}</h3>`;
                    }
                    newSessionElement.innerHTML = innerHTML;
                    const editSession = document.createElement('button');
                    editSession.textContent = 'Edit Session';
                    editSession.classList.add('edit-button', 'shadow-lg');
                    newSessionElement.appendChild(editSession);
                    const editModal = document.createElement('dialog');
                    editModal.classList.add('modal', 'rounded', 'shadow-lg');
                    // retrieve the course data from the server
                    const courseRes = await fetch('/api/courses');
                    const courseData = await courseRes.json();
                    const courseSelect = courseData.map(course => {
                        return `<option value="${course._id}">${course.title}</option>`;
                    }).join('');
                    editModal.innerHTML = `
                        <div class="modal-content">
                            <span class="close">&times;</span>
                            <h2 class = "edit-header">Edit Session</h2>
                            <form method="POST" action="/edit/${session._id}">
                                <div class="input-group">
                                    <label for="course" class="modal-label font-bold">Course</label>
                                    <select id="course" class="select2" name="course">
                                        ${courseSelect}
                                    </select>
                                </div>
                                <div class="input-group">
                                    <label for="start" class="modal-label font-bold">Start Time</label>
                                    <input type="datetime-local" id="start" name="start" class="datetime-input">
                                </div>
                                <div class="input-group">
                                    <label for="location" class="modal-label font-bold">Location</label>
                                    <select id="location" class="select2" name="location">
                                        <option value="ULC ARC">ULC ARC</option>
                                        <option value="ULC UHall">ULC UHall</option>
                                        <option value="Online">Online</option>
                                    </select>
                                </div>
                                <button type="submit" class="edit-session-button">Edit Session</button>
                            </form>
                        </div>
                    `;
                    newSessionElement.appendChild(editModal);
                    editSession.addEventListener('click', function() {
                        editModal.showModal();
                    });
                    const close2 = editModal.querySelector('.close');
                    close2.addEventListener('click', function() {
                        editModal.close();
                    });

                    const endButton = document.createElement('button');
                    endButton.textContent = 'End Session';
                    endButton.classList.add('end-button', 'shadow-lg');
                    newSessionElement.appendChild(endButton);
                    const endModal = document.createElement('dialog');
                    endModal.classList.add('modal', 'rounded', 'shadow-lg');
                    endModal.innerHTML = `
                        <div class="modal-content">
                            <span class="close">&times;</span>
                            <h2 class = "edit-header">End Session</h2>
                            <form method="POST" action="/end/${newSession._id}">
                                <div class="input-group">
                                    <label for="start" class="modal-label font-bold">Start Time</label>
                                    <input type="datetime-local" id="start" name="start" class="datetime-input">
                                </div>
                                <div class="input-group">
                                    <label for="end" class="modal-label font-bold">End Time</label>
                                    <input type="datetime-local" id="end" name="end" class="datetime-input">
                                </div>
                                <div class="input-group">
                                    <h1 class="modal-label font-bold">Session Content</h1>
                                    <input type="checkbox" id="exam-prep" name="content" value="Exam Prep">
                                    <label for="exam-prep" class="check-label">Exam Prep</label>
                                    <input type="checkbox" id="assignment-help" name="content" value="Assignment Help">
                                    <label for="assignment-help" class="check-label">Assignment Help</label>
                                    <input type="checkbox" id="content-review" name="content" value="Content Review">
                                    <label for="content-review" class="check-label">Content Review</label>
                                </div>
                                <div class="input-group">
                                    <h1 class="modal-label font-bold">Preparedness</h1>
                                    <input type="radio" id="prepared" name="prepared" value="Prepared" required>
                                    <label for="prepared" class="radio-label">Prepared</label>
                                    <input type="radio" id="unprepared" name="prepared" value="Unprepared" required>
                                    <label for="unprepared" class="radio-label">Unprepared</label>
                                </div>
                                <div class="input-group">
                                    <label for="notes" class="modal-label font-bold">Notes</label>
                                    <textarea id="notes" name="notes" class="textarea-input rounded" placeholder="Session notes"></textarea>
                                </div>
                                <button type="submit" class="edit-session-button">End Session</button>
                            </form>
                        </div>
                    `;
                    newSessionElement.appendChild(endModal);
                    endButton.addEventListener('click', function() {
                        endModal.showModal();
                    });
                    const close3 = endModal.querySelector('.close');
                    close3.addEventListener('click', function() {
                        endModal.close();
                    });

                    const cancelButton = document.createElement('button');
                    cancelButton.textContent = 'Cancel Session';
                    cancelButton.classList.add('cancel-button', 'shadow-lg');
                    cancelButton.addEventListener('click', async function() {
                        await fetch(`/api/sessions/${newSession._id}`, {
                            method: 'DELETE'
                        });
                        newSessionElement.remove();
                    });
                    newSessionElement.appendChild(cancelButton);
                    document.querySelector('.session-list').appendChild(newSessionElement);

                });
                sessionElement.appendChild(startButton);

                const cancelButton = document.createElement('button');
                cancelButton.textContent = 'Cancel Session';
                cancelButton.classList.add('cancel-button', 'shadow-lg');
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

                const editSession = document.createElement('button');
                editSession.textContent = 'Edit Session';
                editSession.classList.add('edit-button', 'shadow-lg');
                sessionElement.appendChild(editSession);
                const editModal = document.createElement('dialog');
                editModal.classList.add('modal', 'rounded', 'shadow-lg');
                const courseRes = await fetch('/api/courses');
                const courseData = await courseRes.json();
                const courseSelect = courseData.map(course => {
                    return `<option value="${course._id}">${course.title}</option>`;
                }).join('');
                editModal.innerHTML = `
                    <div class="modal-content">
                        <span class="close">&times;</span>
                        <h2 class = "edit-header">Edit Session</h2>
                        <form method="POST" action="/edit/${session._id}">
                            <div class="input-group">
                                <label for="course" class="modal-label font-bold">Course</label>
                                <select id="course" class="select2" name="course">
                                    ${courseSelect}
                                </select>
                            </div>
                            <div class="input-group">
                                <label for="start" class="modal-label font-bold">Start Time</label>
                                <input type="datetime-local" id="start" name="start" class="datetime-input">
                            </div>
                            <div class="input-group">
                                <label for="location" class="modal-label font-bold">Location</label>
                                <select id="location" class="select2" name="location">
                                    <option value="ULC ARC">ULC ARC</option>
                                    <option value="ULC UHall">ULC UHall</option>
                                    <option value="Online">Online</option>
                                </select>
                            </div>
                            <button type="submit" class="edit-session-button">Edit Session</button>
                        </form>
                    </div>
                `;
                sessionElement.appendChild(editModal);
                editSession.addEventListener('click', function() {
                    editModal.showModal();
                });
                const close = editModal.querySelector('.close');
                close.addEventListener('click', function() {
                    editModal.close();
                });

                const endButton = document.createElement('button');
                endButton.textContent = 'End Session';
                endButton.classList.add('end-button', 'shadow-lg');
                sessionElement.appendChild(endButton);
                const endModal = document.createElement('dialog');
                endModal.classList.add('modal', 'rounded', 'shadow-lg');
                endModal.innerHTML = `
                    <div class="modal-content">
                        <span class="close">&times;</span>
                        <h2 class = "edit-header">End Session</h2>
                        <form method="POST" action="/end/${session._id}">
                            <div class="input-group">
                                <label for="start" class="modal-label font-bold">Start Time</label>
                                <input type="datetime-local" id="start" name="start" class="datetime-input">
                            </div>
                            <div class="input-group">
                                <label for="end" class="modal-label font-bold">End Time</label>
                                <input type="datetime-local" id="end" name="end" class="datetime-input">
                            </div>
                            <div class="input-group">
                                <h1 class="modal-label font-bold">Session Content</h1>
                                <input type="checkbox" id="exam-prep" name="content" value="Exam Prep">
                                <label for="exam-prep" class="check-label">Exam Prep</label>
                                <input type="checkbox" id="assignment-help" name="content" value="Assignment Help">
                                <label for="assignment-help" class="check-label">Assignment Help</label>
                                <input type="checkbox" id="content-review" name="content" value="Content Review">
                                <label for="content-review" class="check-label">Content Review</label>
                            </div>
                            <div class="input-group">
                                <h1 class="modal-label font-bold">Preparedness</h1>
                                <input type="radio" id="prepared" name="prepared" value="Prepared" required>
                                <label for="prepared" class="radio-label">Prepared</label>
                                <input type="radio" id="unprepared" name="prepared" value="Unprepared" required>
                                <label for="unprepared" class="radio-label">Unprepared</label>
                            </div>
                            <div class="input-group">
                                <label for="notes" class="modal-label font-bold">Notes</label>
                                <textarea id="notes" name="notes" class="textarea-input rounded" placeholder="Session notes"></textarea>
                            </div>
                            <button type="submit" class="edit-session-button">End Session</button>
                        </form>
                    </div>
                `;
                sessionElement.appendChild(endModal);
                endButton.addEventListener('click', function() {
                    endModal.showModal();
                });
                const close3 = endModal.querySelector('.close');
                close3.addEventListener('click', function() {
                    endModal.close();
                });

                const cancelButton = document.createElement('button');
                cancelButton.textContent = 'Cancel Session';
                cancelButton.classList.add('cancel-button', 'shadow-lg');
                cancelButton.addEventListener('click', async function() {
                    await fetch(`/api/sessions/${session._id}`, {
                        method: 'DELETE'
                    });
                    sessionElement.remove();
                });
                sessionElement.appendChild(cancelButton);
                document.querySelector('.session-list').appendChild(sessionElement);
            }
        }
    }


});