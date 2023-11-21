<template>
    <BaseFormField :title="title" :error="error">
        <textarea class="form__input form__input--area" v-model="dataValue" :type="type" :placeholder="placeholder"></textarea>
    </BaseFormField>
</template>

<script>
import formFieldMixin from '@/mixins/formField.Mixin'

export default {
    props: ['type'],
    mixins: [formFieldMixin]
}
</script>