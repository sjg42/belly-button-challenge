//Use the D3 library to read in "samples.json"
d3.json("./samples.json").then(function(data)
    {
        //show data in console
        console.log(data)
        init(data)
    }
)

//Init function with ID 940 data
function init(jsonData)
{
    populate_dropdown(jsonData)
    demoInfo(jsonData.metadata[0])    
    barChart(jsonData.samples[0])
    bubbleChart(jsonData.samples[0])
}


function optionChanged()
{
    d3.json("./samples.json").then(function(data){
        // d3 selector on the dropdown menu
        let dropdown = d3.select("#selDataset");

        // access nested value property from the selected option
        let ID = dropdown.property("value");
        
        //Loop through data.names and find the index of the selected ID
        for (i=0; i<data.names.length; i++)
        {   
            //run the functions for the ID selected
            if (data.names[i] == ID)
            {
                demoInfo(data.metadata[i])
                barChart(data.samples[i])
                bubbleChart(data.samples[i])            
            }
        }
    }
    )
}

// call on d3 selector associate the dropdown with an object
d3.selectAll("#selDataset")





function populate_dropdown(jsonData)
{
    //make variable for Sample names
    var names = jsonData.names

    //loop through each ID and create an option for it
    //Reference - https://stackoverflow.com/questions/5182772/append-option-to-select-menu
    names.forEach((name,index)=>{

        //create new option -> <option></option>
        var option = document.createElement("option")

        //set option parameters -> <option value = {name}> text </option>
        option.value = name
        option.text = name

        //add to dropdown
        var dropdown = document.getElementById("selDataset")
        dropdown.append(option)
    }
    )
}

//Populate Demographic Info container
//Takes in the metadata of the ID selected
function demoInfo(ID_meta)
{
    output = `id: ${ID_meta.id} <br>
        ethnicity: ${ID_meta.ethnicity} <br>
        gender: ${ID_meta.gender} <br>
        age: ${ID_meta.age} <br>
        location: ${ID_meta.location} <br>
        bbtype: ${ID_meta.bbtype} <br>
        wfreq: ${ID_meta.wfreq}`
    document.getElementById("sample-metadata").innerHTML = output;
}



//Create bar chart with selected ID - using Plotly.newPlot
//Takes in the sample of the selected ID
function barChart(ID)
{
    //slice data
    let top10_sampleVals = ID.sample_values.slice(0,10)
    let top10_otuIds = ID.otu_ids.slice(0,10)
    let top10_otuLabels = ID.otu_ids.slice(0,10)

    //reverse data
    top10_sampleVals.reverse()
    top10_otuIds.reverse()
    top10_otuLabels.reverse()

    //Change outIds to strings for plotting
    top10_otuIds_strings = top10_otuIds.map(val => {return "OTU " +String(val)})

    let trace = {
        x: top10_sampleVals,
        y: top10_otuIds_strings,
        text: top10_otuLabels,
        type: "bar",
        orientation:"h"
    }
    
    let traceData = [trace]

    let layout = {
        title:""
    }
    Plotly.newPlot("bar",traceData, layout)
}


//Create bubble chart with selected ID - using Plotly.newPlot
//Takes in the sample of the selected ID
function bubbleChart(ID)
{
    //make trace for bubble chart
    //Reference - https://plotly.com/javascript/bubble-charts/
    var trace = {
        x: ID.otu_ids,
        y: ID.sample_values,
        mode: 'markers',
        marker:{
            size: ID.sample_values,
            color: ID.otu_ids,
        },
        text: ID.otu_labels
    }

    var traceData = [trace]

    var layout = {
        xaxis:{
            title:{text: "OTU ID"}
        }
    }

    Plotly.newPlot("bubble",traceData,layout)
}