import Validation from './valid.js';

const v = new Validation();

class Post extends Validation {
    constructor(data1, data2) {
        super();
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
                super.showSuccess(result.success)
                $("#addForm").trigger("reset");
            },
            error: err => {
                $("#overlay").hide();
                if (err.status == 409 || err.status == 422) {
                    super.showError(err.responseJSON.error)
                } else {
                    super.showError()
                }
            }
        });
    }
}

window.postMessage = () => {
    const title = $("#title").val();
    const msg = $("#msg").val();
    const _csrf = $("#_csrf").val();
    if (v.checkFields(title, msg)) {
        const msgBox = new Post(title, msg)
        msgBox.postData("/user/add-message", _csrf)
    }
}

window.postContact = () => {
    const name = $("#name").val();
    const mob = $("#mob").val();
    const _csrf = $("#_csrf").val();
    if (v.checkFields(name,mob)) {
        const phoneBook = new Post(name,mob)
        phoneBook.postData("/user/add-contact",_csrf)
    }
}
