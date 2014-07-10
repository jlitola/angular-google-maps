"use strict";angular.module("angularGoogleMapsApp",["ngAnimate","ngSanitize","google-maps","hljs","semverSort","ui.router"]),angular.module("angularGoogleMapsApp").controller("MainCtrl",["$scope","$github","$log","analytics",function(a,b,c,d){var e="https://raw.github.com/nlaplante/angular-google-maps/%REF%/dist/angular-google-maps.min.js",f="master";a.map={center:{latitude:40.7081,longitude:-74.0041},zoom:13,options:{disableDefaultUI:!0,mapTypeControl:!1,tilt:45}},a.marker={coords:{latitude:40.47,longitude:-74.5}},a.dlClick=function(){d.trackEvent("click","download")},b.getTags().then(function(b){a.latestTag=b&&b.length?b[0]:{},a.downloadUrl=e.replace("%REF%",a.latestTag.name)},function(b){c.error("could not fetch latest tag; falling back to "+f,b),a.latestTag={name:f},a.downloadUrl=e.replace("%REF%",f)})}]),angular.module("angularGoogleMapsApp").controller("UseCtrl",["$scope",function(){}]),angular.module("angularGoogleMapsApp").controller("FAQCtrl",["$scope",function(){}]),angular.module("angularGoogleMapsApp").controller("ApiCtrl",["$scope","$location",function(a,b){a.directives=["google-map","circle","layer","marker","marker-label","markers","polygon","polyline","polylines","rectangle","window","windows"],a.viewUrl=function(a){return"/views/directive/"+a+".html"},a.query=null,a.$watch(function(){return b.hash()},function(a,b){a!==b&&$("#content"+a).collapse("show")})}]),angular.module("angularGoogleMapsApp").controller("DemoCtrl",["$scope","$timeout",function(a,b){a.tab="status",a.map={center:{latitude:40.47,longitude:-73.85},zoom:8,markers:[{id:0,coords:{latitude:41,longitude:-75},title:"Marker 1"},{id:1,coords:{latitude:40,longitude:-74.5},title:"Marker 2"}],polyline:{path:[{latitude:41,longitude:-75},{latitude:40,longitude:-74.5},{latitude:40.47,longitude:-73.85},{latitude:41.2,longitude:-74.2}],clickable:!0,editable:!0,geodesic:!0,draggable:!0}},b(function(){a.map.markers.push({id:3,coords:{latitude:40.2,longitude:-74.3},title:"Marker 3"})},4e3)}]),angular.module("angularGoogleMapsApp").controller("HeadlinesCtrl",["$scope","$http","$log","$interval","headlinesFetchInterval",function(a,b,c,d,e){function f(){b({method:"GET",url:"headlines.json"}).then(function(b){a.headlines=b.data.items,a.count=b.data.items.length,c.debug("headlines: fetched",b.data.items.length,"headlines")},function(a){c.error("could not fetch headlines",a.status)})}var g=3,h=3;c.debug("headlines: fetch updates every "+e/1e3/60+" minute(s)"),d(f,e).then(function(){},function(a){c.error("an error has occured in interval",a)},function(){c.info("fetched headlines")}),a.displayed=function(){return _.first(a.headlines,g)},a.loadMore=function(){g+=h},f.apply(this,[])}]),angular.module("angularGoogleMapsApp").controller("FooterCtrl",["$scope","$log","$q","$github",function(a,b,c,d){var e=!1;e||(c.all([d.getAllCommits(),d.getContributors(),d.getIssues(),d.getEvents()]).then(function(b){var c=b[0],e=b[1],f=b[2],g=b[3];angular.extend(a,{github:{branch:d.getBranch(),commits:{latest:c.length?c[0]:{},all:c},issuesCount:f.length,issues:f,contributors:e,events:g}})},function(c){b.error(c),a.github=null}),e=!0),a.eventLabel=function(a){var b=a.payload;switch(a.type){case"WatchEvent":return"starred this repository";case"CreateEvent":return"created "+b.ref_type+" "+b.ref;case"ForkEvent":return"forked this repository";case"PushEvent":return"pushed "+b.size+" commit(s) to "+b.ref.replace("refs/heads/","");case"IssueCommentEvent":return"commented on issue "+b.issue.number;case"DeleteEvent":return"deleted "+b.ref_type+" "+b.ref;case"PullRequestEvent":return b.action+" pull request "+b.pull_request.number;case"IssuesEvent":return b.action+" issue "+b.issue.number;case"PullRequestReviewCommentEvent":return'commented on a <a href="'+b.comment.html_url+'" rel="external">pull request</a>';case"GollumEvent":var c=b.pages&&b.pages.length?b.pages[0]:null;return c?c.action+' page <a href="'+c.html_url+'" rel="external">'+c.title+"</a> on the wiki":"[api data error]";case"CommitCommentEvent":return"commented on commit "+b.comment.commit_id.substring(0,8)}return"TODO ("+a.type+")"}}]),angular.module("angularGoogleMapsApp").controller("NotFoundCtrl",["$scope","$log","$location","$route",function(a,b,c){a.requestedUrl=c.search().url}]),angular.module("angularGoogleMapsApp").controller("ChangeLogCtrl",["$scope","$log","changelog",function(a,b,c){var d=[];for(var e in c){var f=c[e];d.push({tag:e,commits:_.groupBy(f,function(a){return a.author})})}a.changelog=d}]),angular.module("angularGoogleMapsApp").provider("$github",function(){function a(a,e,f){function g(b,c){var d=i+"/"+b+"?callback=JSON_CALLBACK";return c&&angular.forEach(c,function(a,b){null!=a&&(d+="&"+b+"="+a)}),a.debug("github: api url",d),d}function h(b,c){var d=f.defer();return e({cache:!0,method:"JSONP",url:g(b,angular.extend({},j,c))}).then(function(c){a.debug("github:",b,"("+(c.data.data?c.data.data.length:0)+")",c.data.data),d.resolve(c.data.data)},function(c){a.error("github:",b,c),d.reject(c)}),d.promise}var i="https://api.github.com/repos/"+b+"/"+c,j=d?{sha:d,per_page:1e3}:null;this.getRepository=function(){return c},this.getBranch=function(){return d},this.getCollaborators=function(){return h("collaborators",{})},this.getContributors=function(){return h("contributors",{})},this.getCommits=function(){return h("commits",{per_page:10})},this.getAllCommits=function(){var a=f.defer();return h("branches",{sha:null}).then(function(b){var c=[];angular.forEach(b,function(a){var b=f.defer();c.push(b.promise),h("commits",{per_page:10,sha:a.name}).then(function(a){b.resolve(a)},function(a){b.reject(a)})}),f.all(c).then(function(b){var c=_.flatten(b);_.sortBy(c,function(a){return-Date.parse(a.commit.committer.date)}),a.resolve(_.flatten(b))},function(b){a.reject(b)})},function(b){a.reject(b)}),a.promise},this.getIssues=function(){return h("issues",{})},this.getEvents=function(){return h("events",{})},this.getTags=function(){return h("tags",{})}}var b=null,c=null,d=null;this.repository=function(a){return a?(c=a,this):c},this.username=function(a){return a?(b=a,this):b},this.branch=function(a){return a?(d=a,this):d},this.$get=["$log","$http","$q",function(b,c,d){return new a(b,c,d)}]}),angular.module("angularGoogleMapsApp").provider("analytics",function(){var a=null,b=!0;this.trackingCode=function(){return arguments.length?(a=arguments[0],this):a},this.trackViewChange=function(){return arguments.length?(b=arguments[0],this):b},this.$get=["$window","$log","$rootScope","$document","$location",function(c,d,e,f,g){var h=!1,i=function(){!h&&c.ga&&(c.ga("create",a,"auto"),h=!0)},j=function(a){d.debug("analytics: tracking page view",a),i(),c.ga&&c.ga("send","pageView",a)},k=function(a,b){d.debug("analytics: tracking event",{name:a,value:b}),i(),c.ga&&c.ga("send","event","button","click","download library")};return b&&(d.info("analytics: telling analytics service to track view changes"),e.$on("$routeChangeSuccess",function(){j(g.path())}),e.$on("$routeChangeError",function(){j(g.path())})),{trackPageView:j,trackEvent:k}}]}),angular.module("angularGoogleMapsApp").value("headlinesFetchInterval",3e5).config(["$stateProvider","$urlRouterProvider","$locationProvider","$logProvider","$githubProvider","analyticsProvider","$sceDelegateProvider","hljsServiceProvider",function(a,b,c,d,e,f,g,h){c.html5Mode(!1).hashPrefix("!"),d.debugEnabled(!1),e.username("nlaplante").repository("angular-google-maps").branch("master"),f.trackingCode("UA-34163232-1").trackViewChange(!0),g.resourceUrlWhitelist(["self"]),g.resourceUrlBlacklist(["https://rawgithub.com/**"]),h.setOptions({tabReplace:"    "}),a.state("home",{url:"/",templateUrl:"views/main.html",controller:"MainCtrl"}).state("use",{url:"/use",templateUrl:"views/use.html",controller:"UseCtrl"}).state("api",{templateUrl:"views/api.html",controller:"ApiCtrl",reloadOnSearch:!1}).state("demo",{url:"/demo",templateUrl:"views/demo.html",controller:"DemoCtrl"}).state("faq",{url:"/faq",templateUrl:"views/faq.html",controller:"FAQCtrl"}).state("changelog",{url:"/changelog",templateUrl:"views/changelog.html",controller:"ChangeLogCtrl",reloadOnSearch:!1,resolve:{changelog:["$http","$q","$log",function(a,b,c){var d=b.defer();return a({method:"GET",url:"changelog.json"}).then(function(a){d.resolve(a.data)},function(a){c.error("could not get /changelog.json",a),d.reject(a)}),d.promise}]}}).state("not-found",{url:"/not-found",templateUrl:"views/404.html",controller:"NotFoundCtrl"}),b.otherwise("home")}]).run(["$rootScope","$log","$location",function(a,b,c){a.$location=c,a.$on("$routeChangeError",function(a,c,d,e){b.error("could not change route",e)})}]),angular.module("angularGoogleMapsApp").directive("rel",["$log",function(){return{restrict:"A",link:function(a,b){var c=angular.element(b);-1!==c.attr("rel").indexOf("external")&&c.attr("target","_blank").addClass("link-external")}}}]),angular.module("angularGoogleMapsApp").directive("share",["$log",function(a){return{restrict:"E",template:'<div class="share-button" ng-cloak></div>',replace:!0,link:function(b,c,d){var e=angular.element(c),f={};d.url&&(f.url=d.url),d.text&&(f.text=d.text),d.image&&(f.image=d.image),d.appId&&(f.app_id=d.appId),d.background&&(f.background=d.background),d.color&&(f.color=d.color),d.icon&&(f.icon=d.icon),d.buttonText&&(f.button_text=d.buttonText),d.flyout&&(f.flyout=d.flyout),a.debug("share options",f);var g=e.share(f);e.data("ng-share",g)}}}]),angular.module("angularGoogleMapsApp").directive("affix",["$log",function(a){return{restrict:"A",link:function(b,c,d){var e={offset:{}};d.offsetTop&&(e.offset.top=parseInt(d.offsetTop)),d.offsetBottom&&(e.offset.bottom=parseInt(d.offsetBottom)),a.debug("affix options",e),angular.element(c).affix(e)}}}]),angular.module("angularGoogleMapsApp").directive("googleApi",["$log",function(a){return{restrict:"A",link:function(b,c,d){a.debug("generating link to Google Maps API reference for "+d.googleApi);var e=angular.element(c);e.attr("href","https://developers.google.com/maps/documentation/javascript/reference#"+d.googleApi).attr("rel","external").attr("target","_blank")}}}]);