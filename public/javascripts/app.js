var twitterClientModule = angular.module('TwitterClient', []);

twitterClientModule.controller('TwitterSearchController',function ($scope, tweetsStore){
	$scope.tweets = tweetsStore.getTweets();
	// tweetsStore.getTweetsAsync().success(displayTweets);
	// function displayTweets(data){
	// 	$scope.tweets = data;
	// }

});