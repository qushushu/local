const digList = [
    {
        id: 1,
        code: "SIP1",
        name: "喷灌泵1",
        b1: "运行",
        b0: "停止"
    },
    {
        id: 2,
        code: "SIP2",
        name: "喷灌泵2",
        b1: "运行",
        b0: "停止"
    },
    {
        id: 3,
        code: "BWP1",
        name: "回水泵",
        b1: "运行",
        b0: "停止"
    },
    {
        id: 4,
        code: "CHILL",
        name: "营养液制冷",
        b1: "运行",
        b0: "停止"
    },
    {
        id: 5,
        code: "MIX_P",
        name: "搅拌泵",
        b1: "运行",
        b0: "停止"
    },
    {
        id: 6,
        code: "WSV",
        name: "补水阀",
        b1: "开",
        b0: "关"
    },
    {
        id: 7,
        code: "CO2V",
        name: "二氧化碳阀",
        b1: "开",
        b0: "关"
    },
    {
        id: 8,
        code: "PP1",
        name: "蠕动泵1状态",
        b1: "运行",
        b0: "停止"
    },
    {
        id: 9,
        code: "PP2",
        name: "蠕动泵2状态",
        b1: "运行",
        b0: "停止"
    },
    {
        id: 10,
        code: "PP3",
        name: "蠕动泵3状态",
        b1: "运行",
        b0: "停止"
    },
    {
        id: 11,
        code: "PP4",
        name: "蠕动泵4状态",
        b1: "运行",
        b0: "停止"
    },
    {
        id: 12,
        code: "PP5",
        name: "蠕动泵5状态",
        b1: "运行",
        b0: "停止"
    },
    {
        id: 13,
        code: "PP1_ZF",
        name: "蠕动泵1方向",
        b1: "正转",
        b0: "反转"
    },
    {
        id: 14,
        code: "PP2_ZF",
        name: "蠕动泵2方向",
        b1: "正转",
        b0: "反转"
    },
    {
        id: 15,
        code: "PP3_ZF",
        name: "蠕动泵3方向",
        b1: "正转",
        b0: "反转"
    },
    {
        id: 16,
        code: "PP4_ZF",
        name: "蠕动泵4方向",
        b1: "正转",
        b0: "反转"
    },
    {
        id: 17,
        code: "PP5_ZF",
        name: "蠕动泵5方向",
        b1: "正转",
        b0: "反转"
    },
    {
        id: 18,
        code: "AUTO",
        name: "工作模式",
        b1: "自动",
        b0: "手动"
    },
    {
        id: 19,
        code: "IND_RUN",
        name: "运行灯",
        b1: "开",
        b0: "关"
    },
    {
        id: 20,
        code: "IND_EC",
        name: "EC告警灯",
        b1: "开",
        b0: "关"
    },
    {
        id: 21,
        code: "IND_PH",
        name: "PH告警灯",
        b1: "开",
        b0: "关"
    },
    {
        id: 22,
        code: "IND_LV",
        name: "液位灯",
        b1: "开",
        b0: "关"
    },
    {
        id: 23,
        code: "VL1",
        name: "阀左1",
        b1: "开",
        b0: "关"
    },
    {
        id: 24,
        code: "VL2",
        name: "阀左2",
        b1: "开",
        b0: "关"
    },
    {
        id: 25,
        code: "VL3",
        name: "阀左3",
        b1: "开",
        b0: "关"
    },
    {
        id: 26,
        code: "VL4",
        name: "阀左4",
        b1: "开",
        b0: "关"
    },
    {
        id: 27,
        code: "VR1",
        name: "阀右1",
        b1: "开",
        b0: "关"
    },
    {
        id: 28,
        code: "VR2",
        name: "阀右2",
        b1: "开",
        b0: "关"
    },
    {
        id: 29,
        code: "VR3",
        name: "阀右3",
        b1: "开",
        b0: "关"
    },
    {
        id: 30,
        code: "VR4",
        name: "阀右4",
        b1: "开",
        b0: "关"
    },
    {
        id: 31,
        code: "WATER_TANK_TOP",
        name: "水箱上浮球",
        b1: "开",
        b0: "关"
    },
    {
        id: 32,
        code: "WATER_TANK_DOWN",
        name: "水箱下浮球",
        b1: "开",
        b0: "关"
    },
    {
        id: 33,
        code: "CURRENT_BW_L",
        name: "左侧回水泵电流",
        b1: "开",
        b0: "关"
    },
    {
        id: 34,
        code: "CURRENT_BW_R",
        name: "右侧回水泵电流",
        b1: "开",
        b0: "关"
    },
    {
        id: 35,
        code: "WORK_BW_L",
        name: "左侧回水",
        b1: "开",
        b0: "关"
    },
    {
        id: 36,
        code: "WORK_BW_R",
        name: "右侧回水",
        b1: "开",
        b0: "关"
    }
];
export {digList}