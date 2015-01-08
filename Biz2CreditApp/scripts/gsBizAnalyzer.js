(function (global) {
    var getStartBizAnalyzerViewModel,
        app = global.app = global.app || {};

    getStartBizAnalyzerViewModel = kendo.data.ObservableObject.extend({
        
        show:function()
        {

        },
        submitBizAnalyzer:function()
        {
            console.log('debug')
            var status = app.gsBizAnalyzer.viewModel.validateBizAnalyzer();
            if(status === false)
            return status; 
        },
        validateBizAnalyzer:function()
        {
                var form = document.mosForm;
                var emailhide= document.mosForm.emailHide.value;
                var etype= form.per_type.value;

                if(emailhide===0)
                {
                    var emailID = document.mosForm.email.value;
                }	
                //alert(emailhide +" : "+ emailID);

                if(isNaN(form.txtmaxammount.value))
                     maxidealamt=0;
                else
                     maxidealamt = eval(form.txtmaxammount.value.trim());

                if(isNaN(form.ammount.value))	
                     minidealamt = 0;
                else
                     minidealamt = eval(form.ammount.value.trim());		

                if(form.name.value==="" || form.name.value==="Enter Your Name")
                {
                    navigator.notification.confirm('Please enter your name', function (confirmed) {
                    if (confirmed === true || confirmed === 1) {
                    	document.mosForm.name.focus();
                    }
                    }, 'Notification','OK'); 
                    
                    return false;
                }
                if(form.year.value==="")
                {
                    navigator.notification.confirm('Please select year.', function (confirmed) {
                    if (confirmed === true || confirmed === 1) {
                    	form.year.focus();
                    }
                    }, 'Notification','OK');
                    
                    return false;
                } 
                if(form.month.value==="") 
                {
                    navigator.notification.confirm('Please select month.', function (confirmed) {
                    if (confirmed === true || confirmed === 1) {
                    	form.month.focus();
                    }
                    }, 'Notification','OK');
                    
                    return false;
                }
                if(form.orgname.value==="" || form.orgname.value==="Enter Your Business Name")
                {
                     navigator.notification.confirm('Please enter business name.', function (confirmed) {
                    if (confirmed === true || confirmed === 1) {
                    	document.mosForm.orgname.focus();
                    }
                    }, 'Notification','OK');
                    
                    return false;
                }
                if(form.ammount.value==="" || form.ammount.value==="Min $") 
                {
                    navigator.notification.confirm('Please enter minimum loan amount.', function (confirmed) {
                    if (confirmed === true || confirmed === 1) {
                    	 form.ammount.focus();
                    }
                    }, 'Notification','OK');
                   
                    return false;
                } 
                if(!app.gsBizAnalyzer.viewModel.checknumber(form.ammount,form.ammount.value)){
                    return false;
                }
                if(form.txtmaxammount.value==="" || form.txtmaxammount.value==="Max $") 
                {
                    navigator.notification.confirm('Please enter maximum loan amount.', function (confirmed) {
                    if (confirmed === true || confirmed === 1) {
                    	form.txtmaxammount.focus();
                    }
                    }, 'Notification','OK');

                    return false;
                }
                if(!app.gsBizAnalyzer.viewModel.checknumber(form.txtmaxammount,form.txtmaxammount.value)){
                    return false;
                }

                if(maxidealamt < minidealamt) 
                {
                    navigator.notification.confirm('Maximum loan amount should be greater than or equal to minimum loan amount.', function (confirmed) {
                    if (confirmed === true || confirmed === 1) {
                    	form.txtmaxammount.focus();
                    }
                    }, 'Notification','OK');
                    
                    return false;
                } 
                if(emailhide===0)
                {
                    if(emailID === "" || emailID === "Enter Your Email ID")
                    {
                        navigator.notification.confirm('Please enter an email id.', function (confirmed) {
                        if (confirmed === true || confirmed === 1) {
                        	document.mosForm.email.focus();
                        }
                        }, 'Notification','OK');
                        
                        return false;
                    }
                    if (app.gsBizAnalyzer.viewModel.checkEmail(emailID) === false)
                    {
                        document.mosForm.email.focus();
                        return false;
                    }

                    if(document.getElementById("emailerror").innerHTML.length>0)
                    {
                        navigator.notification.confirm('This email address already exists.', function (confirmed) {
                        if (confirmed === true || confirmed === 1) {
                        	document.getElementById("email").focus();
                        }
                        }, 'Notification','OK');
                        
                        return false;
                    }

                }
                if(form.anu_revenue.value==="" || form.anu_revenue.value==="Annual Revenue $") 
                {
                    navigator.notification.confirm('Please enter annual revenue.', function (confirmed) {
                        if (confirmed === true || confirmed === 1) {
                        	form.anu_revenue.focus();
                        }
                    }, 'Notification','OK');
                    
                    return false;
                }
                if(!app.gsBizAnalyzer.viewModel.checknumber(form.anu_revenue,form.anu_revenue.value)){
                    return false;
                } 
                if(form.orgtype.value==="")
                {
                    navigator.notification.confirm('Please select industry.', function (confirmed) {
                        if (confirmed === true || confirmed === 1) {
                        	form.orgtype.focus();
                        }
                    }, 'Notification','OK');
                    
                    return false;
                }
                if(form.orgcategory.value==="0")
                {
                    navigator.notification.confirm('Please select sub industry.', function (confirmed) {
                        if (confirmed === true || confirmed === 1) {
                        	 form.orgcategory.focus();
                        }
                    }, 'Notification','OK');

                    return false;
                } 
                if(form.credittype.value==="") 
                {
                    navigator.notification.confirm('Please select personal credit score.', function (confirmed) {
                        if (confirmed === true || confirmed === 1) {
                        	 form.credittype.focus();
                        }
                    }, 'Notification','OK');
                    
                    return false;
                }

                if(form.blegal.value==="") 
                {
                    navigator.notification.confirm('Please select Business legal structure.', function (confirmed) {
                        if (confirmed === true || confirmed === 1) {
                        	 form.blegal.focus();
                        }
                    }, 'Notification','OK');
                    
                    return false;
                }        
                if(etype==="0") {
                    navigator.notification.confirm('Please select residence status.', function (confirmed) {
                        if (confirmed === true || confirmed === 1) {
                        	 
                        }
                    }, 'Notification','OK');
                    return false;
                }

                if((etype==="own" || etype==="rent" || etype==="neither" ) && (form.per_ome.value.trim()==="" || form.per_ome.value.trim()===0 || form.per_ome.value.trim()==="Average Other Monthly Expenses $")) 
                {
                    navigator.notification.confirm('Please enter average other monthly expense.', function (confirmed) {
                        if (confirmed === true || confirmed === 1) {
                        	 form.per_ome.focus();
                        }
                    }, 'Notification','OK');
                    
                    return false;
                }  

                if((etype==="own" || etype==="rent" || etype==="neither" ) && isNaN(form.per_ome.value))
                {
                    navigator.notification.confirm('Please enter average other monthly expenses.', function (confirmed) {
                        if (confirmed === true || confirmed === 1) {
                        	 form.per_ome.focus();
                        }
                    }, 'Notification','OK');

                    return false;
                }

                if((etype==="own" || etype==="rent" || etype==="neither") && (form.per_income.value.trim()==="" || form.per_income.value.trim()===0 || form.per_income.value.trim()==="Average Monthly Income $")) 
                {
                    navigator.notification.confirm('Please enter average monthly income.', function (confirmed) {
                        if (confirmed === true || confirmed === 1) {
                        	 form.per_income.focus();
                        }
                    }, 'Notification','OK');
                    
                    return false;
                } 
                if((etype==="own" || etype==="rent" || etype==="neither" ) && isNaN(form.per_income.value))
                {
                    navigator.notification.confirm('Please enter numbers only in average monthly income.', function (confirmed) {
                        if (confirmed === true || confirmed === 1) {
                        	form.per_income.focus();
                        }
                    }, 'Notification','OK');
                    
                    return false;
                }
                if(etype==="rent" && (form.per_rent.value.trim()==="" || form.per_rent.value.trim()===0 || form.per_rent.value.trim()==="Monthly Rent Amount $")) 
                {
                    navigator.notification.confirm('Please enter monthly rent amount.', function (confirmed) {
                        if (confirmed === true || confirmed === 1) {
                        	form.per_rent.focus();
                        }
                    }, 'Notification','OK');
                    
                    return false;
                }
                if((etype==="own")&& (form.per_mon_pay.value.trim()==="" || form.per_mon_pay.value.trim()===0 || form.per_mon_pay.value.trim()==="Monthly Mortgage Payment $")) 
                {
                    navigator.notification.confirm('Please enter monthly mortgage payment.', function (confirmed) {
                        if (confirmed === true || confirmed === 1) {
                        	 form.per_mon_pay.focus();
                        }
                    }, 'Notification','OK');
                    
                    return false;
                } 
                if((etype==="own") && isNaN(form.per_mon_pay.value))
                {
                    navigator.notification.confirm('Please enter numbers only in monthly mortgage payment.', function (confirmed) {
                        if (confirmed === true || confirmed === 1) {
                        	 form.per_mon_pay.focus();
                        }
                    }, 'Notification','OK');
                    
                    return false;
                }
                if(etype==="rent" && isNaN(form.per_rent.value))
                {
                    navigator.notification.confirm('Please enter monthly rent amount.', function (confirmed) {
                        if (confirmed === true || confirmed === 1) {
                        	 form.per_rent.focus();
                        }
                    }, 'Notification','OK');
                    
                    return false;
                }

                if(form.terms.checked === false)
                {
                    navigator.notification.confirm('Please accept terms and condition.', function (confirmed) {
                        if (confirmed === true || confirmed === 1) {
                        	 form.terms.focus();
                        }
                    }, 'Notification','OK');	
                    
                    return false;
                }
                if(parseInt(form.per_ome.value)>parseInt(form.per_income.value)){
                    
                    navigator.notification.confirm('You'+"'"+'ve indicated that average other monthly expenses are greater than the average income. Is this correct?', function (confirmed) {
                        if (confirmed !== true || confirmed !== 1) {
                        	 form.per_income.focus();
                             return false;
                        }
                    }, 'Notification','OK,Cancel');

                }
                return true;
            
        },
        checknumber:function(field,fieldvalue){
            var form = document.mosForm;	
            var x=fieldvalue;
            var anum=/(^\d+$)|(^\d+\.\d+$)/
            if (anum.test(x))
                testresult=true
            else{
                alert("Please enter only numbers. ");
                field.focus();
                field.value='';
                testresult=false
            }
            return (testresult)
        },
        checkEmail:function(emailID) {

            if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailID)){
                return true;
            }
            navigator.notification.confirm('Invalid e-mail address. please re-enter.', function (confirmed) {
                if (confirmed === true || confirmed === 1) {
                	
                }
            }, 'Notification','OK');

            return false;
        }

    });
   
    app.gsBizAnalyzer = {
       viewModel: new getStartBizAnalyzerViewModel()	
    };
})(window);