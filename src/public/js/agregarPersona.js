let fotoPersona
document.getElementById("filePersona").addEventListener("change", getUrl);

function getUrl() {
  if (this.files && this.files[0]) {
    debugger
    var FR = new FileReader();
    FR.addEventListener("load", function (e) {
      document.getElementById("imgPersona").src = e.target.result;
      fotoPersona = e.target.result;
    });

    FR.readAsDataURL(this.files[0]);
  }
}

document.addEventListener('DOMContentLoaded', function () {
  var elems = document.querySelectorAll('select');
  var instances = M.FormSelect.init(elems);

});

document.getElementById('tipoPersona').addEventListener('change', getD);

function getD() {
  if (document.getElementById('tipoPersona').value == 'Voluntario') {
    document.getElementById('containerVoluntario').style.display = 'block';
    document.getElementById('containerRegistro').style.display = 'block';
    document.getElementById('rolForm').style.display = 'block';

  } else {
    document.getElementById('containerVoluntario').style.display = 'none';
    document.getElementById('containerRegistro').style.display = 'none';
    document.getElementById('rolForm').style.display = 'none';
    // alert('genio')
  }
}