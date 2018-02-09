<template>
    <div class="start">
        <h4>{{selectedHorizontal ? selectedHorizontal.name : ''}} 
            <span class='dropdown-toggle' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'></span>
            <div class='dropdown-menu'>
                <a v-for='item in dropdownHorizontal' href="#" class="dropdown-item" @click='selectedHorizontal = item'>{{item.name}}</a>
            </div>
        </h4>
        <div class="watching d-flex mb-3 pb-2" v-if='horisontalList && horisontalList.length'>
            <div class="card" v-for='anime in horisontalList' key='anime.russian' @click="select_anime(anime)">
                <img :src="anime.cover || 'https://shikimori.org/' +anime.image.original" :alt="anime.name" class='card-img' @error='card_error'>
                <div class="card-body card-img-overlay">
                    <h4 class="card-title">{{anime.russian}}</h4>
                    <h6 class="card-subtitle mb-2 text-muted">{{anime.name}}</h6>
                    <p class="card-text">{{anime.watched}} / {{anime.episodes_aired || anime.episodes}}</p>
                </div>
            </div>
        </div>
        <div class='mb-3 pb-2' v-else>
                <p>Здесь пока ничего нет...</p>
        </div>
        <h4>Избранное аниме</h4>
        <template v-if="all_anime && all_anime.length">
            <div class="cards-wrap">
                <b-card-group columns>
                    <div class="card" v-for='anime in all_anime' key='anime.russian' @click="select_anime(anime)">
                        <img :src="anime.cover || 'https://shikimori.org/' +anime.image.original" :alt="anime.name" class='card-img' @error='card_error'>
                        <div class="card-body card-img-overlay">
                            <h4 class="card-title">{{anime.russian}}</h4>
                            <h6 class="card-subtitle mb-2 text-muted">{{anime.name}}</h6>
                        </div>
                    </div>
                </b-card-group>
            </div>
        </template>
        <template v-else>
            <p>Здесь пока ничего нет. Используйте поиск, чтобы добавить аниме в избранное.</p>
        </template>
        <h4>Избранная манга</h4>
        <template v-if="all_manga && all_manga.length">
            <div class="cards-wrap">
                <b-card-group columns>
                    <div class="card" v-for='manga in all_manga' key='manga.russian' @click="select_manga(manga)">
                        <img :src="'https://shikimori.org/' +manga.image.original" :alt="manga.name" class='card-img' @error='card_error'>
                        <div class="card-body card-img-overlay">
                            <h4 class="card-title">{{manga.russian}}</h4>
                            <h6 class="card-subtitle mb-2 text-muted">{{manga.name}}</h6>
                        </div>
                    </div>
                </b-card-group>
            </div>
        </template>
        <template v-else>
            <p>Здесь пока ничего нет. Используйте поиск, чтобы добавить мангу в избранное.</p>
        </template>
    </div>
</template>

<script>
    const Mixins = require('../Mixin');

    module.exports = {
        props: ['all_anime', 'all_manga'],
        mixins: [ Mixins.selectItem ],
        data: function() {
            return {
                selectedHorizontal: null,
                droppedTime: 1000 * 60 * 60 * 24 * 18, // 2.5 weeks
                dropdownHorizontal: [
                    { 
                        name: 'Смотрю',
                        filter: (anime) => {
                            if (anime.watched > 0 && anime.watched < (anime.episodes_aired || anime.episodes)) {
                                if (anime.lastWatched && Date.now() - anime.lastWatched > this.droppedTime) {
                                    return false
                                }
                                return true;
                            }
                            return false;
                        },
                        sort: (a, b) => {
                            return a.lastWatched && b.lastWatched ? b.lastWatched - a.lastWatched : 
                                a.lastWatched ? -1 :
                                b.lastWatched ? 1 :
                                0
                        },
                        //limit: 10
                    },
                    { 
                        name: 'Хочу посмотреть',
                        filter: function(anime) {
                            return !anime.watched
                        },
                        sort: function(a, b) {
                            return a.lastWatched && b.lastWatched ? b.lastWatched - a.lastWatched :
                                a.lastWatched ? -1 :
                                b.lastWatched ? 1 :
                                0
                        },
                        //limit: 10
                    },
                    { 
                        name: 'Брошено',
                        filter: (anime) => {
                            if (anime.watched < (anime.episodes_aired || anime.episodes)) {
                                if (anime.lastWatched && Date.now() - anime.lastWatched > this.droppedTime) {
                                    return true;
                                }
                            }
                            return false;
                        },
                        sort: function(a, b) {
                            return a.lastWatched && b.lastWatched ? b.lastWatched - a.lastWatched :
                                a.lastWatched ? -1 :
                                b.lastWatched ? 1 :
                                0
                        },
                        //limit: 10
                    }
                ],
                selectedMain: null,
                dropdownMain: [
                    {
                        name: 'Избранное аниме',
                        list: this.all_anime,
                        click: 'show_anime'
                    },
                    {
                        name: 'Избранная манга',
                        list: this.all_manga,
                        click: 'show_manga'
                    }
                ]
            }
        },
        computed: {
            horisontalList: function() {
                if (this.selectedHorizontal) {
                    let list = this.all_anime.filter(this.selectedHorizontal.filter);
                    
                    if (this.selectedHorizontal.sort) {
                        list.sort(this.selectedHorizontal.sort);
                    }
                    if (this.selectedHorizontal.limit) {
                        list = list.slice(0, this.selectedHorizontal.limit);
                    }
                    return list;
                } else {
                    return [];
                }
            }
        },
        mounted: function() {
            this.selectedHorizontal = this.dropdownHorizontal[0];
            this.selectedMain = this.dropdownMain[0];
        },
        methods: {
            card_error: function(err) {
                err.target.src = 'img/img-error.jpg';
            }
        }
    }
</script>
