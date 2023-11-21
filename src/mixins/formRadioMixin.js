export default {
    props: ["title", "error", "value"],
    components: { BaseFormField },
    computed: {
        dataValue: {
            get() {
                return this.value
            },
            set(value) {
                this.$emit("input", value)
            },
        },
    },
}
