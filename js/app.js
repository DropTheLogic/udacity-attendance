/* STUDENTS IGNORE THIS FUNCTION
 * All this does is create an initial
 * attendance record if one is not found
 * within localStorage.
 */
(function() {
    if (!localStorage.attendance) {
        console.log('Creating attendance records...');
        function getRandom() {
            return (Math.random() >= 0.5);
        }

        var nameColumns = $('tbody .name-col'),
            attendance = {};

        nameColumns.each(function() {
            var name = this.innerText;
            attendance[name] = [];

            for (var i = 0; i <= 11; i++) {
                attendance[name].push(getRandom());
            }
        });

        localStorage.attendance = JSON.stringify(attendance);
    }
}());


/* STUDENT APPLICATION */
var model = {

    init: function() {
        this.attendance = JSON.parse(localStorage.attendance);
    }
};

var controller = {

    init: function() {
        model.init();
        view.init();
    },

    getAttendance: function() {
        return model.attendance;
    },

    countMissedDays: function(student) {
        var missedDays = 0;
        model.attendance[student].forEach(function(day) {
            missedDays += (day) ? 1 : 0;
        });
        return missedDays;
    },

    addListener: function(elem, student, day) {
        elem.addEventListener('click', function(e) {
            model.attendance[student][day] = (model.attendance[student][day]) ? false : true;
            view.render();
        });
    }
};

var view = {

    init: function() {
        this.attendance = controller.getAttendance();
        this.table = document.getElementById('table-body');
        var trStudents = this.table.getElementsByClassName('student');
        // Cycle through all student boxes, check if needed and add listeners
        var row = 0;
        for (var student in this.attendance) {
            var dayTDs = trStudents[row].getElementsByClassName('attend-col');
            for (var day = 0; day < dayTDs.length; day++) {
                var checkbox = dayTDs[day].firstChild;
                checkbox.checked = this.attendance[student][day];
                controller.addListener(checkbox, student, day);
            }
            row++;
        }
        view.render();
    },

    render: function() {
        // Render totals
        var allMissed = this.table.getElementsByClassName('missed-col');
        var i = 0;
        for (var student in this.attendance) {
            allMissed[i].textContent = controller.countMissedDays(student);
            i++;
        }
    }
};

controller.init();