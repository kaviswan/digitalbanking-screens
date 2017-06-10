(function(){
	angular.module('routes',['ngRoute'])
	.config([ '$routeProvider', function($routeProvider) {
	$routeProvider.when('/', {
		templateUrl : 'includes/login.html',
		controller : 'loginCtrl'
	}).when('/register', {
		templateUrl : 'includes/register.html',
		controller : 'RegistrationController'
	}).when('/forgotPassword',{
		templateUrl: 'includes/forgotPwd.html',
		controller:'PasswordChangeController'
	}).when('/home', {
		templateUrl : 'includes/home.html',
		controller : 'HomeController'
	}).when('/accountsTransactionList', {
		templateUrl : 'includes/accountsTransactionList.html',
		controller : 'AccountsTransactionListController'
	}).when('/accountSummary',{
		templateUrl : 'includes/AccountsSummary.html',
		controller : 'AccountsSummaryController'
	});

	$routeProvider.otherwise({
		redirectTo : '/'
	});
} ]);
	angular.module('routes').run(function ($rootScope,$location) {
	       $rootScope.$on("$routeChangeSuccess", function (event, currentRoute, previousRoute) {
		            $rootScope.showMenu = $location.path() != '/forgotPassword'
									  && $location.path() != '/register' 
									  && $location.path() != '/';
		        });
		    });  
})();