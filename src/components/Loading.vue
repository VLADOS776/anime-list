<template>
    <transition name="fade">
        <div class="loading-wrap">
            <div class='load-spinner'></div>
        </div>
    </transition>
</template>

<style scoped>
    .loading-wrap {
        position: fixed;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.68);
        z-index: 100;
        display: flex;
        top: 0;
    }
    .fade-enter-active, .fade-leave-active {
        transition: opacity .2s;
    }
    .fade-enter, .fade-leave-to {
        opacity: 0;
    }
</style>
