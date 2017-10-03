function markAsWatched(animeId, ep) {
    console.log('Mark as watched anime:' + animeId, 'Episode:', ep);

    $.post('/api/watched', {
            anime: animeId,
            episode: ep
        })
        .done(function (data) {
            if (data == 'ok') {
                $('#markWatched').addClass('btn-info');
                $('#markWatched').removeClass('btn-outline-info');
            }
        })
}

$('#select-ep').change(function () {
    let ep = parseInt($(this).val());

    location.href = updateQueryStringParameter(location.href, 'episode', ep);
})

function updateQueryStringParameter(uri, key, value) {
    var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
    var separator = uri.indexOf('?') !== -1 ? "&" : "?";
    if (uri.match(re)) {
        return uri.replace(re, '$1' + key + "=" + value + '$2');
    } else {
        return uri + separator + key + "=" + value;
    }
}
