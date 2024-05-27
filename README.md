# Hot Air Balloon Visualization
This repository contains a JavaScript project that visualizes hot air balloons on an SVG canvas based on multivariate data. The dataset consists of 10 data cases, each containing five positive quantitative variables. Each data case corresponds to a hot air balloon, and the variables determine its position, size, and color. The project utilizes D3.js for data visualization and interaction.

## Features:
- Displays 10 hot air balloons on an SVG canvas, each representing a data case.
- Position of balloons is determined by the first two variables, while size and color are determined by the third, fourth, and fifth variables respectively.
- Clicking on a balloon changes its color to white.
- Clicking on a second balloon swaps variables between the two balloons, excluding position and color variables.
- Smooth animation for resizing balloons.
- Utilizes D3.js scales to map variable values to coordinate ranges.

## Files:
- index.html: HTML file containing the SVG canvas and script tags.
- data.json: JSON file containing the multivariate dataset for hot air balloons.
- js/script.js: JavaScript file containing the D3.js code for data visualization and interaction.
- css/style.css: CSS file containing styles for the index.html page.

## Demo
[demo](https://ic-99.github.io/information-visualization/)
