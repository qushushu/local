import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Operation from '@/components/Operation'
import PlanSetting from '@/components/PlanSetting'
import History from '@/components/History'
import DeviceModel from '@/components/DeviceModel'
import DeviceInfo from '@/components/DeviceInfo'
import Device from '@/components/Device'
import ParameterConfig from '@/components/ParameterConfig'
import ParameterAdjustment from '@/components/ParameterAdjustment'
import CulRecords from '@/components/CulRecords'
import PlanStage from '@/components/PlanStage'
import PlanStageShow from '@/components/PlanStageShow'
import User from '@/components/User'
import CreateLanguage from '@/components/CreateLanguage'
import Sensor from '@/components/Sensor'
import Calibration from '@/components/Calibration'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(Router)
Vue.use(ElementUI);
export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/User',
      name: 'User',
      component: User
    },
    {
      path: '/Calibration',
      name: 'Calibration',
      component: Calibration
    },
    {
      path: '/Sensor',
      name: 'Sensor',
      component: Sensor
    },
    {
      path: '/CreateLanguage',
      name: 'CreateLanguage',
      component: CreateLanguage
    },
    {
      path: '/Operation',
      name: 'Operation',
      component: Operation,
    },
    {
      path: '/PlanSetting',
      name: 'PlanSetting',
      component: PlanSetting
    },
    {
      path: '/History',
      name: 'History',
      component: History
    },
    {
      path: '/DeviceModel',
      name: 'DeviceModel',
      component: DeviceModel,
    },
    {
      path: '/DeviceInfo',
      name: 'DeviceInfo',
      component: DeviceInfo,
    },
    {
      path: '/Device',
      name: 'Device',
      component: Device
    },
    {
      path: '/ParameterConfig',
      name: 'ParameterConfig',
      component: ParameterConfig
    },
    {
      path: '/ParameterAdjustment',
      name: 'ParameterAdjustment',
      component: ParameterAdjustment
    },{
      path: '/CulRecords',
      name: 'CulRecords',
      component: CulRecords
    },{
      path: '/PlanStage',
      name: 'PlanStage',
      component: PlanStage
    },{
      path: '/PlanStageShow',
      name: 'PlanStageShow',
      component: PlanStageShow
    },{
      path: "*",
      redirect: Home
    }
  ]
})
