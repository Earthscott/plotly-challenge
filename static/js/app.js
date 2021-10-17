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

// Return top 10 OTUs for selected subId
function top10(selSample) {
    console.log([...Array(selSample.length).keys()]);
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

    // create Object to store samples data by subject id, sorted reverse by 
    // OTU sample values
    let sampleLookup = {};
    for (let i = 0; i < samples.length; i++) {
        // let subID = samples[i]["id"];
        let obj = samples[i];
        let arr = [];
        for (let j = 0; j < obj["otu_ids"].length; j++) {
            arr.push([obj["otu_ids"][j], obj["sample_values"][j], obj["otu_labels"][j]]);
        }
        // arr.sort((a,b) => a[1].localeCompare(b[1]));
        // sampleLookup[obj.id] = arr;
    }

    // get samples Object with top 10 OTUs for selected subId
    // top10(samples[names[0]]);


    return (metaLookup);
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

};

demogLookup = init();