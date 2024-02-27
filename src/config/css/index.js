/* 本模块用于导入全局CSS */
import {opinion} from "../../assets/tools/tool.js"
import "../../assets/base.css"
opinion() === "mobile" ? import("../../assets/mobile-style.css") : import("../../assets/pc.css");