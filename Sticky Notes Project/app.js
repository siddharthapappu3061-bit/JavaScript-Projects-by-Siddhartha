const input = document.querySelector(".input");
const button = document.querySelector(".add-note");
const notes = document.querySelector(".notes-container");

let count = 0;

button.addEventListener("click", () => {
    const text = input.value;
    count++;

    if(text === ""){
        return;
    }

    const card = document.createElement("div");
    const tools = document.createElement("div");
    const circle = document.createElement("div");
    const red = document.createElement("div");
    const content = document.createElement("div");

    if(count %2 === 0){
        card.style.backgroundColor = "rgb(230, 133, 209)";
    }

    card.classList.add("card");
    tools.classList.add("tools");
    circle.classList.add("circle");
    red.classList.add("red", "box");
    content.classList.add("content");

    content.textContent = text;

    red.addEventListener("click", () => {
        notes.removeChild(card);
    });

    circle.appendChild(red);
    tools.appendChild(circle);
    card.appendChild(tools);
    card.appendChild(content);
    notes.appendChild(card);

    input.value = "";
});