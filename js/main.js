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

        displayMap: function () {
            $.getJSON("https://api.myjson.com/bins/12j0h7", function (data) {
                app.code_and_name = data
                $('#map').vectorMap({
                    map: 'europe_mill',
                    onRegionClick: function (e, code) {
                        app.getPictures(app.code_and_name[code])
                    }
                })
             })

        },

        getPictures: function (country_name) {
            app.ratedPics = []
            $.getJSON("https://www.instagram.com/explore/tags/" + country_name + "/?__a=1", function (data) {
                //USE "app." and NOT "this." because the latter only refers to the function
                //            app.picturesData = data.graphql.hashtag.edge_hashtag_to_top_posts.edges;
                app.picturesData = data.graphql.hashtag.edge_hashtag_to_media.edges;
                app.ratedPics = app.decreasingOrder(app.picturesData)



            })

        },

        decreasingOrder: function (array) {
            array.sort(function (a, b) {
                return b.node.edge_liked_by.count - a.node.edge_liked_by.count
            });
            return array
        },
        getCountryCodes: function () {
            
        }

    },

})
