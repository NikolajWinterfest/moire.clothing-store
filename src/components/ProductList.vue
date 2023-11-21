<template>
    <ul class="catalog__list">
        <ProductItem v-for="product in products" :key="product.id" :product="product" :images="product.images" :colors="product.colors" :title='product.title' :id="product.id"  />
    </ul>
</template>

<script>
import ProductItem from '@/components/ProductItem'

export default {
    props: ['products'],
    components: { ProductItem }
}
</script>