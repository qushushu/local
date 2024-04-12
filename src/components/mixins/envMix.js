import projectJson from "../../config"
let {isPlant} = projectJson;
export const envMixin = {
	computed: {
		isPlant() {return isPlant},
        isMobile() {return this.$store.state.isMobile},
        i18n() {return this.$store.state.i18n},
        isWeb() {return this.$store.state.isWeb}
	}
}