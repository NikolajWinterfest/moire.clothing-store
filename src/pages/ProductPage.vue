<template>
	<main v-if="productLoading">Загрузка товара...</main>
	<main v-else-if="!productData">Не удалось получить товар</main>
	<main class="content container" v-else>
		<div class="content__top">
			<ul class="breadcrumbs">
				<li class="breadcrumbs__item">
					<router-link class="breadcrumbs__link" :to="{ name: 'main' }">
						Каталог
					</router-link>
				</li>
				<li class="breadcrumbs__item">
					<router-link class="breadcrumbs__link" :to="{ name: 'main', query: { categoryId: product.category.id } }">
						{{ category.title }}
					</router-link>
				</li>
				<li class="breadcrumbs__item">
					<a class="breadcrumbs__link">
						{{ product.title }}
					</a>
				</li>
			</ul>
		</div>
		<section class="item">
			<div class="item__pics pics">
				<div class="pics__wrapper">
					<img width="570" height="570" :src="selectedColor === 0 ? getImageUrlTwo() : getImageUrl()" :alt="product.title">
				</div>
			</div>
			<div class="item__info">
				<span class="item__code">Артикул: {{ productArticle }}</span>
				<h2 class="item__title">
					{{ product.title }}
				</h2>
				<div class="item__form">
					<form class="form" action="#" method="POST" @submit.prevent="addToCart">
						<div class="item__row item__row--center">
							<div class="form__counter">
								<button type="button" aria-label="Убрать один товар" @click="decrement">
									<svg width="12" height="12" fill="currentColor">
										<use xlink:href="#icon-minus"></use>
									</svg>
								</button>

								<input type="text" v-model.number="productAmount">

								<button type="button" aria-label="Добавить один товар" @click="increment">
									<svg width="12" height="12" fill="currentColor">
										<use xlink:href="#icon-plus"></use>
									</svg>
								</button>
							</div>
							<b class="item__price">
								{{ productAmount * product.price | numberFormat }} ₽
							</b>
						</div>
						<div class="item__row">
							<fieldset class="form__block">
								<legend class="form__legend">Цвет</legend>
								<ul class="colors colors--black">
									<li class="colors__item" v-for="color in product.colors" :key="color.id">
										<label class="colors__label">
											<input class="colors__radio sr-only" type="radio" name="color" :value="color.color.id" v-model="selectedColor">
											<span class="colors__value" :style="{ 'background-color': color.color.code }">
											</span>
										</label>
									</li>
								</ul>
							</fieldset>
							<fieldset class="form__block">
								<legend class="form__legend">Размер</legend>
								<label class="form__label form__label--small form__label--select">
									<select class="form__select" type="text" name="size" v-model="selectedSize">
										<option value="0" disabled>Выберите размер</option>
										<option v-for="size in product.sizes" :key="size.id" :value="size.id">
											{{ size.title }}
										</option>
									</select>
								</label>
							</fieldset>
						</div>
						<button class="item__button button button--primery" type="submit" :disabled="productAddSending">
							В корзину
						</button>

						<div v-show="productAdded">Товар добавлен в корзину</div>
						<div v-show="productAddSending">Добавляем товар в корзину...</div>
						<div v-show="productNotAvailable">Данного товара нет в наличии</div>
					</form>
				</div>
			</div>
			<div class="item__desc">
				<ul class="tabs">
					<li class="tabs__item" :class="{ 'tabs__link--current': activeTab === 'info' }" @click.prevent="changeTab('info')">
						<a class="tabs__link" href='#'>
							Информация о товаре
						</a>
					</li>
					<li class="tabs__item" :class="{ 'tabs__link--current': activeTab === 'delivery' }" @click.prevent="changeTab('delivery')">
						<a class="tabs__link" href="#">
							Доставка и возврат
						</a>
					</li>
				</ul>
				<div class="item__content" v-if="activeTab === 'info'">
					<h3>Состав:</h3>
					<p>
						60% хлопок<br>
						30% полиэстер<br>
					</p>
					<h3>Уход:</h3>
					<p>
						Машинная стирка при макс. 30ºC короткий отжим<br>
						Гладить при макс. 110ºC<br>
						Не использовать машинную сушку<br>
						Отбеливать запрещено<br>
						Не подвергать химчистке<br>
					</p>
				</div>
				<div class='item__content' v-else-if="activeTab === 'delivery'">
					<p>
						Сайт рыбатекст поможет дизайнеру, верстальщику, вебмастеру сгенерировать несколько абзацев более менее осмысленного текста
						рыбы на русском языке, а начинающему оратору отточить навык публичных выступлений в домашних условиях.
					</p>
				</div>
			</div>
		</section>
	</main>
</template>

<script>
import gotoPage from '@/helpers/gotoPage'
import numberFormat from '@/helpers/numberFormat'
import axios from 'axios'
import { API_BASE_URL } from '@/config'
import { mapActions } from 'vuex'

export default {
	data() {
		return {
			productAmount: 1,
			productData: null,
			productLoading: false,
			productLoadingFailed: false,
			productAdded: false,
			productAddSending: false,
			selectedColor: null,
			selectedSize: 0,
			productNotAvailable: false,
			imageFake: require("@/assets/no-image-aviable.png"),
			activeTab: 'info'
		}
	},
	props: {
		image: String,
	},
	filters: {
		numberFormat
	},
	computed: {
		product() {
			return this.productData
		},
		category() {
			return this.productData.category
		},
		productArticle() {
			return this.product.colors.find(el => el.id).id
		},
	},
	methods: {
		...mapActions(['addProductToCart']),

		gotoPage,
		changeTab(tab) {
			this.activeTab = tab
		},
		getImageUrl() {
			if (this.product && this.product.colors.length > 0) {
				const selectedColor = this.product.colors.find(color => color.color.id === this.selectedColor)
				if (selectedColor.gallery && selectedColor.gallery.length > 0) {
					const imageUrl = selectedColor.gallery.find(el => el.file)?.file.url
					return imageUrl
				}
			}
			return this.imageFake
		},
		getImageUrlTwo() {
			if (this.product && this.product.colors.length > 1) {
				const selectedColor = this.product.colors.find(color => color.color.id === this.selectedColor)
				if (selectedColor.gallery && selectedColor.gallery.length > 0) {
					const imageUrl = selectedColor.gallery.find(el => el.file).file.url
					return imageUrl
				}
			}
			return this.imageFake
		},
		addToCart() {
			this.productAdded = false
			this.productAddSending = true
			this.productNotAvailable = false

			this.addProductToCart({
				productId: this.product.id,
				amount: this.productAmount,
				colorId: this.selectedColor,
				sizeId: this.selectedSize
			})
				.then(() => {
					this.productAdded = true
					this.productAddSending = false
				})
				.catch((error) => {
					if (error.response && error.response.status === 404) {
						this.productNotAvailable = true
					}
					this.productAddSending = false
					this.productNotAvailable = true
				})
		},
		decrement() {
			if (this.productAmount > 1) {
				this.productAmount--
			}
		},
		increment() {
			this.productAmount++
		},
		loadProduct() {
			this.productLoading = true
			this.productLoadingFailed = false
			axios.get(API_BASE_URL + '/api/products/' + +(this.$route.params.id))
				.then(response => {
					this.productData = response.data
					this.setOfColor()
					this.setOfSize()
				})
				.catch(() => this.productLoadingFailed = true)
				.then(() => this.productLoading = false)
		},
		setOfColor() {
			if (this.product && this.product.colors.length > 0) {
				this.selectedColor = this.product.colors[0].color.id
			}
		},
		setOfSize() {
			if (this.product && this.product.sizes.length > 0) {
				this.selectedSize = this.product.sizes[0].id
			}
		},
	},
	watch: {
		'$route.params.id': {
			handler() {
				this.loadProduct()
			},
			immediate: true
		}
	}
}
</script>