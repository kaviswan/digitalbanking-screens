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
	}).when('/paymentsAccountsSummary',{
		templateUrl : 'includes/PaymentsAccountsSummary.html',
		controller : 'PaymentsAccountsSummaryController'
	}).when('/paymentsCardsSummary',{
		templateUrl : 'includes/PaymentsCardsSummary.html',
		controller : 'PaymentsCardsSummaryController'
	}).when('/paymentsFinalSummary',{
		templateUrl : 'includes/MakePaymentScreen.html',
		controller : 'PaymentsFinalSummaryController'
	}).when('/paymentsFinalSummaryOTP',{
		templateUrl : 'includes/PaymentOTPScreen.html',
		controller : 'PaymentsFinalSummaryOTPController'
	}).when('/paymentsConfirmation',{
		templateUrl : 'includes/PaymentsConfirmation.html',
		controller : 'PaymentsConfirmation'
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