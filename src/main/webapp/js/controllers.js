'use strict';

/* Controllers */
var digitalbankingControllers = angular.module('digitalbankingControllers', [
		'ngStorage', 'digitalbankingDirectives' ]);

angular.module('routes').controller('routeController',
		[ '$scope', '$location', function($scope, $location) {
			$scope.showMenu = $location.path() != '/';
		} ]);

digitalbankingControllers.controller('LoginController', [ '$scope',
		function($scope) {
			$scope.var1 = "Test scope";
		} ]);

digitalbankingControllers.controller('loginCtrl', [
		'$scope',
		'$rootScope',
		'$http',
		'User',
		'LoginService',
		'$location',
		'$localStorage',
		function($scope, $rootScope, $http, User, LoginService, $location,
				$localStorage) {
			$scope.User = User;
			$rootScope.loggedinUser = '';
			$rootScope.currentDate = '';
			$scope.login = function() {
				LoginService.Login($scope.User.username, $scope.User.password)
						.success(function(data, status, headers, config) {
							//console.log(data);
							$scope.authResult = data.authResult;
							if ($scope.authResult == 'success') {
								$rootScope.loggedinUser = User.username;
								$rootScope.currentDate = new Date();
								$location.path('/home');
								$localStorage.applicationUrls = data.applicationConfigurationURLs;
							}

						}).error(function(data) {
							$rootScope.loggedinUser = User.username;
							$rootScope.currentDate = new Date();
							//$location.path('/home');
						});
			}
		} ]);

digitalbankingControllers
		.controller(
				'RegistrationController',
				[
						'RegistrationService',
						'$scope',
						'$location',
						function(RegistrationService,$scope, $location) {
							$scope.acc_infotab = true;
							$scope.auth_infotab = false;
							$scope.userIdtab = false;
							$scope.passwordtab = false;
							
							$scope.registrationData={
									accountType : '',
									cardNum:{
										part1:'',
										part2:'',
										part3:'',
										part4:''
										},
									cvvNum:'',
									pincode:'',
									expDate:'',
									dob:'',
									otp:'',
									userId:'',
									userPassword:''
							}
							$scope.confirmPassword='';
							$scope.isMatch = false;
							$scope.isValidPassword = false;
							
							$scope.registerMethod=function(){
								if ($scope.registrationData.userPassword == $scope.confirmPassword) {
									$scope.isMatch = false;
									$location.path('/');
									RegistrationService.postUserDetails($scope.registrationData)
									.success(function(data,status,headers, config){
										console.log(data);
									}).error(function(data){
										console.log('hard coded data');
										console.log($scope.registrationData);
									})
									
								} else {
									$scope.isMatch = true;
								}
								
							}
							
							$scope.comparePasswords = function() {
								if (registrationData.userPassword == $scope.confirmPassword) {
									$scope.isMatch = false;
									$location.path('/');
									console.log($scope.registrationData);
								} else {
									$scope.isMatch = true;
								}
							}

							
							$scope.showCredit = function() {
								if ($scope.registrationData.accountType == 'credit') {
									$scope.credit = true;
									$scope.banking = false;
								} else if ($scope.registrationData.accountType == 'banking') {
									$scope.credit = false;
									$scope.banking = true;
								} else {
									$scope.credit = false;
									$scope.banking = false;
								}
							}

							$scope.go = function(index) {
								if (index == 1) {
									$scope.acc_infotab = false;
									$scope.auth_infotab = true;
									$scope.userIdtab = false;
									$scope.passwordtab = false;
								} else if (index == 2) {
									$scope.acc_infotab = false;
									$scope.auth_infotab = false;
									$scope.userIdtab = true;
									$scope.passwordtab = false;
								} else if (index == 3) {
									$scope.acc_infotab = false;
									$scope.auth_infotab = false;
									$scope.userIdtab = false;
									$scope.passwordtab = true;
								}
							}

						} ]);

digitalbankingControllers.controller('PasswordChangeController', [ '$scope','ForgotPasswordService','$location',
		function($scope,ForgotPasswordService,$location) {
			$scope.userForgotPasswordData = {
				username : '',
				oldPassword : '',
				newPassword : '',
				confirmPassword : '',
			}
			$scope.isMatch = false;
			
			$scope.forgotPasswordMethod=function(){
				if($scope.userForgotPasswordData.newPassword==$scope.userForgotPasswordData.confirmPassword){
					$scope.isMatch = false;
					ForgotPasswordService.postForgotPasswordDetails($scope.userForgotPasswordData)
					.success(function(data,status,headers,config){
						console.log(data);
					}).error(function(data){
						console.log('temparory data');
						console.log($scope.userForgotPasswordData);
					})
				}
				else
					$scope.isMatch = true;
					//alert('passwords doesnot match');
			}
			$scope.reset=function(){
				var original=$scope.userForgotPasswordData;
				//console.log(original);
				$scope.userForgotPasswordData=angular.copy({},original);
				console.log($scope.userForgotPasswordData);
			}
			
		} ]);

digitalbankingControllers.controller('HomeController', [ '$scope',
		function($scope) {
			$scope.tab = 1;

			$scope.setTab = function(newTab) {
				$scope.tab = newTab;
			};

			$scope.isSet = function(tabNum) {
				return $scope.tab === tabNum;
			};
		} ]);

digitalbankingControllers
		.controller(
				'AccountsSummaryController',
				[
						'$scope',
						'AccountsService',
						function($scope, AccountsService) {

							$scope.accountsSummary = {};
							$scope.accGridOptions = {
								data : 'accountsSummary',
								columnDefs : [
										{
											field : 'accountType',
											displayName : 'Account Type'
										},
										{
											field : 'accountNo',
											displayName : 'Account Number'
										},
										{
											field : 'accountBalance',
											displayName : 'Balance'
										},
										{
											field : '',
											cellTemplate : '<div class="ngCellText" ng-class="col.colIndex()"><a class="transaction-link-style"' + 
												'href="#/accountsTransactionList">View Transaction Details</a></div>'
										} ]
							};
							getAccountsSummary();
							
							function getAccountsSummary() {
								AccountsService
										.getAccountSummary()
										.success(
												function(data, status, headers,
														config) {
													if (data != null) {
														$scope.accountsSummary = data;

													}
												}).error(function() {
											$scope.accountsSummary = [ {
												"accountType" : "Saving",
												"accountNo" : "XXXXXXX075",
												"accountBalance" : "60,000"
											}, {
												"accountType" : "Current",
												"accountNo" : "XXXXXXX095",
												"accountBalance" : "10,000"
											} ];
										});
							}
						} ]);

digitalbankingControllers
		.controller(
				'LoansSummaryController',
				[
						'$scope',
						'LoanService',
						function($scope, LoanService) {

							$scope.loanSummary = {};
							$scope.loanGridOptions = {
								data : 'loanSummary',
								columnDefs : [{
											field : 'loanAccountNumber',
											displayName : 'Loan Account Number'
										},
										{
											field : 'loanType',
											displayName : 'Loan Type'
										},
										{
											field : 'loanStatus',
											displayName : 'Loan Status'
										},
										{
											field : 'duration',
											displayName : 'Duration'
										},
										{
											field : 'rateOfInterest',
											displayName : 'Interest Rate'
										},
										{
											field : 'amount',
											displayName : 'Loan Amount'
										}]
							};
							getLoanSummary();
							function getLoanSummary() {
								LoanService
										.getLoanSummary()
										.success(
												function(data, status, headers,
														config) {
													if (data != null) {
														$scope.loanSummary = data;

													}
												}).error(function() {
											$scope.loanSummary = [ {
												"loanType" : "Personal",
												"loanAmount" : "700000",
												"amountPaid" : "200000",
												"loanBalance" : "500000"
											}, {
												"loanType" : "Home",
												"loanAmount" : "700000",
												"amountPaid" : "200000",
												"loanBalance" : "500000"
											} ];
										});
							}
						} ]);

digitalbankingControllers.controller('CardsSummaryController', [ '$scope',
		function($scope) {

		} ]);

digitalbankingControllers.controller('AccountsTransactionListController', [ '$scope',
	function($scope) {
		console.log("In AccountsTransactionListController");
	} ]);


digitalbankingControllers.controller('InvestmentsSummaryController', [
		'$scope', function($scope) {

		} ]);

digitalbankingControllers.controller('TransactionsSummaryController', [
		'$scope',
		'TransactionService',
		function($scope, TransactionService) {

			$scope.transactionDetails = {};
			$scope.transactionGridOptions = {
				data : 'transactionDetails',
				columnDefs : [ {
					field : 'transactionTo',
					displayName : ''
				}, {
					field : 'Amount',
					displayName : 'Amount'
				}, {
					field : 'DebitCredit',
					displayName : ''
				} ]
			};
			getTransactionDetails();
			function getTransactionDetails() {
				TransactionService.getTransactionDetails().success(
						function(data, status, headers, config) {
							if (data != null) {
								$scope.transactionDetails = data;

							}
						}).error(function() {
					$scope.transactionDetails = [ {
						"transactionTo" : "PayTM mobile solutions",
						"Amount" : "1000",
						"DebitCredit" : "Dr"
					}, {
						"transactionTo" : "techProcess solutions",
						"Amount" : "300",
						"DebitCredit" : "Dr"
					}, {
						"transactionTo" : "PayTM mobile solutions",
						"Amount" : "1000",
						"DebitCredit" : "Dr"
					}, {
						"transactionTo" : "Life insurance solutions",
						"Amount" : "5000",
						"DebitCredit" : "Dr"
					}, {
						"transactionTo" : "9110120345678",
						"Amount" : "1500",
						"DebitCredit" : "Cr"
					} ];
				});
			}
		} ]);

digitalbankingControllers.controller('PayeeListController', [
		'$scope',
		'PayeeService',
		function($scope, PayeeService) {

			$scope.payeeList = {};
			$scope.payeeGridOptions = {
				data : 'payeeList',
				columnDefs : [ {
					field : 'payeeName',
					displayName : 'Payee Name'
				}, {
					field : 'bank',
					displayName : 'Bank'
				}, {
					field : 'type',
					displayName : 'Type'
				} ]
			};
			getPayeeList();
			function getPayeeList() {
				PayeeService.getPayeeList().success(
						function(data, status, headers, config) {
							if (data != null) {
								$scope.payeeList = data;

							}
						}).error(function() {
					$scope.payeeList = [ {
						"payeeName" : "Mike",
						"bank" : "Axis",
						"type" : "NEFT"
					}, {
						"payeeName" : "John",
						"bank" : "Citi",
						"type" : "IMPS"
					}, {
						"payeeName" : "Meera",
						"bank" : "ICICI",
						"type" : "NEFT"
					}, {
						"payeeName" : "Chandler",
						"bank" : "Barclays",
						"type" : "IMPS"
					}, {
						"payeeName" : "Joe",
						"bank" : "SBI",
						"type" : "NEFT"
					} ];
				});
			}
		} ]);

digitalbankingControllers.controller('CardsSummaryController', [
'$scope',
'CardService',
function($scope, CardService) {

	$scope.cardSummary = {};
	$scope.cardGridOptions = {
		data : 'cardSummary',
		columnDefs : [ {
			field : 'cardNumber',
			displayName : 'Card Number'
		}, {
			field : 'cardType',
			displayName : 'Type'
		}, {
			field : 'balance',
			displayName : 'Balance'
		} ]
	};
	getCardSummary();
	function getCardSummary() {
		CardService.getCardSummary().success(
				function(data, status, headers, config) {
					if (data != null) {
						$scope.cardSummary = data;

					}
				}).error(function() {
			$scope.cardSummary = [ {
				"cardNumber" : "xxxx-123",
				"cardType" : "Debit",
				"balance" : "27000"
			}, {
				"cardNumber" : "xxxx-234",
				"cardType" : "Credit",
				"balance" : "28000"
			}];
		});
	}
} ]);

digitalbankingControllers.controller('InvestmentsSummaryController', [
'$scope',
'InvestmentService',
function($scope, InvestmentService) {

	$scope.investmentSummary = {};
	$scope.investmentGridOptions = {
		data : 'investmentSummary',
		columnDefs : [ {
			field : 'investmentType',
			displayName : 'Investment Type'
		}, {
			field : 'investmentAmount',
			displayName : 'Amount'
		}, {
			field : 'timeFor',
			displayName : 'Total Time'
		} ]
	};
	getInvestmentSummary();
	function getInvestmentSummary() {
		InvestmentService.getInvestmentSummary().success(
				function(data, status, headers, config) {
					if (data != null) {
						$scope.investmentSummary = data;

					}
				}).error(function() {
			$scope.investmentSummary = [ {
				"investmentType" : "Fixed Deposit",
				"investmentAmount" : "100000",
				"timeFor" : "6"
			}, {
				"investmentType" : "Mutual Fund",
				"investmentAmount" : "25000",
				"timeFor" : "5"
			}];
		});
	}
} ]);
