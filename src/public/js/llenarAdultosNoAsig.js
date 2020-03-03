let idadulto = 0;

function cambiarid(id){
    idadulto=id
}
function asignarAdulto(registro){


    const url = `http://localhost:3000/api/asignarAdulto`

        const data = {};
        data.registro = registro
        data.idadulto = parseInt(idadulto) 

        let JSO = JSON.stringify(data)
        fetch(url, {
            method: 'POST', // or 'PUT'
            body: JSO, // data can be `string` or {object}!
            headers:{
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(response => location.reload());
};


async function cargarPersonasNoAsignadas(idlab,idhorario){
    async function getPersonasNoAsignadas(url) {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    }
    const $listaPersonas= await getPersonasNoAsignadas(`http://localhost:3000/api/getAdultosNoAsignados/${idlab}/${idhorario}`);
    // debugger
    function PersonasItemTemplate(persona){
        return `
                <td><img src="http://localhost:3000/photos/${persona.nombres} ${persona.apat} ${persona.amat}-${persona.ci}.jpg"></td>
                <td>${persona.nombres}</td>
                <td>${persona.apat} ${persona.amat}</td>
                <td><a onclick="cambiarid(${persona.idadulto});" class="btn modal-trigger" href="#modal1">button</a></td>
                 `;
    }
    function createTemplate(HTMLString){
        const $html = document.implementation.createHTMLDocument();
        const a = $html.createElement('tr');
        a.innerHTML=HTMLString
        debugger
        // $html.body.innerHTML = HTMLString;
        return a;
    }
    
    function renderPersonas(listpersonas, $container){
        // $container.children[0].remove();
        $container.innerHTML='';
        
        listpersonas.forEach(persona => {
            
          const HTMLString = PersonasItemTemplate(persona);
          const personaElement = createTemplate(HTMLString);
        //   addEventClick(noticiaElement,noticia);
          
          $container.append(personaElement);
        });    
    }
    const $containerNoticias = document.getElementById('containerPersonas')
    
    renderPersonas($listaPersonas, $containerNoticias)
};

async function cargarVoluntariosNoAsignadas(idlab,idhorario){
    async function getVolNoAsignadas(url) {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    }
    const $listaVoluntarios= await getVolNoAsignadas(`http://localhost:3000/api/getVolNoAsignados/${idlab}/${idhorario}`);
    // debugger
    function VoluntarioItemTemplate(persona){
        return `<li class="collection-item avatar">
                    <img src="http://localhost:3000/photos/${persona.nombres} ${persona.apat} ${persona.amat}-${persona.ci}.jpg" alt="" class="circle">
                    <div>${persona.nombres} ${persona.apat} ${persona.amat} <a onclick="asignarAdulto(${persona.registro});" class="btn secondary-content"><i class="material-icons">send</i></a></div>
                    
                </li>`;
    }
    function createTemplate(HTMLString){
        const $html = document.implementation.createHTMLDocument();
        $html.body.innerHTML = HTMLString;
        return $html.body.children[0];
    }
    
    function renderVoluntario(listvoluntario, $container){
        // $container.children[0].remove();
        $container.innerHTML='';
        $container.innerHTML='<li class="collection-header"><h4>Voluntarios para Asignar</h4></li>';
        listvoluntario.forEach(vol => {
            
          const HTMLString = VoluntarioItemTemplate(vol);
          const volElement = createTemplate(HTMLString);
        //   addEventClick(noticiaElement,noticia);
          
          $container.append(volElement);
        });    
    }
    const $containerVol = document.getElementById('containerVol')
    
    renderVoluntario($listaVoluntarios, $containerVol)
};


document.getElementById('btnBuscarAdul').addEventListener('click',()=>{
     cargarPersonasNoAsignadas(document.getElementById('selectLab').value,document.getElementById('selectHorario').value)
     cargarVoluntariosNoAsignadas(document.getElementById('selectLab').value,document.getElementById('selectHorario').value)
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