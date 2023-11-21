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
                    <router-link class="breadcrumbs__link" href="cart.html" :to="{ name: 'cart' }">
                        Корзина
                    </router-link>
                </li>
                <li class="breadcrumbs__item">
                    <a class="breadcrumbs__link">
                        Оформление заказа
                    </a>
                </li>
            </ul>

            <h1 class="content__title">
                Заказ оформлен <span>№ 23621</span>
            </h1>
        </div>

        <section class="cart" v-if="orderDetails">
            <form class="cart__form form" action="#" method="POST">
                <div class="cart__field">
                    <p class="cart__message">
                        Благодарим за&nbsp;выбор нашего магазина. На&nbsp;Вашу почту придет письмо с&nbsp;деталями заказа.
                        Наши менеджеры свяжутся с&nbsp;Вами в&nbsp;течение часа для уточнения деталей доставки.
                    </p>

                    <ul class="dictionary">
                        <li class="dictionary__item">
                            <span class="dictionary__key">
                                Получатель
                            </span>
                            <span class="dictionary__value">
                                {{ orderDetails.name }}
                            </span>
                        </li>
                        <li class="dictionary__item" v-if='orderDetails.address'>
                            <span class="dictionary__key">
                                Адрес доставки
                            </span>
                            <span class="dictionary__value">
                                {{ orderDetails.address }}
                            </span>
                        </li>
                        <li class="dictionary__item">
                            <span class="dictionary__key">
                                Телефон
                            </span>
                            <span class="dictionary__value">
                                {{ orderDetails.phone }}
                            </span>
                        </li>
                        <li class="dictionary__item">
                            <span class="dictionary__key">
                                Email
                            </span>
                            <span class="dictionary__value">
                                {{ orderDetails.email }}
                            </span>
                        </li>
                        <li class="dictionary__item" v-if='orderDetails.comment'>
                            <span class="dictionary__key">
                                Комментарий
                            </span>
                            <span class="dictionary__value">
                                {{ orderDetails.comment }}
                            </span>
                        </li>
                        <li class="dictionary__item">
                            <span class="dictionary__key">
                                Способ оплаты
                            </span>
                            <span class="dictionary__value">
                                {{ orderDetails.paymentType }}
                            </span>
                        </li>
                    </ul>
                </div>

                <div class="cart__block">
                    <ul class="cart__orders">
                        <li class="cart__order" v-for="(product, index) in orderDetails.basket.items" :key="index">
                            <h3>{{ product.product.title }} {{ product.quantity }} шт.</h3>
                            <b>{{ product.price * product.quantity }} ₽</b>
                            <span>Артикул: {{ product.color.id }}</span>
                        </li>

                    </ul>

                    <div class="cart__total">
                        <p>Доставка: <b>{{ deliveryPrice() }}</b></p>
                        <p>Итого: <b>{{ getTotalItemsCount() }}</b> товара на сумму <b>{{ orderDetails.totalPrice }} ₽</b></p>
                    </div>
                </div>
            </form>
        </section>
    </main>
</template>

<script>

export default {
    computed: {
        orderDetails() {
            return this.$store.state.orderInfo
        },
    },
    methods: {
        getTotalItemsCount() {
            if (this.orderDetails.basket.items.length > 0) {
                return this.orderDetails.basket.items.reduce((total, product) => total + product.quantity, 0)
            }
            return 0
        },
        deliveryPrice() {
            if (this.orderDetails.deliveryType.price > 0) {
                return this.orderDetails.deliveryType.price + ' ₽'
            } else {
                return 'бесплатно'
            }
        }
    },
    created() {
        if (this.$store.state.orderInfo && this.$store.state.orderInfo.id === this.$route.params.id) {
            return
        }

        this.$store.dispatch('loadOrderInfo', this.$route.params.id)
    }
}
</script>