/*global $*/
/*eslint-env browser*/
/*eslint "no-console": "off" */


var app = new Vue ({
    el: '#vueApp',
    data:{
        picturesData: [],
        ratedPics: [],
        url: ""
    },
    
    created: function(){
        this.getPictures();
    },
    
    methods: {
        
        getPictures: function() {
            var url;
            url = $("input").val() //gets the input value from the selected country
            //for test pourposes url=spain
            url ="spain"
            // url =$("input").val() just saying, probably it works different for the map
            $.getJSON("https://www.instagram.com/explore/tags/"+ url + "/?__a=1", function(data){
            //USE "app." and NOT "this." because the latter only refers to the function
//            app.picturesData = data.graphql.hashtag.edge_hashtag_to_top_posts.edges;
            app.picturesData = data.graphql.hashtag.edge_hashtag_to_media.edges;
            console.log(app.picturesData)    
            app.ratedPics = app.decreasingOrder(app.picturesData)
            console.log(app.ratedPics);
            
            })
            
       },
        
        decreasingOrder : function(array) {
                        array.sort(function(a, b)
                           {
                            return b.node.edge_liked_by.count - a.node.edge_liked_by.count
                           });
           return array
        },
    },
    
})