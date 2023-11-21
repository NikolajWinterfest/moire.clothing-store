<template>
    <li class="cart__item product">
        <div class="product__pic">
            <img :src="getImage ? getImage : imageFake" width="120" height="120" srcset="img/product-square-4@2x.jpg 2x" :alt="item.product.title">
        </div>
        <h3 class="product__title">
            {{ item.product.title }}
        </h3>
        <p class="product__info product__info--color">
            Цвет:
            <span>
                <i :style="{ 'background-color': item.colorId.color.code, 'border': '1px solid' }"></i>
            </span>
        </p>
        <span class="product__info--size">
            Размер: {{ item.sizeId.title }}
        </span>
        <span class="product__code">
            Артикул: {{ productArticle }}
        </span>
        <div class="product__counter form__counter">
            <button type="button" aria-label="Убрать один товар" @click="decrement">
                <svg width="10" height="10" fill="currentColor">
                    <use xlink:href="#icon-minus"></use>
                </svg>
            </button>

            <input type="text" v-model.number="amount" name="count">

            <button type="button" aria-label="Добавить один товар" @click="increment">
                <svg width="10" height="10" fill="currentColor">
                    <use xlink:href="#icon-plus"></use>
                </svg>
            </button>
        </div>

        <b class="product__price">
            {{ (item.amount * item.product.price) | numberFormat }} ₽
        </b>

        <button class="product__del button-del" type="button" aria-label="Удалить товар из корзины" @click.prevent="removeFromCart(item.id)">
            <svg width="20" height="20" fill="currentColor">
                <use xlink:href="#icon-close"></use>
            </svg>
        </button>
    </li>
</template>

<script>
import numberFormat from '@/helpers/numberFormat'
import { mapActions } from 'vuex'

export default {
    data() {
        return {
            imageFake: require('/public/img/no-image-aviable.png')
        }
    },
    filters: { numberFormat },
    props: ['item'],
    computed: {
        amount: {
            get() {
                return this.item.amount
            },
            set(value) {
                this.$store.dispatch('updateCartProductAmount', { productId: this.item.id, amount: value })
            }
        },
        productArticle() {
            return this.item.product.colors.find(el => el.id).id
        },
        getImage() {
            const gallery = this.item.colorId.gallery
            if (gallery) {
                return gallery.find(el => el.file)?.file.url
            }
        }
    },
    methods: {
        ...mapActions({ deleteProduct: 'deleteCartProduct' }),
        removeFromCart(prodId) {
            this.deleteProduct({ productId: prodId })
        },
        decrement() {
            if (this.amount > 1) {
                this.amount--
            }
        },
        increment() {
            this.amount++
        },
    }
}
</script>