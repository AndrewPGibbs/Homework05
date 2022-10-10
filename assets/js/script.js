var today = moment().clone();

function setTodaysDate() {
  $("#currentDay").text(today.format("MMM Do, YYYY h:mA"));
}
const hours = [9, 10, 11, 12, 13, 14, 15, 16, 17];
var updateInterval;
const timeBlockInterval = 30000;

function saveToLocal() {
  var saveInLocal = $(this).siblings(".description"); 
  var hour = saveInLocal.attr("data-hour");
  var text = saveInLocal.val();
  localStorage.setItem(localStorageDate() + hour.trim(), text.trim());
}

function loadDate(fadeTime = 1100) {
  clearInterval(updateInterval);
  $(".container").html("");

  for (var i = 0; i < hours.length; i++) {
    $(".container").append(createTimeBlock(hours[i]));
  }
  updateInterval = setInterval(verifyTimeBlocks, timeBlockInterval);

  $(".container").hide().fadeIn(fadeTime);
}

function createTimeBlock(currentHour) {
  var row = createEl("div", "row");
  var timeBlock = createEl("div", "time-block");
  timeBlock.appendChild(row);
  var colHour = createEl("div", "col-sm-1 col-12 pt-3 hour", currentHour);
  row.appendChild(colHour);
  var colText = createEl(
    "textarea",
    "col-sm-10 col-12 description",
    currentHour
  );
  row.appendChild(colText);
  var colSave = createEl("div", "col-sm-1 col-12 saveBtn");
  row.appendChild(colSave);
  var iconSave = createEl("i", "fas fa-save"); 
  colSave.appendChild(iconSave);

  return timeBlock;
}

function createEl(tag, cls, currentHour) { //createEl is a function with the parameters of tag, class, and currenHour
  var el = document.createElement(tag); //assigns the variable el the value ofthe  createElement method and naming it the "tag" passed to it
  if (currentHour) {
    var t = getCurrentMoment(currentHour);
    var displayHour = amPmFormat(t); //displays the hour in 12 hour format
    if (cls.includes("description")) {
      cls += " " + getTimeFormat(t); // determines the proper date and tense
      el.textContent = localStorage.getItem(dateFormat() + displayHour);  //retrieves date format in YYYY MM DD format and adds the hour to it from localStorage
      el.setAttribute("data-hour", displayHour); // the hour in 12 hour format is given the attribute of data-hour
    } else {
      el.textContent = displayHour.padEnd(4, " ");
    }
  }
  el.setAttribute("class", cls);
  return el;
}

function verifyTimeBlocks() {
  console.log("Verifying TimeBlocks"); //logs a message 
  var $descriptions = $(".description"); //adds a class of description to the variable
  $descriptions.each(function (index) {
    var hour12 = $(this).attr("data-hour"); // is pulling the data-hour info from local and adding it to var hour12
    var t = getMoment12H(hour12);  
    var tense = getTimeFormat(t);  // retrieves the proper tense 
    if ($(this).hasClass(tense)) {
    } else if (tense === "present") {
      $(this).removeClass("past future");
    } else if (tense === "past") {
      $(this).removeClass("present future");  // determines whether the time blocks has been assigned the class of 
    } else if (tense === "future") {
      $(this).removeClass("past present");
    } else {
      alert("Unknown Tense");
    }
    $(this).addClass(tense);
  });
}

// t = time
// this determines which tense to use when displaying the time

function getTimeFormat(t) {
  var cls;
  var n = moment();

  if (
    n.isSame(t, "hour") &&  //compares if the "hour" of var n and var t are the same
    n.isSame(t, "day") &&  // day
    n.isSame(t, "month") && // month
    n.isSame(t, "year")// year
  ) {
    cls = "present";  // if all matches up, it is given class "present"
  } else if (n.isAfter(t)) {  // if n is passed t then it is assigned the class of past
    cls = "past";
  } else {
    cls = "future"; //same intention but for the future
  }
  return cls;   //this will ultimately return the tense required
}

function dateFormat() {
  return today.format("YYYYMMDD-"); // formats the date into YYYY MM DD
}
function localStorageDate() {
    return today.format("YYYYMMDD-");
}

function amPmFormat(m) {
  return m.format("h A"); // moment.js terms , h displays the time in a 12 hour format and A is reponsible for am/pm
}

function getMoment12H(hour12) {
  return moment(today.format("YYYYMMDD ") + hour12, "YYYYMMDD hA");
}
function getCurrentMoment(currentHour) {
  return moment(today.format("YYYYMMDD ") + currentHour, "YYYYMMDD H");
}

function clearButton() {
    clear.addEventListener('click', function() {
        localStorage.clear();
        location.reload();
    })
}
// Document Ready
$(function () {
  // Set the date in the header
  setTodaysDate();

  // Setup Save Button Events through the container element
  $(".container").on("click", ".saveBtn", saveToLocal);

 
  // Load the day into the view
  loadDate();
  clearButton();
});
