<!-- 
  组件说明：本组件为系统管理员登录后展示的管理用户组件。
  进入方式：系统管理员登录后自动跳转至该页面。
  用户权限：只有系统管理员方可查看，其他用户（或登录用户）进入此页后将自动跳转至首页。
-->
<template>
    <div class="ym-main">
        <a-card class="card-pd">
            <!-- 标题 start -->
            <PageHeader :title="factory_name + '的种植间'" goBack=false></PageHeader>
            <!-- 标题 end -->
            <!-- 新增种植间 start -->
            <div class="space-btm1">
                <SearchBox :placeholder="$t('message.搜索种植间')" @search="toSearch" />
                <el-button type="primary" size="small" @click="editRoom">{{$t('message.新增种植间')}}</el-button>
            </div>
            <!-- 新增种植间 end -->
            <!-- 种植间列表 start -->
            <el-table :data="tableData" border stripe size="small">
              <el-table-column prop="room_name" :label="$t('message.种植间名称')"></el-table-column>
              <el-table-column prop="account" :label="$t('message.管理员')" width="141px"></el-table-column>
              <el-table-column fixed="right" :label="$t('message.操作')">
                  <template slot-scope="scope">
                    <el-button type="primary" size="small" @click="editRoom(scope.row)">{{$t('message.编辑')}}</el-button>
                    <el-button type="danger" size="small" @click="handleDelete(scope.row)">{{$t('message.删除')}}</el-button>
                    <el-button size="small" @click="toGrowCell(scope.row)">{{$t('message.进入种植间')}}</el-button>
                  </template>
                </el-table-column>
            </el-table>
            <!-- 种植间列表 end -->
            <!-- 创建/编辑种植间弹层 start -->
            <el-dialog :title="layerTitle" :visible.sync="dialogVisibleSee" width="400px">
                <el-form ref="r" :model="r" label-width="100px" size="mini" modal="true" :rules="rules">
                    <el-form-item :label="$t('message.种植间名称')" prop="room_name">
                        <el-input v-model="r.room_name"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('message.管理员')" prop="t">
                        <el-select v-model="r.t">   
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option> 
                        </el-select>
                         <el-popover
                            placement="top-start"
                            title="没有管理员?"
                            width="200"
                            trigger="hover"
                            content="如果没有管理员，请先创建种植间管理员">
                            <i class="el-icon-question"  slot="reference"></i>
                          </el-popover>
                    </el-form-item>
                    <el-form-item> 
                        <el-button @click="resetForm('r')">{{$t('message.取消')}}</el-button>
                        <el-button type="primary" @click="submitForm('r')">{{$t('message.确定')}}</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
            <!-- 创建/编辑种植间弹层 end -->
        </a-card>
    </div>
</template>
<script>
    import {getRoomList,getUserRoleList,createRoom,updateRoom,deleteRoom} from '../../../store/ajax'
    import {globalUserEnter} from '../../../assets/tools/tool.js'
    export default {
        data() {
            return {
                searchText: "",
                tableData: [],
                dialogVisibleSee: false,
                layerTitle: "",
                r: {
                    id: 0,
                    room_name: "",
                    t: ""
                },
                options: [{
                    value: '',
                    label: ''
                }],
                rules: {
                    room_name: [{ required: true, message: this.$t('message.请输入种植间名称'), trigger: 'blur' }],
                    t: [{ required: true, message: this.$t('message.请选择管理员'), trigger: 'blur' }],
                }
            }
        },
        computed: {
            factoryInfo() {return this.$store.state.userInfo.factory},
            factory_id() {
                if(this.factoryInfo && this.factoryInfo.factory_id) {
                    return this.factoryInfo.factory_id;
                }
            },
            factory_name() {
                if(this.factoryInfo && this.factoryInfo.factory_name) {
                    return this.factoryInfo.factory_name;
                }
            }
        },
        watch: {
            factory_id(id) {
                if(id) {
                    this.getRoomList();
                }
            }
        },
        methods: {
            // 获取种植间列表
            async getRoomList() {
                this.tableData = await getRoomList({
                    factory_id: this.factoryInfo.factory_id,
                    searchText: this.searchText
                }) || [];
            },
            // 搜索种植间
            toSearch(data) {
                this.searchText = data;
                this.getRoomList();
            },
            // 新增/编辑种植间弹层
            async editRoom(row) {
                this.layerTitle = this.$t("message.新增种植间");
                this.resetForm();
                let res = await this.getUserList();
                res.forEach(item => {
                    this.options.push({
                        value: Number(item.id),
                        label: item.account
                    })
                })
                if(row.id) {
                    this.layerTitle = this.$t("message.编辑种植间");
                    this.r.id = parseInt(row.id);
                    let data = this.getOneData(this.r.id);
                }
                this.dialogVisibleSee = true;
            },
            // 获取某个种植间数据
            async getOneData(id) {
                let res = await getRoomList({id});
                if(res.length) {
                    let {id,manager_id,room_name} = res[0];
                    this.r.id = id;
                    this.r.room_name = room_name;
                    this.r.t = manager_id;
                }
            },
            // 获取种植间成员列表
            async getUserList() {
                this.options = [];
                let res = await getUserRoleList({
                    factory_id: this.factory_id,
                    role: 3
                });
                return res;
            },
            // 重置修改
            resetForm(formName) {
                formName && this.$refs[formName].resetFields();
                this.dialogVisibleSee = false;
                this.r.id = 0;
                this.r.room_name = "";
                this.r.t = "";
            },
            // 新增/编辑种植间
            submitForm(formName) {
                this.$refs[formName].validate(async  valid => {
                    if(valid) {
                        let {room_name} = formName;
                        let id = this.r.id;
                        let res = id ? await updateRoom({
                            room_name: this.r.room_name,
                            manager_id: this.r.t,
                            id
                        }) : await createRoom({
                            room_name: this.r.room_name,
                            manager_id: this.r.t,
                            factory_id: this.factory_id,
                        });
                        if(res.code == 200) {
                            this.$message({
                              type: 'success',
                              message: this.$t("message.操作成功")
                            });
                            this.resetForm();
                            this.getRoomList();
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.message
                            });   
                        }
                    }
                })
            },
            // 删除种植间
            handleDelete(row) {
                this.$confirm(this.$t("message.确认删除当前种植间？"), this.$t("message.确认信息"), {
                  distinguishCancelAndClose: true,
                  confirmButtonText: this.$t("message.确认"),
                  cancelButtonText: this.$t("message.取消")
                }).then(async () => {
                    let res = await deleteRoom(row.id);
                    if(res.code == 200) {
                        this.$message({
                          type: 'success',
                          message: this.$t("message.删除成功")
                        });
                        this.getRoomList();
                    } else if(res.code == 501) {
                        this.$message({
                          type: 'error',
                          message: this.$t("message.此种植间仍有种植单元，请先删除种植单元")
                        });
                    } else {
                        this.$message({
                          type: 'error',
                          message: this.$t("message.操作失败")
                        });
                    }
                })
            },
            // 进入种植间
            toGrowCell(row) {
                this.$router.push(`Room?rid=${row.id}&back=1`)
            }
        },
        async mounted() {
            await globalUserEnter();
            // 获取所在的工厂信息
            if(this.factoryInfo.factory_id) {
                this.getRoomList();
            }
        }
    }
</script>