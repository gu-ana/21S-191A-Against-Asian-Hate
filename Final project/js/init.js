
// import stopwords from "./stopwords.js"
// import 'leaflet-swoopy';

const map = L.map('map');
 
// create leaflet map ...

// let CartoDB_PositronNoLabels = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
// 	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
// 	subdomains: 'abcd',
// 	maxZoom: 19
// });

// CartoDB_PositronNoLabels.addTo(map)

let Esri_WorldGrayCanvas = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
	maxZoom: 16
});

Esri_WorldGrayCanvas.addTo(map)





// create a new global scoped variable called 'scroller'
// you can think of this like the "map" with leaflet (i.e. const map = L.map('map'))
let scroller = scrollama();

//marker cluster group 
let mcg = L.markerClusterGroup({
    spiderfyOnMaxZoom: false,
	showCoverageOnHover: true,
	zoomToBoundsOnClick: true
}); 
// under59, sixtyfour, sixtynine, overseventy
let under59 = L.featureGroup.subGroup(mcg);
let sixtyfour= L.featureGroup.subGroup(mcg);
let sixtynine = L.featureGroup.subGroup(mcg);
let overseventy = L.featureGroup.subGroup(mcg);

let url = "https://spreadsheets.google.com/feeds/list/1S2rdXU_e0T-APmkcVG8Vjm7XB4og7CUjszqNqqztI14/od6/public/values?alt=json"
fetch(url)
	.then(response => {
		return response.json();
		})
    .then(data =>{
                console.log(data)
                formatData(data)
        }
)

let circleOptions = {
    radius: 8,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
}

let boundaryLayer = "./data/CA_boundaries.geojson"

function countiesF() {
    // have the map show counties that are fearful
}

// function toggleBoundaries(flag){
//     if (flag == "zip"){
//     boundaryLayer = "./data/counties.geojson"
//     getBoundary(boundaryLayer)
//     }
//     if (flag == "counties"){
//         boundaryLayer = "./data/zipcode.geojson"
//         getBoundary(boundaryLayer)
//     }
//     else{

//     }
// }

let boundary;
let ptsWithin;
let collected;
let allPoints = [];

let headers = {
    choice1: "Elderly Woman",
    choice2: "Woman",
    choice3: "Asian American Pacific Islander"
}

// let layers = {
//     '<i style="background: green; border-radius: 50%;"></i> < 59 Years Old ': under59,
//     '<i style="background: red; border-radius: 50%;"></i> 60-64 Years Old': sixtyfour,
//     '<i style="background: purple; border-radius: 50%;"></i> 65-69 Years Old': sixtynine,
//     '<i style="background: blue; border-radius: 50%;"></i> 70+ Years Old': overseventy
// }

let flag;

function toggleLegend(flag){
    let target = document.getElementById("legend")
    if (!flag) {
        target.style.display = "inline";
        console.log('flag:')
        console.log(flag)
        flag = 1
        return flag
    }
    if (flag) {
        target.style.display = "none";
        console.log('flag:')
        console.log(flag)
        // target.setAttribute("style", "display: none")
        flag = 0
        return flag
    }
}
let onPolyClick = function(event,header){
    console.log('click!')
    toggleLegend(flag)
    
    // if (!map.hasLayer(layers)) {
    //     L.control.layers(null,layers,{collapsed: false}).addTo(map)
    // }
    

    //callFancyboxIframe('flrs.html')
    console.log(event.layer.feature.properties.values)
    let regionFeatures = event.layer.feature.properties.values
    const placeHolder = document.getElementById('contents')
    placeHolder.innerHTML = ""
    let thisLayer = L.featureGroup();
    
    regionFeatures.forEach(data=>{ 
        let feature = subset_region(data,headers);
        thisLayer.addLayer(L.circleMarker([feature.lat,feature.lng],circleOptions))
      })
    console.log('theseFeatures')
    console.log(thisLayer)
    map.fitBounds(thisLayer.getBounds())
    // var label = event.target.options.label;
    // var content = event.target.options.popup;
    // var otherStuff = event.target.options.otherStuff;
    // alert("Clicked on polygon with label:" +label +" and content:" +content +". Also otherStuff set to:" +otherStuff);
};

function subset_region(subData,cardHeaders) {
    const targetDiv = document.createElement("div"); // adds a new button
    console.log(('subData'))
    console.log((subData))
    // let cardContent = subData
    let header;
    if (subData.gender != "Woman" && subData.age == "under 59") {
        header = cardHeaders.choice3
    }
    else if (subData.gender == "Woman" && subData.age == "under 59") {
        header = cardHeaders.choice2
    }
    else {
        header = cardHeaders.choice1
    }
    let cardContent =  `<h2> ${header} </h2> <div class='story'> <p> Age: ${subData.age} </p> <p> Location: ${subData.city} </p> <p> Asian American/Pacific Islander: ${subData.iden} </p> <p> Gender identity: ${subData.gender} </p> <p>Fearful of going outside: ${subData.fear} </p>  Story: ${subData.story}</div>`
    targetDiv.innerHTML = cardContent; // gives it the HTML content
    targetDiv.setAttribute("class","story") // add the class called "step" to the button or div
    // targetDiv.setAttribute("data-step",newDiv.id) // add a data-step for the button id to know which step we are on
    // newDiv.setAttribute("lat",lat); // sets the latitude 
    // newDiv.setAttribute("lng",lng); // sets the longitude
    const placeHolder = document.getElementById('contents')
    console.log("placholder"+placeHolder)
    // placeHolder.innerHTML.replace(targetDiv)
    placeHolder.innerHTML += cardContent;
    console.log('targetDiv')
    console.log(targetDiv)
    return subData
}

function getStyles(data){
    let myStyle = {
        "color": "#ffd369",
        "weight": 1,
        "opacity": 50,
        "stroke": .5
    };
    return myStyle
}

function onEachFeature(feature, layer) {
    // does this feature have a property named popupContent?
    console.log(feature.properties)
    if (feature.properties.values) {
        console.log(feature.properties.values)
        let count = feature.properties.values
        //call function to parse out data based on values inside the boundary
        // feature.properties.values.forEach(data=>{ 
        //     let runningCount = subset_region(data,headers);
        //   })
        // subset_region(feature)

        // console.log(count)
        let text = count.toString()
        // layer.bindPopup(text);
        console.log('layer')
        console.log(layer)
        console.log(layer.feature.properties.values)
        // layer.on({
        //     // mouseover: highlightFeature,
        //     // mouseout: resetHighlight,
        //     // click: subset_region(layer,headers)
        //     click: layer.bindPopup(layer.feature.properties.values);
        //     // layer.bindPopup(`<strong>State: </strong>`+clickName+`<br>`+`<strong>Number of incidents reported: </strong>`+reportSum)
        // });
    }
}

// Next steps --> zoom on click (to bay (or where most are responding))
let regionColors = {
    'SoCal': "blue", 
    'NorCal': "green"
}


function getBoundary(layer){
    fetch(layer)
    .then(response => {
        return response.json();
        })
    .then(data =>{
                boundary = data
                console.log('data:')
                console.log(data)
                collected = turf.collect(boundary, thePoints, 'surveyData', 'values');
                
                // collected = turf.buffer(thePoints, 50,{units:'miles'});
                console.log(collected.features)
                let boundaryJson = L.geoJson(collected,{onEachFeature: onEachFeature,style:function(feature)
                {
                    console.log('feature.properties.values.Region')
                    // console.log(feature.properties.Region)
                    let thisRegion = feature.properties.Region
                    return {color: regionColors[thisRegion]}    
                    // if (thisRegion == 'SoCal') {
                    //     return {color: "aqua"};
                    // }
                    // else{
                    //     return{color: "green"}
                    // }
                }
                
                    }).on('click',onPolyClick).addTo(map)    
                    map.fitBounds(boundaryJson.getBounds()); 
        }
    )   
}

function getBoundary2(layer){
    fetch(layer)
    .then(response => {
        return response.json();
        })
    .then(data =>{
                boundary = data
                console.log('data:')
                console.log(data)
                collected = turf.collect(boundary, thePoints, 'surveyData', 'values');
                
                // collected = turf.buffer(thePoints, 50,{units:'miles'});
                console.log(collected.features)
                let boundaryJson = L.geoJson(collected,{onEachFeature: onEachFeature,style:function(feature)
                {
                    console.log('feature.properties.values.Region')
                    // console.log(feature.properties.Region)
                    let thisRegion = feature.properties.Region
                    return {color: regionColors[thisRegion]}    
                    // if (thisRegion == 'SoCal') {
                    //     return {color: "aqua"};
                    // }
                    // else{
                    //     return{color: "green"}
                    // }
                }})
        
                map.fitBounds(boundaryJson.getBounds()); 
        }
    )   
}

// Step 1: Filter by Yes/No Fear
// Step 2: in that region who said fear who said not fear
// Optional Step 2: get stories to show up in div

let myFieldArray = []

function getDistinctValues(targetField){
    // find out how to add distinct values to an array 

    if (!myFieldArray.includes(targetField)){
        myFieldArray.push(targetField)
    } 
    return targetField
      // append values to array 
}

function recenter() {
    // map.flyTo([37.5, -119.1], 6 ,{
    //     pan: {
    //         animate: true,
    //         duration: 0.1
    //     }
    // });
    flag = 1
    toggleLegend(flag)
    flag = 0
    
    getBoundary2(boundaryLayer)
}


// function addImage(lat, lng, age, gender){
//     // switch(title){
//     //     case 'Los Angeles, CA': img = './pictures/UCLA.jpg';
//     //         break;
//     //     case 'West Lafayette, IN': img = './pictures/Purdue.jpg';
//     //         break;
//     //     case 'Houston, TX': img = './pictures/Houston.jpg';
//     //         break;
//     // }

//     if(age == "under 59" && gender == "Woman") {
//         img = './pictures/woman.png'
//     }

//     else if (age != "under 59" && gender == "Woman") {
//         img = './pictures/elderly_woman.jpg'
//     }

//     else {
//         img = './pictures/man.png'
//     }

//     L.popup().setLatLng([lat, lng]).setContent('<img src=' + img + ' width=105 height=105/><p>').openOn(map);
    
// }

function addMarker(thisData){
        // let story = data.ifpossiblepleaseelaborateaboutwhyyouarefearful.
        // console.log(story)
        let theStory;
        // console.log('thisData.fearful')
        // console.log(thisData.fearful.length)
        // console.log('thisData.notfearful')
        // console.log(thisData.notfearful.length)
        if (thisData.fearful.length > 0){
            theStory = thisData.fearful
            // console.log('fearful greater than 0 ')
            // console.log(thisData.fearful)
        }
        else if (thisData.notfearful.length > 0 ){
            theStory = thisData.notfearful
            // console.log('not fearful greater than 0')
            // console.log(thisData.notfearful)
        }
        else if (thisData.notfearful.length > 0 && thisData.fearful.length > 0){
            theStory = "Story not provided."
        }
        // console.log(theStory)
        let surveyData = {
            ['zip']: thisData.zipcode,
            ['city']: thisData.whatcitydoyouorthepersonyouarerepresentingcurrentlylivein,
            ['age']: thisData.howoldareyouorthepersonyouarerepresenting,
            ['relationship']: thisData.whatisyourrelationshipwiththepersonthatyouarefillingoutthissurveyfor,
            ['story']: theStory,
            ['lat']: thisData.lat,
            ['lng']: thisData.lng,
            ['fear']: thisData.areyoufearfulofgoingoutsideduetotheriseofasianamericanhatecrimes,
            ['iden']: thisData.doyouorthepersonyouarerepresentingidentifyasanasianamericanpacificislander,
            ['gender']: thisData.whatgenderdoyouorthepersonyouarerepresentingidentifyas

        }
        // console.log(data)
        // createButtons(surveyData.lat,surveyData.lng, surveyData)
        getDistinctValues(surveyData.age)
        let fear = thisData.areyoufearfulofgoingoutsideduetotheriseofasianamericanhatecrimes
        let thisPoint = turf.point([Number(surveyData.lng),Number(surveyData.lat)],{surveyData})
        // console.log('thisPoint')
        // console.log(thisPoint.properties.data)
        allPoints.push(thisPoint)

        // console.log('all the distinct fields')
        // console.log(myFieldArray)
        colorArray = ['green','blue','red','purple']
        circleOptions.fillColor = colorArray[myFieldArray.indexOf(surveyData.age)]
        // console.log("age")
        // console.log(data.age)
        let popUp = `<h2>${surveyData.gender}</h2>`
        // addImage(surveyData.lat,surveyData.lng,surveyData.age,surveyData.gender)

        var marker1 = L.circleMarker([surveyData.lat,surveyData.lng],circleOptions).bindPopup(popUp)
         
        marker1.on('mouseover', function (e) {
            this.openPopup();
        });

        if (surveyData.age == "under 59"){         
            under59.addLayer(marker1)
            // addImage(surveyData.lat,surveyData.lng,surveyData.age,surveyData.gender)
            return surveyData.timestamp
        }
        else if (surveyData.age == "60-64") {
            sixtyfour.addLayer(marker1)
            // addImage(surveyData.lat,surveyData.lng,surveyData.age,surveyData.gender)
        }
        else if (surveyData.age == "65-69") {
            sixtynine.addLayer(marker1)
            // addImage(surveyData.lat,surveyData.lng,surveyData.age,surveyData.gender)
        }
        else {
            overseventy.addLayer(marker1)
            // addImage(surveyData.lat,surveyData.lng,surveyData.age,surveyData.gender)
        }
      
        return surveyData   
}

function createButtons(lat,lng,data){
    const newDiv = document.createElement("div"); // adds a new button
    
    let cleanage = data.age.replace(/ /g, '');
    let cardContent =  ` <div class='story'> <h3> Their Story: </h3> Story: ${data.story} <p> Age: ${data.age} </p> <p> Asian Pacific Islander: ${data.iden} </p> <p> Gender identity: ${data.gender} </p> <p>Fearful of going outside: ${data.fear} </p>  </div>`
    newDiv.innerHTML = cardContent; // gives it the HTML content
    newDiv.setAttribute("class","card_" + cleanage); // add the class called "step" to the button or div
    newDiv.setAttribute("data-step",newDiv.id) // add a data-step for the button id to know which step we are on
    newDiv.setAttribute("lat",lat); // sets the latitude 
    newDiv.setAttribute("lng",lng); // sets the longitude 
// merging from here
    newDiv.setAttribute("age", cleanage);

    newDiv.setAttribute("Asian_American", data.iden);
    newDiv.setAttribute("Gender",data.gender);
    newDiv.setAttribute("Afraid", data.fear);
// merging end here
    newDiv.addEventListener('click', function(){
        map.flyTo([lat,lng], 15, 
            { pan: {
                animate: false,
                duration: 0.1
            }
            }
            ); //this is the flyTo from Leaflet

    })
    const spaceForButtons = document.getElementById('contents')
    spaceForButtons.appendChild(newDiv);//this adds the button to our page.
}

let allLayers;
let testLayer;

//if i change from local to session storage, the popup will come up every time ?
//let lastVisited = window.localStorage.getItem('last visited');
let lastVisited = 'false';
function formatData(theData){
        const formattedData = [] /* this arry will eventually be populated with the contents of the spreadsheet's rows */
        const rows = theData.feed.entry
        for(const row of rows) {
          const formattedRow = {}
          for(const key in row) {
            if(key.startsWith("gsx$")) {
                  formattedRow[key.replace("gsx$", "")] = row[key].$t
            }
          }
          formattedData.push(formattedRow)
        }
        // console.log(formattedData)
        formattedData.forEach(addMarker)    
        testLayer = overseventy;
        allLayers = L.featureGroup([under59, sixtyfour, sixtynine, overseventy]);
        thePoints = turf.featureCollection(allPoints)
        getBoundary(boundaryLayer)
        mcg.addTo(map)
        // console.log(allLayers)
        allLayers.addTo(map)
        // map.fitBounds(allLayers.getBounds()); 
       
        //popup?
        if (lastVisited == null || lastVisited == 'false') {
            startModal();
            localStorage.setItem('last visited', 'true');
            console.log('started');
        }
        document.getElementById("myBtn").click() // simulate click to start modal
        // setup the instance, pass callback functions
        // use the scrollama scroller variable to set it up
        scroller
        .setup({
            step: ".card", // this is the name of the class that we are using to.card into, it is called "step", not very original
        })
        // do something when you enter a "step":
        .onStepEnter((response) => {
            // you can access these objects: { element, index, direction }
            // use the function to use element attributes of the button 
            // it contains the lat/lng: 
            scrollStepper(response.element.attributes)
        })
        .onStepExit((response) => {
            // { element, index, direction }
            // left this in case you want something to happen when someone
            // steps out of a div to know what story they are on.
        });
}
function scrollStepper(thisStep){
    // optional: console log the step data attributes:
    // console.log("you are in thisStep: "+thisStep)
    let thisLat = thisStep.lat.value
    let thisLng = thisStep.lng.value
    // tell the map to fly to this step's lat/lng pair:
    // fix this later:
    // map.flyTo([thisLat,thisLng] ,{ 
    //     pan: {
    //     animate: false,
    //     duration: 0.1
    //     }
    // }
    //     );
}


function startModal(){

    var modal = document.getElementById("myModal");

    // Get the button that opens the modal
    var btn = document.getElementById("myBtn");
    
    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];
    
    // // When the user clicks the button, open the modal 
    // btn.onclick = function() {
    //   modal.style.display = "block";
    // }
    document.getElementById("myBtn").onclick = function() {
        modal.style.display = "block";};
    

    
    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
      modal.style.display = "none";
    }
    
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }
}
// setup resize event for scrollama incase someone wants to resize the page...
window.addEventListener("resize", scroller.resize);
  
new L.SwoopyArrow([37.718590, -125.311178], [38.891033,-121.529358], {
    label: '(NorCal)',
    labelFontSize: 20,
    labelClassName: 'swoopy-arrow',
    arrowFilled: true,
    opacity: 1,
    minZoom: 2,
    maxZoom: 10,
    factor: .6,
    iconAnchor: [75, 5],
    iconSize: [85, 16],
    weight: 2
  }).addTo(map);

  new L.SwoopyArrow([32.953368, -121.492700], [34.125448,-117.227158], {
    label: '(SoCal)',
    labelFontSize: 20,
    labelClassName: 'swoopy-arrow',
    arrowFilled: true,
    opacity: 1,
    minZoom: 2,
    maxZoom: 10,
    factor: .6,
    iconAnchor: [75, 5],
    iconSize: [85, 16],
    weight: 2
  }).addTo(map);

  
let i = 0; 
let filtered_stories;
function search() {

   let stories = document.getElementById('contents').children
   let asian_american = document.getElementById('asian_american').value;
   let age = document.getElementById('age_range').value;
   let gender = document.getElementById('gender').value;
   let fearful = document.getElementById('fearful').value;

   for (const story of stories) {
       story.style.display = 'none';
   }
   i = 0;
   console.log(asian_american)
   console.log(fearful)
   console.log(age)
   console.log(gender)
   filtered_stories = document.querySelectorAll(`[asian_american=${asian_american}][gender=${gender}][afraid=${fearful}][age=${age}]`);

   filtered_stories[0].style.display = 'block';
   return filtered_stories;
}

function next() {

    if(i < filtered_stories.length - 1) {
        filtered_stories[i].style.display = 'none';
        i = i + 1;
        filtered_stories[i].style.display = 'block';
    }
    
}

function prev() {
    if(i > 0) {
        filtered_stories[i].style.display = 'none';
        i = i - 1;
        filtered_stories[i].style.display = 'block';
    }
}
// setup resize event for scrollama incase someone wants to resize the page...
window.addEventListener("resize", scroller.resize);