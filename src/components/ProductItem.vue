<template>
    <li class="catalog__item">
        <router-link class="catalog__pic" :to="{ name: 'product', params: { id: product.id } }">
            <img v-if="images[selectImage] && images[selectImage].file" :src="images[selectImage].file.url" :alt="title" />
            <img v-else src="@/assets/no-image-aviable.png" alt="Нет изображения" />
        </router-link>
        <h3 class="catalog__title">
            <a href="#">
                {{ product.title }}
            </a>
        </h3>
        <span class="catalog__price">
            {{ product.price | numberFormat }} ₽
        </span>
        <ul class="colors colors--black">
            <li class="colors__item" v-for="color in product.colors" :key="color.id">
                <label class="colors__label" @click.prevent="changeImage(color.id)">
                    <input class="colors__radio sr-only" type="radio" :name="'color' + id" :value="color.color.code" :checked="color.id === imageId">
                    <span class="colors__value" :style="background(color.color.code)">
                    </span>
                </label>
            </li>
        </ul>
    </li>
</template>

<script>
import gotoPage from '@/helpers/gotoPage'
import numberFormat from '@/helpers/numberFormat'

export default {
    data() {
        return {
            selectImage: 0,
        }
    },
    computed: {
        imageId() {
            return this.colors[this.selectImage].id
        },
    },
    filters: {
        numberFormat
    },
    methods: {
        changeImage(value) {
            const index = this.colors.findIndex((item) => item.id === value)
            this.selectImage = index
        },
        background(colvalue) {
            return {
                'background-color': colvalue,
            };
        },
        gotoPage
    },
    props: ['product', 'images', 'colors', 'title', 'id']
}
</script>