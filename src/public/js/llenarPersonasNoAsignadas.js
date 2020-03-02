function asigarlab(id){
    let $fechainicio = document.getElementById('fechainicio');
    let $fechafin = document.getElementById('fechafin');
    let $horario = document.getElementById(`horarios${id}`)
    let $laboratorio = document.getElementById(`laboratorio${id}`)
    
  

    const url = `http://localhost:3000/api/asignarLab`

        const data = {};
        data.fec_ini=$fechainicio.value
        data.fec_fin=$fechafin.value
        data.idlab=parseInt($laboratorio.value) 
        data.idpersona=id
        data.idhorario=parseInt($horario.value) 

        let JSO = JSON.stringify(data)
        fetch(url, {
            method: 'POST', // or 'PUT'
            body: JSO, // data can be `string` or {object}!
            headers:{
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(response => alert('asignado'));
};


async function cargarPersonasNoAsignadas(rol){
    async function getPersonasNoAsignadas(url) {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    }
    const $listaPersonas= await getPersonasNoAsignadas(`http://localhost:3000/api/getPersonasNoAsignadas/${rol}`);
    // debugger
    function PersonasItemTemplate(persona){
        return `<div class="personas">
                    <div class="fotoPersonas">
                        <figure>
                            <img src="http://localhost:3000/photos/${persona.nombres} ${persona.apat} ${persona.amat}-${persona.ci}.jpg" alt="">
                        </figure>
                    </div>      
                    <div class="NombresPersonas">
                        <h6>${persona.nombres} ${persona.apat} ${persona.amat}</h6>
                    </div>
                    <div class="NombresPersonas">
                    <div class="input-field">           
                        <select id="laboratorio${persona.idpersona}">
                            <option value="" disabled selected>Laboratorio</option>
                            <option value="1">N-221</option>
                            <option value="2">N-401</option>
                            <option value="3">N-402</option>
                            <option value="4">N-503</option>
                        </select>
                    </div>
                    </div>
            

                    <div class="NombresPersonas">
                    <div class="input-field">
                        <select id="horarios${persona.idpersona}">
                            <option value="" disabled selected>Horario</option>
                            <option value="1">09:00 - 11:30</option>
                            <option value="2">14:30 - 17:00</option>
                        </select>
                    </div>
                    </div>
            
                    <div class="NombresPersonas">
                    <div class="input-field">
                        <a onclick="asigarlab(${persona.idpersona});" class="btn">button</a>
                    </div>
                    </div>

                </div>`;
    }
    function createTemplate(HTMLString){
        const $html = document.implementation.createHTMLDocument();
        $html.body.innerHTML = HTMLString;
        return $html.body.children[0];
    }
    
    function renderPersonas(listpersonas, $container){
        // $container.children[0].remove();
        $container.innerHTML='';
        listpersonas.forEach(persona => {
            
          const HTMLString = PersonasItemTemplate(persona);
          debugger
          const personaElement = createTemplate(HTMLString);
        //   addEventClick(noticiaElement,noticia);
          
          $container.append(personaElement);
        });    
    }
    const $containerNoticias = document.getElementById('containerPersonas')
    
    renderPersonas($listaPersonas, $containerNoticias)
};
document.getElementById('btnBuscar').addEventListener('click',()=>{
     cargarPersonasNoAsignadas(document.getElementById('selectRol').value)
})

document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('select');
    var instances = M.FormSelect.init(elems);
});
document.addEventListener('DOMContentLoaded', function() {
var elems = document.querySelectorAll('.datepicker');
var instances = M.Datepicker.init(elems,{
    format:'yyyy-mm-dd'
    
});
});