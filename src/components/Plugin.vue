<template>
    <div class='row mb-4 plugin'>
        <div class='col-sm-10 d-flex align-items-center'>
            <img v-if='icon_src != null' :src="icon_src" :alt="plugin.name + ' icon'" class='plugin__icon d-none d-md-block'>
            <div v-else style='width: 70px; margin-right: 1rem;' class='d-none d-md-block'></div>
            <div class='d-flex flex-column'>
                <h5 class='plugin__name'>{{plugin.name}} <small class='plugin__version'>v{{plugin.version}}</small></h5>
                <small class='plugin__author text-muted'>{{plugin.opt.author}}</small>
                <div class='plugin__description'>{{plugin.opt.description}}</div>
            </div>
        </div>
        <div class="col-sm-2 text-center">
            <template>
                <label class="switch" v-if='forThisAppVersion'>
                    <input type="checkbox" v-model='active'>
                    <span class="slider round"></span>
                </label>
                <div v-else class='text-danger'>Обновите программу до версии {{plugin.opt['min-version']}}</div>
            </template>
            
            <template v-if='hasUpdate'>
                <div v-if='newVersion.updateProgram' class='text-danger'>Обновите программу до версии {{newVersion['min-version']}}</div>
                <button class="btn btn-outline-success btn-sm btn-block" @click='update' v-else>Обновить</button>
            </template>
            <button class="btn btn-outline-warning btn-sm btn-block" onclick="location.reload()" v-b-tooltip.hover.auto.bottom title='Перезагрузить программу, чтобы изменения вступили в силу' v-if='showRefresh'><i class="fa fa-refresh mr-0" aria-hidden="true"></i></button>        
        </div>
    </div>
</template>

<script>
const Mixins = require('../Mixin');

module.exports = {
    props: ['plugin'],
    mixins: [Mixins.browser],
    data: function() {
        return {
            hasUpdate: false,
            showRefresh: false,
            newVersion: null,
            forThisAppVersion: true
        }
    },
    computed: {
        active: {
            get: function() {
                return config.get('plugins.' + this.plugin.id + '.active', true);
            },
            set: function(val) {
                this.plugin.active = val;
                config.set('plugins.' + this.plugin.id + '.active', val);

                Plugins._setActive(this.plugin.id, val);
                
                if (val) {
                    ga.event('Plugins', 'Turn on', { evLabel: `${this.plugin.name} v${this.plugin.version} (${this.plugin.id})`, clientID: clientID });
                } else {
                    ga.event('Plugins', 'Turn off', { evLabel: `${this.plugin.name} v${this.plugin.version} (${this.plugin.id})`, clientID: clientID });
                }
            }
        },
        icon_src: function() {
            if (this.plugin.opt.icon != null) {
                return path.join(Plugins.pluginsDir(), this.plugin.id, this.plugin.opt.icon)
            } else {
                return null;
            }
        }
    },
    methods: {
        update: function() {
            repos.downloadPlugin(this.newVersion)
            .then(_ => {
                this.hasUpdate = false;
                this.showRefresh = true;
            })
            .catch(err => {
            });
        }
    },
    mounted: function() {
        let update = Plugins.hasUpdate(this.plugin.id);
        if (update.length > 0) {
            this.hasUpdate = true;
            this.newVersion = update[0];
        }

        this.forThisAppVersion = this.plugin.opt['min-version'] != null ? compareVersions(this.plugin.opt['min-version'], remote.app.getVersion()) < 1 : true;
    }
}
</script>

<style lang="scss">
    .plugin {
        &__author {
            margin-top: -10px;
            display: block;
            margin-bottom: .5rem;
        }
        &__icon {
            float: left;
            max-width: 70px;
            margin-right: 1rem;
            max-height: 70px;
        }
    }
</style>
