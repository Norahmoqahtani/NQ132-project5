
//Locations
var locations =[ {
    title: '‪King Abdullah Environmental Park',
    position: {
        lat: 25.3201,
        lng: 49.5566
    }
}, {
    title: ' King Abdullah Park',
    position: {
        lat: 24.6660,
        lng: 46.7376
    }
}, {
    title: ' Salam Park',
    position: {
        lat: 24.6213,
        lng: 46.7083
    }
}, {
    title: ' Dhahran Hills Park',
    position: {
        lat: 26.2982,
        lng: 50.1072
    }
}, {
    title: ' Al Rudaf Park',
    position: {
        lat: 21.23263,
        lng: 40.42302
    }
}, {
    title: 'Raghadan Forest Park',
    position: {
        lat: 20.0207,
        lng: 41.4327
    }
}];
var infoWindow;
var markers =[];
var map;

//initMap
var InitMap = function () {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 23.8859,
            lng: 45.0792
        },
        zoom: 6,
        mapTypeId: 'roadmap'
    });
    
    infowindow = new google.maps.InfoWindow();
    var clickInfowindow = new google.maps.InfoWindow();
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
                title: name,
                position: placeLoc.position(),
                animation: google.maps.Animation.DROP
            });
            
            //create infowindow
            placeLoc.marker = marker;
            infoWindow = new google.maps.InfoWindow();
            //Create an onclick event to open infowindow for each marker
            marker.addListener('click', function () {
                infoWindow.marker = marker;
                this.setAnimation(google.maps.Animation.BOUNCE);
                /* added setTimeOut */
                setTimeout(function () {
                    marker.setAnimation(null);
                },
                700);
                openInfoWindow(this, clickInfowindow);
            });
        });
        
        //Filter/Search locations
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
                        /* added setMap */
                        placeLoc.marker.setVisible(false);
                        return false;
                    }
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

//Google Map Error
function googleError() {
    window.alert("I'm sorry there has been an error with Google Maps.");
}

//Dropdown list
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

// Foursquare API
function openInfoWindow(marker, infowindow) {
    console.log(marker);
    if (infowindow.marker != marker) {
        infowindow.open(map, marker);
        
        var client_id = 'K4RE0VHCBPDS3TXGJDAC25ZNWWGLO3FNBYJBFXI5LY0X1GDC',
        client_secret = '3R3KD0ICDOEINKPS05RVCA2R0EY5G0ZWAYYJEDFJXY0FPUDO',
        location,
        venue;
        
        $.ajax({
            url: 'https://api.foursquare.com/v2/venues/search',
            dataType: 'json',
            data: {
                ll: marker.position.lat() + ',' + marker.position.lng(),
                query: marker.title,
                client_id: client_id,
                client_secret: client_secret,
                v: '20170619'
            }
        }).done(function (data) {
            
            var marker = data.response.venues[0];
            infowindow.setContent('<div><h3>' + marker.name + '</h3>' +
            marker.location.address + '</div>');
            infowindow.marker = marker;
            
            infowindow.addListener('closeclick', function () {
                infowindow.marker = null;
            });
        }).fail(function (error) {
            infowindow.setContent('Foursquare data is unavailable. Please try again later.');
            self.showMessage(true);
        });
    }
}