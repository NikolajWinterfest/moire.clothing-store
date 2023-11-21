<template>
    <main class="content container">
        <div class="content__top">
            <div class="content__row">
                <h1 class="content__title">
                    Каталог
                </h1>
                <span class="content__info">
                    {{ countProducts }} товаров
                </span>
            </div>
        </div>
        <div class="content__catalog">
            <ProductFilter :price-from.sync="filterPriceFrom" :price-to.sync="filterPriceTo" :category-id.sync="filterCategoryId" :material.sync="filterMaterials" :collection.sync="filterCollections" />
            <section class="catalog">
                <div v-if="productsLoading">Загрузка товаров...</div>
                <div v-if="productsLoadingFailed">Произошла ошибка при загрузке товаров
                    <button class="button button--primery" @click.prevent="loadProducts">Попробовать ещё раз</button>
                </div>
                <ProductList :products="products" @gotoPage="(pageName, pageParams) => $emit('gotoPage', pageName, pageParams)" />
                <BasePagination v-model="page" :count="countProducts" :per-page="productsPerPage" />
            </section>
        </div>
    </main>
</template>

<script>
import { API_BASE_URL } from '@/config'
import ProductList from '@/components/ProductList'
import ProductFilter from '@/components/ProductFilter'
import BasePagination from '@/components/BasePagination'
import axios from 'axios'

export default {
    data() {
        return {
            filterPriceFrom: 0,
            filterPriceTo: 0,
            filterCategoryId: 0,
            filterMaterials: [],
            filterCollections: [],

            page: 1,
            productsPerPage: 12,

            productsData: null,
            productsLoading: false,
            productsLoadingFailed: false
        }
    },
    components: { ProductFilter, ProductList, BasePagination },
    computed: {
        products() {
            return this.productsData ? this.productsData.items.map((product) => {
                return {
                    ...product,
                    images: product.colors.flatMap((color) => color.gallery || []).filter((image) => image !== null),
                }
            })
                : []
        },
        countProducts() {
            return this.productsData ? this.productsData.pagination.total : 0
        }
    },
    methods: {
        paginate(page) {
            this.page = page
            this.$emit('paginate', page)
        },
        loadProducts() {
            this.productsLoading = true
            this.productsLoadingFailed = false
            clearTimeout(this.loadProductsTimer)
            this.loadProductsTimer = setTimeout(() => {
                axios
                    .get(API_BASE_URL + `/api/products`, {
                        params: {
                            page: this.page,
                            limit: this.productsPerPage,
                            categoryId: this.filterCategoryId,
                            minPrice: this.filterPriceFrom,
                            maxPrice: this.filterPriceTo,
                            materialIds: this.filterMaterials,
                            seasonIds: this.filterCollections
                        }
                    })
                    .then(response => this.productsData = response.data)
                    .catch(() => this.productsLoadingFailed = true)
                    .then(() => this.productsLoading = false)
            }, 0)
        }
    },
    watch: {
        page() {
            this.loadProducts()
        },
        filterPriceFrom() {
            this.loadProducts()
        },
        filterPriceTo() {
            this.loadProducts()
        },
        filterCategoryId() {
            this.loadProducts()
        },
        filterMaterials() {
            this.loadProducts()
        },
        filterCollections() {
            this.loadProducts()
        },
        '$route'() {
            this.loadProducts()
        }
    },
    created() {
        this.filterCategoryId = this.$route.query.categoryId || 0
        this.loadProducts()
    }
}
</script>