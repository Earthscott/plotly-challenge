// Create test subject ID array
let subId = data.names;
let subIdInit = subId[0];

let dropDown = d3.select("select");
for (let i = 0; i < subId.length; i++) {
    let option = dropDown.append("option");
    option.attr("value", subId[i]);
    option.text(subId[i]);
};

// console.log(data.metadata[0])
// console.log(data.metadata[0].id)
// console.log(data.metadata.length)

let demogDict = {};
for (let i = 0; i < data.metadata.length; i++) {
    let IdKey = data.metadata[i].id;
    demogDict[IdKey] = data.metadata[i];
}

console.log(demogDict[941])

let metadataLabels = {
    "id": "ID",
    "ethnicity": "Ethnicity",
    "gender": "Gender",
    "age": "Age",
    "location": "Location",
    "bbtype": "Belly Button Type",
    "wfreq": "Weekly Wash Freq."
};

