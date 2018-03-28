/*global $*/
/*eslint-env browser*/
/*eslint "no-console": "off" */


var app = new Vue({
    el: '#vueApp',
    data: {
        picturesData: [],
        ratedPics: [],
        url: "",
        code_and_name: {}
    },

    created: function () {
        this.displayMap();
      
    },

    methods: {

        displayMap: function () {// on load: show map ; on click: show pics, hide map, show button to display map again
            $.getJSON("https://api.myjson.com/bins/12j0h7", function (data) {
                app.code_and_name = data
                $('#map').vectorMap({
                    map: 'europe_mill',
                    onRegionClick: function (e, code) {//from jVectorMap documentation, to call functions by clickin on a country
                        
                        app.getPictures(app.code_and_name[code]);
                        app.hideMap(app.code_and_name[code]);
                    }
                })
                app.showMap(); //I call it here, activate it later, by clicking the button to bring the map back
                
             })

        },

        getPictures: function (country_name) {
            app.ratedPics = []
            $.getJSON("https://www.instagram.com/explore/tags/" + country_name + "/?__a=1", function (data) {
                //USE "app." and NOT "this." because the latter only refers to the function
                //            app.picturesData = data.graphql.hashtag.edge_hashtag_to_top_posts.edges;
                app.picturesData = data.graphql.hashtag.edge_hashtag_to_media.edges;
                app.ratedPics = app.decreasingOrder(app.picturesData);//this actually puts the elements in a decreasing order



            })

        },
        
        hideMap: function () {//function to hide the map and show the toggle button
            $("#map").slideToggle();
            $("#map_button").show();
//            window.location.href="index.html#picsContainer"
        
        },
        
        showMap: function() {// shows the map on button click
            $("#map_button").click(function(){
                $("#map").slideToggle();
                $("#map_button").hide();
                app.scrollDown();
            })
        },

        decreasingOrder: function (array) {
            array.sort(function (a, b) {
                return b.node.edge_liked_by.count - a.node.edge_liked_by.count
            });
            return array
        },
        getCountryCodes: function () {
            
        },
        
        scrollDown: function() { // to go at the beginning of the page each time I show the map again
            $('html,body').animate({ // it will animate all html body 
            scrollTop: $('#startContainer').offset().top}, 'slow'); // get the other id where you want the page to scroll to. then offset the page and slow the animation.the only options available to offset are top and left for some reason. 
               

            },
        

    },

})
