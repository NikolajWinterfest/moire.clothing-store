<template>
    <ul class="cart__options options">
        <li class="options__item" v-for="(option, index) in options" :key="index">
            <label class="options__label">
                <input class="options__radio sr-only" :type="type" :name="name" :value="option.value" v-model="selectedOption" />
                <span class="options__value">{{ option.label }}</span>
                <span class="form__errors" v-if="error">{{ error }}</span>
            </label>
        </li>
    </ul>
</template>
  
<script>

export default {
    props: {
        type: {
            default: 'radio'
        },
        name: String,
        error: String,
        options: Array,
        value: [String, Number]
    },
    computed: {
        selectedOption: {
            get() {
                return this.value
            },
            set(value) {
                this.$emit('input', value)
            }
        }
    }
}
</script>