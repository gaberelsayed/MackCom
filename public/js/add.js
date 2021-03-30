class Post {
    constructor(data1, data2) {
        this.data = {
            "field1": data1,
            "field2": data2
        }
    }
    postData(url, _csrf) {
        $("#overlay").show();
        $.ajax({
            type: "POST",
            url: url,
            data: this.data,
            headers: {
                'CSRF-Token': _csrf
            },
            success: result => {
                $("#overlay").hide();
                showSuccess(result.success)
                $("#addForm").trigger("reset");
            },
            error: err => {
                $("#overlay").hide();
                if (err.status == 409 || err.status == 422) {
                    showError(err.responseJSON.error)
                } else {
                    showError()
                }
            }
        });
    }
}

function postMessage() {
    const title = $("#title").val();
    const msg = $("#msg").val();
    const _csrf = $("#_csrf").val();
    if (checkFields(title, msg)) {
        const msgBox = new Post(title, msg)
        msgBox.postData("/user/add-message", _csrf)
    }
}

function postContact() {
    const name = $("#name").val();
    const mob = $("#mob").val();
    const _csrf = $("#_csrf").val();
    if (checkFields(name,mob)) {
        const phoneBook = new Post(name,mob)
        phoneBook.postData("/user/add-contact",_csrf)
    }
}