/*global $*/
/*eslint-env browser*/
/*eslint "no-console": "off" */



var apiApp = new Vue({
    el: '#apiApp',
    data: {
        access_token: "",},
    
    methods: {
        getAccessToken: function() {
            return window.location.href.split("#access_token")[1]
        }
    },
    
    created: function() {
        
        
    },
    
})