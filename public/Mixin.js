module.exports = {
    browser: {
        methods: {
            browser: function(url) {
                require('electron').shell.openExternal(url);
            }
        }
    },
    cleanDescr: {
        methods: {
            cleanDescr: function() {
                let descr = this.anime && this.anime.description ? this.anime.description :
                            this.manga && this.manga.description ? this.manga.description :
                            '';
                if (descr) {
                    return descr.replace(/\[\/?character.*?\]/gi, '')
                            .replace(/\r\n/gi, '<br>')
                            .replace(/\[i\](.*?)\[\/i\]/gi, '<i>$1</i>')
                            .replace(/\[\[|\]\]/g, '')
                } else {
                    return ''
                }
            }
        }
    },
    selectItem: {
        methods: {
            select_anime: function(anime) {
                this.$root.$emit('anime', anime)
            },
            select_manga: function(manga) {
                this.$root.$emit('manga', manga)
            },
        }
    },
    pluginsCategories: {
        computed: {
            allCat: function() {
                let tmp = [];
                Plugins.getAllPlugins().forEach(plug => {
                    if (Array.isArray(plug.opt.category)) {
                        plug.opt.category.forEach(category => {
                            if (!tmp.includes(category)) {
                                tmp.push(category)
                            }
                        })
                    }
                });
                return tmp;
            }
        }
    }
}