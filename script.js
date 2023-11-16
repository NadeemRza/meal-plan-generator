document
  .getElementById("mealForm")
  .addEventListener("submit", generateMealPlan);

let formContainer = document.getElementById("mainContainer");
let loader = document.querySelector(".loader");
let mealPlanContainer = document.getElementById("mealPlanDisplay");

function generateMealPlan(event) {
  event.preventDefault();
  formContainer.classList.toggle("blur");
  mealPlanContainer.classList.toggle("blur");
  loader.classList.toggle("hide");
  loader.classList.toggle("show");

  let age = document.getElementById("age").value;
  let weight = document.getElementById("weight").value;
  let height = document.getElementById("height").value;
  let gender = document.getElementById("gender").value;
  let activityLevel = document.getElementById("activityLevel").value;
  let numOfMeals = document.getElementById("numOfMeals").value;
  let dietPreference = document.getElementById("dietPreference").value;
  let healthSpec = document.getElementById("healthSpec").value;

  let bmr;
  if (gender === "male") {
    bmr = 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age;
  } else if (gender === "female") {
    bmr = 447.593 + 9.247 * weight + 3.098 * height - 4.33 * age;
  }

  let calories = Math.round(bmr * activityLevel);
  let totalMeals = numOfMeals * 7;

  // Edamam API details
  const APP_ID = "d274a2ad";
  const APP_KEY = "c2131569c6f44750cca1ba268df3de02";

  // API endpoint
  let apiUrl = `https://api.edamam.com/search?q=${dietPreference}&app_id=${APP_ID}&app_key=${APP_KEY}&from=0&to=${totalMeals}&calories=${calories}&health=${healthSpec}&diet=${dietPreference}&health=${healthSpec}`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => displayMealPlan(data.hits, numOfMeals))
    .catch((error) => {
      document.querySelector(".loader h1").innerText =
        "Something Went Wrong...";
      console.error("Error:", error);
    });
}

function displayMealPlan(meals, numOfMeals) {
  let mealPlanDisplay = document.getElementById("mealPlanDisplay");
  mealPlanDisplay.innerHTML = ""; // Clear previous meal plan

  // Create table and headings
  let table = document.createElement("table");
  let thead = document.createElement("thead");
  let tbody = document.createElement("tbody");
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  let headerRow = document.createElement("tr");
  days.forEach((day) => {
    let th = document.createElement("th");
    th.textContent = day;
    if (window.innerWidth < 749) {
      if (numOfMeals == 2) {
        th.style.height = "31.1em";
      }
      if (numOfMeals == 3) {
        th.style.height = "48em";
      }
      if (numOfMeals == 5) {
        th.style.height = "81.65em";
      }
    }
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Fill table with meal data
  for (let i = 0; i < numOfMeals; i++) {
    let row = document.createElement("tr");
    for (let j = 0; j < 7; j++) {
      let meal = meals[i * 7 + j].recipe;
      let cell = document.createElement("td");
      cell.innerHTML = `
      <img src="${meal.image}" alt="${meal.label}">
                <h3>${meal.label}</h3>
                <button href="${meal.url}" target="_blank">View Recipe</button>
            `;
      if (cell.querySelector("h3").innerText.length > 25) {
        cell.querySelector("h3").innerText =
          cell.querySelector("h3").innerText.slice(0, 25) + "...";
      }
      row.appendChild(cell);
    }
    tbody.appendChild(row);
  }
  table.appendChild(tbody);

  mealPlanDisplay.appendChild(table);
  formContainer.classList.toggle("blur");
  mealPlanContainer.classList.toggle("blur");
  loader.classList.toggle("hide");
  loader.classList.toggle("show");
}
