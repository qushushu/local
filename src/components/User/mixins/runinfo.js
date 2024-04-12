import {anaList} from "../../../config/config/param/param_analist"
import {digList} from "../../../config/config/param/param_diglist"
import {alarmList} from "../../../config/config/param/param_alarmlist"
import {commList} from "../../../config/config/param/param_commlist"
export const runInfoMixin = {
	computed: {
		runInfo() {return this.$store.state.runInfo},
		i18n() {return this.$store.state.i18n},
		tableDataAna() {
          	return anaList.map(item => {
                item["value"] = this.runInfo.ana[item['code']];
                return item;
            });
        },
        tableDataDig() {
            return digList.map(item => {
            	item.value = this.runInfo.dig[item.code];
            	return item;
            });
        },
        tableDataAlarm() {
            return alarmList.map(item => {
            	item.value = this.runInfo.alarm[item.code];
            	return item;
            });
        },
        tableDataComm() {
            return commList.map(item => {
            	item.value = this.runInfo.comm[item.code];
            	return item;
            });
        },
        tableDataSeedlingLight() {
        	if(this.runInfo.lightVersion && this.runInfo.lightVersion) {
	        	let f = Object.values(this.runInfo.lightVersion);
	      	    return f.filter(item => item.dev_id);
        	} else {
        		return null;
        	}
        },
        tableDataVersion() {return [this.runInfo.version]},
	},
	methods: {
		pushOne(arrFilter) {
			if(arrFilter.length) {
				let re = arrFilter[0];
				re.refValue = re.value;
				re.refUnit = re.unit == "--" ? null : re.unit;
				switch(re.code) {
					case "EC":
					case "PH":
					case "OUT_PRESS":
					case "OUT_PRESS2":
					case "LIQ_TEMP":
					case "TEMP":
					case "HUM":
					case "CO2":
					case "LIQ_LV":
						if(Number(re.value)) {
							re.value = Number(re.value).toFixed(2);
						} else {
							re.value = "--";
						} 
					break;
					case "SIP1T":
					case "SIP2T":
						re.value = re.value ? re.value : '--';
					break;
				}
                re.name = this.i18n == "zh" ? re.zhName : re.enName;
				return re;
			} else {
				return {};
			}
		},
        // 获取单独或一组值
		getRunInfo(type,arrCode) {
			let arrFilter = [];
			let result = [];
			switch(type) {
				case "ana":
					if(typeof arrCode === "string") {
						arrFilter = this.tableDataAna.filter(item => item.code == arrCode);
						return this.pushOne(arrFilter);
					} else {
						for(let code of arrCode) {
							arrFilter = this.tableDataAna.filter(item => item.code == code);
							result.push(this.pushOne(arrFilter));
						}
					}
				break;
				case "dig":
					if(typeof arrCode === "string") {
						let arrFilter = this.tableDataDig.filter(item => item.code == arrCode);
						if(arrFilter.length) {
							let re = arrFilter[0];
							re.refValue = re.value == 1;
							return re;
						} else {
							return {};
						}
					} else {
						for(let code of arrCode) {
							let arrFilter = this.tableDataDig.filter(item => item.code == code);
							if(arrFilter.length) {
								let re = arrFilter[0];
								re.refValue = re.value == 1;
								result.push(re);
							} else {
								result.push({});
							}
						}	
					}
				break;
			}
			return result;
		}
	}
}