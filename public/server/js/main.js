$(function () {
    $('#select-ep').change(function () {
        let ep = parseInt($(this).val());

        location.search = '?episode=' + ep;
    })

    $('textarea#note').change(function () {
        let note = $('textarea#note').val();
        if (!anime.notes) anime.notes = {};
        anime.notes[watch.ep] = note;

        $.ajax({
            type: "POST",
            data: JSON.stringify({
                anime: anime.id,
                notes: anime.notes
            }),
            contentType: "application/json",
            url: '/api/note'
        })
    })
})

function markAsWatched(animeId, ep) {
    console.log('Mark as watched anime:' + animeId, 'Episode:', ep);

    $.post('/api/watched', {
        animeId: anime.id,
        episode: ep
    })
        .done(function (data) {
            if (data == 'ok') {
                $('#markWatched').addClass('btn-info');
                $('#markWatched').removeClass('btn-outline-info');
            }
        })
}

function updateQueryStringParameter(uri, key, value) {
    var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
    var separator = uri.indexOf('?') !== -1 ? "&" : "?";
    if (uri.match(re)) {
        return uri.replace(re, '$1' + key + "=" + value + '$2');
    } else {
        return uri + separator + key + "=" + value;
    }
}