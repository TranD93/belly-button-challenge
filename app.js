// The URL with data
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Display the default plots
function init() {
    let dropdownMenu = d3.select("#selDataset");

    // Fetch the JSON data and log it
    d3.json(url).then(data => {
        console.log("Data:", data);

        let names = data.names;

        // Populate dropdown options
        names.forEach(name => {
            dropdownMenu.append("option")
                .text(name)
                .property("value", name);
        });

        let initialName = names[0];

        // Call functions to create visualizations
        demo(initialName);
        bar(initialName);
        bubble(initialName);
        gauge(initialName);
    });
}

// Create the demographics panel
function demo(selectedValue) {
    d3.json(url).then(data => {
        console.log("Data:", data);

        let metadata = data.metadata;

        let filteredData = metadata.filter(meta => meta.id == selectedValue);
        let obj = filteredData[0];

        let sampleMetadata = d3.select("#sample-metadata");
        sampleMetadata.html("");

        Object.entries(obj).forEach(([key, value]) => {
            sampleMetadata.append("h5").text(`${key}: ${value}`);
        });

        console.log(Object.entries(obj));
    });
}

// Create the bar chart
function bar(selectedValue) {
    d3.json(url).then(data => {
        console.log("Data:", data);

        let samples = data.samples;

        let filteredData = samples.filter(sample => sample.id === selectedValue);
        let obj = filteredData[0];

        let trace = [{
            x: obj.sample_values.slice(0, 10).reverse(),
            y: obj.otu_ids.slice(0, 10).map(otu_id => `OTU ${otu_id}`).reverse(),
            text: obj.otu_labels.slice(0, 10).reverse(),
            type: "bar",
            marker: {
                color: "rgb(166, 172, 237)"
            },
            orientation: "h"
        }];

        Plotly.newPlot("bar", trace);
    });
}

// Create the bubble chart
function bubble(selectedValue) {
    d3.json(url).then(data => {
        let samples = data.samples;

        let filteredData = samples.filter(sample => sample.id === selectedValue);
        let obj = filteredData[0];

        let trace = [{
            x: obj.otu_ids,
            y: obj.sample_values,
            text: obj.otu_labels,
            mode: "markers",
            marker: {
                size: obj.sample_values,
                color: obj.otu_ids,
                colorscale: "Sunset"
            }
        }];

        let layout = {
            xaxis: { title: "OTU ID" }
        };

        Plotly.newPlot("bubble", trace, layout);
    });
}

// Create the gauge chart 
function gauge(selectedValue) {
    d3.json(url).then(data => {
        let metadata = data.metadata;

        let filteredData = metadata.filter(meta => meta.id == selectedValue);
        let obj = filteredData[0];

        let trace = [{
            domain: { x: [0, 1], y: [0, 1] },
            value: obj.wfreq,
            title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week", font: { size: 24 } },
            type: "indicator",
            mode: "gauge+number",
            gauge: {
                axis: { range: [null, 10] },
                bar: { color: "rgb(68, 166, 198)" },
                steps: [
                    { range: [0, 1], color: "rgb(233, 245, 248)" },
                    { range: [1, 2], color: "rgb(218, 237, 244)" },
                    { range: [2, 3], color: "rgb(203, 230, 239)" },
                    { range: [3, 4], color: "rgb(188, 223, 235)" },
                    { range: [4, 5], color: "rgb(173, 216, 230)" },
                    { range: [5, 6], color: "rgb(158, 209, 225)" },
                    { range: [6, 7], color: "rgb(143, 202, 221)" },
                    { range: [7, 8], color: "rgb(128, 195, 216)" },
                    { range: [8, 9], color: "rgb(113, 187, 212)" },
                    { range: [9, 10], color: "rgb(98, 180, 207)" }
                ]
            }
        }];

        Plotly.newPlot("gauge", trace);
    });
}

// Change plots when option is changed
function optionChanged(selectedValue) {
    demo(selectedValue);
    bar(selectedValue);
    bubble(selectedValue);
    gauge(selectedValue);
}

// Initialize the page
init();
