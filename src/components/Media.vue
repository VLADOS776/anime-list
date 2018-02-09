<template>
    <div class="media-item-wrap">
        <div class="modal-mask" @click="active=false" v-if="active">
            <div class="modal-wrapper">
                <img :src="fullLink" alt='' v-if="isImage">
                <div class="youtube embed-responsive embed-responsive-16by9" v-else>
                    <iframe class="embed-responsive-item" :src="fullLink" allowfullscreen></iframe>
                </div>
            </div>
        </div>
        <div class="media-content" v-if="isImage" @click="active=true">
            <i class="fa fa-search-plus" aria-hidden="true"></i>
            <img :src="previewLink" alt="">
        </div>
        <div class="media-content" v-else @click="active=true">
            <i class="fa fa-youtube-play" aria-hidden="true"></i>
            <img :src="previewLink" alt="">
        </div>
    </div>
</template>

<script>
module.exports = {
    props: ['preview', 'full'],
    data: function() {
        return {
            active: false
        }
    },
    methods: {
        open: function() {
            this.active = true;
        },
        hide: function() {
            this.active = false;
        }
    },
    computed: {
        isImage: function() {
            return /\.(jpg|png|gif)/gi.test(this.full);
        },
        previewLink: function() {
            return this.preview.startsWith('/') ? 'https://shikimori.org/'+ this.preview : this.preview;
        },
        fullLink: function() {
            return this.full.startsWith('/') ? 'https://shikimori.org/'+ this.full : this.full;
        }
    },
    watch: {
        active: function(val) {
            if (val) {
                document.body.classList.add('overflow');
            } else {
                document.body.classList.remove('overflow');
            }
        }
    }
}
</script>

<style lang="scss">
    body.overflow {
        overflow: hidden;
    }
    .screensVideo {
        .media-item-wrap {
            display: inline-block;
            .media-content {
                position: relative;
                cursor: pointer;
                opacity: 0.8;
                transition: 0.2s;
                &:hover {
                    opacity: 1;
                }
                & > i {
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    font-size: 1.8rem;
                    transform: translate(-50%, -50%);
                    color: #fff;
                    text-shadow: 0 0 7px rgba(0, 0, 0, 0.5);
                }
            }
        }
        img {
            max-width: 250px;
            max-height: 140px;
            margin-top: .5rem;
            margin-left: .5rem;
        }
        
        .modal-mask {
            z-index: 40;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            .modal-wrapper {
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100%;
                iframe, img {
                    margin: auto;
                }
                .youtube {
                    width: 70%;
                }
                img {
                    max-width: 800px;
                    max-height: 100%;
                }
            }
        }
    }
</style>
