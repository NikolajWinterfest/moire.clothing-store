<template>
    <main class="content container">
        <div class="content__top">
            <ul class="breadcrumbs">
                <li class="breadcrumbs__item">
                    <router-link class="breadcrumbs__link" href="index.html" :to="{ name: 'main' }">
                        Каталог
                    </router-link>
                </li>
                <li class="breadcrumbs__item">
                    <a class="breadcrumbs__link">
                        Корзина
                    </a>
                </li>
            </ul>

            <div class="content__row">
                <h1 class="content__title">
                    Корзина
                </h1>
                <span class="content__info">
                    {{ cartTotalItems }} товаров
                </span>
            </div>
        </div>
        <div v-if="loadingProducts">Загружаем товар...</div>
        <section class="cart">
            <form class="cart__form form" action="#" method="POST">
                <div class="cart__field">
                    <ul class="cart__list">
                        <CartItem v-for="item in products" :key="item.productId" :item="item" />
                    </ul>
                </div>

                <div class="cart__block">
                    <p class="cart__desc">
                        Мы&nbsp;посчитаем стоимость доставки на&nbsp;следующем этапе
                    </p>
                    <p class="cart__price">
                        Итого: <span>{{ totalPrice | numberFormat }} ₽</span>
                    </p>

                    <router-link v-if="cartTotalItems" tag="button" :to="{ name: 'order' }" class="cart__button button button--primery" type="submit">
                        Оформить заказ
                    </router-link>
                </div>
            </form>
        </section>
    </main>
</template>

<script>
import numberFormat from '@/helpers/numberFormat'
import { mapGetters } from 'vuex'
import CartItem from '@/components/CartItem'
import router from '@/router';

export default {
    filters: { numberFormat },
    components: { CartItem, router },
    computed: {
        ...mapGetters({ products: 'cartDetailProducts', totalPrice: 'cartTotalPrice', cartTotalItems: 'cartTotalItems' }),
        loadingProducts() {
            return this.$store.state.productsLoading;
        }
    }
}
</script>