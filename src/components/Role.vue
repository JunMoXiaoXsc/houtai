<template>
    <div>

        <el-row>
            <el-col :span="2">
                <!-- <el-button type="primary" icon="el-icon-edit" circle></el-button> -->
                <el-button type="success" @click="showEdit" plain icon="el-icon-plus">新增</el-button>
                <!-- <el-button type="primary" @click="showEdit()" icon="el-icon-circle-plus"></el-button> -->
            </el-col>
            <el-col :span="8">
                <el-input placeholder="请输入内容" v-model="keyword" class="input-with-select">
                    <el-button slot="append" @click="search()" icon="el-icon-search"></el-button>
                </el-input>
            </el-col>

            <el-col :span="12">
            </el-col>
        </el-row>
        <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="rid" label="角色编号" width="180">
            </el-table-column>
            <el-table-column prop="rname" label="角色名称" width="180">
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="180">
                <template slot-scope="scope">
                    <el-button @click="showEdit(scope.row)" type="primary" size="small" icon="el-icon-edit">修改
                    </el-button>
                    <el-button @click="del(scope.row.rid)" type="danger" size="small" icon="el-icon-delete">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog v-if="dialogVisible" :title="title" :visible="true" :visible.sync="dialogVisible" width="30%"
            :before-close="handleClose" class="myStyle" :close-on-click-modal="false">
            <el-form ref="form" :rules="rules" :model="form" label-width="80px">
                <el-form-item label="角色名称">
                    <el-input v-model="form.rname"></el-input>
                </el-form-item>
                <el-form-item label="选择模块">
                    <el-tree ref="menuTree" :default-expand-all="true" node-key="id" :data="menuData" show-checkbox
                        :props="defaultProps"></el-tree>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="saveOrUpdate">保存</el-button>
                <el-button @click="resetForm">重置</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
let chongzhi = {
    name: "",
    rid: ""
}
export default {
    name: "Role",
    mounted: function () {
        this.loadData()
    },
    data() {
        return {
            tableData: [],
            options: [],
            dialogVisible: false,
            keyword: "",
            form: chongzhi,
            //声明校验规则
            rules: {

            },
            menuData: [],
            //树的基本树形的对象
            defaultProps: {
                label: 'name'
            },

        }

    },
    methods: {
        loadData: function () {
            //往后台发送ajax请求 获取表格的数据
            this.$http.post("role/listData").then(res => {
                console.info("后台数据", res.data);
                this.tableData = res.data;
            });
            //往后台发送ajax请求来查询菜单
            this.$http.post("role/listAllMenus").then(res => {
                console.info("菜单", res.data);
                this.menuData = res.data;
            });
        }
        ,
        showEdit: function (row) {
            console.info("row", row);
            this.dialogVisible = true;
            if (row.rid) {
                this.title = "修改数据";
                //对象复制，把row里面的所有的属性都复制给一个新的对象
                this.form = Object.assign({}, row);
                //把所有角色能操作的模块的id放到array1数组中
                var array1 = [];
                for (var index in row.menus) {
                    array1.push(row.menus[index].id);
                }
                //等下次弹窗中有组件渲染完之后再去干一些事
                //要干的事写到参数的函数中
                this.$nextTick(() => {
                    for (var index in array1) {
                        //第一个参数 要选中节点的id  第二个参数 选中就是true 取消选中就是return false
                        //第三个参数 如果是父节点是否启用级联选中，false是不级联，只选中他自己
                        this.$refs['menuTree'].setChecked(array1[index], true, false);
                    }
                });
                //让角色能操作的模块选中
                /* setTimeout(()=>{
                },
                1000); */

            } else {
                this.title = "新增数据";
                this.form = chongzhi;
            }
        },
        handleClose(done) {
            this.dialogVisible = false;
        },
        //新增或者修改
        saveOrUpdate: function () {
            let checkNodes = this.$refs["menuTree"].getCheckedNodes(false, true);
            console.info("选中的节点", checkNodes);
            //把选中的节点的id 拼成以逗号分割的字符串 1,4,5
            let result = "";
            for (let i = 0; i < checkNodes.length; i++) {
                result += checkNodes[i].id;
                result += ",";
            }
            //如果用户没有选中任何节点
            if (!result) {
                this.$message.error("请至少选择一个模块");
                return;
            }
            result = result.substring(0, result.length - 1);
            console.info("result", result);

            //往后台发送ajax请求 保存/修改用户数据
            console.info("提交的数据:", this.form)

            this.form.menuIds = result;
            this.form.menus = undefined;
            this.$http.post("role/saveOrUpdate", this.form)
                .then(res => {
                    if (res.data.success) {
                        this.loadData()
                        this.dialogVisible = false;
                    } else {
                        alert(res.data.error)
                    }
                })
        },
        //删除
        del: function (rid) {
            this.$http.post("role/del", { rid: rid }).then(res => {
                console.info('res', res)
                if (res.data.success) {
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                    this.loadData()
                } else {
                    alert(res.data.error)
                }
            })
        },
        resetForm: function () {
            this.$refs['form'].resetFields();
        },
        //搜索的方法
        search() {
            console.info("搜索" + this.keyword);
            //往后台发送ajax请求 查询
            this.loadData()
        },
    }
}
</script>

<style>
</style>
