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
										} ],								
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
		'PaymentsAccountsSummaryController',
		[
				'$scope',
				'AccountsService',
				'$localStorage',
				'$location',
				function($scope, AccountsService,$localStorage,$location) {

					$scope.accountsSummary = {};	
					$scope.mySelections = [];
					$scope.paymentsAccGridOptions = {
						data : 'accountsSummary',
						columnDefs : [
						        
								{
									field : 'accountNo',
									displayName : 'Account Number'
								},
								{
									field : 'accountBalance',
									displayName : 'Balance'
								},
								{
									field : 'accountStatus',
									displayName : 'Account Status'
								}],
						enableRowSelection : true,
						showSelectionCheckbox : true,
						multiSelect: false,								
						enableHighlighting : true,
						selectedItems : $scope.mySelections
						
					};
					getAccountsSummary();
					$scope.startPayment = function () {					    
					    $localStorage.SavingsAccountNo = $scope.mySelections[0].accountNo;
					    $localStorage.SavingsAccountBalance = $scope.mySelections[0].accountBalance;
					    $localStorage.customerId = $scope.mySelections[0].customerId;
					    console.log('Savings Details Stored: '+$localStorage.SavingsAccountNo +", "+$localStorage.SavingsAccountBalance);
					    $location.path('/paymentsCardsSummary');					   					    
					  };
					$scope.cancelPayment = function () {						    
						    $location.path('/home');						  
						  };
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

digitalbankingControllers.controller('CardsSummaryController', [ '$scope','$localStorage',
		function($scope,$localStorage) {

		} ]);

digitalbankingControllers.controller('PaymentsCardsSummaryController', [
'$scope',
'CardService','$localStorage','$location',
function($scope, CardService,$localStorage,$location) {

	$scope.cardSummary = {};
	$scope.mySelections = [];
	$scope.paymentsCardGridOptions = {
		data : 'cardSummary',
		columnDefs : [ 
		{
			field : 'customerId',
			displayName : 'Customer ID'
		},
		{
			field : 'cardNo',
			displayName : 'Card Number'
		}, {
			field : 'cardType',
			displayName : 'Type'
		}, {
			field : 'creditLimit',
			displayName : 'Balance'
		},
		{
			field : 'cardStatus',
			displayName : 'Card Status'
		}],
	   enableRowSelection : true,
	   showSelectionCheckbox : true,
	   multiSelect: false,								
	   enableHighlighting : true,
	   selectedItems : $scope.mySelections
	};
	getCardSummary();
	$scope.startPayment = function () {	    
	    $localStorage.PaymentCardNo = $scope.mySelections[0].cardNo;
	    $localStorage.PaymentCardBalance =  $scope.mySelections[0].creditLimit;
	    console.log('Card Details Stored: '+$localStorage.PaymentCardNo+", "+$localStorage.PaymentCardBalance);
	    $location.path('/paymentsFinalSummary');					   					    
	  };
	$scope.cancelPayment = function () {						    
		    $location.path('/home');						  
		  };
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


digitalbankingControllers.controller('PaymentsFinalSummaryController', [
'$scope',
'CardService','$localStorage','$location',
function($scope, CardService,$localStorage,$location) {	
	$scope.savingsDetailsAccountNo = $localStorage.SavingsAccountNo;
	$scope.savingsDetailsBalance = $localStorage.SavingsAccountBalance;
	$scope.cardDetailsCardNo = $localStorage.PaymentCardNo;
	$scope.cardDetailsCardBalance = $localStorage.PaymentCardBalance;	
	$scope.currentDate = new Date();
	$scope.makePayment = function () {
		if($scope.payableAmount == null || $scope.payableAmount === "") 
			{				
				alert("Please Enter a Valid Amount to Pay. ");
			}	
		else if($scope.payableAmount < 0)
			{
				alert("Payable Amount cannot be Negative. Enter a Valid Amount");
			}
		else if( $scope.payableAmount > $localStorage.SavingsAccountBalance)
			{
				alert("Savings Account Balance is Lesser than Payable Amount");
			}
		else 
			{
			$localStorage.PaymentDueAmount = $scope.payableAmount;
			$location.path('/paymentsFinalSummaryOTP');					
			}			    			   					   
	  };
	$scope.cancelPayment = function () {						    
		    $location.path('/home');						  
		  };
	} ]);

digitalbankingControllers.controller('PaymentsFinalSummaryOTPController', [
'$scope',
'CardPaymentService','$localStorage','$location',
function($scope, CardPaymentService,$localStorage,$location) {	
	$scope.savingsDetailsAccountNo = $localStorage.SavingsAccountNo;
	$scope.savingsDetailsBalance = $localStorage.SavingsAccountBalance;
	$scope.cardDetailsCardNo = $localStorage.PaymentCardNo;
	$scope.cardDetailsCardBalance = $localStorage.PaymentCardBalance;	
	$scope.transferredAmount = $localStorage.PaymentDueAmount;
	$scope.currentDate = new Date();
	$localStorage.currentDate =$scope.currentDate; 
	$scope.makePayment = function () {
		$localStorage.OTP = $scope.OTPdata;
		alert("OTP Data is"+$scope.OTPdata);
		CardPaymentService.payCreditCard().success(
							function(data, status, headers,
									config) {
								if (data != null) {
									//alert("All Success!"+data);
									$localStorage.TransactionID = data;
									$localStorage.TransactionStatus = "Success";									
									$location.path('/paymentsConfirmation');
								}
							}).error(function() {
								console.log("Failed somewhere...");
							});
		/*$localStorage.TransactionID = "ACGD437624372DG";
		$localStorage.TransactionStatus = "Success";
		alert("Data to be Posted to Server.");
		$location.path('/paymentsConfirmation');*/
	}	 
	$scope.cancelPayment = function () {						    
		    $location.path('/home');						  
		  };
	} ]);

digitalbankingControllers.controller('PaymentsConfirmation', [
'$scope',
'CardService','$localStorage','$location',
function($scope, CardService,$localStorage,$location) {	
	$scope.transactionStatus = $localStorage.TransactionStatus;
	$scope.transactionID = $localStorage.TransactionID;
	$scope.makePayment = function () {		
		$location.path('/home');			
	  };

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
			field : 'cardNo',
			displayName : 'Card Number'
		}, {
			field : 'cardType',
			displayName : 'Type'
		}, {
			field : 'creditLimit',
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
