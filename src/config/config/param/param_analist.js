let anaList = [
    {
        id: 1,
        code: "EC",
        name: "营养液EC",
        zhName: "营养液EC",
        enName: "Nutrient solution EC",
        unit: "μs/cm"
    },
    {
        id: 2,
        code: "PH",
        name: "营养液PH",
        zhName: "营养液PH",
        enName: "Nutrient solution PH",
        unit: "--"
    },
    {
        id: 3,
        code: "LIQ_LV",
        name: "液位",
        zhName: "液位",
        enName: "Water level",
        unit: "cm"
    },
    {
        id: 4,
        code: "LIQ_TEMP",
        name: "液温",
        zhName: "液温",
        enName: "Liquid temperature",
        unit: "℃"
    },
    {
        id: 5,
        code: "CO2",
        name: "CO2",
        zhName: "CO2",
        enName: "CO2",
        unit: "PPM"
    },
    {
        id: 6,
        code: "W1",
        name: "营养液A质量",
        zhName: "营养液A质量",
        enName: "Weight of nutrient solution A",
        unit: "千克"
    },
    {
        id: 7,
        code: "W2",
        name: "营养液B质量",
        zhName: "营养液B质量",
        enName: "Weight of nutrient solution B",
        unit: "千克"
    },
    {
        id: 8,
        code: "W3",
        name: "营养液C质量",
        zhName: "营养液C质量",
        enName: "Weight of nutrient solution C",
        unit: "千克"
    },
    {
        id: 9,
        code: "W4",
        name: "酸质量",
        zhName: "酸质量",
        enName: "Weight of acid",
        unit: "千克"
    },
    {
        id: 10,
        code: "W5",
        name: "碱质量",
        zhName: "碱质量",
        enName: "Weight of alkali",
        unit: "千克"
    },
    {
        id: 11,
        code: "WS1",
        name: "营养液A起始质量",
        zhName: "营养液A起始质量",
        enName: "Initial Weight of nutrient solution A",
        unit: "千克"
    },
    {
        id: 12,
        code: "WS2",
        name: "营养液B起始质量",
        zhName: "营养液B起始质量",
        enName: "Initial Weight of nutrient solution B",
        unit: "千克"
    },
    {
        id: 13,
        code: "WS3",
        name: "营养液C起始质量",
        zhName: "营养液C起始质量",
        enName: "Initial Weight of nutrient solution C",
        unit: "千克"
    },
    {
        id: 14,
        code: "WS4",
        name: "酸起始质量",
        zhName: "酸起始质量",
        enName: "Initial Weight of acid",
        unit: "千克"
    },
    {
        id: 15,
        code: "WS5",
        name: "碱起始质量",
        zhName: "碱起始质量",
        enName: "Initial Weight of alkali",
        unit: "千克"
    },
    {
        id: 16,
        code: "ZS1",
        name: "营养液A蠕动泵转速",
        zhName: "营养液A蠕动泵转速",
        enName: "Rotation speed of peristaltic pump A",
        unit: "转每分钟"
    },
    {
        id: 17,
        code: "ZS2",
        name: "营养液B蠕动泵转速",
        zhName: "营养液B蠕动泵转速",
        enName: "Rotation speed of peristaltic pump B",
        unit: "转每分钟"
    },
    {
        id: 18,
        code: "ZS3",
        name: "营养液C蠕动泵转速",
        zhName: "营养液C蠕动泵转速",
        enName: "Rotation speed of peristaltic pump C",
        unit: "转每分钟"
    },
    {
        id: 19,
        code: "ZS4",
        name: "酸液蠕动泵转速",
        zhName: "酸液蠕动泵转速",
        enName: "Speed of acid peristaltic pump",
        unit: "转每分钟"
    },
    {
        id: 20,
        code: "ZS5",
        name: "碱液蠕动泵转速",
        zhName: "碱液蠕动泵转速",
        enName: "Rotating speed of alkali peristaltic pump",
        unit: "转每分钟"
    },
    {
        id: 21,
        code: "OUT_PRESS",
        name: "出水管压力",
        zhName: "出水管压力",
        enName: "Outlet pipe pressure",
        unit: "Mpa"
    },
    {
        id: 22,
        code: "OUT_PRESS2",
        name: "右侧管道压力",
        zhName: "右侧管道压力",
        enName: "Right pipe pressure",
        unit: "MPa"
    },
    {
        id: 23,
        code: "TEMP",
        name: "环境温度",
        zhName: "环境温度",
        enName: "Temperature",
        unit: "℃"
    },
    {
        id: 24,
        code: "HUM",
        name: "湿度",
        zhName: "湿度",
        enName: "Humidity",
        unit: "%"
    },
    {
        id: 25,
        code: "SIP1T",
        name: "泵1喷灌持续时间",
        zhName: "泵1喷灌持续时间",
        enName: "Pump 1 spray duration",
        unit: "秒"
    },
    {
        id: 26,
        code: "SIP1NT",
        name: "泵1下次喷灌时间",
        zhName: "泵1下次喷灌时间",
        enName: "Next spray irrigation time of pump 1",
        unit: "分钟"
    },
    {
        id: 27,
        code: "SIP2T",
        name: "泵2喷灌持续时间",
        zhName: "泵2喷灌持续时间",
        enName: "Pump 2 spray duration",
        unit: "秒"
    },
    {
        id: 28,
        code: "SIP2NT",
        name: "泵2下次喷灌时间",
        zhName: "泵2下次喷灌时间",
        enName: "Next spray irrigation time of pump 2",
        unit: "分钟"
    },
    {
        id: 29,
        code: "EC1",
        name: "EC1",
        zhName: "EC1",
        enName: "EC1",
        unit: "μs/cm"
    },
    {
        id: 30,
        code: "EC2",
        name: "EC2",
        zhName: "EC2",
        enName: "EC2",
        unit: "μs/cm"
    },
    {
        id: 31,
        code: "PH1",
        name: "PH1",
        zhName: "PH1",
        enName: "PH1",
        unit: "--"
    },
    {
        id: 32,
        code: "PH2",
        name: "PH2",
        zhName: "PH2",
        enName: "PH2",
        unit: "--"
    },
    {
        id: 33,
        code: "WATER_SUP_SEC",
        name: "补水时间",
        zhName: "补水时间",
        enName: "Water replenishment time",
        unit: "秒"
    },
    {
        id: 34,
        code: "WATER_SUPPLY",
        name: "补水计算量",
        zhName: "补水计算量",
        enName: "Water replenishment calculation amount",
        unit: "升"
    },
    {
        id: 35,
        code: "WATER_PV",
        name: "实时补水量",
        zhName: "实时补水量",
        enName: "Real time hydration amount",
        unit: "升每秒"
    },
    {
        id: 36,
        code: "WATER_CV",
        name: "累计补水量",
        zhName: "累计补水量",
        enName: "Accumulated water replenishment",
        unit: "升"
    },
    {
        id: 37,
        code: "TEMP_PCB",
        name: "PCB文档",
        zhName: "PCB文档",
        enName: "PCB documentation",
        unit: "℃"
    },
    {
        id: 38,
        code: "HUM_PCB",
        name: "PEB湿度",
        zhName: "PEB湿度",
        enName: "PEB humidity",
        unit: "%"
    }
];
export {anaList}