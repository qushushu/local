const autoUpdateMixin = {
	data() {
		return {
		    timer: null
		}
	},
	mounted() {
		this.$store.dispatch("updateRunInfo");
		this.timer = setInterval(()=> {
			this.$store.dispatch("updateRunInfo");
		},1000);
	},
	beforeDestroy() {
		clearInterval(this.timer);
	}
}
export {autoUpdateMixin}