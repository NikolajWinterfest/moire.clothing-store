<template>
    <BaseFormField :title="title" :error="error">
        <input class="form__input" v-model="dataValue" :type="type" :placeholder="placeholder">
    </BaseFormField>
</template>

<script>
import formFieldMixin from '@/mixins/formField.Mixin'

export default {
    props: {
        type: {
            default: 'text'
        }
    },
    mixins: [formFieldMixin]
}
</script>