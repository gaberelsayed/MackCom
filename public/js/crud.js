import Validation from './valid.js';

const v = new Validation();

window.sendMsg = (t) => {
    const msgId = t.parentNode.querySelector(["select"]).value;
    const csrf = t.parentNode.querySelector("input[name='_csrf']").value;
    const mob = t.parentNode.parentNode.querySelector("input[name='mob']").value;
    if (msgId != "null") {
        $("#overlay").show();
        $.ajax({
            type: "POST",
            url: "/user/sendMsg",
            headers: {'CSRF-Token': csrf },
            data: {
                msgId: msgId,
                mob: mob
            },
            success: response => {$("#overlay").hide(); v.showSuccess(response.success)},
            error: err => {$("#overlay").hide(); v.showError()}
        });
    }
    else{
        v.showError("Please Select Message First");
    }
}

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
                if ($("tbody").has("tr").length == 0) {
                    if(type =='contact')
                    $("tbody").append("<tr><td style='color: red;' colspan='5'>No Contact Found ...</td></tr>");
                    if(type =='msg')
                       $("tbody").append("<tr><td style='color: red;' colspan='5'>No Message Found ...</td></tr>");
                }
            },
            error: err => {$("#overlay").hide(); v.showError(err.responseJSON.error)}
        });
    }

window.deleteContact = (t) => {
    const contactId = $(t).data("id");
    const csrf = t.parentNode.querySelector("input[name='_csrf']").value;
    const parent = t.parentNode.parentNode;
    if (confirm("Do you really want to delete contact")) {
        del(contactId,parent,csrf,"contact");
    }
}

window.deleteMsg = (t) => {
    const msgId = $(t).data("id");
    const csrf = t.parentNode.querySelector("input[name='_csrf']").value;
    const parent = t.parentNode.parentNode;
    if (confirm("Do you really want to delete message")) {
        del(msgId,parent,csrf,"msg")
    }
}
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
                        $("tbody").append("<tr><td><input type='text' name='name' readonly value='"+e.name+"'></td><td><input type='tel' name='mob' readonly value='"+e.mobile+"'></td><td style='display: inline-flex;'><select class='form-select' name='msg'><option value='null' disabled selected>Select Message</option>"
                           +"</select><input type='hidden' name='_csrf' value="+csurf+">"
                           +"<button onclick='sendMsg(this)' style='margin-left: 10px;' class='btn btn-primary'><i class='fa fa-send'></i></button></td><td><input type='hidden' name='_csrf' value="+csurf+">"
                           +"<button data-id="+e._id+" onclick='openContactUpdate(this)' type='button' class='btn btn-success'>Edit</button></td><td><input type='hidden' name='_csrf' value="+csurf+">"
                           +"<button data-id="+e._id+" onclick='deleteContact(this)' type='button' class='btn btn-danger'>Delete</button></td></tr>");
                    });
                    msg.forEach(m => { $("select").append("<option value='"+m._id+"'>"+m.title+"</option>")})
                }else{
                    $("tbody").html("<tr><td style='color: red;' colspan='5'>No Contact Found ...</td></tr>");
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

window.openContactUpdate = (t) => { 
    const contactId = $(t).data("id");
    const name = t.parentNode.parentNode.querySelector("input[name='name']").value;
    const mob =  t.parentNode.parentNode.querySelector("input[name='mob']").value;
    UpdateParent = t.parentNode.parentNode;
        $("#name").val(name);
        $("#mob").val(mob);
        $("#updateBtn").attr("data-update",contactId);
}

window.updateContact = (t) => { 
    const contactId = $(t).data("update");
    const name = $("#name").val();
    const mob = $("#mob").val();
    const csrf = t.parentNode.parentNode.querySelector("input[name='_csrf']").value;
    update(contactId,name,mob,csrf,"contact");
    
}

window.openMsgUpdate = (t) => { 
    const msgId = $(t).data("id");
    // console.log("msg");
    const title = t.parentNode.parentNode.querySelector("input[name='title']").value;
    const msg =  t.parentNode.parentNode.querySelector("textarea[name='msg']").value;
    UpdateParent = t.parentNode.parentNode;
        $("#title").val(title);
        $("#msg").val(msg);
        $("#updateBtn").attr("data-update",msgId);
}
window.updateMsg = (t)=>{
    const msgId = $(t).data("update");
    const title = $("#title").val();
    const msg = $("#msg").val();
    const csrf = t.parentNode.parentNode.querySelector("input[name='_csrf']").value;
    update(msgId,title,msg,csrf,"msg");
}