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

            <div class="content__row">
                <h1 class="content__title">
                    Оформление заказа
                </h1>
            </div>
        </div>

        <section class="cart">
            <form class="cart__form form" action="#" method="POST" @submit.prevent="order">
                <div class="cart__field">
                    <div class="cart__data">
                        <BaseFormText v-model="formData.name" :error="formError.name" title="ФИО" placeholder="Введите ваше полное имя" />
                        <BaseFormText v-model="formData.address" :error="formError.address" title="Адрес доставки" placeholder="Введите ваш адрес" />
                        <BaseFormText v-model="formData.phone" :error="formError.phone" title="Телефон" placeholder="Введите ваш телефон" />
                        <BaseFormText v-model="formData.email" :error="formError.email" title="Email" placeholder="Введи ваш Email" />
                        <BaseFormTextarea v-model="formData.comment" :error="formError.comment" title="Комментарий к заказу" placeholder="Ваши пожелания" />
                    </div>

                    <div class="cart__options">
                        <h3 class="cart__title">Доставка</h3>
                        <BaseFormRadio v-model="formData.deliveryTypeId" :options="deliveryOptions" name="delivery" @change="updatePaymentOptions" :error="formError.deliveryTypeId" />
                        <h3 class="cart__title">Оплата</h3>
                        <BaseFormRadio v-model="formData.paymentTypeId" :options="paymentOptions" name="pay" :error="formError.paymentTypeId" />
                    </div>
                </div>

                <div class="cart__block">
                    <ul class="cart__orders">
                        <li class="cart__order" v-for="(product, index) in cartProducts" :key="index">
                            <h3>{{ getProductTitle(product.productId) }} {{ product.amount }} шт.</h3>
                            <b>{{ getProductPrice(product.productId) }} ₽</b>
                            <span>Артикул: {{ product.colorId.id }}</span>
                        </li>
                    </ul>

                    <div class="cart__total">
                        <p>Доставка: <b>{{ deliveryPrice() }}</b></p>
                        <p>Итого: <b>{{ getTotalItemsCount() }}</b> товара на сумму <b>{{ getTotalPrice() }} ₽</b></p>
                    </div>

                    <button class="cart__button button button--primery" type="submit">
                        Оформить заказ
                    </button>
                </div>
                <div class="cart__error form__error-block" v-if="formErrorMessage">
                    <h4>Заявка не отправлена!</h4>
                    <p>
                        {{ formErrorMessage }}
                    </p>
                </div>
            </form>
        </section>
    </main>
</template>

<script>
import BaseFormRadio from '@/components/BaseFormRadio'
import BaseFormText from '@/components/BaseFormText'
import BaseFormTextarea from '@/components/BaseFormTextarea'
import { API_BASE_URL } from '@/config'
import axios from 'axios'

export default {
    data() {
        return {
            formData: {},
            formError: {},
            formErrorMessage: '',
            deliveryOptions: [
                { label: 'Самовывоз', value: 1 },
                { label: 'Курьером', value: 2 }
            ],
            paymentOptions: []
        }
    },
    computed: {
        cartProducts() {
            return this.$store.state.cartProducts
        },
        cartProductsData() {
            return this.$store.state.cartProductsData
        }
    },
    components: { BaseFormText, BaseFormTextarea, BaseFormRadio },
    watch: {
        'formData.deliveryTypeId': 'updatePaymentOptions',
    },
    methods: {
        getProductTitle(productId) {
            const product = this.cartProductsData.find(item => item.product.id === productId)
            return product ? product.product.title : ''
        },
        getProductPrice(productId) {
            const product = this.cartProductsData.find(item => item.product.id === productId)
            return product ? product.product.price : 0
        },
        getTotalItemsCount() {
            return this.cartProducts.reduce((total, item) => total + item.amount, 0)
        },
        getTotalPrice() {
            return this.cartProducts.reduce((total, item) => {
                const product = this.cartProductsData.find(p => p.product.id === item.productId).product
                if (this.formData.deliveryTypeId === 2) {
                    return 1200 + total + product.price * item.amount
                }
                return total + product.price * item.amount
            }, 0)
        },
        deliveryPrice() {
            if (this.formData.deliveryTypeId === 2) {
                return 1200 + ' ₽'
            } else {
                return 'бесплатно'
            }
        },
        async updatePaymentOptions() {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/payments`, {
                    params: {
                        deliveryTypeId: this.formData.deliveryTypeId,
                        userAccessKey: this.$store.state.userAccessKey
                    }
                })
                this.paymentOptions = response.data.map(option => ({
                    label: option.title,
                    value: option.id
                }))
            } catch (error) {
                console.error('Ошибка при получении способов оплаты:', error)
                this.paymentOptions = []
            }
        },

        order() {
            this.formError = {}
            this.formErrorMessage = ''

            const formDataToSend = {
                ...this.formData,
                deliveryTypeId: this.formData.deliveryTypeId,
                paymentTypeId: this.formData.paymentTypeId
            }

            axios
                .post(API_BASE_URL + '/api/orders', formDataToSend, {
                    params: {
                        userAccessKey: this.$store.state.userAccessKey
                    }
                })
                .then((response) => {
                    this.$store.commit('resetCart')
                    this.$store.commit('updateOrderInfo', response.data)
                    this.$router.push({ name: 'orderInfo', params: { id: response.data.id } })
                })
                .catch(error => {
                    this.formError = error.response.data.error.request || {}
                    this.formErrorMessage = error.response.data.error.message
                })
        }
    }
}
</script>