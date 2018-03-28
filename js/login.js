/*global $*/
/*eslint-env browser*/
/*eslint "no-console": "off" */



var apiApp = new Vue({
    el: '#apiApp',
    data: {
        access_token: "",
        contries_location: {},
        location_response: "",
        lat: "",
        long: ""
    },
    
    methods: {
        getAccessToken: function() {
            console.log("yay")
            return window.location.href.split("#access_token=")[1]
        },
        
        getLocationData: function() {
            $.getJSON("https://api.myjson.com/bins/ibjif", function(data) {
                apiApp.countries_location = data;
                var input =  "GB"
                apiApp.countries_location.forEach(function(element){
                    if (element.CountryCode === input) {
                        apiApp.lat = element.CapitalLatitude
                        apiApp.long = element.CapitalLongitude
                    }
                })
                $.getJSON("https://api.instagram.com/v1/locations/search?lat=" + apiApp.lat +"&lng="+ apiApp.long +"&access_token=" + apiApp.access_token, function(data) {
                    apiApp.location_response = data
                })
            })
        }
    },
    
    created: function() {
        if (window.location.href.includes("#access_token")) {
            this.access_token = this.getAccessToken()
            this.getLocationData()
        }
        
        
    },
    
})