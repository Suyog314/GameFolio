
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 600;
canvas.height = 400;

let minRadius = 50;
let isDrawing = false;
let radius = 0;
let startX, startY;
let finalRadius = 0;
let perfectCircle = true;

const minRadiusElement = document.getElementById("min-radius");
const perfectionElement = document.getElementById("perfection");
const popup = document.getElementById("popup");
const finalPerfectionElement = document.getElementById("final-perfection");

function startDrawing(event) {
    if (radius < minRadius) return;

    isDrawing = true;
    startX = event.offsetX;
    startY = event.offsetY;
    radius = 0; // Reset radius
}

function drawCircle(event) {
    if (!isDrawing) return;

    const currentX = event.offsetX;
    const currentY = event.offsetY;

    // Calculate radius from starting point
    radius = Math.sqrt(Math.pow(currentX - startX, 2) + Math.pow(currentY - startY, 2));

    // Draw the circle on canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(startX, startY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = "#FF5F00";
    ctx.lineWidth = 5;
    ctx.stroke();
    
    // Check circle perfection
    const perfection = calculatePerfection(radius);
    perfectionElement.innerText = `${Math.round(perfection)}%`;
    
    if (perfection < 95) {
        perfectCircle = false;
    } else {
        perfectCircle = true;
    }
}

function stopDrawing() {
    if (radius < minRadius) return;

    isDrawing = false;

    // Final check for perfection
    const perfection = calculatePerfection(radius);
    if (perfectCircle) {
        alert("You drew a perfect circle! Well done!");
    } else {
        showPopup(perfection);
    }
}

function calculatePerfection(radius) {
    // Assuming perfection is how close the radius is to the ideal value
    const idealRadius = 100; // Ideal radius to target for perfect circle
    const diff = Math.abs(radius - idealRadius);
    return Math.max(0, 100 - (diff / idealRadius) * 100);
}

function showPopup(perfection) {
    finalPerfectionElement.innerText = `${Math.round(perfection)}%`;
    popup.style.display = "flex";
}

function restartGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    radius = 0;
    perfectCircle = true;
    popup.style.display = "none";
    perfectionElement.innerText = "0%";
}

canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", drawCircle);
canvas.addEventListener("mouseup", stopDrawing);

document.addEventListener("keydown", (e) => {
    if (e.key === "r") {
        restartGame();
    }
});
