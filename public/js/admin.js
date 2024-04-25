document.addEventListener('DOMContentLoaded', async function() {
    // Get the session data from the server
    const res = await fetch('/api/sessions');
    const data = await res.json();
    if (data) {
        const sessions = data;
        let currentSessions = false;
        for (const session of sessions) {
            if (session.status === "in progress" || session.status === "pending") {
                currentSessions = true;
                break;
            }
        }
        if (!currentSessions) {
            const noSessions = document.querySelector('.no-sessions');
            noSessions.style.display = 'block';
        }
        for (const session of sessions) {
            if (session.status === "pending") {
                const sessionElement = document.createElement('div');
                sessionElement.classList.add('session', 'ft-30', 'rounded', 'shadow-lg');
                sessionElement.id = "S"+session._id;
                if (!session.tutor) {
                    let innerHTML = `
                        <h1 class="font-bold mb-5 pending-header">Pending Session</h1>
                        <h3 class='pending-course'>Course Name: ${session.course.title}</h3>
                        <h3 class='pending-student'>Student: ${session.students[0].firstname} ${session.students[0].lastname}</h3>
                        <h3 class='pending-tutor'></h3>
                        <h3 class='pending-student'>Time Requested: ${session.start}</h3>
                    `;

                    if (session.location) {
                        innerHTML += `<h3 class='pending-student'>Location: ${session.location}</h3>`;
                    }
                    sessionElement.innerHTML = innerHTML;
                    const form = document.createElement('form');
                    form.onsubmit = (e) => e.preventDefault();
                    const select = document.createElement('select');
                    select.name = 'tutor';
                    select.id = 'tutor';
                    select.classList.add('select', 'text-center');
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
                    assignButton.classList.add('assign-button', 'shadow-lg');
                    assignButton.addEventListener('click', async function() {
                        const tutorId = select.value;
                        await fetch(`/api/sessions/${session._id}`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({tutor: tutorId})
                        });
                        
                        const assignedTutor = sessionElement.querySelector('.pending-tutor');
                        assignedTutor.textContent = `Tutor: ${select.options[select.selectedIndex].textContent}`;
                        console.log(sessionElement.id);
                        assignButton.removeEventListener('click', this);
                        form.remove();

                        const editSession = document.createElement('button');
                        editSession.textContent = 'Edit Session';
                        editSession.classList.add('edit-button', 'shadow-lg');
                        sessionElement.appendChild(editSession);
                        const editModal = document.createElement('dialog');
                        editModal.classList.add('modal', 'rounded', 'shadow-lg');
                        const courseRes = await fetch('/api/courses');
                        const courseData = await courseRes.json();
                        const courseSelect = courseData.map(course => {
                            if (course._id === session.course._id) {
                                return `<option value="${course._id}" selected>${course.title}</option>`;
                            } 
                            return `<option value="${course._id}">${course.title}</option>`;
                        }).join('');
    
                        const tutors2 = await fetch('/api/tutors');
                        const tutorData2 = await tutors2.json();
                        console.log(tutorData2);
                        const tutorSelect = tutorData2.map(tutor => {
                            return `<option value="${tutor._id}">${tutor.firstname} ${tutor.lastname}</option>`;
                        }).join('');
                        editModal.innerHTML = `
                            <div class="modal-content">
                                <span class="close">&times;</span>
                                <h2 class = "edit-header">Edit Session</h2>
                                <form method="POST" action="/edit/${session._id}">
                                    <div class="input-group">
                                        <label for="tutor" class="modal-label font-bold">Tutor</label>
                                        <select id="tutor" class="select2" name="tutor">
                                            ${tutorSelect}
                                        </select>
                                    </div>
                                    <div class="input-group">
                                        <label for="course" class="modal-label font-bold">Course</label>
                                        <select id="course" class="select2" name="course">
                                            ${courseSelect}
                                        </select>
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

                        sessionElement.querySelector('.cancel-button').remove();

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

                    });
                    form.appendChild(assignButton);
                    sessionElement.appendChild(form);

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


                } else {
                    let innerHTML = `
                        <h1 class="font-bold mb-5 pending-header">Pending Session</h1>
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
                        if (course._id === session.course._id) {
                            return `<option value="${course._id}" selected>${course.title}</option>`;
                        } 
                        return `<option value="${course._id}">${course.title}</option>`;
                    }).join('');

                    const tutors = await fetch('/api/tutors');
                    const tutorData = await tutors.json();
                    const tutorSelect = tutorData.map(tutor => {
                        if (tutor._id === session.tutor._id) {
                            return `<option value="${tutor._id}" selected>${tutor.firstname} ${tutor.lastname}</option>`;
                        }
                        return `<option value="${tutor._id}">${tutor.firstname} ${tutor.lastname}</option>`;
                    }).join('');
                    editModal.innerHTML = `
                        <div class="modal-content">
                            <span class="close">&times;</span>
                            <h2 class = "edit-header">Edit Session</h2>
                            <form method="POST" action="/edit/${session._id}">
                                <div class="input-group">
                                    <label for="tutor" class="modal-label font-bold">Tutor</label>
                                    <select id="tutor" class="select2" name="tutor">
                                        ${tutorSelect}
                                    </select>
                                </div>
                                <div class="input-group">
                                    <label for="course" class="modal-label font-bold">Course</label>
                                    <select id="course" class="select2" name="course">
                                        ${courseSelect}
                                    </select>
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
    
            } else if (session.status === "in progress") {
                const sessionElement = document.createElement('div');
                sessionElement.classList.add('session', 'ft-30', 'rounded', 'shadow-lg');
                sessionElement.id = "S"+session._id;
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
        const endElement = document.createElement('div');
        endElement.classList.add('end-div2');
        document.querySelector('.end-div').appendChild(endElement);
    } 
});