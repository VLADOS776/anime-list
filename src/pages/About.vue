<template>
    <div class="about">
        <h5>Разработчики</h5>
        <a href="#" @click="browser('https://vk.com/anime.list')">Сообщество VK</a>
    </div>
</template>

<script>
const Mixins = require('../Mixin');

module.exports = {
    mixins: [Mixins.browser],
}
</script>
