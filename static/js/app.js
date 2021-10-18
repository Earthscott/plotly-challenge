// Import JSON data to variables
let names = data.names;
let metadata = data.metadata;
let samples = data.samples;

// Make demographic code to text Objects
let genderLkup = {
    "F": "Female",
    "f": "Female",
    "M": "Male",
    "m": "Male",
};
let buttonLkup = {
    "I": "Innie",
    "i": "Innie",
    "O": "Outie",
    "o": "Outie",
    "Both": "Both",
    "Unknown": "Not reported"
};

// Populate Demography card
function procDemogData(demogData) {
    for (const demogKey of Object.keys(demogData)) {
        // process values to fill null, format location, and 
        // convert codes to meaningful text
        if (demogData[demogKey] === null) {
            demogData[demogKey] = "Not reported";
        } else if (demogKey === "location") {
            demogData[demogKey] = demogData[demogKey].replace("/", ", ");
        } else if (demogKey === "gender") {
            demogData[demogKey] = genderLkup[demogData[demogKey]];
        } else if (demogKey === "bbtype") {
            demogData[demogKey] = buttonLkup[demogData[demogKey]];
        }
        // Use D3 to transfer values to card for given subject id
        let cssId = "#" + demogKey;
        let demogText = d3.select(cssId);
        demogText.text(demogData[demogKey]);
    };
};

function updatePlots(subId, sampleData) {
    // Bar chart
    Plotly.restyle("bar", "x", [sampleData["sample_values"].slice(0,10)]);
    Plotly.restyle("bar", "y", [sampleData["otu_id_text"].slice(0,10)]);
    Plotly.restyle("bar", "text", [sampleData["otu_labels"].slice(0,10)]);
    Plotly.relayout("bar", "title", `Top 10 Operational Taxonomic Units (OTUs) by<br> Relative Abundance for Test Subject ${subId}`);

    // Bubble chart
    Plotly.restyle("bubble", "x", [sampleData["otu_ids"]]);
    Plotly.restyle("bubble", "y", [sampleData["sample_values"]]);
    Plotly.restyle("bubble", "text", [sampleData["otu_labels"]]);
    Plotly.restyle("bubble", "marker", {
        size: sampleData["sample_values"].map(k => k * 0.65),
        color: sampleData["otu_ids"],
        colorscale: "Portland"
    });
}

function init() {
    // Fill select box using D3
    let dropDown = d3.select("#selDataset");
    for (let i = 0; i < names.length; i++) {
        let option = dropDown.append("option");
        option.attr("value", names[i]);
        option.text(names[i]);
    };

    // create Object to store metadata by subject id
    let metaLookup = {};
    for (let i = 0; i < metadata.length; i++) {
        let subId = metadata[i].id;
        metaLookup[subId] = metadata[i];
    };

    // call Demographics card function with metadata Object for initial subject id
    procDemogData(metaLookup[names[0]]);

    // create Object to store samples data by subject id, 
    // sorted reverse by OTU sample values
    let sampleLookup = {};
    for (let i = 0; i < samples.length; i++) {
        let obj = samples[i];
        let arr = [obj.otu_ids, obj.sample_values, obj.otu_labels];
        arr.sort((a,b) => b[1] - a[1]);
        sampleLookup[obj.id] = {
            "otu_ids": arr[0],
            "otu_id_text": arr[0].map(j => "OTU " + j),
            "sample_values": arr[1],
            "otu_labels": arr[2]
        };
    };

    // Create bar chart using samples Object for initial subject id
    let barData = [{
        x: sampleLookup[names[0]]["sample_values"].slice(0,10),
        y: sampleLookup[names[0]]["otu_id_text"].slice(0,10),
        text: sampleLookup[names[0]]["otu_labels"].slice(0,10),
        hoverinfo: "text",
        orientation: "h",
        type: "bar"
    }];
    let barLayout = {
        title: `Top 10 Operational Taxonomic Units (OTUs) by<br> Relative Abundance for Test Subject ${names[0]}`,
        yaxis: {autorange: "reversed"},
        xaxis: {title: "Total Number of Reads (Proxy for Relative Abundance)"},
        height: 600,
        margin: {"pad": 10}
    };
    Plotly.newPlot("bar", barData, barLayout);
    
    // Create bubble chart using samples Object for initial subject id
    let bubbleData = [{
        x: sampleLookup[names[0]]["otu_ids"],
        y: sampleLookup[names[0]]["sample_values"],
        mode: "markers",
        marker: {size: sampleLookup[names[0]]["sample_values"].map(k => k * 0.65),
                 color: sampleLookup[names[0]]["otu_ids"],
                 colorscale: "Portland"},
        text: sampleLookup[names[0]]["otu_labels"],
        hoverinfo: "text"
    }];
    let bubbleLayout = {
        title: "Bubble Chart of Total Number of Reads versus OTU IDs<br>" +
               "<sub>Bubble Radius is proportional to the Total Number of Reads</sub>",
        xaxis: {title: "OTU IDs"},
        yaxis: {title: "Total Number of Reads"}
    };
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    return [metaLookup, sampleLookup];
};

// On change to the DOM, call getSubId()
d3.selectAll("#selDataset").on("change", getSubId);

// Function called by DOM changes
function getSubId() {
    let dropDown = d3.select("#selDataset");
    
    // Assign the value of the dropdown menu option to a variable
    let subId = dropDown.property("value");

    // call Demographics card function with metadata Object for 
    // selected subject id
    procDemogData(demogLookup[subId]);

    // Update plots
    updatePlots(subId, sampleLookup[subId]);

};

[demogLookup, sampleLookup] = init();