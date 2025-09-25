//alert('ola')

class Despesa {
    constructor(ano, mes, dia, tipo, descricao, valor) {
        this.ano = ano;
        this.mes = mes;
        this.dia = dia;
        this.tipo = tipo;
        this.descricao = descricao;
        this.valor = valor;
    }

    validaDados() {
        for (let i in this) {
            if (this[i] === undefined || this[i] === '' || this[i] === null) {
                return false;
            }
        }
        return true;
    }

    modalRegistraDespesa(text, titulo, descricao, btnText) { //mudar para uma função, ao invés de metodo

        return document.getElementById('modalDespesa').innerHTML = `
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header text-${text}">
                    <h5 class="modal-title" id="exampleModalLabel">${titulo}</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    ${descricao}
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-${text}" data-dismiss="modal">${btnText}</button>
                </div>
            </div>
        </div>`
    }
}

class Bd {
    constructor() {
        let id = localStorage.getItem('id');

        if (id === null) {
            localStorage.setItem('id', 0);
        }
    }

    getProximoId() {
        let proximoId = localStorage.getItem('id');
        return parseInt(proximoId) + 1;
    }

    gravar(d) {
        let id = this.getProximoId() //pega o resultado do metodo anterior, o this referencia o objeto BD
        localStorage.setItem(id, JSON.stringify(d))
        localStorage.setItem('id', id)
    }

    recuperarTodosRegistros() {

        //array de despesas 
        let despesas = Array()

        let id = localStorage.getItem('id')

        for(let i = 1; i <= id; i++) {

            let despesa = JSON.parse(localStorage.getItem(i)); //converte json em objeto literal

            if(despesa === null) {
                continue;
            }

            despesas.push(despesa); //acrescenta array despesa

            //console.log(i, despesa)
        } 

        return despesas;
    }

    pequisar(despesa) {
        let despesasFiltradas = Array();

        despesasFiltradas = this.recuperarTodosRegistros();
        //console.log(despesasFiltradas)
        //console.log(despesa);

        if(despesa.ano != '') {
            console.log('filtro de ano')
            despesasFiltradas = despesasFiltradas.filter(d => d.ano === despesa.ano);
        }

        if(despesa.mes != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.mes === despesa.mes);
        }

        if(despesa.dia != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.dia === despesa.dia);
        }

        if(despesa.tipo != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo === despesa.tipo);
        }

        if(despesa.descricao != '') {
            despesasFiltradas = despesasFiltradas.filter(d => 
                d.descricao.toLowerCase().includes(despesa.descricao.toLowerCase())
            );
        }

        if(despesa.valor != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.valor === despesa.valor);
        }

        return despesasFiltradas;
    }

}

let bd = new Bd();

function cadastrarDespesa() {

    let ano = document.getElementById('ano');
    let mes = document.getElementById('mes');
    let dia = document.getElementById('dia');
    let tipo = document.getElementById('tipo');
    let descricao = document.getElementById('descricao');
    let valor = document.getElementById('valor');

    let despesa = new Despesa(
        ano.value,
        mes.value,
        dia.value,
        tipo.value,
        descricao.value,
        valor.value
    );

    //console.log(despesa);

    if (despesa.validaDados()) {
        bd.gravar(despesa);
        despesa.modalRegistraDespesa('success', 'Registro inserido com sucesso', 'Despesa com foi cadastrada com sucesso!', 'Voltar')
        $('#modalDespesa').modal('show');
        ano.value = ''
        dia.value = ''
        mes.value = ''
        tipo.value = ''
        descricao.value = ''
        valor.value = ''
    } else {
        despesa.modalRegistraDespesa('danger', 'Erro na gravação', 'Existem campos obrigatórios que não foram preenchidos', 'Voltar e corrigir')
        $('#modalDespesa').modal('show');
    }

}

function carregaListasDespesas(despesas = Array(),filtro = false) {
    if(despesas.length == 0 && filtro == false) {
        despesas = bd.recuperarTodosRegistros()
    }

    let listaDespesas = document.getElementById('listaDespesas');
    listaDespesas.innerHTML = '';

    //console.log(despesas);

    despesas.forEach(function(d) {

        //cria linha -> insertRow 
        let linha = listaDespesas.insertRow();

        //cria coluna
        linha.insertCell(0).innerHTML = `${d.ano}/${d.mes}/${d.dia}`

        switch(d.tipo) {
            case '1' : d.tipo = 'Alimentação';
                break;
            case '2' : d.tipo = 'Educação';
                break;
            case '3' : d.tipo = 'Lazer';
                break;
            case '4' : d.tipo = 'Saúde';
                break;
            case '5' : d.tipo = 'Transporte';
        }

        linha.insertCell(1).innerHTML = d.tipo;
        linha.insertCell(2).innerHTML = d.descricao;
        linha.insertCell(3).innerHTML = d.valor;

    })
}

function pesquisarDespesas() {

    let ano = document.getElementById('ano').value;
    let mes = document.getElementById('mes').value;
    let dia = document.getElementById('dia').value;
    let tipo = document.getElementById('tipo').value;
    let descricao = document.getElementById('descricao').value;
    let valor = document.getElementById('valor').value;

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor);
    
    let despesas = bd.pequisar(despesa);

    this.carregaListasDespesas(despesas, true);

    /*
    let listaDespesas = document.getElementById('listaDespesas');
    listaDespesas.innerHTML = '';

    //console.log(despesas);

    despesas.forEach(function(d) {

        //cria linha -> insertRow 
        let linha = listaDespesas.insertRow();

        //cria coluna
        linha.insertCell(0).innerHTML = `${d.ano}/${d.mes}/${d.dia}`

        switch(d.tipo) {
            case '1' : d.tipo = 'Alimentação';
                break;
            case '2' : d.tipo = 'Educação';
                break;
            case '3' : d.tipo = 'Lazer';
                break;
            case '4' : d.tipo = 'Saúde';
                break;
            case '5' : d.tipo = 'Transporte';
        }

        linha.insertCell(1).innerHTML = d.tipo;
        linha.insertCell(2).innerHTML = d.descricao;
        linha.insertCell(3).innerHTML = d.valor;

    })*/
}