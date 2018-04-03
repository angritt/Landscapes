/*global $*/
/*eslint-env browser*/
/*eslint "no-console": "off" */



var apiApp = new Vue({
    el: '#apiApp',
    data: {
        access_token: "",
        contries_location: {},
        european_countries: {},
        location_response: [],
        lat: "",
        long: "",
        country_name: "",
        city_name: "",
        selected_id: "",
        final_location_data: [],
        map_cities_data: {},
        hashtags_dict: {},
        hashtags_array: []
    },

    methods: {
        getAccessToken: function () {
            return window.location.href.split("#access_token=")[1]
        },

        getDataForAllCities: function () {
            $.getJSON("https://api.myjson.com/bins/12j0h7", function (data) {
                apiApp.european_countries = data
                $.getJSON("https://api.myjson.com/bins/ibjif", function (data) {
                    apiApp.countries_location = data;
                    for (var key in apiApp.european_countries) {
                        apiApp.getLocationData(key, apiApp.countries_location)
                    }
                    console.log(apiApp.map_cities_data)
                })

            })
        },

        getLocationData: function (country, array) {
            array.forEach(function (element) {
                if (element.CountryCode === country) {
                    apiApp.lat = element.CapitalLatitude
                    apiApp.long = element.CapitalLongitude
                    apiApp.country_name = element.CountryName
                    apiApp.city_name = element.CapitalName
                    apiApp.map_cities_data[element.CapitalName] = {
                        "total_posts": 0,
                        "post_frequency": 0,
                        "most_used_hasthags": [],
                        "average_text_length": 0,
                        "average_num_hashtags": 0
                    }
                }
            })
            $.getJSON("https://api.instagram.com/v1/locations/search?lat=" + apiApp.lat + "&lng=" + apiApp.long + "&access_token=" + apiApp.access_token, function (data) {
                apiApp.location_response = data.data
                apiApp.location_response.forEach(function (item) {
                    if (item.name.includes(apiApp.country_name)) {
                        apiApp.selected_id = item.id
                        console.log(apiApp.selected_id)
                    }
                })
                $.getJSON("https://www.instagram.com/explore/locations/" + apiApp.selected_id + "/?__a=1", function (data) {
                    apiApp.final_location_data = data.graphql.location.edge_location_to_media
                    apiApp.getTotalPosts(apiApp.city_name, apiApp.final_location_data)
                    apiApp.getAverageNumHashtags(apiApp.city_name, apiApp.final_location_data)
                    apiApp.mostUsedHashtags(apiApp.city_name, apiApp.final_location_data)
                    apiApp.averageTextLength(apiApp.city_name, apiApp.final_location_data)
                })


            })

        },
        getTotalPosts: function (city, data) {
            apiApp.map_cities_data[city].totalposts = data.count
        },

        getAverageNumHashtags: function (city, data) {
            var hashtag_number_arr = []
            data.edges.forEach(function (element) {
                if (element.node.edge_media_to_caption.edges.length != 0) {
                    var text = element.node.edge_media_to_caption.edges[0].node.text
                    var matches = text.match(/#\w+/g)
                    if (matches != null) {
                      hashtag_number_arr.push(matches.length)
                    }
                }
            })
            var hastag_sum = hashtag_number_arr.reduce(function (a, b) {
                return a + b
            })
            apiApp.map_cities_data[city].average_num_hashtags = hastag_sum / hashtag_number_arr.length
        },

        mostUsedHashtags: function (city, data) {
            apiApp.hashtags_dict = {}
            apiApp.hashtags_array = []
            data.edges.forEach(function (element) {
                if (element.node.edge_media_to_caption.edges.length != 0) {
                    var text = element.node.edge_media_to_caption.edges[0].node.text
                    var matches = text.match(/#\w+/g)
                    if (matches != null) {
                        matches.forEach(function (item) {
                            if (item in apiApp.hashtags_dict) {
                                apiApp.hashtags_dict[item] += 1
                            } else {
                                apiApp.hashtags_dict[item] = 1
                            }
                        })
                    }
                }

            })
            for (var key in apiApp.hashtags_dict) {
                    apiApp.hashtags_array.push({"value": key, "count": apiApp.hashtags_dict[key]})
                }
                
             apiApp.hashtags_array.sort(function(a,b) {
                    return b.count - a.count
                })
            apiApp.map_cities_data[city].most_used_hasthags = apiApp.hashtags_array.slice(0,9)
        },
        
        averageTextLength: function (city, data) {
            var text_length_arr = []
            data.edges.forEach(function (element) {
                if (element.node.edge_media_to_caption.edges.length != 0) {
                    var text = element.node.edge_media_to_caption.edges[0].node.text
                    var text_length = text.length
                    text_length_arr.push(text_length)
                    }
        })
            var text_sum = text_length_arr.reduce(function (a, b) {
                return a + b
            })
            apiApp.map_cities_data[city].average_text_length = text_sum / text_length_arr.length
        }
                            
    },

    created: function () {
        if (window.location.href.includes("#access_token")) {
            this.access_token = this.getAccessToken()
            this.getDataForAllCities()
            
        }


    },

})
