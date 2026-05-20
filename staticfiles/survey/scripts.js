// Configuration for graph dimensions
const graphConfig = {
    width: 900,   // match your canvas width
    height: 700,  // match your canvas height
    graphWidth: 700,  // adjust as needed for margins
    graphHeight: 500,
    graphX: 100,
    graphY: 100,
};
// Function to draw the graph
function drawGraph(ctx) {
    const { graphWidth, graphHeight, graphX, graphY } = graphConfig;

    // Efface le canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Dessine les axes
    drawAxes(ctx, graphX, graphY, graphWidth, graphHeight);

    // Dessine la ligne verticale (séparation)
    ctx.save();
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    const x5 = graphX + graphWidth / 2;
    ctx.beginPath();
    ctx.moveTo(x5, graphY);
    ctx.lineTo(x5, graphY + graphHeight);
    ctx.stroke();

    // Dessine la ligne horizontale (séparation)
    const y5 = graphY + graphHeight / 2;
    ctx.beginPath();
    ctx.moveTo(graphX, y5);
    ctx.lineTo(graphX + graphWidth, y5);
    ctx.stroke();
    ctx.restore();

    // Titres des sections
    const quadrantTitles = [
        ["High impact Low probability", "High impact High probability"],
        ["Low impact Low probability", "Low impact High probability"]
    ];
    const halfWidth = graphWidth / 2;
    const halfHeight = graphHeight / 2;

    ctx.save();
    ctx.font = "bold 14px Arial";
    ctx.fillStyle = "#333";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (let row = 0; row < 2; row++) {
        for (let col = 0; col < 2; col++) {
            const titleX = graphX + col * halfWidth + halfWidth / 2;
            const titleY = graphY + row * halfHeight + halfHeight / 2;
            ctx.fillText(quadrantTitles[row][col], titleX, titleY);
        }
    }
    ctx.restore();

    // Add graduations (toujours 0-10)
    addXGraduations(ctx, graphX, graphY, graphWidth, graphHeight);
    addYGraduations(ctx, graphX, graphY, graphHeight, 10);

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
    const cols = 10; // Number of graduations (0 to 10)
    const cellWidth = graphWidth / cols;

    ctx.font = "14px Arial";
    ctx.fillStyle = "#000000";
    ctx.textAlign = "center";

    // Add X-axis graduations
    for (let i = 0; i <= cols; i++) {
        const x = graphX + i * cellWidth;
        const value = i; // Graduation value as integer
        ctx.fillText(value, x, graphY + graphHeight + 20);
    }
}
// Function to add Y-axis graduations
function addYGraduations(ctx, graphX, graphY, graphHeight, rows) {
    const cellHeight = graphHeight / rows;

    ctx.font = "14px Arial";
    ctx.fillStyle = "black"
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";

    // Add Y-axis graduations
    for (let i = 0; i <= rows; i++) {
        const y = graphY + graphHeight - i * cellHeight;
        const value = i; // Graduation value as integer
        ctx.fillText(value, graphX - 10, y);
    }
}


// Function to draw grid
function drawGrid(ctx, graphX, graphY, graphWidth, graphHeight, rows, cols, title = null) {
    const cellWidth = graphWidth / cols;
    const cellHeight = graphHeight / rows;

    // Fill each cell with a color (e.g., light gray)
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            ctx.save();
            ctx.fillStyle = "#f0f0f0"; // Change color as needed
            ctx.fillRect(
                graphX + col * cellWidth,
                graphY + row * cellHeight,
                cellWidth,
                cellHeight
            );
            ctx.restore();
        }
    }

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

    // Draw the title in the center if provided
    if (title) {
        ctx.save();
        ctx.font = "bold 18px Arial";
        ctx.fillStyle = "#333";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(
            title,
            graphX + graphWidth / 2,
            graphY + graphHeight / 2
        );
        ctx.restore();
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

    const impact = ((x - graphConfig.graphX) / graphConfig.graphWidth * 10).toFixed(2);
    const probability = ((graphConfig.graphY + graphConfig.graphHeight - y) / graphConfig.graphHeight * 10).toFixed(2);

    if (impact >= 0 && impact <= 10 && probability >= 0 && probability <= 10) {
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

