async function cargarVoluntarios(idlab,idhorario){
    async function getVoluntarios(url) {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    }
    const $listaVoluntarios= await getVoluntarios(`http://localhost:3000/api/getVoluntarios/${idlab}/${idhorario}`);
    // debugger
    function voluntarioItemTemplate(persona){
        return `<div class="card ">
                    <div class="card-content">
                    <div class="techoRojo"></div>
                        <img class="fotoVoluntario" src="http://localhost:3000/photos/${persona.nombres} ${persona.apat} ${persona.amat}-${persona.ci}.jpg" alt="">
                    <span class="card-title">${persona.nombres}</span>
                    <span class="card-title">${persona.apat} ${persona.amat}</span>
                    <p></p>
                    <img class="fotoAdulto" src="http://localhost:3000/photos/${persona.foto}.jpg" alt="">
                    <p></p>
                    </div>
                    <div class="card-action">
                    <a class="waves-effect waves-light btn">Entrada</a>
                    <a class="waves-effect waves-light btn">Salida</a>
                    <a class="waves-effect waves-light btn modal-trigger" href="#modal1">Detalles</a>
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