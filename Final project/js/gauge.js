//gauge 

var opts_north = {
    angle: 0.15, // The span of the gauge arc
    lineWidth: 0.44, // The line thickness
    radiusScale: 1, // Relative radius
    pointer: {
      length: 0.6, // // Relative to gauge radius
      strokeWidth: 0.035, // The thickness
      color: '#FF5959' // Fill color
    },
    limitMax: false,     // If false, max value increases automatically if value > maxValue
    limitMin: false,     // If true, the min value of the gauge will be fixed
    colorStart: '#6FADCF',   // Colors
    colorStop: '#8FC0DA',    // just experiment with them
    strokeColor: '#E0E0E0',  // to see which ones work best for you
    generateGradient: true,
    highDpiSupport: true,     // High resolution support
    staticLabels: {
      font: "15px sans-serif",  // Specifies font
      labels: [1,3,5,7],  // Print labels at these values
      color: "#FFFFFF",  // Optional: Label text color
      fractionDigits: 0  // Optional: Numerical precision. 0=round off.
    }
  };

  var target = document.getElementById('North'); // your canvas element
  var gauge = new Gauge(target).setOptions(opts_north); // create sexy gauge!
  gauge.maxValue = 7; // set max gauge value
  gauge.setMinValue(0);  // Prefer setter over gauge.minValue = 0
  gauge.animationSpeed = 32; // set animation speed (32 is default value)
  gauge.set(2); // set actual value


  var opts_south = {
    angle: 0.15, // The span of the gauge arc
    lineWidth: 0.44, // The line thickness
    radiusScale: 1, // Relative radius
    pointer: {
      length: 0.6, // // Relative to gauge radius
      strokeWidth: 0.035, // The thickness
      color: '#FF5959' // Fill color
    },
    limitMax: false,     // If false, max value increases automatically if value > maxValue
    limitMin: false,     // If true, the min value of the gauge will be fixed
    colorStart: '#6FADCF',   // Colors
    colorStop: '#8FC0DA',    // just experiment with them
    strokeColor: '#E0E0E0',  // to see which ones work best for you
    generateGradient: true,
    highDpiSupport: true,     // High resolution support
    staticLabels: {
      font: "15px sans-serif",  // Specifies font
      labels: [2,4,6,8],  // Print labels at these values
      color: "#FFFFFF",  // Optional: Label text color
      fractionDigits: 0  // Optional: Numerical precision. 0=round off.
    }
    
  };

  var target = document.getElementById('South'); // your canvas element
  var gauge = new Gauge(target).setOptions(opts_south); // create sexy gauge!
  gauge.maxValue = 8; // set max gauge value
  gauge.setMinValue(0);  // Prefer setter over gauge.minValue = 0
  gauge.animationSpeed = 32; // set animation speed (32 is default value)
  gauge.set(4); // set actual value
 