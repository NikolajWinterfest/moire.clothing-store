<template>
    <aside class="filter">
        <form class="filter__form form" action="#" method="get" @submit.prevent="submit">
            <fieldset class="form__block">
                <legend class="form__legend">Цена</legend>
                <label class="form__label form__label--price">
                    <input class="form__input" type="text" name="min-price" v-model.number="currentPriceFrom">
                    <span class="form__value">От</span>
                </label>
                <label class="form__label form__label--price">
                    <input class="form__input" type="text" name="max-price" v-model.number="currentPriceTo">
                    <span class="form__value">До</span>
                </label>
            </fieldset>

            <fieldset class="form__block">
                <legend class="form__legend">Категория</legend>
                <label class="form__label form__label--select">
                    <select class="form__select" type="text" name="category" v-model="currentCategoryId">
                        <option value="0">Все категории</option>
                        <option :value="category.id" v-for="category in categories" :key="category.id">{{ category.title }}
                        </option>
                    </select>
                </label>
            </fieldset>

            <fieldset class="form__block">
                <legend class="form__legend">Материал</legend>
                <ul class="check-list">
                    <li class="check-list__item" v-for="material in materials" :key="material.id">
                        <label class="check-list__label" :for="`material - ${material.id}`">
                            <input class="check-list__check sr-only" type="checkbox" :id="`material - ${material.id}`" :value="material.id" v-model="currentMaterial">
                            <span class="check-list__desc">
                                {{ material.title }}
                                <span>({{ material.productsCount }})</span>
                            </span>
                        </label>
                    </li>
                </ul>
            </fieldset>

            <fieldset class="form__block">
                <legend class="form__legend">Коллекция</legend>
                <ul class="check-list">
                    <li class="check-list__item" v-for="collection in collections" :key="collection.id">
                        <label class="check-list__label" :for="`collection - ${collection.id}`">
                            <input class="check-list__check sr-only" type="checkbox" :id="`collection - ${collection.id}`" :value="collection.id" v-model="currentCollection">
                            <span class="check-list__desc">
                                {{ collection.title }}
                                <span>({{ collection.productsCount }})</span>
                            </span>
                        </label>
                    </li>
                </ul>
            </fieldset>

            <button class="filter__submit button button--primery" type="submit">
                Применить
            </button>
            <button class="filter__reset button button--second" type="button" :class="{ 'filter__reset--hidden': !buttonOfReset }" @click.prevent="reset">
                Сбросить
            </button>
        </form>
    </aside>
</template>

<script>
import { API_BASE_URL } from '@/config'
import axios from 'axios'

export default {
    data() {
        return {
            currentPriceFrom: 0,
            currentPriceTo: 0,
            currentCategoryId: 0,
            currentMaterial: [],
            currentCollection: [],

            categoriesData: [],
            materialsData: [],
            collectionsData: []
        }
    },
    props: ['priceFrom', 'priceTo', 'categoryId', 'material', 'collection'],
    computed: {
        categories() {
            return this.categoriesData ? this.categoriesData.items : []
        },
        materials() {
            return this.materialsData ? this.materialsData.items : []
        },
        collections() {
            return this.collectionsData ? this.collectionsData.items : []
        },
        buttonOfReset() {
            return (
                this.currentPriceFrom !== 0 ||
                this.currentPriceTo !== 0 ||
                this.currentCategoryId !== 0 ||
                this.currentMaterial.length > 0 ||
                this.currentCollection.length > 0
            )
        }
    },
    watch: {
        priceFrom(value) {
            this.currentPriceFrom = value
        },
        priceTo(value) {
            this.currentPriceTo = value
        },
        categoryId(value) {
            this.currentCategoryId = value
        },
        material(value) {
            this.currentMaterial = value
        },
        collection(value) {
            this.currentCollection = value
        }

    },
    methods: {
        submit() {
            this.$emit('update:priceTo', this.currentPriceTo)
            this.$emit('update:priceFrom', this.currentPriceFrom)
            this.$emit('update:categoryId', this.currentCategoryId)
            this.$emit('update:material', this.currentMaterial)
            this.$emit('update:collection', this.currentCollection)
        },
        reset() {
            this.currentPriceTo = 0
            this.currentPriceFrom = 0
            this.currentCategoryId = 0

            if (this.currentMaterial.length === 0) {
                this.currentMaterial = []
                this.$emit('update:material', [])
            }

            if (this.currentCollection.length === 0) {
                this.currentCollection = []
                this.$emit('update:collection', [])
            }

            this.$emit('update:priceTo', 0)
            this.$emit('update:priceFrom', 0)
            this.$emit('update:categoryId', 0)
            this.$emit('update:material', [])
            this.$emit('update:collection', [])
            this.$router.push('/').catch(err => {
                if (err.name !== 'NavigationDuplicated') {
                    throw err
                }
            })
        },
        loadCategories() {
            axios.get(API_BASE_URL + '/api/productCategories')
                .then(response => this.categoriesData = response.data)
        },
        loadMaterials() {
            axios.get(API_BASE_URL + '/api/materials')
                .then(response => {
                    this.materialsData = response.data
                })
        },
        loadCollections() {
            axios.get(API_BASE_URL + '/api/seasons')
                .then(response => {
                    this.collectionsData = response.data
                })
        }
    },
    created() {
        this.currentCategoryId = this.$route.query.categoryId || 0
        this.loadCategories()
        this.loadMaterials()
        this.loadCollections()
    }
}
</script>