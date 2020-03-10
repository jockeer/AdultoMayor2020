function RegistraringresoFac(registro){
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
function RegistrarSalidaFac(registro){
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


function EntradaFac(registro){
    // socket.emit('fondoVerde', 'asis')
    $prog=document.getElementById(`content${registro}`)
    $botoningreso = document.getElementById(`btnIngreso${registro}`)
    $botonsalida = document.getElementById(`btnSalida${registro}`)
    RegistraringresoFac(registro)
    $prog.classList.add('asis');
    $botoningreso.disabled=true;
    $botonsalida.disabled=false;

}


function SalidaFac(registro){
    let $prog=document.getElementById(`content${registro}`)
    let $botoningreso = document.getElementById(`btnIngreso${registro}`)
    let $botonsalida = document.getElementById(`btnSalida${registro}`)
    RegistrarSalidaFac(registro);
    // alertify.success(`Asistencia Marcada asignacion numero ${codasig}`);
    $prog.classList.remove('asis');
    // $botoningreso.disabled=false;
    $botonsalida.disabled=true;

    
}

async function cargarFacilitadores(idlab,idhorario){
    async function getFacilitadores(url) {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    }
    const $listaFacilitadores= await getFacilitadores(`http://localhost:3000/api/getFacilitadores/${idlab}/${idhorario}`);
    function FacilitadorItemTemplate(persona){
        return `<div class="card">
                    <div id="content${persona.registro}" class="card-content">
                    <h6>${persona.rol}</h6>
                    <figure>
                        <img class="fotoFacilitador" src="http://localhost:3000/photos/${persona.nombres} ${persona.apat} ${persona.amat}-${persona.ci}.jpg" alt="">
                    </figure>
                    <span class="card-title">${persona.nombres} ${persona.apat} ${persona.amat}</span>
                    
                    </div>
                    <div class="card-action">
                    <button class="btn" id="btnIngreso${persona.registro}" onclick="EntradaFac(${persona.registro});">Entrada</button>
                    <button class="btn" id="btnSalida${persona.registro}" disabled onclick="SalidaFac(${persona.registro});">Salida</button>
                    <button class="btn modal-trigger" href="#modal1">Detalles</button>
                    </div>
                </div>`;
    }
    function createTemplate(HTMLString){
        const $html = document.implementation.createHTMLDocument();
        $html.body.innerHTML = HTMLString;
        return $html.body.children[0];
    }
    
    function renderFacilitador(listpersonas, $container){
        // $container.children[0].remove();
        $container.innerHTML='';
        var t = new Date;
        let fecha = `${t.getFullYear()}-${t.getMonth()+1}-${t.getDate()}`
        
        listpersonas.forEach(facilitador => {
            async function validarFacMarcacion(){
                const $asis= await getFacilitadores(`http://localhost:3000/api/obtenerAsisMarcada/${fecha}/${facilitador.registro}`);
                debugger
                if($asis[0] != null){
                    if($asis[0].hora_salida=='00:00:00'){
                        const HTMLString = FacilitadorItemTemplate(facilitador);
                        const facilitadorElement = createTemplate(HTMLString);         
                        $container.append(facilitadorElement);
                        document.getElementById(`content${facilitador.registro}`).classList.add('asis');
                        document.getElementById(`btnIngreso${facilitador.registro}`).disabled=true
                        document.getElementById(`btnSalida${facilitador.registro}`).disabled=false
                        
                    }else{
                        const HTMLString = FacilitadorItemTemplate(facilitador);
                        const facilitadorElement = createTemplate(HTMLString);         
                        $container.append(facilitadorElement);
                        document.getElementById(`content${facilitador.registro}`).classList.remove('asis');
                        document.getElementById(`btnIngreso${facilitador.registro}`).disabled=true
                        document.getElementById(`btnSalida${facilitador.registro}`).disabled=true
                        
                    }     
                }else{                       
                    const HTMLString = FacilitadorItemTemplate(facilitador);
                    const facilitadorElement = createTemplate(HTMLString);         
                    $container.append(facilitadorElement);                   
                }
            }
            validarFacMarcacion()
            
        });    
    }
    const $containerFacilitadores = document.getElementById('containerFacilitadores')
    
    renderFacilitador($listaFacilitadores, $containerFacilitadores)
};

document.getElementById('btnBuscarAsis').addEventListener('click',()=>{
    cargarFacilitadores(document.getElementById('labAsis').value,document.getElementById('horarioAsis').value)
})