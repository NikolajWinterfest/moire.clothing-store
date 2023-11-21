import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import { API_BASE_URL } from '@/config'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        cartProducts: [],
        userAccessKey: null,
        cartProductsData: [],
        orderInfo: null,
        productsLoading: false,
        orderDetails: null,
    },
    mutations: {
        updateOrderInfo(state, orderInfo) {
            state.orderInfo = orderInfo
        },
        resetCart(state) {
            state.cartProducts = []
            state.cartProductsData = []
        },
        updateCartProductAmount(state, { productId, amount }) {
            const item = state.cartProducts.find((item) => item.id === productId)

            if (item) {
                item.amount = amount
            }
        },
        deleteCartProduct(state, productId) {
            state.cartProducts = state.cartProducts.filter((item) => item.productId !== productId)
        },
        updateUserAccessKey(state, accessKey) {
            state.userAccessKey = accessKey
        },
        updateCartProductsData(state, items) {
            state.cartProductsData = items
        },
        syncCartProducts(state) {
            state.cartProducts = state.cartProductsData.map((item) => {
                return {
                    id: item.id,
                    productId: item.product.id,
                    amount: item.quantity,
                    colorId: item.color,
                    sizeId: item.size,
                }
            })
        },
        setOrderDetails(state, orderDetails) {
            state.orderDetails = orderDetails
        },
    },
    getters: {
        cartDetailProducts(state) {
            if (!state.cartProductsData.length) return []
            return state.cartProducts.map((item) => {
                const product = state.cartProductsData.find((p) => p.product.id === item.productId).product
                return {
                    ...item,
                    product: {
                        ...product,
                        image: product.colors.find((el) => el.gallery).gallery.find((el) => el.file).file.url,
                    },
                }
            })
        },
        cartTotalPrice(state, getters) {
            return getters.cartDetailProducts.reduce((acc, item) => item.product.price * item.amount + acc, 0)
        },
        cartTotalItems(state) {
            return state.cartProducts.reduce((total, item) => total + item.amount, 0)
        },
    },
    actions: {
        loadOrderInfo(context, orderId) {
            this.productsLoading = true
            return axios
                .get(API_BASE_URL + '/api/orders/' + orderId, {
                    params: {
                        userAccessKey: context.state.userAccessKey,
                    },
                })
                .then((response) => {
                    context.commit('updateOrderInfo', response.data)
                })
                .then(() => (this.productsLoading = false))
        },
        loadCart(context) {
            return axios
                .get(API_BASE_URL + '/api/baskets', {
                    params: {
                        userAccessKey: context.state.userAccessKey,
                    },
                })
                .then((response) => {
                    if (!context.state.userAccessKey) {
                        localStorage.setItem('userAccessKey', response.data.user.accessKey)
                        context.commit('updateUserAccessKey', response.data.user.accessKey)
                    }
                    context.commit('updateCartProductsData', response.data.items)
                    context.commit('syncCartProducts')
                })
        },
        addProductToCart(context, { productId, amount, colorId, sizeId }) {
            return new Promise((resolve) => setTimeout(resolve, 500)).then(() => {
                return axios
                    .post(
                        API_BASE_URL + '/api/baskets/products',
                        {
                            productId: productId,
                            quantity: amount,
                            colorId: colorId,
                            sizeId: sizeId,
                        },
                        {
                            params: {
                                userAccessKey: context.state.userAccessKey,
                            },
                        }
                    )
                    .then((response) => {
                        context.commit('updateCartProductsData', response.data.items)
                        context.commit('syncCartProducts')
                    })
            })
        },
        deleteCartProduct(context, { productId }) {
            return axios
                .delete(API_BASE_URL + '/api/baskets/products', {
                    params: {
                        userAccessKey: context.state.userAccessKey,
                    },
                    data: {
                        basketItemId: productId,
                    },
                })
                .then((response) => {
                    context.commit('updateCartProductsData', response.data.items)
                    context.commit('syncCartProducts')
                })
        },
        updateCartProductAmount(context, { productId, amount }) {
            if (amount < 1) {
                return
            }
            context.commit('updateCartProductAmount', { productId, amount })
            return axios
                .put(
                    API_BASE_URL + '/api/baskets/products',
                    {
                        basketItemId: productId,
                        quantity: amount,
                    },
                    {
                        params: {
                            userAccessKey: context.state.userAccessKey,
                        },
                    }
                )
                .then((response) => {
                    context.commit('updateCartProductsData', response.data.items)
                })
                .catch(() => {
                    context.commit('syncCartProducts')
                })
        },
    },
})
