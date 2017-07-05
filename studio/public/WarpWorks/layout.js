$(document).ready(function() {
    $('#wizardCreateDomainButton').click(wizardCreateDomain);
    $('#wizardClearFormButton').click(wizardClearForm);
});


function wizardCreateDomain(evt) {
    var smn = {};
    smn.value = $("#wizardFormDataT").val();

    // TBD: evt.preventDefault(); => Required here?

    $.ajax({
        url: $active._links['w2:create-domain-from-smn'].href,
        method: 'POST',
        data: JSON.stringify(smn),
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function(result) {
            if (result.success) {
                console.log("New Domain: " + result.newDomain);
                window.location.href = result._links.domain.href;
            } else {
                $("#wizardStatusD").html("<div class='alert alert-danger'><strong>Error: </strong>" + result.error + "</div>");
            }
        },
        error: function() {
            console.log("Error!");
        }
    });
}

function wizardClearForm() {
    $("#wizardFormDataT").val("");
}
