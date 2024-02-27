import ACard from "./ACard.vue"
import SearchBox from "./SearchBox.vue"
import PageHeader from "./PageHeader.vue"
import CardHeader from "./CardHeader.vue"
export default {
	install(vue) {
		vue.component("aCard",ACard);
		vue.component("SearchBox",SearchBox);
		vue.component("PageHeader",PageHeader);
		vue.component("CardHeader",CardHeader);
	}
}