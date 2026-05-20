// Configuration for graph dimensions
const graphConfig = {
    width: 1000,
    height: 600,
    graphWidth: 600,
    graphHeight: 400,
    graphX: 50,
    graphY: 50,
};

// Function to draw the graph
function drawGraph(ctx) {
    const { graphWidth, graphHeight, graphX, graphY } = graphConfig;

    // Clear the canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Draw axes
    drawAxes(ctx, graphX, graphY, graphWidth, graphHeight);

    // Draw grid
    drawGrid(ctx, graphX, graphY, graphWidth, graphHeight, 3, 3);

    // Add graduations
    addXGraduations(ctx, graphX, graphY, graphWidth, graphHeight);
    addYGraduations(ctx, graphX, graphY, graphHeight, 4);
    // Add axis labels
    addLabels(ctx, graphX, graphY, graphWidth, graphHeight);
}

// Function to draw axes
function drawAxes(ctx, graphX, graphY, graphWidth, graphHeight) {
    ctx.beginPath();
    ctx.moveTo(graphX, graphY + graphHeight); // Start of the X-axis (bottom-left corner)
    ctx.lineTo(graphX + graphWidth, graphY + graphHeight); // End of the X-axis (bottom-right corner)
    ctx.moveTo(graphX, graphY + graphHeight); // Start of the Y-axis (bottom-left corner)
    ctx.lineTo(graphX, graphY); // End of the Y-axis (top-left corner)
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;
    ctx.stroke();
}

// Function to add axes graduations
function addXGraduations(ctx, graphX, graphY, graphWidth, graphHeight) {
    const cols = 4; // Number of graduations
    const cellWidth = graphWidth / cols;

    ctx.font = "14px Arial";
    ctx.fillStyle = "#000000";
    ctx.textAlign = "center";

    // Add X-axis graduations
    for (let i = 0; i <= cols; i++) {
        const x = graphX + i * cellWidth;
        const value = i.toFixed(1); // Graduation value
        ctx.fillText(value, x, graphY + graphHeight + 20); // Position below X-axis
    }

}
// Function to add Y-axis graduations
function addYGraduations(ctx, graphX, graphY, graphHeight, rows) {
    const cellHeight = graphHeight / rows; // Height of each graduation step

    ctx.font = "14px Arial";
    ctx.fillStyle = "#000000";
    ctx.textAlign = "right"; // Align text to the right of the Y-axis
    ctx.textBaseline = "middle"; // Center text vertically

    // Add Y-axis graduations
    for (let i = 0; i <= rows; i++) {
        const y = graphY + graphHeight - i * cellHeight; // Position of the graduation
        const value = i.toFixed(1); // Graduation value
        ctx.fillText(value, graphX - 10, y); // Position text slightly left of the Y-axis
    }
}


// Function to draw grid
function drawGrid(ctx, graphX, graphY, graphWidth, graphHeight, rows, cols) {
    const cellWidth = graphWidth / cols;
    const cellHeight = graphHeight / rows;

    ctx.strokeStyle = "#cccccc";
    ctx.lineWidth = 1;

    // Titles for each cell
    const cellTitles = [
        ["High Impact, Low Probability", "High Impact, Medium Probability", "High Impact, High Probability"],
        ["Medium Impact, Low Probability", "Medium Impact, Medium Probability", "Medium Impact, High Probability"],
        ["Low Impact, Low Probability", "Low Impact, Medium Probability", "Low Impact, High Probability"]
    ];

    // Draw horizontal lines
    for (let i = 0; i <= rows; i++) {
        const y = graphY + i * cellHeight;
        ctx.beginPath();
        ctx.moveTo(graphX, y);
        ctx.lineTo(graphX + graphWidth, y);
        ctx.stroke();
    }

    // Draw vertical lines
    for (let i = 0; i <= cols; i++) {
        const x = graphX + i * cellWidth;
        ctx.beginPath();
        ctx.moveTo(x, graphY);
        ctx.lineTo(x, graphY + graphHeight);
        ctx.stroke();
    }

    // Add titles to each cell
    ctx.font = "11px Arial";
    const gradient = ctx.createLinearGradient(0, 1, 200, 0);
    gradient.addColorStop(0, "grey");
    gradient.addColorStop(1, "blue");
    ctx.fillStyle = gradient;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const x = graphX + col * cellWidth + cellWidth / 2; // Center of the cell horizontally
            const y = graphY + row * cellHeight + cellHeight / 2; // Center of the cell vertically
            ctx.fillText(cellTitles[row][col], x, y); // Draw the title
        }
    }
}

// Function to add axis labels
function addLabels(ctx, graphX, graphY, graphWidth, graphHeight) {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#000000";

    // X-axis label
    ctx.textAlign = "center";
    ctx.fillText("Probability", graphX + graphWidth / 2, graphY + graphHeight + 40);

    // Y-axis label
    ctx.save();
    ctx.translate(graphX - 40, graphY + graphHeight / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("Impact", 0, 0);
    ctx.restore();
}

// Function to handle clicks on the canvas
function handleCanvasClick(event, canvas, ctx, i) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    const impact = ((x - graphConfig.graphX) / graphConfig.graphWidth * 4).toFixed(2);
    const probability = ((graphConfig.graphY + graphConfig.graphHeight - y) / graphConfig.graphHeight * 4).toFixed(2);

    if (impact >= 0 && impact <= 4 && probability >= 0 && probability <= 4) {
        document.getElementById(`impact_${i}`).value = impact;
        document.getElementById(`probability_${i}`).value = probability;

        drawGraph(ctx);

        // Draw the red cross at the clicked point
        ctx.beginPath();
        ctx.strokeStyle = "red";
        ctx.moveTo(x - 5, y - 5);
        ctx.lineTo(x + 5, y + 5);
        ctx.moveTo(x - 5, y + 5);
        ctx.lineTo(x + 5, y - 5);
        ctx.stroke();
    }
}

// Initialize graphs
document.addEventListener("DOMContentLoaded", () => {
    for (let i = 1; i <= 10; i++) {
        const canvas = document.getElementById(`graph_${i}`);
        const ctx = canvas.getContext("2d");

        // Set canvas dimensions
        canvas.width = graphConfig.width;
        canvas.height = graphConfig.height;

        // Draw the initial graph
        drawGraph(ctx);

        // Add click event listener
        canvas.addEventListener("click", (event) => handleCanvasClick(event, canvas, ctx, i));
    }
});

document.addEventListener("DOMContentLoaded", () => {
    // Select the button container
    const buttonContainer = document.querySelector(".button-container");

    // Apply styles to move the button to the left
    if (buttonContainer) {
        buttonContainer.style.display = "flex";
        buttonContainer.style.justifyContent = "flex-start"; // Align the button to the left
        buttonContainer.style.marginTop = "20px"; // Add spacing above the button
    }
});

