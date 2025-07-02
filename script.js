/* -----------------------------------------
   1. Theme Toggle
----------------------------------------- */

// Select the theme toggle button
var themeToggleButton = document.getElementById('theme-toggle');

// Listen for click event
themeToggleButton.addEventListener('click', function() {
    // Toggle the "dark-theme" class on body
    document.body.classList.toggle('dark-theme');

    // Save preference to localStorage
    if(document.body.classList.contains('dark-theme')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
});

// On page load, apply saved theme
if(localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-theme');
}


/* -----------------------------------------
   2. Greeting and Motivational Quote
----------------------------------------- */

// Get current hour
var currentHour = new Date().getHours();
var greetingText = "";

// Determine greeting message
if(currentHour < 12) {
    greetingText = "Good Morning!";
} else if(currentHour < 18) {
    greetingText = "Good Afternoon!";
} else {
    greetingText = "Good Evening!";
}

// Display greeting
document.getElementById('greeting').textContent = greetingText;

// Motivational quotes array
var quotes = [
    "Success is the sum of small efforts repeated daily.",
    "Stay positive and keep pushing forward.",
    "Believe you can and you're halfway there.",
    "Dream big and dare to fail.",
    "Your only limit is you."
];

// Select a random quote
var randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
document.getElementById('motivational-quote').textContent = randomQuote;


/* -----------------------------------------
   3. Study Progress Tracker
----------------------------------------- */

// Select form and list
var studyForm = document.getElementById('study-form');
var studyList = document.getElementById('study-list');

// Load saved sessions
var studySessions = JSON.parse(localStorage.getItem('studySessions')) || [];

// Function to display sessions
function displayStudySessions() {
    studyList.innerHTML = "";
    var totalMinutes = 0;

    for(var i = 0; i < studySessions.length; i++) {
        var session = studySessions[i];
        totalMinutes += parseInt(session.duration);

        var li = document.createElement('li');
        li.textContent = session.subject + " - " + session.duration + " min. Notes: " + session.notes;
        studyList.appendChild(li);
    }

    // Update today's summary
    document.getElementById('today-summary').textContent = "Today's Study Time: " + totalMinutes + " minutes.";
}

// Display on load
displayStudySessions();

// Handle form submit
studyForm.addEventListener('submit', function(event) {
    event.preventDefault();

    var subject = document.getElementById('subject').value;
    var duration = document.getElementById('duration').value;
    var notes = document.getElementById('notes').value;

    var session = {
        subject: subject,
        duration: duration,
        notes: notes
    };

    studySessions.push(session);
    localStorage.setItem('studySessions', JSON.stringify(studySessions));

    displayStudySessions();

    studyForm.reset();

    updateStreak();
});


/* -----------------------------------------
   4. Exam Countdown
----------------------------------------- */

var examForm = document.getElementById('exam-form');
var examList = document.getElementById('exam-list');

// Load exams
var exams = JSON.parse(localStorage.getItem('exams')) || [];

// Display countdowns
function displayExams() {
    examList.innerHTML = "";

    for(var i = 0; i < exams.length; i++) {
        var exam = exams[i];
        var li = document.createElement('li');

        var examDate = new Date(exam.date);
        var now = new Date();
        var diffTime = examDate - now;
        var daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        li.textContent = exam.name + " - " + daysLeft + " days remaining";

        // Delete button
        var delBtn = document.createElement('button');
        delBtn.textContent = "Delete";
        delBtn.setAttribute('data-index', i);
        delBtn.addEventListener('click', function() {
            var index = this.getAttribute('data-index');
            exams.splice(index, 1);
            localStorage.setItem('exams', JSON.stringify(exams));
            displayExams();
        });

        li.appendChild(delBtn);
        examList.appendChild(li);

        // Update next exam on dashboard
        if(i === 0) {
            document.getElementById('next-exam').textContent = "Next Exam: " + exam.name + " in " + daysLeft + " days.";
        }
    }

    if(exams.length === 0) {
        document.getElementById('next-exam').textContent = "No exams added.";
    }
}

displayExams();

// Handle exam form
examForm.addEventListener('submit', function(event) {
    event.preventDefault();

    var name = document.getElementById('exam-name').value;
    var date = document.getElementById('exam-date').value;

    exams.push({ name: name, date: date });
    localStorage.setItem('exams', JSON.stringify(exams));
    displayExams();

    examForm.reset();
});


/* -----------------------------------------
   5. Study Planner (Time Table)
----------------------------------------- */

var plannerForm = document.getElementById('planner-form');
var plannerDisplay = document.getElementById('planner-display');

// Load saved planner
var planner = JSON.parse(localStorage.getItem('planner')) || {};

// Display planner
function displayPlanner() {
    plannerDisplay.innerHTML = "";

    for(var day in planner) {
        var div = document.createElement('div');
        div.textContent = day + ": " + planner[day].subject + " at " + planner[day].time;
        plannerDisplay.appendChild(div);
    }
}

displayPlanner();

// Handle planner form submit
plannerForm.addEventListener('submit', function(event) {
    event.preventDefault();

    var days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    planner = {};

    for(var i = 0; i < days.length; i++) {
        var day = days[i];
        var subject = document.getElementById(day + "-subject").value;
        var time = document.getElementById(day + "-time").value;
        planner[day] = { subject: subject, time: time };
    }

    localStorage.setItem('planner', JSON.stringify(planner));
    displayPlanner();
});


/* -----------------------------------------
   6. To-Do List
----------------------------------------- */

var todoForm = document.getElementById('todo-form');
var todoItems = document.getElementById('todo-items');

var todos = JSON.parse(localStorage.getItem('todos')) || [];

function displayTodos() {
    todoItems.innerHTML = "";

    for(var i = 0; i < todos.length; i++) {
        var li = document.createElement('li');
        li.textContent = todos[i].task;

        var checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.checked = todos[i].completed;
        checkbox.setAttribute('data-index', i);
        checkbox.addEventListener('change', function() {
            var index = this.getAttribute('data-index');
            todos[index].completed = this.checked;
            localStorage.setItem('todos', JSON.stringify(todos));
        });

        var delBtn = document.createElement('button');
        delBtn.textContent = "Delete";
        delBtn.setAttribute('data-index', i);
        delBtn.addEventListener('click', function() {
            var index = this.getAttribute('data-index');
            todos.splice(index, 1);
            localStorage.setItem('todos', JSON.stringify(todos));
            displayTodos();
        });

        li.appendChild(checkbox);
        li.appendChild(delBtn);
        todoItems.appendChild(li);
    }
}

displayTodos();

// Handle to-do form
todoForm.addEventListener('submit', function(event) {
    event.preventDefault();

    var task = document.getElementById('todo-task').value;

    todos.push({ task: task, completed: false });
    localStorage.setItem('todos', JSON.stringify(todos));
    displayTodos();

    todoForm.reset();
});


/* -----------------------------------------
   7. Daily Streak
----------------------------------------- */

function updateStreak() {
    var lastDate = localStorage.getItem('lastStudyDate');
    var currentDate = new Date().toDateString();
    var streak = parseInt(localStorage.getItem('streak')) || 0;

    if(lastDate !== currentDate) {
        streak += 1;
        localStorage.setItem('lastStudyDate', currentDate);
        localStorage.setItem('streak', streak);
    }

    document.getElementById('daily-streak').textContent = "🔥 Daily Streak: " + streak + " days";
}

// Initialize streak
updateStreak();


/* -----------------------------------------
   8. Friends List
----------------------------------------- */

var friendForm = document.getElementById('friend-form');
var friendList = document.getElementById('friend-list');

var friends = JSON.parse(localStorage.getItem('friends')) || [];

function displayFriends() {
    friendList.innerHTML = "";

    for(var i = 0; i < friends.length; i++) {
        var li = document.createElement('li');
        li.textContent = friends[i].name + " - " + friends[i].progress + "% complete";
        friendList.appendChild(li);
    }
}

displayFriends();

// Handle friend form
friendForm.addEventListener('submit', function(event) {
    event.preventDefault();

    var name = document.getElementById('friend-name').value;
    var progress = document.getElementById('friend-progress').value;

    friends.push({ name: name, progress: progress });
    localStorage.setItem('friends', JSON.stringify(friends));
    displayFriends();

    friendForm.reset();
});


/* -----------------------------------------
   9. Pomodoro Timer
----------------------------------------- */

var timerDisplay = document.getElementById('timer-display');
var startTimerButton = document.getElementById('start-timer');
var pauseTimerButton = document.getElementById('pause-timer');
var resetTimerButton = document.getElementById('reset-timer');
var timerStatus = document.getElementById('timer-status');

var timerSeconds = 25 * 60;
var timerInterval = null;

// Update timer display
function updateTimerDisplay() {
    var minutes = Math.floor(timerSeconds / 60);
    var seconds = timerSeconds % 60;

    timerDisplay.textContent = (minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}

// Start timer
startTimerButton.addEventListener('click', function() {
    if(timerInterval === null) {
        timerInterval = setInterval(function() {
            if(timerSeconds > 0) {
                timerSeconds--;
                updateTimerDisplay();
            } else {
                clearInterval(timerInterval);
                timerInterval = null;
                timerStatus.textContent = "Time's up! Take a break.";
            }
        }, 1000);

        timerStatus.textContent = "Focus Time!";
    }
});

// Pause timer
pauseTimerButton.addEventListener('click', function() {
    if(timerInterval !== null) {
        clearInterval(timerInterval);
        timerInterval = null;
        timerStatus.textContent = "Paused.";
    }
});

// Reset timer
resetTimerButton.addEventListener('click', function() {
    clearInterval(timerInterval);
    timerInterval = null;
    timerSeconds = 25 * 60;
    updateTimerDisplay();
    timerStatus.textContent = "Ready to focus!";
});

// Initialize display
updateTimerDisplay();


/* -----------------------------------------
   10. Notes Section
----------------------------------------- */

var noteForm = document.getElementById('note-form');
var notesList = document.getElementById('notes-list');

var notes = JSON.parse(localStorage.getItem('notes')) || [];

function displayNotes() {
    notesList.innerHTML = "";

    for(var i = 0; i < notes.length; i++) {
        var li = document.createElement('li');
        li.textContent = notes[i].title + ": " + notes[i].content;
        notesList.appendChild(li);
    }
}

displayNotes();

noteForm.addEventListener('submit', function(event) {
    event.preventDefault();

    var title = document.getElementById('note-title').value;
    var content = document.getElementById('note-content').value;

    notes.push({ title: title, content: content });
    localStorage.setItem('notes', JSON.stringify(notes));
    displayNotes();

    noteForm.reset();
});


/* -----------------------------------------
   11. GPA Calculator
----------------------------------------- */

var gpaForm = document.getElementById('gpa-form');
var gpaList = document.getElementById('gpa-list');
var gpaResult = document.getElementById('gpa-result');

var marksList = [];

function displayGPA() {
    gpaList.innerHTML = "";
    var total = 0;

    for(var i = 0; i < marksList.length; i++) {
        var li = document.createElement('li');
        li.textContent = marksList[i].subject + ": " + marksList[i].marks;
        gpaList.appendChild(li);
        total += parseInt(marksList[i].marks);
    }

    if(marksList.length > 0) {
        var average = total / marksList.length;
        gpaResult.textContent = "Average Marks: " + average.toFixed(2);
    } else {
        gpaResult.textContent = "Average: N/A";
    }
}

gpaForm.addEventListener('submit', function(event) {
    event.preventDefault();

    var subject = document.getElementById('gpa-subject').value;
    var marks = document.getElementById('gpa-marks').value;

    marksList.push({ subject: subject, marks: marks });
    displayGPA();

    gpaForm.reset();
});


/* -----------------------------------------
   12. Sticky Notes
----------------------------------------- */

var stickyForm = document.getElementById('sticky-form');
var stickyContainer = document.getElementById('sticky-container');

var stickyNotes = JSON.parse(localStorage.getItem('stickyNotes')) || [];

function displayStickyNotes() {
    stickyContainer.innerHTML = "";

    for(var i = 0; i < stickyNotes.length; i++) {
        var noteDiv = document.createElement('div');
        noteDiv.textContent = stickyNotes[i];
        stickyContainer.appendChild(noteDiv);
    }
}

displayStickyNotes();

stickyForm.addEventListener('submit', function(event) {
    event.preventDefault();

    var content = document.getElementById('sticky-content').value;
    stickyNotes.push(content);
    localStorage.setItem('stickyNotes', JSON.stringify(stickyNotes));
    displayStickyNotes();

    stickyForm.reset();
});
