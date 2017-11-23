$(function () {
    $('#select-ep').change(function () {
        let ep = parseInt($(this).val());

        let newSearch = updateQueryStringParameter(location.search, 'episode', ep);
        newSearch = updateQueryStringParameter(newSearch, 'videoId', null);
        location.search = newSearch;
        //location.search = '?episode=' + ep;
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

$('.card-img').on('error', function() {
    $(this).attr('src', 'img/img-error.jpg')
})

function markAsWatched(query, ep) {
    console.log('Mark as watched anime:' + query, 'Episode:', ep);

    $.post('/api/watched', {
        query: query,
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
        if (value == null) {
            return uri.replace(re, '$2');
        } else {
            return uri.replace(re, '$1' + key + "=" + value + '$2');
        }
    } else {
        if (value == null) return uri
        return uri + separator + key + "=" + value;
    }
}