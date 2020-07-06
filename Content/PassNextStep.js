
$('input').change(function () {
    if (this.type != null && this.type != 'submit' && !this.checkValidity()) {
        this.style.border = "2px solid red";
    }
    else {
        this.style.border = "2px dashed green";
    }
});

$('select').change(function () {
    if (this.type != null && this.type != 'submit' && !this.checkValidity()) {
        this.style.border = "2px solid red";
    }
    else {
        this.style.border = "2px dashed green";
    }
});
function surChange(element) {
    if (element.type != null && element.type != 'submit' && !element.checkValidity()) {
        element.style.border = "2px solid red";
    }
    else {
        element.style.border = "2px dashed green";
    }
}

var inputs = document.getElementsByTagName('input');
var selects = document.getElementsByTagName('select');

function passClicked(a, nameAttr) {
    if (confirm('Voulez Vous Vraiment passer a L\'etape suivante ??')) {
        var errors = 0;
        Array.from(inputs).forEach(function (item) {
            if (item.type == 'file') {
                if (!item.checkValidity()) {
                    errors += 1;
                    item.className = 'inputfile inputfile-err';
                }
                else {
                    item.className = 'inputfile inputfile-1';
                }
            }
            if (item.type != null && item.type != 'file' && item.id != 'Date_Commission' && item.type != 'submit' && !item.checkValidity()) {
                errors += 1;
                item.style.border = "2px solid red";
            }
            else {
                item.style.border = "";
            }
        });
        Array.from(selects).forEach(function (item) {
            if (!item.checkValidity()) {
                errors += 1;
                item.style.border = "2px solid red";
            }
            else {
                item.style.border = "";
            }
        });
        //console.log('errors = ' + errors);
        if (errors == 0) {
            var input = document.createElement('input');
            input.setAttribute('type', 'hidden');
            input.setAttribute('name', nameAttr);
            input.setAttribute('value', '1');
            a.parentNode.appendChild(input);
            console.log(a.closest('form'));
            a.closest('form').submit();
        }
        else {
            alert(errors + " champs non valides !!");
        }

    }
}