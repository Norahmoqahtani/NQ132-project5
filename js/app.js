
//Locations
var locations =[ {
    title: 'King Salman Safari Park',
    position: {
        lat: 25.0054,
        lng: 46.6020
    },
    description: ' The park resembles the Najd region, giving it a natural beauty'
}, {
    title: ' King Abdullah Park',
    position: {
        lat: 24.6660,
        lng: 46.7376
    },
    description: ' The park was established by Prince Turki Bin Abdul Aziz.'
}, {
    title: ' Salam Park',
    position: {
        lat: 24.6213,
        lng: 46.7083
    },
    description: 'Salam Park represents one of the natural elements for Riyadh '
}, {
    title: ' Riyadh National Zoo Park',
    position: {
        lat: 24.7117,
        lng: 46.7242
    },
    description: ' is an easily accessible travel location for visiting the city'
}, {
    title: 'Rawdah Park',
    position: {
        lat: 24.7317,
        lng: 46.7756
    },
    description: ' Open Park for Kids to do cycling, play in the sand, Skate'
}, {
    title: ' King Abdul Aziz Historical Centre',
    position: {
        lat: 24.62105,
        lng: 46.77263
    },
    description: 'It was built in 1936/37 by King Abdul Aziz'
}];
var infoWindow;
var markers =[];
var marker;
var map;

//initMap
var InitMap = function () {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 24.774265,
            lng: 46.738586
        },
        zoom: 10,
        mapTypeId: 'roadmap'
    });
    
    infowindow = new google.maps.InfoWindow();
    
    //Source:knockoutjs
    //view model
    var ViewModel = function () {
        'use strict';
        
        var self = this;
        self.markers =[];
        self.searchList = ko.observable('');
        self.filteredlist = ko.observableArray([]);
        self.locations = ko.observableArray([]);
        
    
        
        //create marker for each location and lsit view
        var placeLoc = function (data) {
            var self = this;
            this.title = ko.observable(data.title);
            this.description = ko.observable(data.description);
            this.position = ko.observable(data.position);
            this.showlist = ko.observable(true);
        };
        locations.forEach(function (position) {
            self.filteredlist.push(new placeLoc(position));
        });
        // to knockout
        //Source: http://www.knockmeout.net/2011/04/utility-functions-in-knockoutjs.html
        
        this.filteredlist().forEach(function (placeLoc) {
            
            var marker = new google.maps.Marker({
                map: map,
                position: placeLoc.position(),
                animation: google.maps.Animation.DROP
            });
            
            
            
            //create infowindow
            placeLoc.marker = marker;
            infoWindow = new google.maps.InfoWindow();
            //check for opened windows
            if (infowindow.marker !== marker) {
                infowindow.marker = marker;
                marker.addListener('click', function () {
                    infoWindow.marker = marker;
                    this.setAnimation(google.maps.Animation.BOUNCE);
                    /* added setTimeOut */
                      setTimeout(function () {
                        marker.setAnimation(null);
                    },
                    700);
                    
                    infoWindow.open(map, marker);
                    /*added ti close infow*/ 
                     infoWindow.addListener('closeclick', function () {
                        infowindow.marker = null;
                    });
                    
                   // infoWindow.setContent('<h2>' + placeLoc.title() + '</h2>' +
                  //  '<h4>' + placeLoc.description() + '</h4>');
                    
                    // infoWindow.setContent(content);
                });
            }
        });
              
        //filter/search locations
        
        self.locationsArray = ko.computed(function () {
            var search = self.searchList().toLowerCase();
            if (! search) {
                self.filteredlist().forEach(function (placeLoc) {
                    placeLoc.showlist(true);
                    /* added setVisible */ 
                    placeLoc.marker.setVisible(true);
                });
            } else {
                self.filteredlist().forEach(function (placeLoc) {
                    
                    if (placeLoc.title().toLowerCase().indexOf(search) >= 0) {
                        placeLoc.showlist(true);
                        /* added setVisible */ 
                        placeLoc.marker.setVisible(true);
                        return true;
                    } else {
                        placeLoc.showlist(false);
                        /* added setMap */ placeLoc.marker.setVisible(false);
                        return false;
                    }
                    // return self.filteredlist();
                },
                self);
            }
        });
        
        
        //click the list-view to show the location
        this.openInfo = function (placeLoc) {
            google.maps.event.trigger(placeLoc.marker, 'click');
        };
    };
    
    //To apply bindings
    ko.applyBindings(new ViewModel());
};


//FourSquare API
var fourSquareApiUrl = "https://api.foursquare.com/v2/venues/search?ll="
"&client_id=K4RE0VHCBPDS3TXGJDAC25ZNWWGLO3FNBYJBFXI5LY0X1GDC&client_secret=3R3KD0ICDOEINKPS05RVCA2R0EY5G0ZWAYYJEDFJXY0FPUDO=20170619&query=";
var foursquareId = setTimeout(function () {
    alert("Foursquare could not be loaded.");
},
1500);


$.ajax({
    url: fourSquareApiUrl,
    dataType: "json",
    async: true,
    
    success: function (response) {
        
        placeLoc.title = response.response.venue.title;
        placeLoc.description = response.response.venue.placeLoc.description ? response.response.venue.placeLoc.description: " ";
        
        console.log(placeLoc.title);
        console.log(placeLoc.description);
        
        var infowindow = new google.maps.InfoWindow();
        
        infoWindow.setContent('<h2>' + placeLoc.title() + '</h2>' +
        '<h4>' + placeLoc.description() + '</h4>');
        infowindow.open(map, marker);
        
        clearTimeout(foursquareId);
    }
});
//Google Map Error
function googleError() {
    window.alert("I'm sorry there has been an error with Google Maps.");
}

function myFunction() {
    document.getElementById("myDropdown").classList.toggle("showlist");
}

function filterFunction() {
    var input, filter, ul, li, a, i;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    div = document.getElementById("myDropdown");
    a = div.getElementsByTagName("a");
    for (i = 0; i < a.length; i++) {
        if (a[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
            a[i].style.display = "";
        } else {
            a[i].style.display = "none";
        }
    }
}