import Vue from 'vue'
import Router from 'vue-router'
import ElementUI from 'element-ui';
import {getUserPower} from "@/assets/tools/tool"
import VueI18n from "vue-i18n"
import 'element-ui/lib/theme-chalk/index.css';
import projectJson from "../config/project/config"
let {isWeb} = projectJson;
// import messages from "../setting/i18n/messages"

/* 登录页面 start */
import Login from '@/components/Login'
/* 登录页面 end */

/* 用户页面 start */
import Cards from '@/components/User/Cards'
import Dashboard from '@/components/User/Dashboard'
import Operation from '@/components/User/Operation'
import Device from '@/components/User/Device'
import ParameterAdjustmentUser from '@/components/User/ParameterAdjustmentUser'
import DeviceInfo from '@/components/User/DeviceInfo'
// import Parameter from '@/components/User/Parameter'
import PlanSetting from '@/components/User/PlanSetting'
import PlanStageShow from '@/components/User/PlanStageShow'
import PlanStage from '@/components/User/PlanStage'
import Plant from '@/components/User/Plant'
import CulRecords from '@/components/User/CulRecords'
// import History from '@/components/User/History'
import Calibration from '@/components/User/Calibration'
/* 用户页面 end */

/* 系统管理员页面 start */
import Customer from '@/components/manager/systemManager/Customer'
import Factory from '@/components/manager/systemManager/Factory'
import DeviceModel from '@/components/manager/systemManager/DeviceModel'
import ParameterConfig from '@/components/manager/systemManager/ParameterConfig'
import Language from '@/components/manager/systemManager/Language'
/* 系统管理员页面 end */

/* 工厂管理员(种植间管理员)页面 start */
import FactoryUser from '@/components/manager/factoryManager/FactoryUser'
import RoomList from '@/components/manager/factoryManager/RoomList'
import RoomManager from '@/components/manager/factoryManager/RoomManager'
import Room from '@/components/manager/factoryManager/Room'
import DevManager from '@/components/manager/factoryManager/DevManager'
import ParameterAdjustment from '@/components/manager/factoryManager/ParameterAdjustment'
import Sensor from '@/components/manager/Sensor'
import DeviceGroup from '@/components/manager/DeviceGroup'
/* 工厂管理员(种植间管理员)页面 end */

Vue.use(Router)
Vue.use(ElementUI);

let router = new Router({
  routes: [
    {
      path: '/Login',
      name: 'Login',
      component: Login,
      meta: {
        power: [0]
      },
    },
    /* 用户相关 */
    {
      path: '/',
      name: '',
      // alias: "/Cards",
      meta: {
        power: [4,5]
      },
      component: Cards,
      redirect() {
        if(!isWeb) {
          return "/Dashboard"
        } else {
          return "/Cards"
        }
      }
    },
    {
      path: '/Cards',
      name: 'Cards',
      meta: {
        power: [4,5]
      },
      component: Cards,
    },
    {
      path: '/Dashboard',
      name: 'Dashboard',
      meta: {
        power: [4,5]
      },
      component: Dashboard,
    },
    {
      path: '/Operation',
      name: 'Operation',
      meta: {
        power: [4]
      },
      component: Operation,
    },
    {
      path: '/Device',
      name: 'Device',
      meta: {
        power: [4]
      },
      component: Device
    },
    {
      path: '/ParameterAdjustmentUser',
      name: 'ParameterAdjustmentUser',
      meta: {
        power: [4]
      },
      component: ParameterAdjustmentUser
    },
    {
      path: '/DeviceInfo',
      name: 'DeviceInfo',
      meta: {
        power: [4]
      },
      component: DeviceInfo,
    },
    // {
    //   path: '/Parameter',
    //   name: 'Parameter',
    //   meta: {
    //     power: [4,5]
    //   },
    //   component: Parameter,
    // },
    {
      path: '/PlanSetting',
      name: 'PlanSetting',
      meta: {
        power: [4]
      },
      component: PlanSetting
    },
     {
      path: '/PlanStageShow',
      name: 'PlanStageShow',
      meta: {
        power: [4]
      },
      component: PlanStageShow
    },{
      path: '/PlanStage',
      name: 'PlanStage',
      meta: {
        power: [4]
      },
      component: PlanStage
    },
    {
      path: '/CulRecords',
      name: 'CulRecords',
      meta: {
        power: [4]
      },
      component: CulRecords
    },
    // {
    //   path: '/History',
    //   name: 'History',
    //   meta: {
    //     power: [4,5]
    //   },
    //   component: History
    // },
    {
      path: '/Calibration',
      name: 'Calibration',
       meta: {
        power: [4]
      },
      component: Calibration
    },

    /* 系统管理员相关 */
    {
      path: '/Customer',
      name: 'Customer',
       meta: {
        power: [1]
      },
      component: Customer
    },
    {
      path: '/Plant',
      name: 'Plant',
      meta: {
        power: [1,2,3,4]
      },
      component: Plant
    },
    {
      path: '/Factory',
      name: 'Factory',
      component: Factory,
      meta: {
        power: [1]
      },
    },
    {
      path: '/DeviceModel',
      name: 'DeviceModel',
      meta: {
        power: [1]
      },
      component: DeviceModel,
    },
    {
      path: '/ParameterConfig',
      name: 'ParameterConfig',
      meta: {
        power: [1]
      },
      component: ParameterConfig
    },
    {
      path: '/Language',
      name: 'Language',
      meta: {
        power: [1]
      },
      component: Language
    },
    /* 工厂管理员(种植间管理员)页面 */
    {
      path: '/FactoryUser',
      name: 'FactoryUser',
       meta: {
        power: [2]
      },
      component: FactoryUser
    },{
      path: '/RoomList',
      name: '/RoomList',
       meta: {
        power: [2]
      },
      component: RoomList
    },
    {
      path: '/RoomManager',
      name: '/RoomManager',
       meta: {
        power: [3]
      },
      component: RoomManager
    },
    {
      path: '/Room',
      name: '/Room',
       meta: {
        power: [2,3]
      },
      component: Room
    },
    {
      path: '/DevManager',
      name: '/DevManager',
       meta: {
        power: [2]
      },
      component: DevManager
    },
    {
      path: '/ParameterAdjustment',
      name: 'ParameterAdjustment',
      meta: {
        power: [2,3]
      },
      component: ParameterAdjustment
    },
    
    {
      path: '/Sensor',
      name: 'Sensor',
      meta: {
        power: [2,3]
      },
      component: Sensor
    },
    {
      path: '/DeviceGroup',
      name: 'DeviceGroup',
      meta: {
        power: [2,3]
      },
      component: DeviceGroup
    },
    {
      path: "*",
      redirect: Dashboard
    }
  ]
});

/* 用户登录到不该登录的页面后的跳转 */
/*
  包括用户登录之后进入的页面
*/
router.beforeEach((to,from,next)=> {
  let power = getUserPower();
  if(to.meta.power) {
    let arr = to.meta.power;
    if(arr.includes(power)) {
      next();
    } else {
      switch(power) {
         // 系统管理员
        case 1:
          if(to.path !== "/Customer") {
            next("/Customer")
          } else {
            next();
          }
          next("/Customer");
        break;
        // 工厂管理者
        case 2:
          if(to.path !== "/FactoryUser") {
            next("/FactoryUser");
          } else {
            next();
          }
          next("/FactoryUser");
        break;
        // 工作间管理员
        case 3:
          if(to.path !== "/RoomManager") {
            next("/RoomManager");
          } else {
            next();
          }
          next("/RoomManager");
        break;
        // 操作员、普通用户
        case 4:
        case 5:
          if(isWeb) {
            if(to.path !== "/") {
              next("/");
            } else {
              next();
            }
          } else {
             if(to.path !== "/Dashboard") {
              next("/Dashboard");
            } else {
              next();
            } 
          }
        break;
      }
    }
  }
})

export default router