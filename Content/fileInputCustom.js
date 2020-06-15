(function (document) {
    //var input = document.getElementById('UrlDoc');
    var inputs = document.getElementsByClassName('inputfile');
    //var inputs_ = $("input[type = file]");
    for (e = 0; e < inputs.length; e++) {
        console.log(inputs.length);
        var input = inputs[e];
        var label = input.nextElementSibling;
        labelVal = label.innerHTML;
        input.addEventListener('change', function (e) {
            var fileName = '';
            if (this.files.length > 1) {
                //fileName = (this.getAttribute('data-multiple-caption') || '').replace('{count}', this.files.length);
                fileName = this.files.length + ' fichiers';
            }
            else {
                fileName = e.target.value.split('\\').pop();
                //label.querySelector('span').innerHTML = fileName;
                //label.querySelector('span').innerHTML = e.target.value.split('\\').pop();
            }
            if (fileName) {
                label.querySelector('span').innerHTML = fileName;
            }
            else {
                label.innerHTML = labelVal;
            }
        });
        // Firefox bug fix
        input.addEventListener('focus', function () { input.classList.add('has-focus'); });
        input.addEventListener('blur', function () { input.classList.remove('has-focus'); });
    }

}(document, window, 0));