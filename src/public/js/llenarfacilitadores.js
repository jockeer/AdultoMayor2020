async function cargarFacilitadores(idlab,idhorario){
    async function getFacilitadores(url) {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    }
    const $listaFacilitadores= await getFacilitadores(`http://localhost:3000/api/getFacilitadores/${idlab}/${idhorario}`);
    // debugger
    function FacilitadorItemTemplate(persona){
        return `<div class="card">
                    <div class="card-content">
                    <h6>${persona.rol}</h6>
                    <figure>
                        <img class="fotoFacilitador" src="http://localhost:3000/photos/${persona.nombres} ${persona.apat} ${persona.amat}-${persona.ci}.jpg" alt="">
                    </figure>
                    <span class="card-title">${persona.nombres} ${persona.apat} ${persona.amat}</span>
                    
                    </div>
                    <div class="card-action">
                    <a class="btn">Entrada</a>
                    <a class="btn">Salida</a>
                    <a class="btn modal-trigger" href="#modal1">Detalles</a>
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
        
        listpersonas.forEach(facilitador => {
            
          const HTMLString = FacilitadorItemTemplate(facilitador);
          const facilitadorElement = createTemplate(HTMLString);
        //   addEventClick(noticiaElement,noticia);
          
          $container.append(facilitadorElement);
        });    
    }
    const $containerFacilitadores = document.getElementById('containerFacilitadores')
    
    renderFacilitador($listaFacilitadores, $containerFacilitadores)
};

document.getElementById('btnBuscarAsis').addEventListener('click',()=>{
    cargarFacilitadores(document.getElementById('labAsis').value,document.getElementById('horarioAsis').value)
})