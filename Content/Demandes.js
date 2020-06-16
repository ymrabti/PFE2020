
var table = document.getElementById('tableau');
var rows = table.rows;
//alert(rows.length);
for (var i = 0; i < rows.length; i++) {


    var date = new Date(rows[i].getAttribute('value'));
    var dateNow = new Date();
    var date_now = new Date(dateNow.toISOString().slice(0, 10) + ',' + dateNow.getHours() + ':' + dateNow.getMinutes());
    var tempsRester = (date.getTime() + 172800000) - date_now.getTime();
    var tempsResterSec = 172800000 - tempsRester;
    var backclr = '';
    var clr = '';

    if (tempsRester < 0) { backclr = '#fff'; clr = 'black' } else if (0 <= tempsRester && tempsRester < 43200000) { backclr = '#e38710'; clr = 'white' }
    rows[i].setAttribute('temps', tempsResterSec);
    rows[i].setAttribute('backclr', backclr);
    rows[i].setAttribute('clr', clr);
    rows[i].style.backgroundColor = backclr;
    rows[i].style.color = clr;

    rows[i].onclick = function () {
        for (var j = 0; j < rows.length; j++) {
            table.rows[j].style.backgroundColor = table.rows[j].getAttribute('backclr');
            table.rows[j].style.color = table.rows[j].getAttribute('clr');
            table.rows[j].clicked = false;

        }
        var tab = document.getElementById("tableFilter");
        for (var i = 0; i < tab.rows.length; i++) {


            if (tab.rows[i]/*.cells[4]*/.innerHTML.includes(" Dépassement de délai")) {

                tab.rows[i].style.color = '#FF3364';
            }
        }
        var id = this.id;
        document.getElementById(id).style.backgroundColor = "#DAEFF9";
        document.getElementById(id).style.borderColor = "#2e6da4";
        document.getElementById(id).style.color = "balck";
        document.getElementById(id).clicked = true;
        document.getElementById('hiddenDemande').value = id;
        document.getElementById('btnsend').disabled = false;;

    }


    rows[i].onmouseover = function () {
        var id = this.id;
        if (document.getElementById(id).clicked != true) {
            document.getElementById(id).style.backgroundColor = "#f5f5f5";
            document.getElementById(id).style.borderColor = "#f5f5f5";
            document.getElementById(id).style.color = '';
            var tab = document.getElementById("tableFilter");
            for (var i = 0; i < tab.rows.length; i++) {


                if (tab.rows[i].innerHTML.includes(" Dépassement de délai")) {

                    tab.rows[i].style.color = '#FF3364';
                }
            }
        }
    }

    rows[i].onmouseout = function () {
        var id = this.id;
        if (document.getElementById(id).clicked != true) {
            document.getElementById(id).style.backgroundColor = document.getElementById(id).getAttribute('backclr');
            document.getElementById(id).style.borderColor = '';
            document.getElementById(id).style.color = document.getElementById(id).getAttribute('clr');
            var tab = document.getElementById("tableFilter");
            for (var i = 0; i < tab.rows.length; i++) {


                if (tab.rows[i].innerHTML.includes(" Dépassement de délai")) {

                    tab.rows[i].style.color = '#FF3364';
                }
            }
        }
    };
}




