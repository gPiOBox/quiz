/*
    -------------------------------------------------------------
    Copyright Clickpoints by LKPridgeon 2017 all rights reserved.
    -------------------------------------------------------------
    
    API call script 
    
    -------------------------------------------------------------
    
    BY: LKPridgeon
    VERSION: 1.2.0
    BRANCH: Beta
    DEPENDENCIES: jQuery 1.7+, JS ES6
*/

var runtime_error = false;

// Define Constants
    
// Authentication types: none/internal, basic
var api = {
    protocol: "https",
    endpoint: "localhost",
    username: "",
    password: "",
    auth: "internal",
    cache: false
};

// (TODO: Implement) Pre-written triggers 
var triggers = {
    keypress: false,
    onload: false,
    onchange: false
};

var inputs = [];

// Output types: field, html, alert
var output = {
    type: "field",
    location: ""
};

var other = {
    debug: false
};

// Error handling: forward, alert, log
var error = {
    type: "log",
    location: ""
};

// Overwritable callback function
var callback = function(result) {};

// Local configured value toggles with the configure function once completed
var configured = false;

// Global Configure Function
var configure = function(config){
    if(typeof config.api !== 'undefined'){
        for (sub in api){
            if(typeof config.api[sub] !== 'undefined'){
                api[sub] = config.api[sub];
            }
        }
    }
    if(typeof config.triggers !== 'undefined'){
        for (sub in triggers){
            if(typeof config.triggers[sub] !== 'undefined'){
                triggers[sub] = config.triggers[sub];
            }
        }
    }
    if(typeof config.output !== 'undefined'){
        for (sub in output){
            if(typeof config.output[sub] !== 'undefined'){
                output[sub] = config.output[sub];
                console.log(config.output[sub]);
            }
        }
    }
    if(typeof config.other !== 'undefined'){
        for (sub in other){
            if(typeof config.other[sub] !== 'undefined'){
                other[sub] = config.other[sub];
            }
        }
    }
    if(typeof config.error !== 'undefined'){
        for (sub in error){ 
            if(typeof config.error[sub] !== 'undefined'){
                console.log(config.error[sub]);
                error[sub] = config.error[sub];
            }
        }
    }
    if(typeof config.inputs !== 'undefined'){
        for(i=0;i<config.inputs.length; i++){
            if(typeof config.inputs[i] !== 'undefined'){
                inputs.push(config.inputs[i]);
            }
        }
        if(other.debug){console.log(inputs);}
    }
    configured = true;
};

// Global Configure Function
var trigger = function (){
    //Check configured
    if(configured){
        // Localise configuration data
    	var config = {}
    	config.other = other;
    	config.output = output; 
    	config.error = error;
    	config.api = api;
    	config.inputs = inputs;
        
        // Localise user configured callback if exists
    	var doCallback = callback;
    	
        // Reset Global configurations
    	reset();
        
        // Local config debug line
    	if(config.other.debug){ console.log(config.output); }
    	
        // Construct base API string
        var API_AUTH_STRING = "";
        if(config.api.auth == "basic"){
           API_AUTH_STRING = config.api.username + ":" + config.api.password + "@"
        }
        
        var API_QUERY_BASE = config.api.protocol + "://" + API_AUTH_STRING + config.api.endpoint;
        if(config.other.debug){ console.log("APICALL: Base string: " + API_QUERY_BASE); }
        
        // Define API query string
        var API_QUERY_STRING = "";
        
        // Cycle inputs within the configuration
        for(input in config.inputs){
            // Check if input is valid
            if(typeof config.inputs[input].type !== 'undefined' && typeof config.inputs[input].value !== 'undefined'){
                // Check input type
                switch (config.inputs[input].type) {
                    case "field":
                        // Fetch field data from page using the field ID
                        API_QUERY_STRING +=  "/" + document.getElementById(config.inputs[input].value).innerHTML;
                        break;
                    case "value":
                        // Fetch field value from page using the field ID
                        API_QUERY_STRING +=  "/" + document.getElementById(config.inputs[input].value).value;
                        break;
                    case "fixed": 
                        // Add the value defined in the config
                        API_QUERY_STRING +=  "/" + config.inputs[input].value;
                        break;
                    default: 
                        // Default to fixed value
                        API_QUERY_STRING +=  "/" + config.input[input].value;
                }
            }
        }
        
        
        if(config.other.debug){ console.log("APICALL: Query String: " + API_QUERY_STRING);}
        
        // Construct Final query string from base elements
        var API_QUERY = API_QUERY_BASE + API_QUERY_STRING;
        if(config.other.debug){ console.log("APICALL: API Query: " + API_QUERY);}
        
        // Call API using the Query string
        callAPI(config, API_QUERY, doCallback);
    }
}

// Local API call function
function callAPI(config, API_QUERY, doCallback){
    runtime_error = false;
    $.ajax({
          cache: config.api.cache,
          dataType: "jsonp",
          contentType: "application/json; charset=utf-8",
          url: API_QUERY,
          crossDomain: true,
          statusCode: {
              401: function() {
                  isError({error: "401 error"}, config);
                  runtime_error = true; 
              },
              403: function() {
                  isError({error: "403 error"}, config);
                  runtime_error = true; 
                  // Internal API requests only or no access
              },
              404: function() {
                  isError({error: "404 error"}, config);
                  runtime_error = true;
              },
              500: function() {
                  isError({error: "500 error"}, config);
                  runtime_error = true; 
                  // Server failure
              }
          },
          complete: function(data){
              if(!runtime_error){  
                  console.log(data.responseText);
                  // In case the JSON parse fails
                  try {  
                      // Parse query data
                      var data_json = JSON.parse(data.responseText);
                      // Check response json is not undefined or null
                      if(typeof data_json !== 'undefined'){
                          // Handle response
                          doOutput(data_json, config, doCallback);
                      }
                      else
                      {
                          isError({error: "Invalid Response"}, config);
                      }
                  }
                  catch (err) {
                      isError({error: "Unable to parse JSON data."}, config);
                  }
              }
          }
      });
}

// Attempt to do output action as configured
function doOutput(data_json, config, doCallback){
    if(config.other.debug){ console.log(data_json);}
    
    if(data_json.result !== 'undefined'){
        if(data_json.result !== ""){
            if(config.output.type !== 'undefined' && config.output.location !== 'undefined'){
                switch (config.output.type){
                    case "alert": 
                        // Send popup alert with raw data
                        alert(data_json.result);
                        break;
                    case "field":
                        // Output to document field/input field as a value
                        if(config.output.location !== ""){
                            document.getElementById(config.output.location).value = data_json.result;
                        }
                        break;
                    case "console":
                        // Output raw data to console
                        console.log(data_json.result);
                        break;
                    case "html":
                        // Output to document field as html
                        document.getElementById(config.output.location).innerHTML = data_json.result;
                        break;
                    case "none":
                        // Absolutely Nothing is done. 
                        break;
                    case "custom":
                        // Call user defined callback function
                        doCallback(data_json.result);
                        break;
                    default: 
                        // Default to console output
                        console.log(data_json.result);

                }
            }
            else {
                isError({error: "API Configuration error"}, config);
            }
        }
        else
        {
            isError(data_json, config);
        }
    }
    else
    {
        isError(data_json, config);
    }
}

// Error reporting function
function isError(data_json, config){
    console.log(config.error.type + ":" + data_json.error);
    if(typeof data_json.error !== 'undefined' && typeof config.error.type !== 'undefined'){
        switch (config.error.type) {
            case "alert": 
                console.log(data_json.error);
                alert(data_json.error);
                break;
            case "field":
                if(typeof config.error.location !== 'undefined' && config.error.location !== ""){
                    document.getElementById(config.error.location).value = data_json.error;
                    break;
                }
            case "console":
                console.log(data_json.error);
                break;
            case "html":
                if(typeof config.error.location !== 'undefined' && config.error.location !== ""){
                    document.getElementById(config.error.location).innerHTML = data_json.error;
                    break;
                }
            case "none":
                // Error
                break;
            default: 
                if(config.other.debug){
                    console.log(data_json.error);
                }
        }
    }
    else
    {
        if(other.debug){
            console.log("API Configuration Error");
        }
    }
}

// Reset global configurations
var reset = function(){
    api = {
        protocol: "https",
        endpoint: "localhost",
        username: "",
        password: "",
        auth: "internal",
        cache: false
    };
    triggers = {
        keypress: false,
        onload: false,
        onchange: false
    };
    inputs = [];
    output = {
        type: "field",
        location: ""
    };
    other = {
        debug: false
    };
    error = {
        type: "log", 
        location: ""
    };
    callback = function(result){};
    configured = false;
}

/* Checks if duplication of data is preasent and whether 
the configure function has worked correctly/data has been 
overwritten */

var test = function(){
    console.log("TEST: " + api.protocol + "://" + api.endpoint + "/");
};

// Globalise the file
var bestellingenAPI = function() {
    return this; 
}();
