var nextWordNumber = 1;
var words = [{word:"",meaning:"",score:"",numOfTries:0,numRight:0}];
var totalScore = 0;
var currentWord = {};
function createAbox() {
  // create new row
  var newRow = document.getElementById("allWords").insertRow(-1);
  newRow.id = "block" + nextWordNumber;
  // add word box
  var getNew = document.createElement("input");
  getNew.id = "word" + nextWordNumber;
  getNew.type = "text";
  getNew.placeholder = "word";
  var newCell0 = newRow.insertCell(0);
  newCell0.appendChild(getNew);
  // add meaning box
  var getNewMeaning = document.createElement("input");
  getNewMeaning.id = "meaning" + nextWordNumber;
  getNewMeaning.type = "text";
  getNewMeaning.placeholder = "meaning";
  var newCell1 = newRow.insertCell(1);
  newCell1.appendChild(getNewMeaning);
  // add cells for tries, corrects and %
  var newCell2 = newRow.insertCell(2);
  newCell2.innerHTML = "0";
  newCell2.id = "tries" + nextWordNumber;
  var newCell3 = newRow.insertCell(3);
  newCell3.innerHTML = "0";
  newCell3.id = "correct" + nextWordNumber;
  var newCell4 = newRow.insertCell(4);
  newCell4.innerHTML = "-";
  newCell4.id = "percentage" + nextWordNumber;
  // add deleter button
  var getNewDeleter = document.createElement("input");
  getNewDeleter.type = "button";
  getNewDeleter.classList.add("deletes");
  getNewDeleter.value = "X";
  getNewDeleter.setAttribute("onclick","deleteWord(" + nextWordNumber + ")");
  getNewDeleter.id = "deleter" + nextWordNumber;
  var newCell5 = newRow.insertCell(5);
  newCell5.appendChild(getNewDeleter);
  // do paperwork
  var newWord = {word:"",meaning:"",score:"",numOfTries:0,numRight:0};
  words.push(newWord);
  nextWordNumber = nextWordNumber + 1;
}
function getWord() {
  var randNum = Math.random() * totalScore;
  var checkNum = 0;
  for (var i = 0; i < words.length; i++) {
    checkNum = checkNum + words[i].score;
    if (randNum <= checkNum) {
      return i;
      break;
    }
  }
}
function updateWords() {
  words = [];
  for (var i = 0; i < nextWordNumber; i++) {
    var newWord = {word:document.getElementById("word" + i).value,meaning:document.getElementById("meaning" + i).value,score:1,numOfTries:0,numRight:0};
    words.push(newWord);
  }
}
function takeTest() {
  if (words.length == 0) {
    alert("You have no words!");
  } else {
    document.getElementById("startScreen").hidden = true;
    document.getElementById("testScreen").hidden = false;
    updateWords();
    totalScore = nextWordNumber;
    var randWord = getWord();
    document.getElementById("testWord").value = words[randWord].word;
    currentWord = randWord;
    document.getElementById("answer").value = "";
    document.getElementById("result").value = "";
    document.getElementById("total%").innerHTML = "Overall: -";
    document.getElementById("total%").style.color = "rgb(226,226,226)";
  }
}
function changeWords() {
  document.getElementById("startScreen").hidden = false;
  document.getElementById("testScreen").hidden = true;
  for (var i = 0; i < nextWordNumber; i++) {
    document.getElementById("tries" + i).innerHTML = words[i].numOfTries;
    document.getElementById("correct" + i).innerHTML = words[i].numRight;
    var percentage = Math.floor(words[i].numRight / words[i].numOfTries * 1000) / 10;
    var percentBox = document.getElementById("percentage" + i);
    percentBox.innerHTML = percentage;
    percentBox.style.color = "hsl(" + (percentage / 100 * 120) + ",100%,50%)";
    if (percentBox.innerHTML == "NaN") {
      percentBox.innerHTML = '-';
    }
  }
  document.getElementById("wordlists").hidden = true;
}
function checkAnswer() {
  if (document.getElementById("answer").value == words[currentWord].meaning) {
    document.getElementById("result").value = "Correct";
    if (words[currentWord].score > 1) {
      words[currentWord].score = words[currentWord].score - 1;
      totalScore = totalScore - 1;
    }
    words[currentWord].numRight++;
  } else {
    document.getElementById("result").value = "X It's: " + words[currentWord].meaning;
    words[currentWord].score++;
    totalScore++;
  }
  document.getElementById("next").disabled = false;
  words[currentWord].numOfTries++;
  var totalTries = 0;
  var totalCorrect = 0;
  for (var i = 0; i < words.length; i++) {
    totalTries = totalTries + words[i].numOfTries;
    totalCorrect = totalCorrect + words[i].numRight;
  }
  // update % reading
  var percentage = Math.floor(totalCorrect / totalTries * 1000) / 10;
  document.getElementById("total%").innerHTML = "Overall: " + percentage + "%";
  document.getElementById("total%").style.color = "hsl(" + (percentage / 100 * 120) + ",100%,50%)";
}
function nextWord() {
  var randWord = getWord();
  document.getElementById("testWord").value = words[randWord].word;
  currentWord = randWord;
  document.getElementById("next").disabled = true;
  document.getElementById("answer").value = "";
  document.getElementById("result").value = "";
}
function deleteWord(wordNum) {
  var oldBlock = document.getElementById("block" + wordNum);
  oldBlock.parentNode.removeChild(oldBlock);
  for (var i = wordNum + 1; i < nextWordNumber; i++) {
    document.getElementById("word" + i).id = "word" + (i - 1);
    document.getElementById("meaning" + i).id = "meaning" + (i - 1);
    document.getElementById("deleter" + i).setAttribute("onClick","deleteWord(" + (i - 1) + ")");
    document.getElementById("deleter" + i).id = "deleter" + (i - 1);
    document.getElementById("block" + i).id = "block" + (i - 1);
    document.getElementById("tries" + i).id = "tries" + (i - 1);
    document.getElementById("correct" + i).id = "correct" + (i - 1);
    document.getElementById("percentage" + i).id = "percentage" + (i - 1)
  }
  totalScore = totalScore - words[wordNum].score;
  words.splice(wordNum,1)
  nextWordNumber = nextWordNumber - 1;
}
function keyDown(event) {
  if (event.keyCode == 13) { // checking if the input is an enter
    if (document.getElementById("testScreen").hidden == false) {
      if (document.getElementById("next").disabled == true) {
        checkAnswer();
      } else {
        nextWord();
      }
    }
  }
}
// word saving functions
function saveToBrowser() {
  updateWords();
  var wordsToSave = JSON.stringify(words);
  var wordsName = prompt("name this set:");
  if (localStorage.getItem("nameList") == null) {
    var array = [];
    localStorage.setItem("nameList",JSON.stringify(array));
  }
  var names = JSON.parse(localStorage.getItem("nameList"));
  names.push(wordsName);
  localStorage.setItem("nameList",JSON.stringify(names));
  localStorage.setItem(wordsName,wordsToSave);
}
function saveToFiles() {
  updateWords();
  var wordsToSave = JSON.stringify(words);
  alert("Copy this to a word doc and save it:\n" + wordsToSave);
}
function getWordList() {
  var menu = document.getElementById("wordlists");
  if (menu.hidden == false) { // handles menu on/off & no point in making list if it's gonna be hidden
    menu.hidden = true;
  } else {
    menu.parentNode.removeChild(menu);
    var getNewDiv = document.createElement("div");
    getNewDiv.id = "wordlists";
    getNewDiv.classList.add("dropdown-content");
    document.getElementById("menuParent").appendChild(getNewDiv);
    var names = JSON.parse(localStorage.getItem("nameList"));
    if (names == null || names.length == 0 || names[0] == null) { // handles no saved words
      var getNewButton = document.createElement("input");
      getNewButton.type = "button";
      getNewButton.disabled = true;
      getNewButton.value = "there are no saved lists";
      getNewButton.classList.add("dropButton");
      document.getElementById("wordlists").appendChild(getNewButton);
      document.getElementById("wordlists").appendChild(document.createElement("br"));
    } else {
      for (var i = 0; i < names.length; i++) {
        if (names[i] == null) { // handles weird glitch where null just sits in the array for no reason
          continue;
        }
        var getNewButton = document.createElement("input");
        // add a new wordlist link onto the menu
        getNewButton.type = "button";
        getNewButton.setAttribute("onClick","importWords('" + names[i] + "')");
        getNewButton.value = names[i];
        getNewButton.classList.add("dropButton");
        document.getElementById("wordlists").appendChild(getNewButton);
        // add a button to the wordlist link that allows the wordlist to be deleted
        var getDeleterButton = document.createElement("input");
        getDeleterButton.type = "button";
        getDeleterButton.classList.add("deletes");
        getDeleterButton.value = "X";
        getDeleterButton.setAttribute("onClick","deleteWordList('" + names[i] + "')");
        document.getElementById("wordlists").appendChild(getDeleterButton);
        document.getElementById("wordlists").appendChild(document.createElement("br"));
      }
    }
    var getNewButton = document.createElement("input");
    // add the option to import from computer
    getNewButton.type = "button";
    getNewButton.setAttribute("onClick","importWordsFromFile()");
    getNewButton.value = "import from files";
    getNewButton.classList.add("dropButton");
    document.getElementById("wordlists").appendChild(getNewButton);
    menu.hidden = false;
  }
}
function importWordsFromFile() {
  var wordList = JSON.parse(prompt("Copy in your word file:"));
  for (var i = 0; i < wordList.length; i++) {
    var wordNum = nextWordNumber;
    createAbox();
    document.getElementById("word" + wordNum).value = wordList[i].word;
    document.getElementById("meaning" + wordNum).value = wordList[i].meaning;
  }
  updateWords();
}
function saveWords() {
  if (document.getElementById("saveOptions").hidden) {
    document.getElementById("saveOptions").hidden = false;
  } else {
    document.getElementById("saveOptions").hidden = true;
  }
}
function deleteWordList(listName) {
  localStorage.removeItem(listName);
  var nameList = JSON.parse(localStorage.getItem("nameList"));
  for (var i = 0; i < nameList.length; i++) {
    if (nameList[i] == listName) {
      nameList.splice(i,1);
      break;
    }
  }
  document.getElementById("wordlists").hidden = true;
  localStorage.setItem("nameList",JSON.stringify(nameList));
  getWordList();
}
function importWords(listName) {
  var wordList = JSON.parse(localStorage.getItem(listName));
  for (var i = 0; i < wordList.length; i++) {
    var wordNum = nextWordNumber;
    createAbox();
    document.getElementById("word" + wordNum).value = wordList[i].word;
    document.getElementById("meaning" + wordNum).value = wordList[i].meaning;
  }
  updateWords();
}
