<template>
	<div>
		<HeaderPage />
		<router-view />
		<FooterPage />
	</div>
</template>

<script>
import FooterPage from '@/components/FooterPage'
import HeaderPage from '@/components/HeaderPage'
import { mapActions, mapMutations } from 'vuex'

export default {
	components: { HeaderPage, FooterPage },
	created() {
		const userAccessKey = localStorage.getItem('userAccessKey')
		if (userAccessKey) {
			this.updateUserAccessKey(userAccessKey)
		}
		this.loadCart()
	},
	methods: {
		...mapActions(['loadCart']),
		...mapMutations(['updateUserAccessKey'])
	}
}
</script>