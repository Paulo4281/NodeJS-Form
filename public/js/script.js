$(document).ready(() => {

    $('#formulario').submit((event) => {
        event.preventDefault();
        verificarFormulario();
    })

});

async function verificarFormulario() {

    let form = $('#formulario');
    let formData = form.serialize();

    const config = await $.getJSON('../config.json');

    const response = await $.post(`${config.protocol}${config.origin}:${config.port}/cadastro`, formData);

    if (response[0].status == 1) {
        $('#successModal').modal('show');
    } else {
        $('#errorModal').modal('show');
    }

}