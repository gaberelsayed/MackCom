$(document).ready(function () {
    setTimeout(function () {
        $('.alert').fadeOut('fast');
    }, 5000);
});

const checkFields = (...fields) => {
    const check = fields.filter(f => f.length == 0);
    if (check.length > 0) {
        $("#liveToast").addClass("bg-danger");
        $(".toast-body").html("All Feilds are required !!");
        $("#liveToast").toast("show");
        setTimeout(() => {
            $("#liveToast").removeClass("bg-danger");
        }, 4000);
        return false;
    } else {
        return true;
    }
}

const showSuccess = data => {
    $("#liveToast").addClass("bg-success");
    $(".toast-body").html(data);
    $("#liveToast").toast("show");
    setTimeout(() => {
        $("#liveToast").removeClass("bg-success");
    }, 3000);
}
const showError = (data = "Something went Wrong,Try after sometime !") => {
    $("#liveToast").addClass("bg-danger");
    $(".toast-body").html(data);
    $("#liveToast").toast("show");
    setTimeout(() => {
        $("#liveToast").removeClass("bg-danger");
    }, 3000);
}