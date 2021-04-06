export default class Validation {

    checkFields (...fields) {
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
    showSuccess (data) {
        $("#liveToast").addClass("bg-success");
        $(".toast-body").html(data);
        $("#liveToast").toast("show");
        setTimeout(() => {
            $("#liveToast").removeClass("bg-success");
        }, 4000);
    }
    showError (data = "Something went Wrong,Try after sometime !") {
        $("#liveToast").addClass("bg-danger");
        $(".toast-body").html(data);
        $("#liveToast").toast("show");
        setTimeout(() => {
            $("#liveToast").removeClass("bg-danger");
        }, 4000);
    }
}

