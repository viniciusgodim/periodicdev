function fetchJSONFile(path, callback) {
  var httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = function() {
    if (httpRequest.readyState === 4) {
      if (httpRequest.status === 200) {
        var data = JSON.parse(httpRequest.responseText);
        if (callback) callback(data);
      }
    }
  };
  httpRequest.open('GET', path);
  httpRequest.send();
}

function getRandomArrayElements(arr, count) {
  var shuffled = arr.slice(0),
    i = arr.length,
    min = i - count,
    temp, index;
  while (i-- > min) {
    index = Math.floor((i + 1) * Math.random());
    temp = shuffled[index];
    shuffled[index] = shuffled[i];
    shuffled[i] = temp;
  }
  return shuffled.slice(min);
}

function setBubble(range, bubble) {
  const val = range.value;
  const min = range.min ? range.min : 0;
  const max = range.max ? range.max : 100;
  const newVal = Number(((val - min) * 100) / (max - min));
  bubble.innerHTML = val;
  bubble.style.left = `calc(${newVal}% + (${8 - newVal * 0.15}px))`;
}

function fillSquare(Element, AtomicNumber, showNumbers) {
  list = ["Symbol", "Element"];
  if (showNumbers) {
    list = list.concat(["AtomicNumber", "AtomicMass"]);
  }
  for (item of list) {
    var itemElement = document.createElement('div');
    itemElement.className = item
    itemElement.innerText = data[AtomicNumber - 1][item];
    document.getElementById(Element).appendChild(itemElement);
  }
}

function handleScores() {
  document.getElementById("correctScore").innerText = correctScore;
  document.getElementById("incorrectScore").innerText = incorrectScore;
}

function handleClick(event) {
  button = event.target;
  button.blur();
  if (button.id == "correctSquare") {
    generateGame();
  } else {
    if (options.includes(parseInt(button.getAttribute('AtomicNumber')))) {
      if (button.getAttribute("AtomicNumber") == correctAtomicNumber) {
        if (totalOptions.length > 0) {
          fillSquare(button.id, correctAtomicNumber, true);
          document.getElementById(button.id).setAttribute('alreadyPlayed', true);
          correctScore++;
          handleScores();
          generateGame();
        }
      } else {
        button.style.backgroundColor = 'LightCoral'
        incorrectScore++;
        handleScores();
      }
    }
  }
}

function generateGame() {
  buildOptions();
  squares.forEach(square => {
    if (!square.getAttribute('outOfGame')) {
      square.style.backgroundColor = '';
    }
  });
  if (totalOptions.length > 0) {
    options = getRandomArrayElements(totalOptions, numberOfOptions);
    correctIndex = Math.floor(Math.random() * numberOfOptions);
    correctAtomicNumber = options[correctIndex]
    document.getElementById("correctSquare").innerHTML = '';
    fillSquare("correctSquare", correctAtomicNumber, false);
    squares.forEach(button => {
      if (options.includes(parseInt(button.getAttribute('AtomicNumber')))) {
        button.style.backgroundColor = 'Moccasin';
      }
    });
    squares.forEach(button => button.removeEventListener("click", handleClick));
    squares.forEach(button => button.addEventListener("click", handleClick));
  }
}

function unique(value, index, self) {
  return self.indexOf(value) === index;
}

function buildOptions() {
  totalOptions = [];
  squares.forEach(square => {
    if (!square.getAttribute('alreadyPlayed') && !square.getAttribute('outOfGame')) {
      totalOptions.push(parseInt(square.getAttribute('AtomicNumber')));
    }
  });
  totalOptions.shift();
  numberOfOptions = numberOfOptionsRange.value;
  if (totalOptions.length < numberOfOptions) {
    numberOfOptions = totalOptions.length;
  }
}

var data;
var options = [];
var numberOfOptions;
var numberOfOptionsRange;

function main() {
  fetchJSONFile('periodic.json', function(dataArgument) {
    data = dataArgument;
    var elementTypes = data.map(a => a.Type);
    uniqueElementTypes = elementTypes.filter(unique);
    for (i = 0; i < uniqueElementTypes.length; i++) {
      var label = document.createElement("label");
      var elementTypeSpan = document.createElement("div");
      var elementTypeText = document.createTextNode(uniqueElementTypes[i]);
      elementTypeSpan.appendChild(elementTypeText);
      var elementTypeCheckBox = document.createElement("input");
      elementTypeCheckBox.setAttribute("type", "checkbox");
      elementTypeCheckBox.checked = true;
      label.appendChild(elementTypeCheckBox);
      label.appendChild(elementTypeSpan);
      document.getElementById("checkBoxes").appendChild(label);
    }
    numberOfOptionsRange = document.querySelector("input[type=range]");
    numberOfOptionsBubble = document.querySelector(".bubble");
    setBubble(numberOfOptionsRange, numberOfOptionsBubble);
    numberOfOptionsRange.addEventListener("input", () => {
      setBubble(numberOfOptionsRange, numberOfOptionsBubble);
    });
    numberOfOptionsRange.addEventListener('change', function() {
      generateGame();
      numberOfOptionsRange.blur();
    });
    var checkBoxes = document.querySelectorAll("input[type=checkbox]");
    checkBoxes.forEach(checkBox => {
      checkBox.addEventListener('change', function() {
        squares.forEach(square => {
          if (square.getAttribute('Type') == this.parentElement.innerText) {
            if (!square.getAttribute('alreadyPlayed')) {
              if (this.checked) {
                square.removeAttribute("outOfGame");
                square.style.backgroundColor = '';
                square.innerHTML = '';
              } else {
                fillSquare(square.id, square.getAttribute('AtomicNumber'), true);
                square.style.backgroundColor = 'LightSteelBlue';
                square.setAttribute('outOfGame', true);
              }
            }
          }
        });
        generateGame();
      });
    });
    for (var entry of data) {
      var square = document.createElement('button');
      size = 5.555
      square.style.position = "absolute";
      if (entry.Group != null) {
        square.style.left = size * (entry.Group - 1) + 'vw';
        square.style.top = size * (entry.Period - 1) + 'vw';
      } else {
        if (entry.Period == 6) {
          square.style.left = 3 * size + (entry.AtomicNumber - 57) * size + 'vw';
          square.style.top = 7 * size + size / 3 + 'vw';
        }
        if (entry.Period == 7) {
          square.style.left = 3 * size + (entry.AtomicNumber - 89) * size + 'vw';
          square.style.top = 8 * size + size / 3 + 'vw';
        }
      }
      square.setAttribute('AtomicNumber', entry.AtomicNumber);
      square.setAttribute('Type', entry.Type);
      square.id = entry.Element;
      document.getElementById('table').appendChild(square);
    }
    squares = document.querySelectorAll("button");
    correctScore = incorrectScore = 0;
    generateGame();
  });
}
