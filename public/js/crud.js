import Validation from './valid.js';

const v = new Validation();

$(".sendMsg").click(function (e) { 
    e.preventDefault();
    const type = $(this).data("type");
    const msgId = this.parentNode.querySelector(["select"]).value;
    const csrf = this.parentNode.querySelector("input[name='_csrf']").value;
    let mob;
    if (type == "single" ) {
         mob = this.parentNode.parentNode.querySelector("input[name='mob']").value;
    }
    if (msgId != "null") {
        let url = "/user/sendMsg";
        let data = {msgId: msgId,mob: mob}
        if(type == 'all'){
            url = "/user/sendMsgToAll";
            data = {msgId: msgId}
        } 
        $("#overlay").show();
        $.ajax({
            type: "POST",
            url: url,
            headers: {'CSRF-Token': csrf },
            data: data,
            success: response => {$("#overlay").hide(); v.showSuccess(response.success)},
            error: err => {$("#overlay").hide(); v.showError()}
        });
    }
    else{
        v.showError("Please Select Message First");
    }
});


function del (id,parent,csrf,type){
        let url = "";
        if (type =="contact") {
            url = "/user/delete-contact/";
        } 
        if(type =='msg') {
            url = "/user/delete-message/";
        }
        $("#overlay").show();
        $.ajax({
            type: "DELETE",
            url: url + id,
            headers: {'CSRF-Token': csrf },
            processData: false,
            success: response => {
                $("#overlay").hide();
                $(parent).remove();
                v.showSuccess(response.success);
                console.log($("#contactsTable").has("tr").length);
                if ($("#contactsTable").has("tr").length == 0 ) {
                    $("#sendAll").remove();
                    if(type =='contact')
                    $("#contactsTable").append("<tr><td style='color: red;' colspan='5'>No Contact Found ...</td></tr>");
                    if(type =='msg')
                       $("#contactsTable").append("<tr><td style='color: red;' colspan='5'>No Message Found ...</td></tr>");
                }
            },
            error: err => {$("#overlay").hide(); v.showError(err.responseJSON.error)}
        });
    }

$(".deleteContact").click(function (e) { 
    e.preventDefault();
    const contactId = $(this).data("id");
    const csrf = this.parentNode.querySelector("input[name='_csrf']").value;
    const parent = this.parentNode.parentNode;
    if (confirm("Do you really want to delete contact")) {
        del(contactId,parent,csrf,"contact");
    }
});

$(".deleteMsg").click(function (e) { 
    e.preventDefault();
    const msgId = $(this).data("id");
    const csrf = this.parentNode.querySelector("input[name='_csrf']").value;
    const parent = this.parentNode.parentNode;
    if (confirm("Do you really want to delete message")) {
        del(msgId,parent,csrf,"msg")
    }    
});

$("#search").keyup(function (e) {
    // e.preventDefault();
    let url = "";
    const name = $("#search").val();
    const csrf = $("#searchCsrf").val();
    if(name != ""){
        url = "/user/search-contact/";
    }
    else{
        url = "/user/view-contact";
    }
        $.ajax({
            type: "POST",
            url: url+name,
            headers: {'CSRF-Token': csrf },
            success: function (response) {
                if(response.list.length>0){
                    const msg = response.msg;
                    const csurf = response.csrfToken;
                    $("tbody").empty();
                    response.list.forEach(e => {
                        $("#contactsTable").append("<tr><td><input type='text' name='name' readonly value='"+e.name+"'></td><td><input type='tel' name='mob' readonly value='"+e.mobile+"'></td><td style='display: inline-flex;'><select class='form-select' name='msg'><option value='null' disabled selected>Select Message</option>"
                           +"</select><input type='hidden' name='_csrf' value="+csurf+">"
                           +"<button data-type='single' style='margin-left: 10px;' class='btn btn-primary sendMsg'><i class='fa fa-send'></i></button></td><td><input type='hidden' name='_csrf' value="+csurf+">"
                           +"<button data-id="+e._id+"  type='button' class='btn btn-success openContactUpdate'>Edit</button></td><td><input type='hidden' name='_csrf' value="+csurf+">"
                           +"<button data-id="+e._id+" type='button' class='btn btn-danger deleteContact'>Delete</button></td></tr>");
                    });
                    msg.forEach(m => { $("select").append("<option value='"+m._id+"'>"+m.title+"</option>")})
                }else{
                    $("#contactsTable").html("<tr><td style='color: red;' colspan='5'>No Contact Found ...</td></tr>");
                }
            }
        });
});

var UpdateParent;

function update (id,data1,data2,csrf,type){
    let data = {};
    let url = "";
    if(type == "contact"){
         data = {
            name:data1,
            mob:data2
        }
         url = "/user/update-contact/";
    }
    if(type=="msg"){       
         data = {
            title:data1,
            msg:data2
        }
        url = "/user/update-message/";
    }
    $("#overlay").show();
    $.ajax({
        type: "PATCH",
        headers: {'CSRF-Token': csrf },
        url: url+id,
        data: data,
        success: function (response) {
            $("#overlay").hide();
            if(type == "contact"){
                UpdateParent.querySelector("input[name='mob']").value = data2
                UpdateParent.querySelector("input[name='name']").value = data1
            }
            if(type =='msg'){
                UpdateParent.querySelector("textarea[name='msg']").value = data2
                UpdateParent.querySelector("input[name='title']").value = data1
            }
            v.showSuccess(response.success)
        },
        error: err => {$("#overlay").hide(); v.showError(err.responseJSON.error)}
    });
}

$(".openContactUpdate").click(function (e) { 
    e.preventDefault();
    const contactId = $(this).data("id");
    const name = this.parentNode.parentNode.querySelector("input[name='name']").value;
    const mob =  this.parentNode.parentNode.querySelector("input[name='mob']").value;
    UpdateParent = this.parentNode.parentNode;
        $("#name").val(name);
        $("#mob").val(mob);
        $("#updateBtn").attr("data-update",contactId);
});

$(".updateContact").click(function (e) { 
    e.preventDefault();
    const contactId = $(this).data("update");
    const name = $("#name").val();
    const mob = $("#mob").val();
    const csrf = this.parentNode.parentNode.querySelector("input[name='_csrf']").value;
    update(contactId,name,mob,csrf,"contact"); 
});

$(".openMsgUpdate").click(function (e) { 
    e.preventDefault();
    const msgId = $(this).data("id");
    // console.log("msg");
    const title = this.parentNode.parentNode.querySelector("input[name='title']").value;
    const msg =  this.parentNode.parentNode.querySelector("textarea[name='msg']").value;
    UpdateParent = this.parentNode.parentNode;
        $("#title").val(title);
        $("#msg").val(msg);
        $("#updateBtn").attr("data-update",msgId);
});

$(".updateMsg").click(function (e) { 
    e.preventDefault();
    const msgId = $(this).data("update");
    const title = $("#title").val();
    const msg = $("#msg").val();
    const csrf = this.parentNode.parentNode.querySelector("input[name='_csrf']").value;
    update(msgId,title,msg,csrf,"msg");
});
