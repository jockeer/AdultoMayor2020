function Entrada(registro){
    let $prog=document.getElementById(`content${registro}`)
    let $botoningreso = document.getElementById(`btnIngreso${registro}`)
    let $botonsalida = document.getElementById(`btnSalida${registro}`)
    // RegistraringresoSalida(codasig);
    // alertify.success(`Asistencia Marcada asignacion numero ${codasig}`);
    $prog.classList.add('asis');
    $botoningreso.disabled=true;
    $botonsalida.disabled=false;
}
function Salida(registro){
    let $prog=document.getElementById(`content${registro}`)
    let $botoningreso = document.getElementById(`btnIngreso${registro}`)
    let $botonsalida = document.getElementById(`btnSalida${registro}`)
    // RegistraringresoSalida(codasig);
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
        
        listvoluntarios.forEach(voluntario => {
            
          const HTMLString = voluntarioItemTemplate(voluntario);
          const voluntarioElement = createTemplate(HTMLString);
        //   addEventClick(noticiaElement,noticia);
          
          $container.append(voluntarioElement);
        });    
    }
    const $containerVoluntarios = document.getElementById('containerVoluntarios')
    
    renderVoluntarios($listaVoluntarios, $containerVoluntarios)
};

document.getElementById('btnBuscarAsis').addEventListener('click',()=>{
    cargarVoluntarios(document.getElementById('labAsis').value,document.getElementById('horarioAsis').value)
})