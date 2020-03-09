function Registraringreso(registro){
    let d=new Date().getTime();
    let hour = new Date(d)

    var t = new Date;
    let fecha = `${t.getFullYear()}-${t.getMonth()+1}-${t.getDate()}`

    const url = 'http://localhost:3000/api/regIngresoVol';
    const data = {};
    data.fecha=fecha;
    data.hora_ing=hour.toLocaleTimeString();
    data.hora_salida='00:00:00';
    data.registro=registro;
    
    
    let JSO = JSON.stringify(data)
    alert(JSO)
    fetch(url, {
        method: 'POST', // or 'PUT'
        body: JSO, // data can be `string` or {object}!
        headers:{
            'Content-Type': 'application/json'
        }
    }).then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(response => alert('Asistencia Registrada'));
}
function RegistrarSalida(registro){
    let d=new Date().getTime();
    let hour = new Date(d)

    var t = new Date;
    let fecha = `${t.getFullYear()}-${t.getMonth()+1}-${t.getDate()}`

    const url = `http://localhost:3000/api/regSalidaVol/${fecha}/${registro}`;
      let data = {};
      data.hora_salida=hour.toLocaleTimeString();

      // debugger
     
      // debugger
      let JSO = JSON.stringify(data)
      alert(JSO);
    
      fetch(url, {
          method: 'PUT', // or 'PUT'
          body: JSO, // data can be `string` or {object}!
          headers:{
              'Content-Type': 'application/json'
          }
      }).then(res => res.json())
      .catch(error => console.error('Error:', error))
      .then(response => alert("Salida Actualizado")); 
}

function Entrada(registro){
    let $prog=document.getElementById(`content${registro}`)
    let $botoningreso = document.getElementById(`btnIngreso${registro}`)
    let $botonsalida = document.getElementById(`btnSalida${registro}`)
    Registraringreso(registro)
    // alertify.success(`Asistencia Marcada asignacion numero ${codasig}`);
    $prog.classList.add('asis');
    $botoningreso.disabled=true;
    $botonsalida.disabled=false;
}
function Salida(registro){
    let $prog=document.getElementById(`content${registro}`)
    let $botoningreso = document.getElementById(`btnIngreso${registro}`)
    let $botonsalida = document.getElementById(`btnSalida${registro}`)
    RegistrarSalida(registro);
    // alertify.success(`Asistencia Marcada asignacion numero ${codasig}`);
    $prog.classList.remove('asis');
    // $botoningreso.disabled=false;
    $botonsalida.disabled=true;
}



async function cargarVoluntarios(idlab,idhorario){
    async function getVoluntarios(url) {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    }
    const $listaVoluntarios= await getVoluntarios(`http://localhost:3000/api/getVoluntarios/${idlab}/${idhorario}`);
    // debugger
    function voluntarioItemTemplate(persona){
        return `<div class="card">
                    <div id="content${persona.registro}" class="card-content">
                    <div class="techoRojo"></div>
                        <img class="fotoVoluntario" src="http://localhost:3000/photos/${persona.nombres} ${persona.apat} ${persona.amat}-${persona.ci}.jpg" alt="">
                    <span class="card-title">${persona.nombres}</span>
                    <span class="card-title">${persona.apat} ${persona.amat}</span>
                    <p></p>
                    <img class="fotoAdulto" src="http://localhost:3000/photos/${persona.foto}.jpg" alt="">
                    <p></p>
                    </div>
                    <div class="card-action">
                    <button class="btn" id="btnIngreso${persona.registro}" onclick="Entrada(${persona.registro});">Entrada</button>
                    <button class="btn" id="btnSalida${persona.registro}" onclick="Salida(${persona.registro});">Salida</button>
                    <button class="btn modal-trigger" href="#modal1">Detalles</button>
                    </div>
                </div>`;
    }
    function createTemplate(HTMLString){
        const $html = document.implementation.createHTMLDocument();
        $html.body.innerHTML = HTMLString;
        return $html.body.children[0];
    }
    
    function renderVoluntarios(listvoluntarios, $container){
        // $container.children[0].remove();
        $container.innerHTML='';

        var t = new Date;
        let fecha = `${t.getFullYear()}-${t.getMonth()+1}-${t.getDate()}`
        
        listvoluntarios.forEach(voluntario => {
            async function validarMarcacion(){
                const $asis= await getVoluntarios(`http://localhost:3000/api/obtenerAsisMarcada/${fecha}/${voluntario.registro}`);
                debugger
                if($asis[0] != null){   
                    debugger                                    
                        if($asis[0].hora_salida=='00:00:00'){
                            const HTMLString = voluntarioItemTemplate(voluntario);
                            const voluntarioElement = createTemplate(HTMLString);         
                            $container.append(voluntarioElement);
                            document.getElementById(`content${voluntario.registro}`).classList.add('asis');
                            document.getElementById(`btnIngreso${voluntario.registro}`).disabled=true
                            document.getElementById(`btnSalida${voluntario.registro}`).disabled=false
                            
                        }else{
                            const HTMLString = voluntarioItemTemplate(voluntario);
                            const voluntarioElement = createTemplate(HTMLString);         
                            $container.append(voluntarioElement);
                            document.getElementById(`content${voluntario.registro}`).classList.remove('asis');
                            document.getElementById(`btnIngreso${voluntario.registro}`).disabled=true
                            document.getElementById(`btnSalida${voluntario.registro}`).disabled=true
                            
                        }              
                }else{
                        
                        const HTMLString = voluntarioItemTemplate(voluntario);
                        const voluntarioElement = createTemplate(HTMLString);         
                        $container.append(voluntarioElement);
                }
            }
            validarMarcacion()
            
        });    
    }
    const $containerVoluntarios = document.getElementById('containerVoluntarios')
    
    renderVoluntarios($listaVoluntarios, $containerVoluntarios)
};

document.getElementById('btnBuscarAsis').addEventListener('click',()=>{
    cargarVoluntarios(document.getElementById('labAsis').value,document.getElementById('horarioAsis').value)
})