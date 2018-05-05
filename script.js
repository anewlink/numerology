const api = (function() {
  const charToVal = {};

  for (let i = 0; i < 26; i++) {
    charToVal[String.fromCharCode("a".charCodeAt(0) + i)] = i % 9 + 1;
  }

  function calculateDestiny(fullName) {
    const names = fullName.split(" ");

    let result = names.reduce((total, name) => {
      let sum = 0;
      for (let i = 0; i < name.length; i++) {
        sum += charToVal[name.charAt(i)];
      }
      return reduceNumber(sum) + total;
    }, 0);

    return reduceNumber(result);
  }

  function calculateLifePath(birthdate) {
    const [year, month, day] = birthdate.split("-");
    const sum = parseInt(year) + parseInt(month) + parseInt(day);
    return reduceNumber(sum);
  }

  function calculateSoulUrge(fullName) {
    const regexp = /[aeiou]/gi;
    const result = fullName
      .toLowerCase()
      .match(regexp)
      .reduce((total, letter) => total + charToVal[letter], 0);

    return reduceNumber(result);
  }

  function calculatePersonality(fullName) {
    const regexp = /[^aeiou\s]/gi;
    const result = fullName
      .toLowerCase()
      .match(regexp)
      .reduce((total, letter) => total + charToVal[letter], 0);

    return reduceNumber(result);
  }

  function reduceNumber(num) {
    if (num < 10 || num === 11 || num === 22 || num === 33) {
      return num;
    }

    let digit = num;
    num = 0;
    while (digit !== 0) {
      num += digit % 10;
      digit = Math.floor(digit / 10);
    }

    return reduceNumber(num);
  }

  const form = document.querySelector(`.main-form`);
  const date = document.querySelector(`.dob`);
  const lifePath = document.querySelector(`.life-path`);
  const soulUrge = document.querySelector(`.soul-urge`);
  const destiny = document.querySelector(`.destiny`);
  const personality = document.querySelector(`.personality`);

  const nameError = document.querySelector(`.name-error`);
  const dateError = document.querySelector(`.dob-error`);

  const numbers = { lifePath, soulUrge, destiny, personality };
  const calculations = {
    lifePath: calculateLifePath,
    soulUrge: calculateSoulUrge,
    destiny: calculateDestiny,
    personality: calculatePersonality
  };

  const results = Array.from(document.querySelector(".results").children);

  function doCalculations(e) {
    e.preventDefault();
    const name = this.querySelector(`[name="name"]`).value;

    if (!validateInput(name)) return;

    Object.keys(numbers).forEach(number => {
      numbers[number].innerHTML = "";
      numbers[number].classList.remove("show");
    });

    console.log(name);
    const delayDuration = 500;

    if (!date.value) {
      lifePath.style["position"] = "absolute";
    } else {
      lifePath.style["position"] = "static";
    }

    results.forEach((result, index) => {
      const number = convertToCamelCase(result.className);
      setTimeout(() => {
        if (number !== "lifePath" || (number === "lifePath" && date.value)) {
          const text = result.className.split("-");
          console.log(text);

          numbers[number].classList.add("show");

          numbers[number].innerHTML = `Your ${text[0].charAt(0).toUpperCase() +
            text[0].slice(1)}${
            text[1]
              ? " " + text[1].charAt(0).toUpperCase() + text[1].slice(1)
              : ""
          } number is ${calculations[number](
            number !== "lifePath" ? name : date.value
          )}`;
        }
      }, delayDuration * index);
    });
  }

  function dateBlur(e) {
    this.type = "text";
  }

  function dateFocus(e) {
    this.type = "date";
  }

  function convertToCamelCase(str) {
    const words = str.split("-");

    return words.reduce((fullString, currentWord, index) => {
      if (index > 0) {
        return (
          fullString +
          currentWord.charAt(0).toUpperCase() +
          currentWord.slice(1)
        );
      }
      return currentWord;
    }, "");
  }

  function validateInput(name) {
    nameError.innerHTML = "";
    dateError.innerHTML = "";
    let isValid = true;

    if (!name) {
      nameError.innerHTML = "Please enter your name";
      isValid = false;
    }

    if (!date.value) {
      dateError.innerHTML = "Please enter birth date";
      isValid = false;
    }

    return isValid;
  }

  form.addEventListener("submit", doCalculations);
  date.addEventListener("blur", dateBlur);
  date.addEventListener("focus", dateFocus);

  return {
    calculateSoulUrge,
    calculatePersonality,
    reduceNumber
  };
})();
