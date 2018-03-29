/*global $*/
/*eslint-env browser*/
/*eslint "no-console": "off" */


var app = new Vue({
    el: '#vueApp',
    data: {
        picturesData: [],
        ratedPics: [],
        url: "",
        code_and_name: {}, // object of jVectorMap
        hashtags_dict: {},
        hashtags_array: [],
        sorted_hashtags_array: [],
        filterValue: "" 
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
                        app.filterValue = "";
                        app.sorted_hashtags_array = []
                        app.hideMap();
                        $("#map_button").show();
                        $("#waitBox").show();
                        $("#countryName").html(": #" + app.code_and_name[code])
                    }
                })
//                app.showMap(); //I call it here, activate it later, by clicking the button to bring the map back
                app.hide_show_map();
             })

        },

        getPictures: function (country_name) {
            app.ratedPics = []
            $.getJSON("https://www.instagram.com/explore/tags/" + country_name + "/?__a=1", function (data) {
                //USE "app." and NOT "this." because the latter only refers to the function
                //            app.picturesData = data.graphql.hashtag.edge_hashtag_to_top_posts.edges;
                app.picturesData = data.graphql.hashtag.edge_hashtag_to_media.edges;
                app.ratedPics = app.decreasingOrder(app.picturesData);//this actually puts the elements in a decreasing order
                app.sorted_hashtags_array = app.getSortedHashtags(app.ratedPics)
                    


            })

        },
        
        
        hide_show_map : function () {
            $("#map_button").click(function(){
                if($("#map_button").html()=="Hide Map"){
                    app.hideMap();
                }
//                if($("#map_button").html()=="Show Map"){// this doesn't work, I don't understand why
//                    app.showMap(); // 
//                }
                else{app.showMap()}
            })
        },
        
        
        hideMap: function () {//function to hide the map and show the toggle button
            $("#map").hide(2000);
//            $("map_button").show();
//            $("#map").slideToggle(2000);
            $("#map_button").html("Show Map");
            $("#all_filter").show();
            $("#picsContainer").show();
//            window.location.href="index.html#picsContainer"
        },
        
        showMap: function() {// shows the map on button click
//            $("#map_button").click(function(){
//                $("#map").slideToggle(2000);
                $("#map").show(2000);
                $("#map_button").html("Hide Map");
                $("#all_filter").show();
                $("#picsContainer").hide();
                
                app.scrollTop();
//            })
        },
        
        decreasingOrder: function (array) {
            var array_copy = array.slice()
            array_copy.sort(function (a, b) {
                return b.node.edge_liked_by.count - a.node.edge_liked_by.count
            });
            return array_copy
        },
        
        
        scrollTop: function() { // to go at the beginning of the page each time I show the map again
            $('html,body').animate({ // it will animate all html body 
            scrollTop: $('#startContainer').offset().top}, 'slow'); // get the other id where you want the page to scroll to. then offset the page and slow the animation.the only options available to offset are top and left for some reason. 
               

            },
        
        getSortedHashtags: function(picsArray) {
             app.hashtags_dict = {}
             app.hashtags_array = []
             picsArray.forEach(function(element){
                    if (element.node.edge_media_to_caption.edges.length != 0) {
                        var text = element.node.edge_media_to_caption.edges[0].node.text
                        var matches = text.match(/#\w+/g)
                        if (matches != null) {
                            matches.forEach(function(item) {
                            if (item in app.hashtags_dict) {
                                app.hashtags_dict[item] += 1
                            } else {
                                app.hashtags_dict[item] = 1
                            }
                        })
                        }
                    } element.node.edge_media_to_caption.edges.push({"node":{"text":""}})
                    
                })
                for (var key in app.hashtags_dict) {
                    app.hashtags_array.push({"value": key, "count": app.hashtags_dict[key]})
                }
                
                return app.hashtags_array.sort(function(a,b) {
                    return b.count - a.count
                })
                
        },
        
        hashtagFilter: function(event) {
            app.filterValue = $(event.target).val();
            
            // make the map disappear when clicking on the ashtag button:
            $("#map").hide(2000);
//            $("#map_button").show();
            $("#map_button").html("Show Map")
            $("#picsContainer").show();
            
        }

    },

})
