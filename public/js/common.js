import Validation from './valid.js';
const v = new Validation();

$(document).ready(function () {
    setTimeout(function () {
        $('.alert').fadeOut('fast');
    }, 5000);
});

$("#updatePassword").click(function (e) { 
    e.preventDefault();
    const old_pass = $("#pass").val();
    const new_pass = $("#new_pass").val();
    const csrf = this.parentNode.parentNode.querySelector("input[name='_csrf']").value;
    if(old_pass == "" || new_pass ==""){
        return v.showError("All feilds are required");
    }
    $.ajax({
        type: "PATCH",
        url: "/user/updatePassword",
        data: {oldPassword:old_pass,newPassword:new_pass},
        headers: {'CSRF-Token': csrf },
        success: function (response) {
            // console.log(response);
            v.showSuccess(response.success);            
        },
        error: err=>{
            console.log(err);
            if(err.status == 422) 
                return v.showError(err.responseJSON.error)   
            else
                return v.showError();        
        }
    });
});
