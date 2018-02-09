<template>
    <div class="plugin row mb-3">
        <div class="col-sm-10 d-flex align-items-center">
            <img v-if='icon_src != null' :src="icon_src" :alt="plugin.name + ' icon'" class='plugin__icon'>
            <div class='d-flex flex-column'>
                <h5 class='plugin__name'>{{plugin.name}} <small class='plugin__version'>v{{plugin.version}}</small></h5>
                <small class='plugin__author text-muted'>{{plugin.author}}</small>
                <div class='plugin__description'>{{plugin.description}}</div>
            </div>
        </div>
        <div class="col-sm-2 text-center">
            <template v-if='!installed && !installing'>
                <div class='text-danger' v-if='plugin.updateProgram'>Обновите программу до версии {{plugin['min-version']}}</div>
                <button class="btn btn-outline-success" @click="download" v-else>Установить</button>
            </template>
            <div class="load-spinner" v-if='installing'></div>
            <div v-if='installed'>Уже установлено</div>
            <button class="btn btn-sm" onclick='location.reload()' v-if='showRefresh'>Перезагрузить</button>
        </div>
    </div>
</template>

<script>
module.exports = {
    props: ['plugin'],
    data: function() {
        return {
            installing: false,
            installed: Plugins.hasPlugin({ id: this.plugin.id }),
            showRefresh: false,
            error: null
        }
    },
    computed: {
        icon_src: function() {
            if (this.plugin.icon != null) {
                return this.plugin.pluginDir + '/' + this.plugin.icon;
            } else {
                return null;
            }
        }
    },
    methods: {
        download: function() {
            this.installign = true;
            repos.downloadPlugin(this.plugin).then(_ => {
                this.installing = false;
                this.installed = true;
                this.showRefresh = true;

                ga.event('Plugins', 'Install', { evLabel: `${this.plugin.name} v${this.plugin.version} (${this.plugin.id})`, clientID: clientID });
            })
            .catch(err => {
                this.installing = false;
                this.installed = false;
                this.error = err;
            })
        }
    }
}
</script>
