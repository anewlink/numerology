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
  const date = document.querySelector(`[name="date"]`);

  const lifePath = document.querySelector(`.life-path`);
  const soulUrge = document.querySelector(`.soul-urge`);
  const destiny = document.querySelector(`.destiny`);
  const personality = document.querySelector(`.personality`);

  function doCalculations(e) {
    e.preventDefault();

    const name = this.querySelector(`[name="name"]`).value;
    soulUrge.innerHTML = name
      ? `Your Soul Urge number is ${calculateSoulUrge(name)}`
      : "";

    lifePath.innerHTML = date.value
      ? `Your Life Path number is ${calculateLifePath(date.value)}`
      : "";

    destiny.innerHTML = name
      ? `Your Destiny number is ${calculateDestiny(name)}`
      : "";

    personality.innerHTML = name
      ? `Your Personality number is ${calculatePersonality(name)}`
      : "";
  }

  function dateBlur(e) {
    this.type = "text";
  }

  function dateFocus(e) {
    this.type = "date";
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
